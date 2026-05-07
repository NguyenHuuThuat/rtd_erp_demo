import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import type { UserContext } from '@modules/auth/types';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserContext => {
    const request = ctx.switchToHttp().getRequest<{ user: UserContext }>();
    return request.user;
  },
);
