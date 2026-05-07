'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

const LABELS: Record<string, string> = {
  dashboard: 'Trang chủ',
  admin: 'Quản trị',
  organizations: 'Cơ cấu tổ chức',
  users: 'Người dùng',
  roles: 'Vai trò & Phân quyền',
  partners: 'Đối tác',
  approvals: 'Phê duyệt',
  'audit-logs': 'Nhật ký hoạt động',
  settings: 'Cài đặt hệ thống',
  financial: 'Tài chính – Kế toán',
  journals: 'Sổ nhật ký',
  invoices: 'Hóa đơn',
  reports: 'Báo cáo',
  'chart-of-accounts': 'Hệ thống tài khoản',
  payments: 'Phiếu thu / chi',
  'cost-centers': 'Trung tâm chi phí',
  budgets: 'Ngân sách',
  profile: 'Hồ sơ cá nhân',
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0 || segments[0] === 'login') return null;

  return (
    <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
      <Link href="/dashboard" className="hover:text-rtd-600 flex items-center">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {segments.map((seg, i) => {
        const href = '/' + segments.slice(0, i + 1).join('/');
        const isLast = i === segments.length - 1;
        const label = LABELS[seg] ?? seg;
        return (
          <span key={href} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            {isLast ? (
              <span className="text-slate-700 font-medium">{label}</span>
            ) : (
              <Link href={href} className="hover:text-rtd-600">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
