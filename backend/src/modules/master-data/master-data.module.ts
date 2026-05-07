import { Module } from '@nestjs/common';
import { OrganizationsModule } from './organizations/organizations.module';
import { UsersModule } from './users/users.module';

/**
 * Aggregator cho khối Master Data (Quản trị danh mục).
 * Hiện có: Organizations, Users (list).
 * Bước tiếp theo sẽ thêm: Roles, Permissions, Partners, Products, Uoms,
 * Provinces, SystemSettings, ApprovalFlows.
 */
@Module({
  imports: [OrganizationsModule, UsersModule],
})
export class MasterDataModule {}
