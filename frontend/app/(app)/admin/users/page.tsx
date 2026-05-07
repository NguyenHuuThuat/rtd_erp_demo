'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Filter, MoreHorizontal, Plus, Search, ToggleLeft, ToggleRight, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageTitle } from '@/components/page-title';
import { Modal } from '@/components/modal';
import { Drawer } from '@/components/drawer';
import { StatusBadge } from '@/components/status-badge';
import { UserForm } from '@/components/forms/user-form';
import { useMockStore } from '@/lib/mock-store';
import { type MockUser } from '@/lib/mock-data';
import { formatDateTime, cn } from '@/lib/utils';

const ROLE_BADGE: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary'> = {
  SUPER_ADMIN: 'danger',
  ADMIN: 'success',
  ACCOUNTANT: 'info',
  MANAGER_FACTORY: 'primary',
  VIEWER: 'neutral',
};

export default function UsersPage() {
  const users = useMockStore((s) => s.users);
  const orgs = useMockStore((s) => s.orgs);
  const toggleActive = useMockStore((s) => s.toggleUserActive);

  const [search, setSearch] = useState('');
  const [filterCompany, setFilterCompany] = useState<string>('');
  const [filterRole, setFilterRole] = useState<string>('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [detail, setDetail] = useState<MockUser | null>(null);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (search && !`${u.email} ${u.fullName}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterCompany && u.companyId !== filterCompany) return false;
      if (filterRole && !u.roles.includes(filterRole)) return false;
      if (filterActive === 'active' && !u.isActive) return false;
      if (filterActive === 'inactive' && u.isActive) return false;
      return true;
    });
  }, [users, search, filterCompany, filterRole, filterActive]);

  return (
    <div>
      <PageTitle
        title="Người dùng"
        subtitle={`${users.length} tài khoản · ${users.filter((u) => u.isActive).length} đang hoạt động`}
        actions={
          <>
            <button onClick={() => toast('Import CSV — đang xây')} className="btn-secondary">
              Import CSV
            </button>
            <button onClick={() => setCreateOpen(true)} className="btn-primary">
              <Plus className="w-4 h-4" />
              Thêm người dùng
            </button>
          </>
        }
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-3 border-b border-slate-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo email hoặc họ tên…"
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-slate-300"
            />
          </div>

          <Filter className="w-4 h-4 text-slate-400 ml-2" />
          <select
            value={filterCompany}
            onChange={(e) => setFilterCompany(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-rtd-400"
          >
            <option value="">Tất cả đơn vị</option>
            {orgs.filter((o) => o.type !== 'BRANCH').map((o) => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-rtd-400"
          >
            <option value="">Tất cả vai trò</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            <option value="ADMIN">ADMIN</option>
            <option value="ACCOUNTANT">ACCOUNTANT</option>
            <option value="VIEWER">VIEWER</option>
          </select>
          <div className="flex bg-slate-100 rounded-lg p-0.5 text-xs">
            {(['all', 'active', 'inactive'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setFilterActive(v)}
                className={cn(
                  'px-3 py-1 rounded transition',
                  filterActive === v ? 'bg-white text-slate-800 shadow-sm font-medium' : 'text-slate-500',
                )}
              >
                {v === 'all' ? 'Tất cả' : v === 'active' ? 'Hoạt động' : 'Tạm khóa'}
              </button>
            ))}
          </div>

          <div className="ml-auto text-xs text-slate-500">
            Hiển thị <strong>{filtered.length}</strong>/{users.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="text-left font-semibold px-4 py-3">Họ tên</th>
                <th className="text-left font-semibold px-4 py-3">Email</th>
                <th className="text-left font-semibold px-4 py-3 hidden md:table-cell">SĐT</th>
                <th className="text-left font-semibold px-4 py-3 hidden lg:table-cell">Đơn vị</th>
                <th className="text-left font-semibold px-4 py-3">Vai trò</th>
                <th className="text-left font-semibold px-4 py-3 hidden md:table-cell">Đăng nhập gần nhất</th>
                <th className="text-center font-semibold px-4 py-3">Trạng thái</th>
                <th className="text-center font-semibold px-4 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  onClick={() => setDetail(u)}
                  className="hover:bg-slate-50 transition cursor-pointer"
                >
                  <td className="px-4 py-3 font-medium text-slate-800">{u.fullName}</td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3 text-slate-600 tabular-nums hidden md:table-cell">{u.phone ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-600 truncate max-w-[200px] hidden lg:table-cell">
                    {u.companyName}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {u.roles.map((r) => (
                        <StatusBadge key={r} variant={ROLE_BADGE[r] ?? 'neutral'}>
                          {r}
                        </StatusBadge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">
                    {formatDateTime(u.lastLoginAt)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {u.isActive ? (
                      <CheckCircle2 className="w-4 h-4 text-rtd-600 inline" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-400 inline" />
                    )}
                  </td>
                  <td className="px-2 py-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toast('Menu thao tác — đang xây');
                      }}
                      className="p-1 rounded hover:bg-slate-100 text-slate-400"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    Không có user khớp tìm kiếm
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Thêm người dùng" size="lg">
        <UserForm onClose={() => setCreateOpen(false)} />
      </Modal>

      <Drawer
        open={detail !== null}
        onClose={() => setDetail(null)}
        title={detail?.fullName ?? ''}
        subtitle={detail?.email}
        footer={
          detail && (
            <div className="flex justify-between">
              <button
                onClick={() => {
                  toggleActive(detail.id);
                  toast.success(detail.isActive ? 'Đã tạm khóa tài khoản' : 'Đã kích hoạt tài khoản');
                  setDetail({ ...detail, isActive: !detail.isActive });
                }}
                className="btn-ghost"
              >
                {detail.isActive ? <ToggleLeft className="w-4 h-4" /> : <ToggleRight className="w-4 h-4" />}
                {detail.isActive ? 'Tạm khóa' : 'Kích hoạt'}
              </button>
              <div className="flex gap-2">
                <button onClick={() => setDetail(null)} className="btn-ghost">
                  Đóng
                </button>
                <button onClick={() => toast('Reset password — đang xây')} className="btn-primary">
                  Reset mật khẩu
                </button>
              </div>
            </div>
          )
        }
      >
        {detail && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <DetailField label="Email" value={detail.email} mono />
              <DetailField label="Số điện thoại" value={detail.phone ?? '—'} />
              <DetailField label="Đơn vị" value={detail.companyName} />
              <DetailField label="Trạng thái" value={detail.isActive ? 'Hoạt động' : 'Tạm khóa'} />
              <DetailField label="Đăng nhập cuối" value={formatDateTime(detail.lastLoginAt)} />
              <DetailField label="ID" value={detail.id} mono />
            </div>

            <div className="border-t border-slate-100 pt-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Vai trò ({detail.roles.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {detail.roles.map((r) => (
                  <StatusBadge key={r} variant={ROLE_BADGE[r] ?? 'neutral'}>{r}</StatusBadge>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Bảo mật
              </div>
              <div className="space-y-2 text-sm">
                <Row label="Xác thực 2 lớp (MFA)" value="Chưa bật" />
                <Row label="Đăng nhập sai liên tiếp" value="0 lần" />
                <Row label="Phiên đang hoạt động" value="2 thiết bị" />
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

function DetailField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-xs text-slate-500 mb-0.5">{label}</div>
      <div className={cn('text-sm text-slate-800', mono && 'font-mono break-all')}>{value}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-800 font-medium">{value}</span>
    </div>
  );
}
