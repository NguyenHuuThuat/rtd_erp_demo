/**
 * Mock data dùng khi NEXT_PUBLIC_USE_MOCK=true (chưa cắm DB).
 * Khi có DB + BE: set NEXT_PUBLIC_USE_MOCK=false; FE sẽ tự gọi API thật.
 */

export const MOCK_USER = {
  userId: '00000000-0000-0000-0000-000000000001',
  email: 'admin@rtd.local',
  fullName: 'Quản trị hệ thống',
  companyId: '00000000-0000-0000-0000-000000000010',
  permissions: [
    'master_data.organizations:read',
    'master_data.organizations:write',
    'master_data.organizations:delete',
    'master_data.users:read',
    'master_data.users:write',
    'financial.journals:read',
    'financial.journals:write',
    'financial.invoices:read',
    'financial.invoices:write',
  ] as string[],
};

export interface MockOrg {
  id: string;
  code: string;
  name: string;
  type: 'GROUP' | 'COMPANY' | 'BRANCH';
  parentId: string | null;
  taxCode?: string;
  provinceCode?: string;
  isActive: boolean;
}

export const MOCK_ORGS: MockOrg[] = [
  { id: 'org-rtd', code: 'RTD', name: 'Tập đoàn RTD Việt Nam', type: 'GROUP', parentId: null, taxCode: '0100000000', provinceCode: '01', isActive: true },
  { id: 'org-feed', code: 'RTD-FEED', name: 'Công ty TNHH RTD Feed', type: 'COMPANY', parentId: 'org-rtd', taxCode: '0100000001', provinceCode: '36', isActive: true },
  { id: 'org-farm', code: 'RTD-FARM', name: 'Công ty TNHH RTD Farm', type: 'COMPANY', parentId: 'org-rtd', taxCode: '0100000002', provinceCode: '37', isActive: true },
  { id: 'org-food', code: 'RTD-FOOD', name: 'Công ty TNHH RTD Food', type: 'COMPANY', parentId: 'org-rtd', taxCode: '0100000003', provinceCode: '01', isActive: true },
  { id: 'org-vet', code: 'RTD-VET', name: 'Công ty TNHH RTD Vet', type: 'COMPANY', parentId: 'org-rtd', taxCode: '0100000004', provinceCode: '01', isActive: true },
  { id: 'org-log', code: 'RTD-LOG', name: 'Công ty TNHH RTD Logistics', type: 'COMPANY', parentId: 'org-rtd', taxCode: '0100000005', provinceCode: '31', isActive: true },
  { id: 'org-feed-hn', code: 'FEED-BR-HN', name: 'RTD Feed - Chi nhánh Hà Nội', type: 'BRANCH', parentId: 'org-feed', provinceCode: '01', isActive: true },
  { id: 'org-feed-hcm', code: 'FEED-BR-HCM', name: 'RTD Feed - Chi nhánh TP.HCM', type: 'BRANCH', parentId: 'org-feed', provinceCode: '79', isActive: true },
  { id: 'org-farm-tn', code: 'FARM-TN', name: 'RTD Farm - Trại Thái Nguyên', type: 'BRANCH', parentId: 'org-farm', provinceCode: '19', isActive: true },
  { id: 'org-farm-bg', code: 'FARM-BG', name: 'RTD Farm - Trại Bắc Giang', type: 'BRANCH', parentId: 'org-farm', provinceCode: '24', isActive: true },
];

export interface MockUser {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  companyId: string;
  companyName: string;
  isActive: boolean;
  lastLoginAt: string | null;
  roles: string[];
}

export const MOCK_USERS: MockUser[] = [
  { id: 'u-1', email: 'admin@rtd.local', fullName: 'Quản trị hệ thống', phone: '0901234567', companyId: 'org-rtd', companyName: 'Tập đoàn RTD Việt Nam', isActive: true, lastLoginAt: new Date().toISOString(), roles: ['SUPER_ADMIN'] },
  { id: 'u-2', email: 'gd.feed@rtd.vn', fullName: 'Nguyễn Văn An', phone: '0911000001', companyId: 'org-feed', companyName: 'Công ty TNHH RTD Feed', isActive: true, lastLoginAt: '2026-05-06T08:30:00Z', roles: ['ADMIN'] },
  { id: 'u-3', email: 'gd.farm@rtd.vn', fullName: 'Trần Thị Bình', phone: '0911000002', companyId: 'org-farm', companyName: 'Công ty TNHH RTD Farm', isActive: true, lastLoginAt: '2026-05-07T07:15:00Z', roles: ['ADMIN'] },
  { id: 'u-4', email: 'kt.tonghop@rtd.vn', fullName: 'Phạm Quốc Cường', phone: '0911000003', companyId: 'org-rtd', companyName: 'Tập đoàn RTD Việt Nam', isActive: true, lastLoginAt: '2026-05-07T09:00:00Z', roles: ['ADMIN'] },
  { id: 'u-5', email: 'ke.toan1@rtd.vn', fullName: 'Lê Thị Dung', phone: '0911000004', companyId: 'org-feed', companyName: 'Công ty TNHH RTD Feed', isActive: true, lastLoginAt: '2026-05-06T16:45:00Z', roles: ['VIEWER'] },
  { id: 'u-6', email: 'ke.toan2@rtd.vn', fullName: 'Hoàng Minh Đức', phone: '0911000005', companyId: 'org-farm', companyName: 'Công ty TNHH RTD Farm', isActive: true, lastLoginAt: null, roles: ['VIEWER'] },
  { id: 'u-7', email: 'qly.kho@rtd.vn', fullName: 'Vũ Thị Hà', phone: '0911000006', companyId: 'org-log', companyName: 'Công ty TNHH RTD Logistics', isActive: true, lastLoginAt: '2026-05-05T14:20:00Z', roles: ['VIEWER'] },
  { id: 'u-8', email: 'mua.hang@rtd.vn', fullName: 'Đỗ Văn Khánh', phone: '0911000007', companyId: 'org-rtd', companyName: 'Tập đoàn RTD Việt Nam', isActive: false, lastLoginAt: '2026-04-12T10:00:00Z', roles: ['VIEWER'] },
];

