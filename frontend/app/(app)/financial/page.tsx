'use client';

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Receipt, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { PageTitle } from '@/components/page-title';
import { KpiCard } from '@/components/kpi-card';
import { MOCK_FINANCIAL_KPIS, MOCK_INVOICES } from '@/lib/mock-data';
import { formatVND } from '@/lib/utils';

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

export default function FinancialOverviewPage() {
  const chartData = MOCK_FINANCIAL_KPIS.revenueByMonth.map((row) => ({
    month: row.month,
    'Doanh thu': row.revenue / 1_000_000_000,
    'Chi phí': row.expense / 1_000_000_000,
  }));

  return (
    <div>
      <PageTitle
        title="Tổng quan Tài chính – Kế toán"
        subtitle="Doanh thu, chi phí, công nợ — toàn tập đoàn, tháng 5/2026"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Doanh thu tháng 5"
          value={formatVND(MOCK_FINANCIAL_KPIS.revenueMonth)}
          icon={TrendingUp}
          accent="green"
          trend={{ value: 9.3, isPositive: true }}
        />
        <KpiCard
          label="Chi phí tháng 5"
          value={formatVND(MOCK_FINANCIAL_KPIS.expenseMonth)}
          icon={TrendingDown}
          accent="rose"
          trend={{ value: 7.7, isPositive: false }}
        />
        <KpiCard
          label="Phải thu (AR)"
          value={formatVND(MOCK_FINANCIAL_KPIS.receivable)}
          hint="3 hóa đơn quá hạn"
          icon={Receipt}
          accent="amber"
        />
        <KpiCard
          label="Phải trả (AP)"
          value={formatVND(MOCK_FINANCIAL_KPIS.payable)}
          hint="2 NCC tới hạn 7 ngày"
          icon={Wallet}
          accent="blue"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <h3 className="font-semibold text-slate-800 mb-1">Doanh thu vs Chi phí — 6 tháng gần nhất</h3>
        <p className="text-xs text-slate-500 mb-4">Đơn vị: tỷ đồng</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                formatter={(v: number) => `${v.toFixed(2)} tỷ`}
                contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Doanh thu" fill="#16a34a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Chi phí" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Hóa đơn gần đây</h3>
          <p className="text-xs text-slate-500 mt-0.5">{MOCK_INVOICES.length} hóa đơn</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="text-left font-semibold px-4 py-3">Số hóa đơn</th>
                <th className="text-left font-semibold px-4 py-3">Loại</th>
                <th className="text-left font-semibold px-4 py-3">Đối tác</th>
                <th className="text-left font-semibold px-4 py-3">Ngày</th>
                <th className="text-right font-semibold px-4 py-3">Tổng tiền</th>
                <th className="text-right font-semibold px-4 py-3">Đã thanh toán</th>
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
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {new Date(inv.invoiceDate).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-slate-800 tabular-nums">
                    {formatVND(inv.totalAmount)}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600 tabular-nums">
                    {formatVND(inv.paidAmount)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded ${
                        STATUS_BADGE[inv.status] ?? 'bg-slate-100'
                      }`}
                    >
                      {STATUS_LABEL[inv.status] ?? inv.status}
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
