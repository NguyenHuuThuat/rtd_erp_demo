'use client';

import { Plus } from 'lucide-react';
import { PageTitle } from '@/components/page-title';
import { MOCK_INVOICES } from '@/lib/mock-data';
import { formatVND, formatDate, cn } from '@/lib/utils';

const STATUS_BADGE: Record<string, string> = {
  PAID: 'bg-rtd-100 text-rtd-700',
  PARTIAL_PAID: 'bg-amber-100 text-amber-700',
  ISSUED: 'bg-blue-100 text-blue-700',
  DRAFT: 'bg-slate-100 text-slate-600',
};

const STATUS_LABEL: Record<string, string> = {
  PAID: 'Đã thanh toán',
  PARTIAL_PAID: 'Thanh toán 1 phần',
  ISSUED: 'Đã phát hành',
  DRAFT: 'Nháp',
};

export default function InvoicesPage() {
  const sales = MOCK_INVOICES.filter((i) => i.type === 'SALES');
  const purchase = MOCK_INVOICES.filter((i) => i.type === 'PURCHASE');
  const totalSales = sales.reduce((s, i) => s + i.totalAmount, 0);
  const totalPurchase = purchase.reduce((s, i) => s + i.totalAmount, 0);
  const ar = sales.reduce((s, i) => s + (i.totalAmount - i.paidAmount), 0);
  const ap = purchase.reduce((s, i) => s + (i.totalAmount - i.paidAmount), 0);

  return (
    <div>
      <PageTitle
        title="Hóa đơn"
        subtitle={`${MOCK_INVOICES.length} hóa đơn (${sales.length} bán + ${purchase.length} mua)`}
        actions={
          <button className="inline-flex items-center gap-1.5 bg-rtd-600 hover:bg-rtd-700 text-white text-sm font-medium px-3 py-2 rounded-lg transition">
            <Plus className="w-4 h-4" />
            Tạo hóa đơn
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard label="Tổng HĐ bán" value={formatVND(totalSales)} hint={`${sales.length} hóa đơn`} accent="green" />
        <SummaryCard label="Phải thu" value={formatVND(ar)} hint="Chưa thu hết" accent="amber" />
        <SummaryCard label="Tổng HĐ mua" value={formatVND(totalPurchase)} hint={`${purchase.length} hóa đơn`} accent="blue" />
        <SummaryCard label="Phải trả" value={formatVND(ap)} hint="Chưa trả hết" accent="rose" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="text-left font-semibold px-4 py-3">Số hóa đơn</th>
                <th className="text-left font-semibold px-4 py-3">Loại</th>
                <th className="text-left font-semibold px-4 py-3">Đối tác</th>
                <th className="text-left font-semibold px-4 py-3">Ngày HĐ</th>
                <th className="text-left font-semibold px-4 py-3">Hạn TT</th>
                <th className="text-right font-semibold px-4 py-3">Tổng tiền</th>
                <th className="text-right font-semibold px-4 py-3">Còn lại</th>
                <th className="text-center font-semibold px-4 py-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_INVOICES.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">{inv.code}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded ${
                        inv.type === 'SALES' ? 'bg-rtd-100 text-rtd-700' : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {inv.type === 'SALES' ? 'Bán' : 'Mua'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{inv.partnerName}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{formatDate(inv.invoiceDate)}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{formatDate(inv.dueDate)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-800">{formatVND(inv.totalAmount)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {inv.totalAmount - inv.paidAmount > 0 ? (
                      <span className="text-rose-600 font-medium">
                        {formatVND(inv.totalAmount - inv.paidAmount)}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={cn(
                        'text-xs font-medium px-2 py-0.5 rounded',
                        STATUS_BADGE[inv.status] ?? 'bg-slate-100',
                      )}
                    >
                      {STATUS_LABEL[inv.status]}
                    </span>
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
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent: 'green' | 'blue' | 'amber' | 'rose';
}) {
  const colors = {
    green: 'border-l-rtd-500',
    blue: 'border-l-blue-500',
    amber: 'border-l-amber-500',
    rose: 'border-l-rose-500',
  }[accent];
  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 border-l-4 p-4', colors)}>
      <div className="text-xs text-slate-500 font-medium">{label}</div>
      <div className="text-xl font-bold text-slate-900 mt-1 tabular-nums">{value}</div>
      <div className="text-xs text-slate-400 mt-0.5">{hint}</div>
    </div>
  );
}