export interface MockJournal {
  id: string;
  code: string;
  entryDate: string;
  description: string;
  refType: string;
  totalDebit: number;
  totalCredit: number;
  status: 'DRAFT' | 'POSTED' | 'REVERSED';
}

export const MOCK_JOURNALS: MockJournal[] = [
  { id: 'j-1', code: 'JV-2026-04-001', entryDate: '2026-04-02', description: 'Mua nguyên liệu ngô vàng nhập kho NM Hà Nam', refType: 'PURCHASE_INVOICE', totalDebit: 1_250_000_000, totalCredit: 1_250_000_000, status: 'POSTED' },
  { id: 'j-2', code: 'JV-2026-04-002', entryDate: '2026-04-03', description: 'Bán cám heo thịt cho ĐL Sơn Hùng - HCM', refType: 'SALES_INVOICE', totalDebit: 480_000_000, totalCredit: 480_000_000, status: 'POSTED' },
  { id: 'j-3', code: 'JV-2026-04-003', entryDate: '2026-04-05', description: 'Thu tiền ĐL Sơn Hùng', refType: 'PAYMENT_RECEIPT', totalDebit: 480_000_000, totalCredit: 480_000_000, status: 'POSTED' },
  { id: 'j-4', code: 'JV-2026-04-004', entryDate: '2026-04-08', description: 'Chi lương khối VP T4/2026', refType: 'PAYMENT_DISBURSEMENT', totalDebit: 320_000_000, totalCredit: 320_000_000, status: 'POSTED' },
  { id: 'j-5', code: 'JV-2026-04-005', entryDate: '2026-04-10', description: 'Mua bao bì nhập kho NM Bắc Ninh', refType: 'PURCHASE_INVOICE', totalDebit: 85_000_000, totalCredit: 85_000_000, status: 'POSTED' },
  { id: 'j-6', code: 'JV-2026-04-006', entryDate: '2026-04-15', description: 'Bán heo xuất chuồng - lô 24A trại TN', refType: 'SALES_INVOICE', totalDebit: 1_840_000_000, totalCredit: 1_840_000_000, status: 'POSTED' },
  { id: 'j-7', code: 'JV-2026-04-007', entryDate: '2026-04-18', description: 'Khấu hao TSCĐ tháng 4', refType: 'MANUAL', totalDebit: 245_000_000, totalCredit: 245_000_000, status: 'POSTED' },
  { id: 'j-8', code: 'JV-2026-05-001', entryDate: '2026-05-02', description: 'Mua khô đậu tương nhập kho NM Hà Nam', refType: 'PURCHASE_INVOICE', totalDebit: 920_000_000, totalCredit: 920_000_000, status: 'POSTED' },
  { id: 'j-9', code: 'JV-2026-05-002', entryDate: '2026-05-04', description: 'Bán cám heo nái cho ĐL Bắc Giang', refType: 'SALES_INVOICE', totalDebit: 215_000_000, totalCredit: 215_000_000, status: 'POSTED' },
  { id: 'j-10', code: 'JV-2026-05-003', entryDate: '2026-05-06', description: 'Tạm ứng công tác phí GĐ NM Hà Nam', refType: 'PAYMENT_DISBURSEMENT', totalDebit: 12_000_000, totalCredit: 12_000_000, status: 'DRAFT' },
];

export interface MockInvoice {
  id: string;
  code: string;
  type: 'SALES' | 'PURCHASE';
  partnerName: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  status: 'DRAFT' | 'ISSUED' | 'PARTIAL_PAID' | 'PAID';
}

