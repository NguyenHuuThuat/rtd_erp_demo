'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  CheckCheck,
  HelpCircle,
  Keyboard,
  LogOut,
  Search,
  Settings,
  User,
  UserCircle,
} from 'lucide-react';
import { formatDateTime, cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/auth-store';
import { useMockStore } from '@/lib/mock-store';
import { Dropdown } from './dropdown';
import toast from 'react-hot-toast';

export function Topbar() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);
  const notifications = useMockStore((s) => s.notifications);
  const markRead = useMockStore((s) => s.markNotificationRead);
  const markAllRead = useMockStore((s) => s.markAllNotificationsRead);
  const unreadCount = notifications.filter((n) => !n.read).length;

  function handleLogout() {
    clearSession();
    toast.success('Đã đăng xuất');
    router.push('/login');
  }

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            placeholder="Tìm tổ chức, người dùng, hóa đơn… (Ctrl+K)"
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-slate-300 transition"
            onFocus={() => toast('Tìm kiếm toàn cục — sắp ra mắt', { icon: '🔍' })}
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:inline-block text-[10px] text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 bg-white">⌘K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* Help */}
        <button
          type="button"
          onClick={() => toast('Trợ giúp & Tài liệu — đang xây')}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
          aria-label="Trợ giúp"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <Dropdown
          width={380}
          trigger={
            <span className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 relative inline-flex">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white live-dot" />
              )}
            </span>
          }
        >
          {(close) => (
            <div>
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm text-slate-800">Thông báo</div>
                  <div className="text-xs text-slate-500">{unreadCount} chưa đọc</div>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      markAllRead();
                      toast.success('Đã đánh dấu tất cả là đã đọc');
                    }}
                    className="text-xs text-rtd-600 hover:text-rtd-700 inline-flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Đọc hết
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={cn(
                      'w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 flex items-start gap-3',
                      !n.read && 'bg-rtd-50/30',
                    )}
                  >
                    <span
                      className={cn(
                        'w-2 h-2 rounded-full mt-1.5 shrink-0',
                        n.type === 'warning'
                          ? 'bg-amber-500'
                          : n.type === 'success'
                          ? 'bg-rtd-500'
                          : 'bg-blue-500',
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-800">{n.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{n.body}</div>
                      <div className="text-xs text-slate-400 mt-1">{formatDateTime(n.at)}</div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={close}
                className="w-full px-4 py-2.5 text-xs text-rtd-600 hover:bg-slate-50 border-t border-slate-100 font-medium"
              >
                Xem tất cả thông báo →
              </button>
            </div>
          )}
        </Dropdown>

        {/* Profile dropdown */}
        <Dropdown
          width={240}
          trigger={
            <span className="flex items-center gap-2 pl-2 ml-1 hover:bg-slate-50 rounded-lg py-1 pr-2 transition">
              <UserCircle className="w-8 h-8 text-slate-400" />
              <span className="hidden md:block text-left">
                <span className="block text-sm font-medium text-slate-700 leading-tight">
                  {user?.fullName ?? 'Khách'}
                </span>
                <span className="block text-[11px] text-slate-500">{user?.email}</span>
              </span>
            </span>
          }
        >
          {(close) => (
            <div>
              <div className="px-4 py-3 border-b border-slate-100">
                <div className="font-semibold text-sm text-slate-800">{user?.fullName}</div>
                <div className="text-xs text-slate-500">{user?.email}</div>
                <div className="mt-1.5 text-[11px] text-rtd-700 bg-rtd-50 px-2 py-0.5 rounded inline-block">
                  {user?.permissions?.length ?? 0} quyền · SUPER_ADMIN
                </div>
              </div>
              <div className="py-1">
                <DropItem href="/profile" icon={User} onClick={close}>
                  Hồ sơ cá nhân
                </DropItem>
                <DropItem href="/admin/settings" icon={Settings} onClick={close}>
                  Cấu hình hệ thống
                </DropItem>
                <DropItem
                  href="#"
                  icon={Keyboard}
                  onClick={() => {
                    close();
                    toast('Phím tắt: ⌘K (search), ⌘D (dashboard)');
                  }}
                >
                  Phím tắt
                </DropItem>
              </div>
              <div className="border-t border-slate-100 py-1">
                <button
                  onClick={() => {
                    close();
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </Dropdown>
      </div>
    </header>
  );
}

function DropItem({
  href,
  icon: Icon,
  children,
  onClick,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
    >
      <Icon className="w-4 h-4 text-slate-400" />
      {children}
    </Link>
  );
}
