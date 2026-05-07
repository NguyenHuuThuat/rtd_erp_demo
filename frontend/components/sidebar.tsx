'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronDown,
  FileText,
  Handshake,
  Home,
  Landmark,
  Leaf,
  Receipt,
  ScrollText,
  Settings,
  ShieldCheck,
  Target,
  UsersRound,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useMockStore } from '@/lib/mock-store';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: () => number | string | null;
}

interface NavSection {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
}

export function Sidebar() {
  const pathname = usePathname();
  const pendingApprovals = useMockStore((s) =>
    // Recompute từ MOCK_APPROVALS nhưng store chưa có; dùng hardcode 3 cho phù hợp
    s.notifications.filter((n) => !n.read && n.title.includes('phê duyệt')).length,
  );

  const sections: NavSection[] = [
    {
      label: 'Quản trị',
      icon: ShieldCheck,
      items: [
        { label: 'Tổng quan', href: '/admin', icon: Home },
        { label: 'Cơ cấu tổ chức', href: '/admin/organizations', icon: Building2 },
        { label: 'Người dùng', href: '/admin/users', icon: UsersRound },
        { label: 'Vai trò & Phân quyền', href: '/admin/roles', icon: ShieldCheck },
        { label: 'Đối tác', href: '/admin/partners', icon: Handshake },
        { label: 'Phê duyệt', href: '/admin/approvals', icon: CheckCircle2, badge: () => 3 },
        { label: 'Nhật ký hoạt động', href: '/admin/audit-logs', icon: ScrollText },
        { label: 'Cài đặt hệ thống', href: '/admin/settings', icon: Settings },
      ],
    },
    {
      label: 'Tài chính – Kế toán',
      icon: Wallet,
      items: [
        { label: 'Tổng quan', href: '/financial', icon: Home },
        { label: 'Hệ thống tài khoản', href: '/financial/chart-of-accounts', icon: BookOpen },
        { label: 'Sổ nhật ký', href: '/financial/journals', icon: ScrollText },
        { label: 'Hóa đơn', href: '/financial/invoices', icon: Receipt },
        { label: 'Phiếu thu / chi', href: '/financial/payments', icon: Landmark },
        { label: 'Trung tâm chi phí', href: '/financial/cost-centers', icon: Briefcase },
        { label: 'Ngân sách', href: '/financial/budgets', icon: Target },
        { label: 'Báo cáo', href: '/financial/reports', icon: FileText },
      ],
    },
  ];

  void pendingApprovals;
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(sections.map((s) => s.label)),
  );

  function toggle(label: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shrink-0">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-rtd-600 text-white flex items-center justify-center shadow-md shadow-rtd-200">
          <Leaf className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="font-bold text-rtd-800 leading-tight">RTD ERP</div>
          <div className="text-[11px] text-slate-500">Phase 1 — Demo</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        <Link
          href="/dashboard"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition',
            pathname === '/dashboard'
              ? 'bg-rtd-50 text-rtd-700'
              : 'text-slate-700 hover:bg-slate-50',
          )}
        >
          <Home className="w-4 h-4" />
          Trang chủ
        </Link>

        {sections.map((section) => {
          const isOpen = openSections.has(section.label);
          const SectionIcon = section.icon;
          return (
            <div key={section.label} className="pt-2">
              <button
                onClick={() => toggle(section.label)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-700 transition"
              >
                <span className="flex items-center gap-2">
                  <SectionIcon className="w-3.5 h-3.5" />
                  {section.label}
                </span>
                <ChevronDown
                  className={cn('w-3.5 h-3.5 transition-transform', isOpen ? '' : '-rotate-90')}
                />
              </button>
              {isOpen && (
                <div className="mt-1 space-y-0.5">
                  {section.items.map((item) => {
                    const ItemIcon = item.icon;
                    const active = pathname === item.href || pathname.startsWith(item.href + '/');
                    const badge = item.badge?.();
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'group flex items-center gap-3 pl-7 pr-3 py-2 rounded-lg text-sm transition',
                          active
                            ? 'bg-rtd-50 text-rtd-700 font-medium'
                            : 'text-slate-600 hover:bg-slate-50',
                        )}
                      >
                        <ItemIcon className="w-4 h-4" />
                        <span className="flex-1">{item.label}</span>
                        {badge && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                            {badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-slate-100">
        <div className="rounded-lg bg-gradient-to-br from-rtd-50 to-emerald-50 p-3 text-[11px]">
          <div className="font-semibold text-rtd-800">Phase 2 — sắp tới</div>
          <div className="text-slate-600 mt-0.5">
            Procurement · Manufacturing · Inventory · Farm · Sales
          </div>
        </div>
        <div className="text-[11px] text-slate-400 mt-2 text-center">v0.1.0 — © 2026 RTD</div>
      </div>
    </aside>
  );
}
