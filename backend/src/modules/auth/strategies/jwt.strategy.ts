import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { AppConfig } from '@/config/configuration';
import type { JwtPayload, UserContext } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<AppConfig, true>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_ACCESS_SECRET', { infer: true }),
    });
  }

  validate(payload: JwtPayload): UserContext {
    if (!payload?.sub) throw new UnauthorizedException('Token không hợp lệ');
    return {
      userId: payload.sub,
      email: payload.email,
      fullName: payload.fullName,
      companyId: payload.companyId,
      permissions: payload.permissions ?? [],
    };
  }
}
