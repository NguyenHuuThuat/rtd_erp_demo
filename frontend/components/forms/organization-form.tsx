'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useMockStore } from '@/lib/mock-store';
import { type MockOrg } from '@/lib/mock-data';

interface OrganizationFormProps {
  initialData?: Partial<MockOrg> | null;
  onClose: () => void;
}

const PROVINCES = [
  { code: '01', name: 'Hà Nội' },
  { code: '36', name: 'Hà Nam' },
  { code: '37', name: 'Hưng Yên' },
  { code: '24', name: 'Bắc Giang' },
  { code: '19', name: 'Thái Nguyên' },
  { code: '79', name: 'TP. Hồ Chí Minh' },
  { code: '31', name: 'Hải Phòng' },
];

export function OrganizationForm({ initialData, onClose }: OrganizationFormProps) {
  const isEdit = Boolean(initialData?.id);
  const orgs = useMockStore((s) => s.orgs);
  const addOrg = useMockStore((s) => s.addOrg);
  const updateOrg = useMockStore((s) => s.updateOrg);

  const [code, setCode] = useState(initialData?.code ?? '');
  const [name, setName] = useState(initialData?.name ?? '');
  const [type, setType] = useState<MockOrg['type']>(initialData?.type ?? 'COMPANY');
  const [parentId, setParentId] = useState<string | null>(initialData?.parentId ?? null);
  const [taxCode, setTaxCode] = useState(initialData?.taxCode ?? '');
  const [provinceCode, setProvinceCode] = useState(initialData?.provinceCode ?? '01');
  const [submitting, setSubmitting] = useState(false);

  const allowedParents = orgs.filter((o) =>
    type === 'COMPANY' ? o.type === 'GROUP' : type === 'BRANCH' ? o.type === 'COMPANY' : false,
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[A-Z0-9_-]+$/.test(code)) {
      toast.error('Mã chỉ gồm chữ HOA, số, gạch');
      return;
    }
    if (type !== 'GROUP' && !parentId) {
      toast.error('Đơn vị này phải có tổ chức cha');
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    if (isEdit && initialData?.id) {
      updateOrg(initialData.id, { code, name, type, parentId, taxCode, provinceCode });
      toast.success(`Đã cập nhật "${name}"`);
    } else {
      addOrg({ code, name, type, parentId, taxCode, provinceCode, isActive: true });
      toast.success(`Đã tạo đơn vị "${name}"`);
    }
    setSubmitting(false);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Mã đơn vị *" hint="vd: RTD-FEED, FEED-BR-HCM">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="input"
            placeholder="VD: RTD-FEED"
            disabled={isEdit}
            required
          />
        </Field>
        <Field label="Loại *">
          <select
            value={type}
            onChange={(e) => {
              const t = e.target.value as MockOrg['type'];
              setType(t);
              if (t === 'GROUP') setParentId(null);
            }}
            className="input"
          >
            <option value="GROUP">Tập đoàn</option>
            <option value="COMPANY">Công ty</option>
            <option value="BRANCH">Chi nhánh</option>
          </select>
        </Field>
      </div>

      <Field label="Tên đầy đủ *">
        <input value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Công ty TNHH RTD ..." required />
      </Field>

      {type !== 'GROUP' && (
        <Field label="Trực thuộc *">
          <select value={parentId ?? ''} onChange={(e) => setParentId(e.target.value || null)} className="input" required>
            <option value="">— Chọn —</option>
            {allowedParents.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} — {p.name}
              </option>
            ))}
          </select>
        </Field>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Field label="Mã số thuế">
          <input value={taxCode} onChange={(e) => setTaxCode(e.target.value)} className="input" placeholder="0100000000" />
        </Field>
        <Field label="Tỉnh / Thành">
          <select value={provinceCode} onChange={(e) => setProvinceCode(e.target.value)} className="input">
            {PROVINCES.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
        <button type="button" onClick={onClose} className="btn-ghost">
          Hủy
        </button>
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEdit ? 'Cập nhật' : 'Tạo mới'}
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