export const MOCK_INVOICES: MockInvoice[] = [
  { id: 'i-1', code: 'INV-S-2026-04-012', type: 'SALES', partnerName: 'ĐL Sơn Hùng - HCM', invoiceDate: '2026-04-03', dueDate: '2026-05-03', totalAmount: 480_000_000, paidAmount: 480_000_000, status: 'PAID' },
  { id: 'i-2', code: 'INV-S-2026-04-013', type: 'SALES', partnerName: 'ĐL Minh Phú - Hà Nội', invoiceDate: '2026-04-05', dueDate: '2026-05-05', totalAmount: 215_000_000, paidAmount: 100_000_000, status: 'PARTIAL_PAID' },
  { id: 'i-3', code: 'INV-S-2026-04-014', type: 'SALES', partnerName: 'ĐL Hưng Thịnh - Bắc Giang', invoiceDate: '2026-04-15', dueDate: '2026-05-15', totalAmount: 1_840_000_000, paidAmount: 0, status: 'ISSUED' },
  { id: 'i-4', code: 'INV-P-2026-04-008', type: 'PURCHASE', partnerName: 'Cargill VN', invoiceDate: '2026-04-02', dueDate: '2026-05-02', totalAmount: 1_250_000_000, paidAmount: 1_250_000_000, status: 'PAID' },
  { id: 'i-5', code: 'INV-P-2026-04-009', type: 'PURCHASE', partnerName: 'Bao bì An Phát', invoiceDate: '2026-04-10', dueDate: '2026-05-10', totalAmount: 85_000_000, paidAmount: 85_000_000, status: 'PAID' },
];

export const MOCK_FINANCIAL_KPIS = {
  revenueMonth: 2_535_000_000,
  expenseMonth: 1_950_000_000,
  receivable: 1_955_000_000,
  payable: 320_000_000,
  // 6 tháng gần nhất
  revenueByMonth: [
    { month: 'T12/25', revenue: 1_820_000_000, expense: 1_440_000_000 },
    { month: 'T01/26', revenue: 2_100_000_000, expense: 1_680_000_000 },
    { month: 'T02/26', revenue: 1_950_000_000, expense: 1_580_000_000 },
    { month: 'T03/26', revenue: 2_410_000_000, expense: 1_890_000_000 },
    { month: 'T04/26', revenue: 2_320_000_000, expense: 1_810_000_000 },
    { month: 'T05/26', revenue: 2_535_000_000, expense: 1_950_000_000 },
  ],
};

export const MOCK_ADMIN_KPIS = {
  totalOrgs: MOCK_ORGS.length,
  totalUsers: MOCK_USERS.length,
  activeUsers: MOCK_USERS.filter((u) => u.isActive).length,
  totalRoles: 5,
  recentAudits: [
    { actor: 'admin@rtd.local', action: 'CREATE', entity: 'Organization', detail: 'FARM-BG (Trại Bắc Giang)', at: '2026-05-07T08:42:00Z' },
    { actor: 'gd.feed@rtd.vn', action: 'UPDATE', entity: 'User', detail: 'Đổi role cho ke.toan1@rtd.vn', at: '2026-05-07T08:15:00Z' },
    { actor: 'admin@rtd.local', action: 'CREATE', entity: 'Role', detail: 'Tạo role MANAGER_FACTORY', at: '2026-05-06T17:30:00Z' },
    { actor: 'kt.tonghop@rtd.vn', action: 'APPROVE', entity: 'Invoice', detail: 'Duyệt INV-P-2026-04-008 (1.25 tỷ)', at: '2026-05-06T15:10:00Z' },
    { actor: 'admin@rtd.local', action: 'UPDATE', entity: 'SystemSetting', detail: 'fiscal_year_start_month = 1', at: '2026-05-05T10:00:00Z' },
  ],
};

// ===== Roles & Permissions =====

export interface MockRole {
  id: string;
  code: string;
  name: string;
  description: string;
  isSystem: boolean;
  userCount: number;
  permissionCount: number;
}

export const MOCK_ROLES: MockRole[] = [
  { id: 'r1', code: 'SUPER_ADMIN', name: 'Quản trị viên cấp cao', description: 'Toàn quyền hệ thống, không thể xóa', isSystem: true, userCount: 1, permissionCount: 32 },
  { id: 'r2', code: 'ADMIN', name: 'Quản trị viên', description: 'Quyền quản trị nghiệp vụ', isSystem: true, userCount: 3, permissionCount: 24 },
  { id: 'r3', code: 'ACCOUNTANT', name: 'Kế toán viên', description: 'Ghi sổ, quản lý hóa đơn', isSystem: false, userCount: 4, permissionCount: 12 },
  { id: 'r4', code: 'MANAGER_FACTORY', name: 'Giám đốc nhà máy', description: 'Quản lý nhà máy + duyệt SX', isSystem: false, userCount: 2, permissionCount: 14 },
  { id: 'r5', code: 'VIEWER', name: 'Người xem', description: 'Chỉ xem báo cáo', isSystem: true, userCount: 6, permissionCount: 8 },
];

export interface MockPermission {
  resource: string;
  action: string;
  description: string;
}

