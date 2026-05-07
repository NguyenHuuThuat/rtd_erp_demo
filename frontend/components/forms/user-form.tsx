'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useMockStore } from '@/lib/mock-store';

interface UserFormProps {
  onClose: () => void;
}

export function UserForm({ onClose }: UserFormProps) {
  const orgs = useMockStore((s) => s.orgs);
  const addUser = useMockStore((s) => s.addUser);

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyId, setCompanyId] = useState(orgs[0]?.id ?? '');
  const [roles, setRoles] = useState<string[]>(['VIEWER']);
  const [submitting, setSubmitting] = useState(false);

  function toggleRole(r: string) {
    setRoles((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (roles.length === 0) {
      toast.error('Phải gán ít nhất 1 vai trò');
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    const company = orgs.find((o) => o.id === companyId);
    addUser({
      email,
      fullName,
      phone: phone || null,
      companyId,
      companyName: company?.name ?? '—',
      isActive: true,
      lastLoginAt: null,
      roles,
    });
    toast.success(`Đã tạo người dùng ${fullName}`);
    setSubmitting(false);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Họ và tên *">
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" required />
        </Field>
        <Field label="Email *">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="ten@rtd.vn"
            required
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Số điện thoại">
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input" placeholder="09xxxxxxxx" />
        </Field>
        <Field label="Đơn vị công tác *">
          <select value={companyId} onChange={(e) => setCompanyId(e.target.value)} className="input" required>
            {orgs.map((o) => (
              <option key={o.id} value={o.id}>
                {o.code} — {o.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Vai trò *" hint="Có thể chọn nhiều vai trò">
        <div className="grid grid-cols-2 gap-2">
          {['SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT', 'MANAGER_FACTORY', 'VIEWER'].map((r) => (
            <label
              key={r}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm ${
                roles.includes(r)
                  ? 'border-rtd-500 bg-rtd-50 text-rtd-700'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="checkbox"
                checked={roles.includes(r)}
                onChange={() => toggleRole(r)}
                className="rounded"
              />
              <span className="font-mono text-xs">{r}</span>
            </label>
          ))}
        </div>
      </Field>

      <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800">
        <strong>Demo:</strong> mật khẩu khởi tạo gửi qua email. Người dùng sẽ đổi khi đăng nhập lần đầu.
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
        <button type="button" onClick={onClose} className="btn-ghost">
          Hủy
        </button>
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Tạo người dùng
        </button>
      </div>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
      {hint && <div className="text-xs text-slate-400 mt-1">{hint}</div>}
    </div>
  );
}
