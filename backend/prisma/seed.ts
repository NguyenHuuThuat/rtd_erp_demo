/**
 * Seed dữ liệu tối thiểu cho Bước 2a:
 * - 1 Tập đoàn RTD + 5 công ty con + vài chi nhánh
 * - 3 role mặc định: SUPER_ADMIN, ADMIN, VIEWER
 * - Permissions cho master_data.organizations
 * - 1 user superadmin: admin@rtd.local / RtdAdmin@2026
 *
 * Bước 5 sẽ thay file này bằng seed 6 tháng dữ liệu nghiệp vụ đầy đủ.
 *
 * Chạy: pnpm db:seed
 */
import { PrismaClient, OrganizationType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const ORG_TREE: Array<{
  code: string;
  name: string;
  type: OrganizationType;
  parentCode: string | null;
  taxCode?: string;
  provinceCode?: string;
  address?: string;
}> = [
  { code: 'RTD', name: 'Tập đoàn RTD Việt Nam', type: 'GROUP', parentCode: null, taxCode: '0100000000', provinceCode: '01' },
  { code: 'RTD-FEED', name: 'Công ty TNHH RTD Feed', type: 'COMPANY', parentCode: 'RTD', taxCode: '0100000001', provinceCode: '36' },
  { code: 'RTD-FARM', name: 'Công ty TNHH RTD Farm', type: 'COMPANY', parentCode: 'RTD', taxCode: '0100000002', provinceCode: '37' },
  { code: 'RTD-FOOD', name: 'Công ty TNHH RTD Food', type: 'COMPANY', parentCode: 'RTD', taxCode: '0100000003', provinceCode: '01' },
  { code: 'RTD-VET', name: 'Công ty TNHH RTD Vet', type: 'COMPANY', parentCode: 'RTD', taxCode: '0100000004', provinceCode: '01' },
  { code: 'RTD-LOG', name: 'Công ty TNHH RTD Logistics', type: 'COMPANY', parentCode: 'RTD', taxCode: '0100000005', provinceCode: '31' },
  { code: 'FEED-BR-HN', name: 'RTD Feed - Chi nhánh Hà Nội', type: 'BRANCH', parentCode: 'RTD-FEED', provinceCode: '01' },
  { code: 'FEED-BR-HCM', name: 'RTD Feed - Chi nhánh TP.HCM', type: 'BRANCH', parentCode: 'RTD-FEED', provinceCode: '79' },
];

const PERMISSIONS = [
  // master_data.organizations
  { resource: 'master_data.organizations', action: 'read', description: 'Xem tổ chức' },
  { resource: 'master_data.organizations', action: 'write', description: 'Tạo/sửa tổ chức' },
  { resource: 'master_data.organizations', action: 'delete', description: 'Xóa tổ chức' },
  // chỗ trống cho 2b/2c
  { resource: 'master_data.users', action: 'read', description: 'Xem user' },
  { resource: 'master_data.users', action: 'write', description: 'Tạo/sửa user' },
  { resource: 'financial.journals', action: 'read', description: 'Xem sổ nhật ký' },
  { resource: 'financial.journals', action: 'write', description: 'Ghi bút toán' },
  { resource: 'financial.invoices', action: 'read', description: 'Xem hóa đơn' },
  { resource: 'financial.invoices', action: 'write', description: 'Tạo/sửa hóa đơn' },
];

async function seed(): Promise<void> {
  console.log('🌱 Bắt đầu seed dữ liệu Bước 2a...');

  // 1. Organizations
  const orgIdByCode = new Map<string, string>();
  for (const node of ORG_TREE) {
    const parentId = node.parentCode ? orgIdByCode.get(node.parentCode) : null;
    const org = await prisma.organization.upsert({
      where: { code: node.code },
      update: {
        name: node.name,
        type: node.type,
        parentId: parentId ?? null,
        taxCode: node.taxCode,
        provinceCode: node.provinceCode,
        address: node.address,
      },
      create: {
        code: node.code,
        name: node.name,
        type: node.type,
        parentId: parentId ?? null,
        taxCode: node.taxCode,
        provinceCode: node.provinceCode,
        address: node.address,
      },
    });
    orgIdByCode.set(node.code, org.id);
  }
  console.log(`  ✅ ${ORG_TREE.length} tổ chức`);

  // 2. Permissions
  for (const p of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { resource_action: { resource: p.resource, action: p.action } },
      update: { description: p.description },
      create: p,
    });
  }
  console.log(`  ✅ ${PERMISSIONS.length} permissions`);

  // 3. Roles + role_permissions
  const allPerms = await prisma.permission.findMany();
  const readPerms = allPerms.filter((p) => p.action === 'read');

  const superAdmin = await prisma.role.upsert({
    where: { code: 'SUPER_ADMIN' },
    update: {},
    create: { code: 'SUPER_ADMIN', name: 'Quản trị viên cấp cao', isSystem: true },
  });
  const admin = await prisma.role.upsert({
    where: { code: 'ADMIN' },
    update: {},
    create: { code: 'ADMIN', name: 'Quản trị viên', isSystem: true },
  });
  const viewer = await prisma.role.upsert({
    where: { code: 'VIEWER' },
    update: {},
    create: { code: 'VIEWER', name: 'Người xem', isSystem: true },
  });

  // SUPER_ADMIN: tất cả permission
  for (const p of allPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: superAdmin.id, permissionId: p.id } },
      update: {},
      create: { roleId: superAdmin.id, permissionId: p.id },
    });
  }
  // ADMIN: write + read trên master_data + financial
  for (const p of allPerms.filter((x) => x.action !== 'delete')) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: admin.id, permissionId: p.id } },
      update: {},
      create: { roleId: admin.id, permissionId: p.id },
    });
  }
  // VIEWER: chỉ read
  for (const p of readPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: viewer.id, permissionId: p.id } },
      update: {},
      create: { roleId: viewer.id, permissionId: p.id },
    });
  }
  console.log('  ✅ 3 role: SUPER_ADMIN, ADMIN, VIEWER');

  // 4. User superadmin
  const groupId = orgIdByCode.get('RTD');
  if (!groupId) throw new Error('Không tìm thấy RTD group');
  const passwordHash = await bcrypt.hash('RtdAdmin@2026', 12);
  const user = await prisma.user.upsert({
    where: { email: 'admin@rtd.local' },
    update: { passwordHash, isActive: true },
    create: {
      email: 'admin@rtd.local',
      passwordHash,
      fullName: 'Quản trị hệ thống',
      companyId: groupId,
      isActive: true,
    },
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: superAdmin.id } },
    update: {},
    create: { userId: user.id, roleId: superAdmin.id },
  });
  console.log('  ✅ user admin@rtd.local / RtdAdmin@2026');

  console.log('\n🎉 Seed hoàn tất.\n');
  console.log('Đăng nhập demo:');
  console.log('  email:    admin@rtd.local');
  console.log('  password: RtdAdmin@2026\n');
}

seed()
  .catch((err) => {
    console.error('❌ Seed lỗi:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