export const MOCK_PERMISSIONS: MockPermission[] = [
  { resource: 'master_data.organizations', action: 'read', description: 'Xem cơ cấu tổ chức' },
  { resource: 'master_data.organizations', action: 'write', description: 'Tạo/sửa tổ chức' },
  { resource: 'master_data.organizations', action: 'delete', description: 'Xóa tổ chức' },
  { resource: 'master_data.users', action: 'read', description: 'Xem người dùng' },
  { resource: 'master_data.users', action: 'write', description: 'Tạo/sửa người dùng' },
  { resource: 'master_data.users', action: 'delete', description: 'Vô hiệu người dùng' },
  { resource: 'master_data.partners', action: 'read', description: 'Xem đối tác' },
  { resource: 'master_data.partners', action: 'write', description: 'Tạo/sửa đối tác' },
  { resource: 'financial.journals', action: 'read', description: 'Xem sổ nhật ký' },
  { resource: 'financial.journals', action: 'write', description: 'Ghi bút toán' },
  { resource: 'financial.journals', action: 'post', description: 'Đăng sổ bút toán' },
  { resource: 'financial.invoices', action: 'read', description: 'Xem hóa đơn' },
  { resource: 'financial.invoices', action: 'write', description: 'Tạo/sửa hóa đơn' },
  { resource: 'financial.invoices', action: 'approve', description: 'Duyệt hóa đơn' },
  { resource: 'financial.payments', action: 'read', description: 'Xem phiếu thu/chi' },
  { resource: 'financial.payments', action: 'write', description: 'Tạo phiếu thu/chi' },
  { resource: 'financial.budgets', action: 'read', description: 'Xem ngân sách' },
  { resource: 'financial.budgets', action: 'write', description: 'Lập ngân sách' },
  { resource: 'financial.budgets', action: 'approve', description: 'Duyệt ngân sách' },
  { resource: 'financial.reports', action: 'read', description: 'Xem báo cáo tài chính' },
  { resource: 'financial.reports', action: 'export', description: 'Xuất báo cáo' },
  { resource: 'admin.audit_logs', action: 'read', description: 'Xem nhật ký hệ thống' },
  { resource: 'admin.settings', action: 'read', description: 'Xem cấu hình hệ thống' },
  { resource: 'admin.settings', action: 'write', description: 'Sửa cấu hình hệ thống' },
];

// ===== Partners =====

export interface MockPartner {
  id: string;
  code: string;
  name: string;
  type: 'SUPPLIER' | 'CUSTOMER' | 'BOTH';
  taxCode: string;
  province: string;
  phone: string;
  email: string;
  creditLimit: number;
  currentDebt: number;
  paymentTermDays: number;
  isActive: boolean;
}

export const MOCK_PARTNERS: MockPartner[] = [
  { id: 'p1', code: 'CUS-001', name: 'ĐL Sơn Hùng', type: 'CUSTOMER', taxCode: '0301234567', province: 'TP.HCM', phone: '0908111222', email: 'sonhung@dl.vn', creditLimit: 800_000_000, currentDebt: 0, paymentTermDays: 30, isActive: true },
  { id: 'p2', code: 'CUS-002', name: 'ĐL Minh Phú', type: 'CUSTOMER', taxCode: '0102345678', province: 'Hà Nội', phone: '0911222333', email: 'minhphu@dl.vn', creditLimit: 500_000_000, currentDebt: 115_000_000, paymentTermDays: 30, isActive: true },
  { id: 'p3', code: 'CUS-003', name: 'ĐL Hưng Thịnh', type: 'CUSTOMER', taxCode: '2400123456', province: 'Bắc Giang', phone: '0922333444', email: 'hungthinh@dl.vn', creditLimit: 2_000_000_000, currentDebt: 1_840_000_000, paymentTermDays: 45, isActive: true },
  { id: 'p4', code: 'CUS-004', name: 'ĐL Nam Thành', type: 'CUSTOMER', taxCode: '3702345678', province: 'Thanh Hóa', phone: '0933444555', email: 'namthanh@dl.vn', creditLimit: 600_000_000, currentDebt: 0, paymentTermDays: 30, isActive: true },
  { id: 'p5', code: 'CUS-005', name: 'ĐL Tây Nguyên', type: 'CUSTOMER', taxCode: '6001234567', province: 'Đắk Lắk', phone: '0944555666', email: 'taynguyen@dl.vn', creditLimit: 400_000_000, currentDebt: 75_000_000, paymentTermDays: 30, isActive: true },
  { id: 's1', code: 'SUP-001', name: 'Công ty CP Cargill Việt Nam', type: 'SUPPLIER', taxCode: '0300456789', province: 'Đồng Nai', phone: '02838234567', email: 'sales.vn@cargill.com', creditLimit: 0, currentDebt: 0, paymentTermDays: 60, isActive: true },
  { id: 's2', code: 'SUP-002', name: 'Bao bì An Phát Hà Nội', type: 'SUPPLIER', taxCode: '0102456789', province: 'Hà Nội', phone: '02437654321', email: 'kd@anphat.vn', creditLimit: 0, currentDebt: 0, paymentTermDays: 30, isActive: true },
  { id: 's3', code: 'SUP-003', name: 'Vinacam — đại lý bột cá', type: 'SUPPLIER', taxCode: '0303456789', province: 'TP.HCM', phone: '02839876543', email: 'sales@vinacam.vn', creditLimit: 0, currentDebt: 0, paymentTermDays: 45, isActive: true },
  { id: 's4', code: 'SUP-004', name: 'Đức Hạnh Marphavet — vắc-xin', type: 'SUPPLIER', taxCode: '1900234567', province: 'Thái Nguyên', phone: '02083123456', email: 'kd@marphavet.com', creditLimit: 0, currentDebt: 245_000_000, paymentTermDays: 30, isActive: true },
  { id: 'b1', code: 'BANK-VCB', name: 'Vietcombank — CN Hà Nội', type: 'BOTH', taxCode: '', province: 'Hà Nội', phone: '02438201234', email: '', creditLimit: 0, currentDebt: 0, paymentTermDays: 0, isActive: true },
];

