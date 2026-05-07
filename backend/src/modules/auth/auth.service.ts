import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'node:crypto';
import { PrismaService } from '@common/prisma/prisma.service';
import type { AppConfig } from '@/config/configuration';
import type { LoginDto } from './auth.schemas';
import type { JwtPayload, UserContext } from './types';

interface ClientMeta {
  ip?: string;
  userAgent?: string;
}

interface AuthResult {
  user: UserContext;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService<AppConfig, true>,
  ) {}

  async login(dto: LoginDto, meta: ClientMeta): Promise<AuthResult> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: this.userIncludeForPermissions(),
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Tài khoản không tồn tại hoặc đã bị khóa');
    }

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Mật khẩu không đúng');

    const userContext = this.toUserContext(user);
    const tokens = await this.issueTokens(userContext, meta);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    this.logger.log(`Login OK: ${user.email}`);
    return { user: userContext, ...tokens };
  }

  async refresh(refreshToken: string, meta: ClientMeta): Promise<AuthResult> {
    const tokenHash = this.hashToken(refreshToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: { include: this.userIncludeForPermissions() } },
    });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
    }
    if (!stored.user.isActive) throw new UnauthorizedException('Tài khoản đã bị khóa');

    // Token rotation: revoke token cũ, issue token mới
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const userContext = this.toUserContext(stored.user);
    const tokens = await this.issueTokens(userContext, meta);
    return { user: userContext, ...tokens };
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = this.hashToken(refreshToken);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async getCurrentUser(userId: string): Promise<UserContext | null> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, isActive: true },
      include: this.userIncludeForPermissions(),
    });
    return user ? this.toUserContext(user) : null;
  }

  // ----- helpers -----

  private userIncludeForPermissions() {
    return {
      userRoles: {
        include: {
          role: { include: { rolePermissions: { include: { permission: true } } } },
        },
      },
    } as const;
  }

  private toUserContext(user: {
    id: string;
    email: string;
    fullName: string;
    companyId: string;
    userRoles: Array<{
      role: {
        rolePermissions: Array<{ permission: { resource: string; action: string } }>;
      };
    }>;
  }): UserContext {
    const set = new Set<string>();
    for (const ur of user.userRoles) {
      for (const rp of ur.role.rolePermissions) {
        set.add(`${rp.permission.resource}:${rp.permission.action}`);
      }
    }
    return {
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      companyId: user.companyId,
      permissions: [...set],
    };
  }

  private async issueTokens(user: UserContext, meta: ClientMeta): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = {
      sub: user.userId,
      email: user.email,
      fullName: user.fullName,
      companyId: user.companyId,
      permissions: user.permissions,
    };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_ACCESS_SECRET', { infer: true }),
      expiresIn: this.config.get('JWT_ACCESS_TTL', { infer: true }),
    });

    const refreshTokenRaw = crypto.randomBytes(64).toString('base64url');
    const refreshTokenHash = this.hashToken(refreshTokenRaw);
    const expiresAt = this.parseTtlToDate(this.config.get('JWT_REFRESH_TTL', { infer: true }));

    await this.prisma.refreshToken.create({
      data: {
        userId: user.userId,
        tokenHash: refreshTokenHash,
        expiresAt,
        ipAddress: meta.ip,
        userAgent: meta.userAgent,
      },
    });

    return { accessToken, refreshToken: refreshTokenRaw };
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private parseTtlToDate(ttl: string): Date {
    const match = /^(\d+)([smhd])$/.exec(ttl);
    if (!match) throw new Error(`TTL không hợp lệ: ${ttl}`);
    const value = Number(match[1]);
    const unit = match[2] as 's' | 'm' | 'h' | 'd';
    const ms = value * { s: 1_000, m: 60_000, h: 3_600_000, d: 86_400_000 }[unit];
    return new Date(Date.now() + ms);
  }
}
