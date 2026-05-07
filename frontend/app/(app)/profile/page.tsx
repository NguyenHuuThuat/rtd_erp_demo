'use client';

import { useState } from 'react';
import { Lock, Save, Shield, UserCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageTitle } from '@/components/page-title';
import { StatusBadge } from '@/components/status-badge';
import { useAuthStore } from '@/lib/auth-store';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState<'info' | 'password' | 'security'>('info');

  return (
    <div>
      <PageTitle title="Hồ sơ cá nhân" subtitle="Cập nhật thông tin và bảo mật tài khoản" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rtd-500 to-emerald-600 mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user?.fullName?.charAt(0) ?? 'U'}
            </div>
            <h3 className="font-semibold text-slate-900 text-lg mt-4">{user?.fullName}</h3>
            <div className="text-sm text-slate-500">{user?.email}</div>
            <div className="mt-3">
              <StatusBadge variant="danger">SUPER_ADMIN</StatusBadge>
            </div>
            <button onClick={() => toast('Upload avatar — đang xây')} className="btn-secondary mt-4 w-full justify-center">
              Đổi ảnh đại diện
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 mt-4 p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Hoạt động</div>
            <div className="space-y-2 text-sm">
              <Row label="Đăng nhập gần nhất" value="07/05/2026 10:24" />
              <Row label="IP đăng nhập" value="192.168.1.45" />
              <Row label="Phiên hoạt động" value="2 thiết bị" />
              <Row label="Tổng hành động (30 ngày)" value="247" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-100 px-2">
              <div className="flex">
                {([
                  ['info', 'Thông tin', UserCircle],
                  ['password', 'Mật khẩu', Lock],
                  ['security', 'Bảo mật', Shield],
                ] as const).map(([k, label, Icon]) => (
                  <button
                    key={k}
                    onClick={() => setTab(k)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition ${
                      tab === k
                        ? 'border-rtd-600 text-rtd-700'
                        : 'border-transparent text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {tab === 'info' && <InfoTab />}
              {tab === 'password' && <PasswordTab />}
              {tab === 'security' && <SecurityTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoTab() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        toast.success('Đã cập nhật thông tin');
      }}
      className="space-y-4 max-w-2xl"
    >
      <div className="grid grid-cols-2 gap-4">
        <Field label="Họ và tên">
          <input defaultValue="Quản trị hệ thống" className="input" />
        </Field>
        <Field label="Email">
          <input type="email" defaultValue="admin@rtd.local" className="input" disabled />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Số điện thoại">
          <input defaultValue="0901234567" className="input" />
        </Field>
        <Field label="Phòng ban">
          <input defaultValue="Phòng IT — Tập đoàn" className="input" />
        </Field>
      </div>
      <Field label="Tiểu sử">
        <textarea rows={3} className="input" defaultValue="Quản trị viên hệ thống ERP, phụ trách hạ tầng và phân quyền." />
      </Field>
      <div className="flex justify-end pt-2">
        <button type="submit" className="btn-primary"><Save className="w-4 h-4" />Lưu thay đổi</button>
      </div>
    </form>
  );
}

function PasswordTab() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        toast.success('Đã đổi mật khẩu (mock)');
      }}
      className="space-y-4 max-w-md"
    >
      <Field label="Mật khẩu hiện tại"><input type="password" className="input" /></Field>
      <Field label="Mật khẩu mới"><input type="password" className="input" /></Field>
      <Field label="Xác nhận mật khẩu mới"><input type="password" className="input" /></Field>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
        <div className="font-medium mb-1">Yêu cầu mật khẩu:</div>
        <ul className="space-y-0.5 list-disc list-inside">
          <li>Tối thiểu 12 ký tự</li>
          <li>Có chữ HOA, thường, số, ký tự đặc biệt</li>
          <li>Không trùng 5 mật khẩu gần nhất</li>
        </ul>
      </div>
      <div className="flex justify-end">
        <button type="submit" className="btn-primary"><Save className="w-4 h-4" />Đổi mật khẩu</button>
      </div>
    </form>
  );
}

function SecurityTab() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h4 className="font-semibold text-slate-800 mb-3">Xác thực 2 lớp (MFA)</h4>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <div className="font-medium text-amber-900 text-sm">MFA chưa được bật</div>
            <div className="text-xs text-amber-800 mt-1">
              Bật MFA để tăng bảo mật. Mỗi lần đăng nhập sẽ yêu cầu mã từ ứng dụng Google Authenticator.
            </div>
            <button onClick={() => toast('Setup MFA — đang xây')} className="btn-primary mt-3">Bật MFA</button>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-slate-800 mb-3">Phiên đang hoạt động</h4>
        <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
          <SessionRow device="Chrome / Windows · Hà Nội" ip="192.168.1.45" lastActive="Vừa xong" current />
          <SessionRow device="Safari / iPhone · Hà Nội" ip="118.69.234.12" lastActive="2 giờ trước" />
        </div>
        <button onClick={() => toast.success('Đã đăng xuất tất cả thiết bị khác')} className="btn-ghost text-rose-600 mt-3 text-sm">
          Đăng xuất tất cả thiết bị khác
        </button>
      </div>

      <div>
        <h4 className="font-semibold text-slate-800 mb-3">Lịch sử đăng nhập</h4>
        <div className="text-xs text-slate-500">5 lần gần nhất</div>
        <div className="mt-2 border border-slate-200 rounded-lg divide-y divide-slate-100">
          {[
            { at: '07/05/2026 10:24', ip: '192.168.1.45', ua: 'Chrome/Windows', success: true },
            { at: '06/05/2026 16:12', ip: '192.168.1.45', ua: 'Chrome/Windows', success: true },
            { at: '06/05/2026 09:00', ip: '192.168.1.45', ua: 'Chrome/Windows', success: true },
            { at: '05/05/2026 22:14', ip: '118.69.234.12', ua: 'Safari/iPhone', success: true },
            { at: '04/05/2026 03:42', ip: '210.245.110.5', ua: 'Unknown', success: false },
          ].map((row, i) => (
            <div key={i} className="px-4 py-2 flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <span className={`w-1.5 h-1.5 rounded-full ${row.success ? 'bg-rtd-500' : 'bg-rose-500'}`} />
                <span className="text-slate-600 tabular-nums">{row.at}</span>
                <span className="text-slate-500 text-xs">{row.ua}</span>
              </div>
              <span className="text-xs text-slate-500 font-mono">{row.ip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-500 text-sm">{label}</span>
      <span className="text-slate-800 text-sm font-medium">{value}</span>
    </div>
  );
}

function SessionRow({ device, ip, lastActive, current }: { device: string; ip: string; lastActive: string; current?: boolean }) {
  return (
    <div className="px-4 py-3 flex items-center justify-between">
      <div>
        <div className="text-sm font-medium text-slate-800">{device}</div>
        <div className="text-xs text-slate-500 font-mono">{ip} · {lastActive}</div>
      </div>
      {current ? <StatusBadge variant="success" dot>Phiên hiện tại</StatusBadge> : (
        <button onClick={() => toast.success('Đã đăng xuất phiên này')} className="text-xs text-rose-600 hover:underline">
          Đăng xuất
        </button>
      )}
    </div>
  );
}