// ===== Approvals =====

export interface MockApproval {
  id: string;
  code: string;
  flowName: string;
  targetType: 'INVOICE' | 'PURCHASE_ORDER' | 'BUDGET' | 'JOURNAL';
  targetCode: string;
  targetSummary: string;
  amount: number;
  requesterName: string;
  requesterEmail: string;
  submittedAt: string;
  currentStep: number;
  totalSteps: number;
  currentApprover: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  history: { step: number; name: string; approver: string; result: 'APPROVED' | 'REJECTED' | 'PENDING'; at: string | null; comment: string | null }[];
}

export const MOCK_APPROVALS: MockApproval[] = [
  {
    id: 'ap1',
    code: 'AR-2026-05-008',
    flowName: 'Phê duyệt PO > 500 triệu',
    targetType: 'PURCHASE_ORDER',
    targetCode: 'PR-2026-05-012',
    targetSummary: 'Mua 50 tấn ngô vàng — Cargill VN',
    amount: 1_200_000_000,
    requesterName: 'Đỗ Văn Khánh',
    requesterEmail: 'mua.hang@rtd.vn',
    submittedAt: '2026-05-07T10:15:00Z',
    currentStep: 2,
    totalSteps: 3,
    currentApprover: 'Phạm Quốc Cường (KT trưởng)',
    status: 'PENDING',
    history: [
      { step: 1, name: 'Trưởng phòng mua', approver: 'Đỗ Văn Khánh', result: 'APPROVED', at: '2026-05-07T10:30:00Z', comment: 'Đúng kế hoạch SX T5' },
      { step: 2, name: 'Kế toán trưởng', approver: 'Phạm Quốc Cường', result: 'PENDING', at: null, comment: null },
      { step: 3, name: 'TGĐ', approver: 'Nguyễn Văn An', result: 'PENDING', at: null, comment: null },
    ],
  },
  {
    id: 'ap2',
    code: 'AR-2026-05-009',
    flowName: 'Phê duyệt hóa đơn > 200 triệu',
    targetType: 'INVOICE',
    targetCode: 'INV-S-2026-05-001',
    targetSummary: 'HĐ bán cám heo nái — ĐL Bắc Giang',
    amount: 215_000_000,
    requesterName: 'Lê Thị Dung',
    requesterEmail: 'ke.toan1@rtd.vn',
    submittedAt: '2026-05-07T09:00:00Z',
    currentStep: 1,
    totalSteps: 2,
    currentApprover: 'Phạm Quốc Cường (KT trưởng)',
    status: 'PENDING',
    history: [
      { step: 1, name: 'Kế toán trưởng', approver: 'Phạm Quốc Cường', result: 'PENDING', at: null, comment: null },
      { step: 2, name: 'Giám đốc nhà máy', approver: 'Nguyễn Văn An', result: 'PENDING', at: null, comment: null },
    ],
  },
  {
    id: 'ap3',
    code: 'AR-2026-05-007',
    flowName: 'Phê duyệt ngân sách quý',
    targetType: 'BUDGET',
    targetCode: 'BUD-2026-Q2-FEED',
    targetSummary: 'Ngân sách Q2/2026 — RTD Feed',
    amount: 12_500_000_000,
    requesterName: 'Nguyễn Văn An',
    requesterEmail: 'gd.feed@rtd.vn',
    submittedAt: '2026-05-06T15:00:00Z',
    currentStep: 1,
    totalSteps: 1,
    currentApprover: 'TGĐ Tập đoàn',
    status: 'PENDING',
    history: [{ step: 1, name: 'TGĐ Tập đoàn', approver: 'TGĐ Tập đoàn', result: 'PENDING', at: null, comment: null }],
  },
  {
    id: 'ap4',
    code: 'AR-2026-05-006',
    flowName: 'Phê duyệt PO > 500 triệu',
    targetType: 'PURCHASE_ORDER',
    targetCode: 'PO-2026-05-008',
    targetSummary: 'Mua bao bì PP 25kg — An Phát',
    amount: 85_000_000,
    requesterName: 'Đỗ Văn Khánh',
    requesterEmail: 'mua.hang@rtd.vn',
    submittedAt: '2026-05-05T08:00:00Z',
    currentStep: 3,
    totalSteps: 3,
    currentApprover: '—',
    status: 'APPROVED',
    history: [
      { step: 1, name: 'Trưởng phòng mua', approver: 'Đỗ Văn Khánh', result: 'APPROVED', at: '2026-05-05T08:30:00Z', comment: '' },
      { step: 2, name: 'Kế toán trưởng', approver: 'Phạm Quốc Cường', result: 'APPROVED', at: '2026-05-05T10:00:00Z', comment: 'OK' },
      { step: 3, name: 'TGĐ', approver: 'Nguyễn Văn An', result: 'APPROVED', at: '2026-05-05T14:00:00Z', comment: 'Duyệt' },
    ],
  },
  {
    id: 'ap5',
    code: 'AR-2026-05-005',
    flowName: 'Phê duyệt hóa đơn > 200 triệu',
    targetType: 'INVOICE',
    targetCode: 'INV-P-2026-05-003',
    targetSummary: 'HĐ mua khô đậu tương — Vinacam',
    amount: 920_000_000,
    requesterName: 'Lê Thị Dung',
    requesterEmail: 'ke.toan1@rtd.vn',
    submittedAt: '2026-05-04T11:00:00Z',
    currentStep: 1,
    totalSteps: 2,
    currentApprover: '—',
    status: 'REJECTED',
    history: [
      { step: 1, name: 'Kế toán trưởng', approver: 'Phạm Quốc Cường', result: 'REJECTED', at: '2026-05-04T16:30:00Z', comment: 'Giá cao hơn thị trường, đề nghị đàm phán lại' },
    ],
  },
];

