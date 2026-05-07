import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Bỏ qua JWTAuthGuard cho route hoặc controller. */
export const Public = (): CustomDecorator => SetMetadata(IS_PUBLIC_KEY, true);
