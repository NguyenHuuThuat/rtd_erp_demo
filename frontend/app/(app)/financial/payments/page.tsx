'use client';

import { useMemo, useState } from 'react';
import { Banknote, CreditCard, Filter, Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageTitle } from '@/components/page-title';
import { StatusBadge } from '@/components/status-badge';
import { useMockStore } from '@/lib/mock-store';
import { formatVND, formatDate, cn } from '@/lib/utils';

const TYPE_LABEL: Record<string, string> = { RECEIPT: 'Phiếu thu', DISBURSEMENT: 'Phiếu chi' };
const METHOD_LABEL: Record<string, string> = {
  CASH: 'Tiền mặt',
  BANK_TRANSFER: 'Chuyển khoản',
  CHEQUE: 'Séc',
};
const STATUS_LABEL: Record<string, string> = { COMPLETED: 'Hoàn tất', DRAFT: 'Nháp', CANCELLED: 'Đã hủy' };
const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'danger'> = {
  COMPLETED: 'success',
  DRAFT: 'warning',
  CANCELLED: 'danger',
};

export default function PaymentsPage() {
  const payments = useMockStore((s) => s.payments);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'RECEIPT' | 'DISBURSEMENT'>('all');

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      if (search && !`${p.code} ${p.partnerName}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterType !== 'all' && p.type !== filterType) return false;
      return true;
    });
  }, [payments, search, filterType]);

  const totalReceipt = payments.filter((p) => p.type === 'RECEIPT' && p.status === 'COMPLETED').reduce((s, p) => s + p.amount, 0);
  const totalDisburse = payments.filter((p) => p.type === 'DISBURSEMENT' && p.status === 'COMPLETED').reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <PageTitle
        title="Phiếu thu / chi"
        subtitle={`${payments.length} phiếu trong tháng 5/2026`}
        actions={
          <>
            <button onClick={() => toast('Phiếu thu — form đang xây')} className="btn-secondary">
              <Plus className="w-4 h-4" />
              Phiếu thu
            </button>
            <button onClick={() => toast('Phiếu chi — form đang xây')} className="btn-primary">
              <Plus className="w-4 h-4" />
              Phiếu chi
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <SummaryCard label="Tổng thu (T5)" value={formatVND(totalReceipt)} count={payments.filter((p) => p.type === 'RECEIPT').length} icon={Banknote} accent="green" />
        <SummaryCard label="Tổng chi (T5)" value={formatVND(totalDisburse)} count={payments.filter((p) => p.type === 'DISBURSEMENT').length} icon={CreditCard} accent="rose" />
        <SummaryCard label="Số dư ròng" value={formatVND(totalReceipt - totalDisburse)} count={payments.length} icon={Banknote} accent="blue" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-3 border-b border-slate-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo mã hoặc đối tác…"
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-slate-300"
            />
          </div>
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex bg-slate-100 rounded-lg p-0.5 text-xs">
            {(['all', 'RECEIPT', 'DISBURSEMENT'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setFilterType(v)}
                className={cn(
                  'px-3 py-1 rounded transition',
                  filterType === v ? 'bg-white text-slate-800 shadow-sm font-medium' : 'text-slate-500',
                )}
              >
                {v === 'all' ? 'Tất cả' : TYPE_LABEL[v]}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="text-left font-semibold px-4 py-3">Số phiếu</th>
                <th className="text-left font-semibold px-4 py-3">Loại</th>
                <th className="text-left font-semibold px-4 py-3">Đối tác</th>
                <th className="text-left font-semibold px-4 py-3">Ngày</th>
                <th className="text-left font-semibold px-4 py-3">Phương thức</th>
                <th className="text-right font-semibold px-4 py-3">Số tiền</th>
                <th className="text-left font-semibold px-4 py-3 hidden lg:table-cell">HĐ liên quan</th>
                <th className="text-center font-semibold px-4 py-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">{p.code}</td>
                  <td className="px-4 py-3">
                    <StatusBadge variant={p.type === 'RECEIPT' ? 'success' : 'info'}>
                      {TYPE_LABEL[p.type]}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{p.partnerName}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{formatDate(p.paymentDate)}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">
                    <div>{METHOD_LABEL[p.paymentMethod]}</div>
                    {p.bankAccount && <div className="text-slate-400 font-mono">{p.bankAccount}</div>}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <span className={p.type === 'RECEIPT' ? 'text-rtd-700 font-medium' : 'text-rose-700 font-medium'}>
                      {p.type === 'RECEIPT' ? '+' : '-'}{formatVND(p.amount)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs font-mono hidden lg:table-cell">
                    {p.invoiceCode ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge variant={STATUS_VARIANT[p.status]}>{STATUS_LABEL[p.status]}</StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label, value, count, icon: Icon, accent,
}: { label: string; value: string; count: number; icon: React.ComponentType<{ className?: string }>; accent: 'green' | 'rose' | 'blue' }) {
  const colors = {
    green: 'border-l-rtd-500 bg-rtd-50/30',
    rose: 'border-l-rose-500 bg-rose-50/30',
    blue: 'border-l-blue-500 bg-blue-50/30',
  }[accent];
  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 border-l-4 p-4', colors)}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-slate-600 font-medium">{label}</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{value}</div>
          <div className="text-xs text-slate-500 mt-0.5">{count} phiếu</div>
        </div>
        <Icon className="w-6 h-6 text-slate-300" />
      </div>
    </div>
  );
}