// ===== Chart of Accounts (TT200 rút gọn) =====

export interface MockAccount {
  code: string;
  name: string;
  accountType: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  parentCode: string | null;
  isLeaf: boolean;
  balance: number;
}

export const MOCK_COA: MockAccount[] = [
  // Tài sản ngắn hạn
  { code: '11', name: 'Tiền và các khoản tương đương tiền', accountType: 'ASSET', parentCode: null, isLeaf: false, balance: 5_050_000_000 },
  { code: '111', name: 'Tiền mặt', accountType: 'ASSET', parentCode: '11', isLeaf: true, balance: 850_000_000 },
  { code: '112', name: 'Tiền gửi ngân hàng', accountType: 'ASSET', parentCode: '11', isLeaf: true, balance: 4_200_000_000 },
  { code: '13', name: 'Phải thu', accountType: 'ASSET', parentCode: null, isLeaf: false, balance: 1_955_000_000 },
  { code: '131', name: 'Phải thu khách hàng', accountType: 'ASSET', parentCode: '13', isLeaf: true, balance: 1_955_000_000 },
  { code: '15', name: 'Hàng tồn kho', accountType: 'ASSET', parentCode: null, isLeaf: false, balance: 3_460_000_000 },
  { code: '152', name: 'Nguyên vật liệu', accountType: 'ASSET', parentCode: '15', isLeaf: true, balance: 2_340_000_000 },
  { code: '155', name: 'Thành phẩm', accountType: 'ASSET', parentCode: '15', isLeaf: true, balance: 1_120_000_000 },
  // Tài sản dài hạn
  { code: '21', name: 'Tài sản cố định', accountType: 'ASSET', parentCode: null, isLeaf: false, balance: 15_255_000_000 },
  { code: '211', name: 'TSCĐ hữu hình', accountType: 'ASSET', parentCode: '21', isLeaf: true, balance: 18_500_000_000 },
  { code: '214', name: 'Hao mòn TSCĐ', accountType: 'ASSET', parentCode: '21', isLeaf: true, balance: -3_245_000_000 },
  // Nợ phải trả
  { code: '33', name: 'Phải trả', accountType: 'LIABILITY', parentCode: null, isLeaf: false, balance: 605_000_000 },
  { code: '331', name: 'Phải trả người bán', accountType: 'LIABILITY', parentCode: '33', isLeaf: true, balance: 320_000_000 },
  { code: '334', name: 'Phải trả người lao động', accountType: 'LIABILITY', parentCode: '33', isLeaf: true, balance: 285_000_000 },
  // Vốn chủ sở hữu
  { code: '41', name: 'Vốn chủ sở hữu', accountType: 'EQUITY', parentCode: null, isLeaf: false, balance: 25_115_000_000 },
  { code: '411', name: 'Vốn góp của chủ sở hữu', accountType: 'EQUITY', parentCode: '41', isLeaf: true, balance: 20_000_000_000 },
  { code: '421', name: 'LNST chưa phân phối', accountType: 'EQUITY', parentCode: '41', isLeaf: true, balance: 5_115_000_000 },
  // Doanh thu
  { code: '51', name: 'Doanh thu', accountType: 'REVENUE', parentCode: null, isLeaf: false, balance: 13_135_000_000 },
  { code: '511', name: 'Doanh thu bán hàng', accountType: 'REVENUE', parentCode: '51', isLeaf: true, balance: 13_135_000_000 },
  // Chi phí
  { code: '63', name: 'Giá vốn', accountType: 'EXPENSE', parentCode: null, isLeaf: false, balance: 9_280_000_000 },
  { code: '632', name: 'Giá vốn hàng bán', accountType: 'EXPENSE', parentCode: '63', isLeaf: true, balance: 9_280_000_000 },
  { code: '64', name: 'Chi phí kinh doanh', accountType: 'EXPENSE', parentCode: null, isLeaf: false, balance: 1_500_000_000 },
  { code: '641', name: 'Chi phí bán hàng', accountType: 'EXPENSE', parentCode: '64', isLeaf: true, balance: 580_000_000 },
  { code: '642', name: 'Chi phí quản lý DN', accountType: 'EXPENSE', parentCode: '64', isLeaf: true, balance: 920_000_000 },
];

