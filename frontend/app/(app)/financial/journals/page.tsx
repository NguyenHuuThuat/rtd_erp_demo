'use client';

import { useMemo, useState } from 'react';
import { Filter, Plus, Search } from 'lucide-react';
import { PageTitle } from '@/components/page-title';
import { Modal } from '@/components/modal';
import { StatusBadge } from '@/components/status-badge';
import { JournalForm } from '@/components/forms/journal-form';
import { useMockStore } from '@/lib/mock-store';
import { formatVND, formatDate, cn } from '@/lib/utils';

const STATUS_LABEL: Record<string, string> = { POSTED: 'Đã ghi sổ', DRAFT: 'Nháp', REVERSED: 'Đã đảo' };
const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'danger'> = {
  POSTED: 'success',
  DRAFT: 'warning',
  REVERSED: 'danger',
};

const REF_LABEL: Record<string, string> = {
  PURCHASE_INVOICE: 'HĐ mua',
  SALES_INVOICE: 'HĐ bán',
  PAYMENT_RECEIPT: 'Phiếu thu',
  PAYMENT_DISBURSEMENT: 'Phiếu chi',
  MANUAL: 'Thủ công',
};

export default function JournalsPage() {
  const journals = useMockStore((s) => s.journals);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'POSTED' | 'DRAFT'>('all');
  const [filterType, setFilterType] = useState<string>('');

  const filtered = useMemo(() => {
    return journals.filter((j) => {
      if (search && !`${j.code} ${j.description}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterStatus !== 'all' && j.status !== filterStatus) return false;
      if (filterType && j.refType !== filterType) return false;
      return true;
    });
  }, [journals, search, filterStatus, filterType]);

  const totalDebit = filtered.reduce((s, j) => s + j.totalDebit, 0);
  const totalCredit = filtered.reduce((s, j) => s + j.totalCredit, 0);

  return (
    <div>
      <PageTitle
        title="Sổ nhật ký"
        subtitle={`${journals.length} bút toán · Cân đối Nợ = Có`}
        actions={
          <button data-tour="journal-create" onClick={() => setCreateOpen(true)} className="btn-primary">
            <Plus className="w-4 h-4" />
            Tạo bút toán
          </button>
        }
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-3 border-b border-slate-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo mã hoặc diễn giải…"
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-slate-300"
            />
          </div>
          <Filter className="w-4 h-4 text-slate-400 ml-2" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-rtd-400"
          >
            <option value="">Tất cả loại</option>
            {Object.entries(REF_LABEL).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <div className="flex bg-slate-100 rounded-lg p-0.5 text-xs">
            {(['all', 'POSTED', 'DRAFT'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setFilterStatus(v)}
                className={cn(
                  'px-3 py-1 rounded transition',
                  filterStatus === v ? 'bg-white text-slate-800 shadow-sm font-medium' : 'text-slate-500',
                )}
              >
                {v === 'all' ? 'Tất cả' : STATUS_LABEL[v]}
              </button>
            ))}
          </div>
          <div className="ml-auto text-xs text-slate-500">
            Hiển thị <strong>{filtered.length}</strong>/{journals.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="text-left font-semibold px-4 py-3 w-40">Mã</th>
                <th className="text-left font-semibold px-4 py-3 w-28">Ngày</th>
                <th className="text-left font-semibold px-4 py-3">Diễn giải</th>
                <th className="text-left font-semibold px-4 py-3 w-28">Loại</th>
                <th className="text-right font-semibold px-4 py-3 w-40">Tổng nợ</th>
                <th className="text-right font-semibold px-4 py-3 w-40">Tổng có</th>
                <th className="text-center font-semibold px-4 py-3 w-32">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((j) => (
                <tr key={j.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">{j.code}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{formatDate(j.entryDate)}</td>
                  <td className="px-4 py-3 text-slate-700">{j.description}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {REF_LABEL[j.refType] ?? j.refType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-800">{formatVND(j.totalDebit)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-800">{formatVND(j.totalCredit)}</td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge variant={STATUS_VARIANT[j.status]}>{STATUS_LABEL[j.status]}</StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 font-semibold">
              <tr>
                <td colSpan={4} className="px-4 py-3 text-slate-600">Tổng cộng (lọc hiện tại)</td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-900">{formatVND(totalDebit)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-900">{formatVND(totalCredit)}</td>
                <td className="px-4 py-3 text-center text-rtd-700 text-xs">
                  {Math.abs(totalDebit - totalCredit) < 0.01 ? '✓ Cân đối' : '⚠ Lệch'}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Tạo bút toán mới"
        description="Nhập tối thiểu 2 dòng (1 Nợ, 1 Có) — hệ thống tự kiểm tra cân đối"
        size="2xl"
      >
        <JournalForm onClose={() => setCreateOpen(false)} />
      </Modal>
    </div>
  );
}
