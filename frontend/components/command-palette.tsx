'use client';

import { Command } from 'cmdk';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  FileText,
  Handshake,
  Home,
  Landmark,
  Receipt,
  ScrollText,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
} from 'lucide-react';
import { useTourStore } from '@/lib/tour-store';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  group: 'Quản trị' | 'Tài chính' | 'Hành động';
  keywords?: string;
}

const ITEMS: NavItem[] = [
  { label: 'Trang chủ', href: '/dashboard', icon: Home, group: 'Quản trị', keywords: 'dashboard home' },
  { label: 'Cơ cấu tổ chức', href: '/admin/organizations', icon: Building2, group: 'Quản trị', keywords: 'org tree group company' },
  { label: 'Người dùng', href: '/admin/users', icon: UsersRound, group: 'Quản trị', keywords: 'user account' },
  { label: 'Vai trò & Phân quyền', href: '/admin/roles', icon: ShieldCheck, group: 'Quản trị', keywords: 'role permission rbac' },
  { label: 'Đối tác', href: '/admin/partners', icon: Handshake, group: 'Quản trị', keywords: 'partner customer supplier' },
  { label: 'Phê duyệt', href: '/admin/approvals', icon: CheckCircle2, group: 'Quản trị', keywords: 'approval workflow' },
  { label: 'Nhật ký hoạt động', href: '/admin/audit-logs', icon: ScrollText, group: 'Quản trị', keywords: 'audit log' },
  { label: 'Cài đặt hệ thống', href: '/admin/settings', icon: Settings, group: 'Quản trị', keywords: 'config setting' },
  { label: 'Tổng quan tài chính', href: '/financial', icon: Home, group: 'Tài chính' },
  { label: 'Hệ thống tài khoản', href: '/financial/chart-of-accounts', icon: BookOpen, group: 'Tài chính', keywords: 'coa tt200 account' },
  { label: 'Sổ nhật ký', href: '/financial/journals', icon: ScrollText, group: 'Tài chính', keywords: 'journal voucher' },
  { label: 'Hóa đơn', href: '/financial/invoices', icon: Receipt, group: 'Tài chính', keywords: 'invoice ar ap' },
  { label: 'Phiếu thu / chi', href: '/financial/payments', icon: Landmark, group: 'Tài chính', keywords: 'payment receipt cash' },
  { label: 'Trung tâm chi phí', href: '/financial/cost-centers', icon: Briefcase, group: 'Tài chính', keywords: 'cost center' },
  { label: 'Ngân sách', href: '/financial/budgets', icon: Target, group: 'Tài chính', keywords: 'budget plan actual' },
  { label: 'Báo cáo tài chính', href: '/financial/reports', icon: FileText, group: 'Tài chính', keywords: 'report bs is cf' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const startTour = useTourStore((s) => s.start);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  function go(href: string) {
    router.push(href);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <Command
        label="Command Menu"
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in"
      >
        <div className="flex items-center px-4 border-b border-slate-100">
          <Sparkles className="w-4 h-4 text-slate-400 mr-2" />
          <Command.Input
            placeholder="Gõ để tìm trang, tính năng…"
            className="flex-1 py-3.5 text-sm focus:outline-none placeholder-slate-400"
          />
          <kbd className="text-[10px] text-slate-400 border border-slate-200 rounded px-1.5 py-0.5">ESC</kbd>
        </div>
        <Command.List className="max-h-96 overflow-y-auto p-2">
          <Command.Empty className="py-8 text-center text-sm text-slate-500">
            Không tìm thấy kết quả
          </Command.Empty>

          <Command.Group heading="Hành động nhanh" className="text-xs text-slate-500 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5">
            <Command.Item
              onSelect={() => {
                setOpen(false);
                startTour();
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer aria-selected:bg-rtd-50 aria-selected:text-rtd-700 text-sm"
            >
              <Sparkles className="w-4 h-4 text-slate-400" />
              <span>▶ Bắt đầu tour 2 phút</span>
            </Command.Item>
          </Command.Group>

          {(['Quản trị', 'Tài chính'] as const).map((groupName) => (
            <Command.Group
              key={groupName}
              heading={groupName}
              className="text-xs text-slate-500 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 mt-2"
            >
              {ITEMS.filter((i) => i.group === groupName).map((item) => {
                const Icon = item.icon;
                return (
                  <Command.Item
                    key={item.href}
                    value={`${item.label} ${item.keywords ?? ''}`}
                    onSelect={() => go(item.href)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer aria-selected:bg-rtd-50 aria-selected:text-rtd-700 text-sm"
                  >
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{item.label}</span>
                    <span className="ml-auto text-xs text-slate-400 font-mono">{item.href}</span>
                  </Command.Item>
                );
              })}
            </Command.Group>
          ))}
        </Command.List>

        <div className="px-4 py-2 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
          <span>Mở bằng <kbd className="bg-slate-100 px-1.5 py-0.5 rounded">⌘K</kbd> hoặc <kbd className="bg-slate-100 px-1.5 py-0.5 rounded">Ctrl+K</kbd></span>
          <span>Enter để chọn</span>
        </div>
      </Command>
    </div>
  );
}
