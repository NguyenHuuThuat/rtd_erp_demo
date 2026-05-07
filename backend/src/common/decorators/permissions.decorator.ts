import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'requiredPermissions';

/**
 * Đánh dấu permission cần có để truy cập route.
 * Format: "<resource>:<action>", vd "master_data.organizations:read".
 * AND-semantics: tất cả permission phải có. Nếu cần OR thì tách thành nhiều route.
 */
export const Permissions = (...permissions: string[]): CustomDecorator =>
  SetMetadata(PERMISSIONS_KEY, permissions);
