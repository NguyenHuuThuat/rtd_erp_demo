import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '@common/decorators/permissions.decorator';
import { IS_PUBLIC_KEY } from '@common/decorators/public.decorator';
import type { UserContext } from '../types';

/**
 * Check permission AND-semantics. Phải chạy SAU JwtAuthGuard
 * (NestJS app sẽ register theo thứ tự ở app.module.ts).
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const required = this.reflector.getAllAndOverride<string[] | undefined>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const request = context.switchToHttp().getRequest<{ user?: UserContext }>();
    const user = request.user;
    if (!user) throw new ForbiddenException('Chưa đăng nhập');

    const missing = required.filter((perm) => !user.permissions.includes(perm));
    if (missing.length > 0) {
      throw new ForbiddenException(`Thiếu quyền: ${missing.join(', ')}`);
    }
    return true;
  }
}
