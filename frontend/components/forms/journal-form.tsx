'use client';

import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useMockStore } from '@/lib/mock-store';
import { MOCK_COA } from '@/lib/mock-data';
import { formatVND, formatNumber } from '@/lib/utils';

interface JournalLine {
  id: string;
  accountCode: string;
  description: string;
  debit: string;
  credit: string;
}

interface JournalFormProps {
  onClose: () => void;
}

const REF_TYPES = [
  { value: 'PURCHASE_INVOICE', label: 'Hóa đơn mua' },
  { value: 'SALES_INVOICE', label: 'Hóa đơn bán' },
  { value: 'PAYMENT_RECEIPT', label: 'Phiếu thu' },
  { value: 'PAYMENT_DISBURSEMENT', label: 'Phiếu chi' },
  { value: 'MANUAL', label: 'Bút toán thủ công' },
];

const LEAF_ACCOUNTS = MOCK_COA.filter((a) => a.isLeaf);

export function JournalForm({ onClose }: JournalFormProps) {
  const addJournal = useMockStore((s) => s.addJournal);
  const today = new Date().toISOString().slice(0, 10);

  const [entryDate, setEntryDate] = useState(today);
  const [refType, setRefType] = useState('MANUAL');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [lines, setLines] = useState<JournalLine[]>([
    { id: 'l1', accountCode: '', description: '', debit: '', credit: '' },
    { id: 'l2', accountCode: '', description: '', debit: '', credit: '' },
  ]);

  const totals = useMemo(() => {
    const totalDebit = lines.reduce((s, l) => s + (parseFloat(l.debit) || 0), 0);
    const totalCredit = lines.reduce((s, l) => s + (parseFloat(l.credit) || 0), 0);
    return { totalDebit, totalCredit, balance: totalDebit - totalCredit };
  }, [lines]);

  function addLine() {
    setLines((prev) => [...prev, { id: `l${Date.now()}`, accountCode: '', description: '', debit: '', credit: '' }]);
  }

  function removeLine(id: string) {
    if (lines.length <= 2) {
      toast.error('Phải có tối thiểu 2 dòng (Nợ + Có)');
      return;
    }
    setLines((prev) => prev.filter((l) => l.id !== id));
  }

  function updateLine(id: string, patch: Partial<JournalLine>) {
    setLines((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        const next = { ...l, ...patch };
        // Clear opposite when one is set
        if (patch.debit !== undefined && parseFloat(patch.debit) > 0) next.credit = '';
        if (patch.credit !== undefined && parseFloat(patch.credit) > 0) next.debit = '';
        return next;
      }),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (Math.abs(totals.balance) > 0.001) {
      toast.error(`Bút toán không cân đối: chênh ${formatVND(Math.abs(totals.balance))}`);
      return;
    }
    if (totals.totalDebit === 0) {
      toast.error('Tổng phát sinh phải > 0');
      return;
    }
    if (lines.some((l) => !l.accountCode)) {
      toast.error('Tất cả dòng phải chọn tài khoản');
      return;
    }
    if (!description.trim()) {
      toast.error('Phải có diễn giải');
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    const code = `JV-${entryDate.replace(/-/g, '').slice(2)}-${String(Date.now()).slice(-3)}`;
    addJournal({
      code,
      entryDate,
      description,
      refType,
      totalDebit: totals.totalDebit,
      totalCredit: totals.totalCredit,
      status: 'DRAFT',
    });
    toast.success(`Đã tạo bút toán ${code}`);
    setSubmitting(false);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Field label="Ngày ghi sổ *">
          <input
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            className="input"
            required
          />
        </Field>
        <Field label="Loại bút toán">
          <select value={refType} onChange={(e) => setRefType(e.target.value)} className="input">
            {REF_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Mã (tự sinh)">
          <input value="JV-AUTO" disabled className="input bg-slate-50 text-slate-400" />
        </Field>
      </div>

      <Field label="Diễn giải *">
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input"
          placeholder="Vd: Mua nguyên liệu ngô vàng nhập kho NM Hà Nam"
          required
        />
      </Field>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-slate-700">Chi tiết bút toán</label>
          <button type="button" onClick={addLine} className="text-sm text-rtd-600 hover:text-rtd-700 inline-flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Thêm dòng
          </button>
        </div>

        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
              <tr>
                <th className="text-left font-semibold px-3 py-2">Tài khoản</th>
                <th className="text-left font-semibold px-3 py-2">Diễn giải</th>
                <th className="text-right font-semibold px-3 py-2 w-32">Nợ</th>
                <th className="text-right font-semibold px-3 py-2 w-32">Có</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lines.map((line) => (
                <tr key={line.id}>
                  <td className="px-2 py-1.5">
                    <select
                      value={line.accountCode}
                      onChange={(e) => updateLine(line.id, { accountCode: e.target.value })}
                      className="w-full px-2 py-1 text-sm border border-slate-200 rounded bg-white focus:outline-none focus:border-rtd-400"
                    >
                      <option value="">— Chọn TK —</option>
                      {LEAF_ACCOUNTS.map((a) => (
                        <option key={a.code} value={a.code}>
                          {a.code} — {a.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      value={line.description}
                      onChange={(e) => updateLine(line.id, { description: e.target.value })}
                      className="w-full px-2 py-1 text-sm border border-slate-200 rounded focus:outline-none focus:border-rtd-400"
                      placeholder="Ghi chú dòng"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      type="number"
                      value={line.debit}
                      onChange={(e) => updateLine(line.id, { debit: e.target.value })}
                      className="w-full px-2 py-1 text-sm border border-slate-200 rounded text-right tabular-nums focus:outline-none focus:border-rtd-400"
                      placeholder="0"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      type="number"
                      value={line.credit}
                      onChange={(e) => updateLine(line.id, { credit: e.target.value })}
                      className="w-full px-2 py-1 text-sm border border-slate-200 rounded text-right tabular-nums focus:outline-none focus:border-rtd-400"
                      placeholder="0"
                    />
                  </td>
                  <td className="px-1">
                    <button
                      type="button"
                      onClick={() => removeLine(line.id)}
                      className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 font-semibold text-sm">
              <tr>
                <td colSpan={2} className="px-3 py-2 text-right text-slate-600">Tổng</td>
                <td className="px-3 py-2 text-right tabular-nums">{formatNumber(totals.totalDebit)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{formatNumber(totals.totalCredit)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-2">
          {Math.abs(totals.balance) < 0.001 && totals.totalDebit > 0 ? (
            <div className="text-xs text-rtd-700 bg-rtd-50 rounded px-3 py-1.5 inline-block">
              ✓ Cân đối: Nợ = Có = {formatVND(totals.totalDebit)}
            </div>
          ) : Math.abs(totals.balance) > 0 ? (
            <div className="text-xs text-rose-700 bg-rose-50 rounded px-3 py-1.5 inline-block">
              ⚠ Chênh lệch: {formatVND(Math.abs(totals.balance))} {totals.balance > 0 ? '(Nợ > Có)' : '(Có > Nợ)'}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
        <button type="button" onClick={onClose} className="btn-ghost">
          Hủy
        </button>
        <button type="submit" disabled={submitting || Math.abs(totals.balance) > 0.001 || totals.totalDebit === 0} className="btn-primary">
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Lưu nháp
        </button>
      </div>
    </form>
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