// ===== Payments (Phiếu thu / chi) =====

export interface MockPayment {
  id: string;
  code: string;
  type: 'RECEIPT' | 'DISBURSEMENT';
  partnerName: string;
  paymentDate: string;
  amount: number;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CHEQUE';
  bankAccount: string | null;
  referenceNo: string | null;
  status: 'DRAFT' | 'COMPLETED' | 'CANCELLED';
  invoiceCode: string | null;
}

export const MOCK_PAYMENTS: MockPayment[] = [
  { id: 'pm1', code: 'PT-2026-05-001', type: 'RECEIPT', partnerName: 'ĐL Sơn Hùng', paymentDate: '2026-05-07', amount: 480_000_000, paymentMethod: 'BANK_TRANSFER', bankAccount: 'VCB - 0451 0000 12345', referenceNo: 'TT070526', status: 'COMPLETED', invoiceCode: 'INV-S-2026-04-012' },
  { id: 'pm2', code: 'PT-2026-05-002', type: 'RECEIPT', partnerName: 'ĐL Minh Phú', paymentDate: '2026-05-06', amount: 100_000_000, paymentMethod: 'BANK_TRANSFER', bankAccount: 'VCB - 0451 0000 12345', referenceNo: 'TT060526', status: 'COMPLETED', invoiceCode: 'INV-S-2026-04-013' },
  { id: 'pm3', code: 'PC-2026-05-001', type: 'DISBURSEMENT', partnerName: 'Cargill Việt Nam', paymentDate: '2026-05-05', amount: 1_250_000_000, paymentMethod: 'BANK_TRANSFER', bankAccount: 'VCB - 0451 0000 12345', referenceNo: 'CT050526', status: 'COMPLETED', invoiceCode: 'INV-P-2026-04-008' },
  { id: 'pm4', code: 'PC-2026-05-002', type: 'DISBURSEMENT', partnerName: 'Bao bì An Phát', paymentDate: '2026-05-04', amount: 85_000_000, paymentMethod: 'BANK_TRANSFER', bankAccount: 'VCB - 0451 0000 12345', referenceNo: 'CT040526', status: 'COMPLETED', invoiceCode: 'INV-P-2026-04-009' },
  { id: 'pm5', code: 'PC-2026-05-003', type: 'DISBURSEMENT', partnerName: 'Lương khối VP', paymentDate: '2026-05-03', amount: 320_000_000, paymentMethod: 'BANK_TRANSFER', bankAccount: 'VCB - 0451 0000 12345', referenceNo: 'CT030526', status: 'COMPLETED', invoiceCode: null },
  { id: 'pm6', code: 'PT-2026-05-003', type: 'RECEIPT', partnerName: 'ĐL Tây Nguyên', paymentDate: '2026-05-02', amount: 75_000_000, paymentMethod: 'CASH', bankAccount: null, referenceNo: null, status: 'COMPLETED', invoiceCode: null },
  { id: 'pm7', code: 'PC-2026-05-004', type: 'DISBURSEMENT', partnerName: 'GĐ NM Hà Nam', paymentDate: '2026-05-06', amount: 12_000_000, paymentMethod: 'CASH', bankAccount: null, referenceNo: 'TƯ-001', status: 'DRAFT', invoiceCode: null },
];

// ===== Cost Centers =====

export interface MockCostCenter {
  id: string;
  code: string;
  name: string;
  type: 'FACTORY' | 'FARM' | 'OFFICE' | 'OTHER';
  managerName: string;
  ytdExpense: number;
  ytdBudget: number;
}

export const MOCK_COST_CENTERS: MockCostCenter[] = [
  { id: 'cc1', code: 'NM-HN', name: 'Nhà máy Hà Nam', type: 'FACTORY', managerName: 'Trần Văn Hùng', ytdExpense: 5_280_000_000, ytdBudget: 6_200_000_000 },
  { id: 'cc2', code: 'NM-BN', name: 'Nhà máy Bắc Ninh', type: 'FACTORY', managerName: 'Lê Đức Thắng', ytdExpense: 3_950_000_000, ytdBudget: 4_500_000_000 },
  { id: 'cc3', code: 'TR-TN', name: 'Trại Thái Nguyên', type: 'FARM', managerName: 'Phạm Văn Bình', ytdExpense: 2_140_000_000, ytdBudget: 2_400_000_000 },
  { id: 'cc4', code: 'TR-BG', name: 'Trại Bắc Giang', type: 'FARM', managerName: 'Hoàng Đình Sơn', ytdExpense: 1_820_000_000, ytdBudget: 2_000_000_000 },
  { id: 'cc5', code: 'VP-TĐ', name: 'Văn phòng Tập đoàn', type: 'OFFICE', managerName: 'Phạm Quốc Cường', ytdExpense: 1_245_000_000, ytdBudget: 1_500_000_000 },
];

// ===== Budget =====

export interface MockBudgetLine {
  accountCode: string;
  accountName: string;
  costCenter: string;
  q1Plan: number;
  q1Actual: number;
  q2Plan: number;
  q2Actual: number;
}

export const MOCK_BUDGET_LINES: MockBudgetLine[] = [
  { accountCode: '511', accountName: 'Doanh thu bán hàng', costCenter: 'NM-HN', q1Plan: 6_500_000_000, q1Actual: 6_330_000_000, q2Plan: 7_000_000_000, q2Actual: 4_855_000_000 },
  { accountCode: '511', accountName: 'Doanh thu bán hàng', costCenter: 'NM-BN', q1Plan: 4_800_000_000, q1Actual: 4_545_000_000, q2Plan: 5_200_000_000, q2Actual: 3_410_000_000 },
  { accountCode: '511', accountName: 'Doanh thu bán hàng', costCenter: 'TR-TN', q1Plan: 1_500_000_000, q1Actual: 1_840_000_000, q2Plan: 1_800_000_000, q2Actual: 0 },
  { accountCode: '632', accountName: 'Giá vốn hàng bán', costCenter: 'NM-HN', q1Plan: 4_900_000_000, q1Actual: 4_780_000_000, q2Plan: 5_200_000_000, q2Actual: 3_620_000_000 },
  { accountCode: '632', accountName: 'Giá vốn hàng bán', costCenter: 'NM-BN', q1Plan: 3_600_000_000, q1Actual: 3_410_000_000, q2Plan: 3_900_000_000, q2Actual: 2_530_000_000 },
  { accountCode: '641', accountName: 'Chi phí bán hàng', costCenter: 'VP-TĐ', q1Plan: 280_000_000, q1Actual: 295_000_000, q2Plan: 290_000_000, q2Actual: 285_000_000 },
  { accountCode: '642', accountName: 'Chi phí quản lý DN', costCenter: 'VP-TĐ', q1Plan: 450_000_000, q1Actual: 462_000_000, q2Plan: 460_000_000, q2Actual: 458_000_000 },
];

// ===== System Settings =====

export interface MockSetting {
  key: string;
  label: string;
  value: string;
  category: 'general' | 'accounting' | 'security' | 'i18n' | 'email';
  type: 'string' | 'number' | 'boolean' | 'select';
  options?: string[];
  description?: string;
}

export const MOCK_SETTINGS: MockSetting[] = [
  { key: 'company_name', label: 'Tên hiển thị tập đoàn', value: 'Tập đoàn RTD Việt Nam', category: 'general', type: 'string' },
  { key: 'company_address', label: 'Địa chỉ trụ sở', value: 'Tầng 12, tòa nhà RTD, Cầu Giấy, Hà Nội', category: 'general', type: 'string' },
  { key: 'fiscal_year_start_month', label: 'Tháng bắt đầu năm tài chính', value: '1', category: 'accounting', type: 'number', description: '1 = tháng 1' },
  { key: 'default_currency', label: 'Tiền tệ mặc định', value: 'VND', category: 'accounting', type: 'select', options: ['VND', 'USD', 'EUR', 'CNY'] },
  { key: 'tax_rate_default', label: 'Thuế suất GTGT mặc định (%)', value: '8', category: 'accounting', type: 'number' },
  { key: 'invoice_due_days', label: 'Hạn thanh toán mặc định (ngày)', value: '30', category: 'accounting', type: 'number' },
  { key: 'session_timeout_minutes', label: 'Timeout phiên (phút)', value: '60', category: 'security', type: 'number' },
  { key: 'mfa_enabled', label: 'Bật xác thực 2 lớp (MFA)', value: 'false', category: 'security', type: 'boolean' },
  { key: 'password_min_length', label: 'Độ dài mật khẩu tối thiểu', value: '12', category: 'security', type: 'number' },
  { key: 'default_locale', label: 'Ngôn ngữ mặc định', value: 'vi', category: 'i18n', type: 'select', options: ['vi', 'en'] },
  { key: 'date_format', label: 'Định dạng ngày', value: 'DD/MM/YYYY', category: 'i18n', type: 'select', options: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] },
  { key: 'smtp_host', label: 'SMTP Host', value: 'mailhog.local', category: 'email', type: 'string' },
  { key: 'smtp_port', label: 'SMTP Port', value: '1025', category: 'email', type: 'number' },
  { key: 'smtp_from', label: 'Email gửi mặc định', value: 'no-reply@rtd.vn', category: 'email', type: 'string' },
];
