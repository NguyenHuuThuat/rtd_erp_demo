'use client';

import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Plus, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageTitle } from '@/components/page-title';
import { StatusBadge } from '@/components/status-badge';
import { MOCK_BUDGET_LINES } from '@/lib/mock-data';
import { formatVND, cn } from '@/lib/utils';

export default function BudgetsPage() {
  const [quarter, setQuarter] = useState<'Q1' | 'Q2'>('Q2');
  const [view, setView] = useState<'table' | 'chart'>('table');

  const data = MOCK_BUDGET_LINES.map((line) => {
    const plan = quarter === 'Q1' ? line.q1Plan : line.q2Plan;
    const actual = quarter === 'Q1' ? line.q1Actual : line.q2Actual;
    const variance = actual - plan;
    const variancePct = plan === 0 ? 0 : (variance / plan) * 100;
    return { ...line, plan, actual, variance, variancePct };
  });

  const totals = data.reduce(
    (acc, l) => ({ plan: acc.plan + l.plan, actual: acc.actual + l.actual }),
    { plan: 0, actual: 0 },
  );

  const chartData = data.map((d) => ({
    name: `${d.accountCode}·${d.costCenter}`,
    'Kế hoạch': d.plan / 1_000_000_000,
    'Thực tế': d.actual / 1_000_000_000,
  }));

  return (
    <div>
      <PageTitle
        title="Ngân sách"
        subtitle={`Theo dõi kế hoạch vs thực tế · ${quarter}/2026`}
        actions={
          <button onClick={() => toast('Lập ngân sách quý — đang xây')} className="btn-primary">
            <Plus className="w-4 h-4" />
            Lập ngân sách
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KpiCard label={`Kế hoạch ${quarter}`} value={formatVND(totals.plan)} accent="blue" />
        <KpiCard label={`Thực tế ${quarter}`} value={formatVND(totals.actual)} accent="green" />
        <KpiCard
          label="Chênh lệch"
          value={formatVND(Math.abs(totals.actual - totals.plan))}
          hint={totals.actual > totals.plan ? 'Vượt ngân sách' : 'Trong ngân sách'}
          accent={totals.actual > totals.plan ? 'rose' : 'green'}
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-3 border-b border-slate-100 flex flex-wrap items-center gap-3">
          <Target className="w-4 h-4 text-slate-400" />
          <div className="flex bg-slate-100 rounded-lg p-0.5 text-xs">
            {(['Q1', 'Q2'] as const).map((q) => (
              <button
                key={q}
                onClick={() => setQuarter(q)}
                className={cn(
                  'px-3 py-1 rounded transition',
                  quarter === q ? 'bg-white text-slate-800 shadow-sm font-medium' : 'text-slate-500',
                )}
              >
                {q}/2026
              </button>
            ))}
          </div>
          <div className="ml-auto flex bg-slate-100 rounded-lg p-0.5 text-xs">
            {(['table', 'chart'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'px-3 py-1 rounded transition',
                  view === v ? 'bg-white text-slate-800 shadow-sm font-medium' : 'text-slate-500',
                )}
              >
                {v === 'table' ? 'Bảng' : 'Biểu đồ'}
              </button>
            ))}
          </div>
        </div>

        {view === 'table' ? (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="text-left font-semibold px-4 py-3">TK</th>
                <th className="text-left font-semibold px-4 py-3">Tên</th>
                <th className="text-left font-semibold px-4 py-3">Cost Center</th>
                <th className="text-right font-semibold px-4 py-3">Kế hoạch</th>
                <th className="text-right font-semibold px-4 py-3">Thực tế</th>
                <th className="text-right font-semibold px-4 py-3">Chênh lệch</th>
                <th className="text-center font-semibold px-4 py-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((line, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{line.accountCode}</td>
                  <td className="px-4 py-3 text-slate-700">{line.accountName}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{line.costCenter}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-700">{formatVND(line.plan)}</td>
                  <td className="px-4 py-3 text-right tabular-nums font-medium text-slate-900">
                    {formatVND(line.actual)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <span className={line.variance > 0 ? 'text-rose-600' : 'text-rtd-700'}>
                      {line.variance > 0 ? '+' : ''}{formatVND(line.variance)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {Math.abs(line.variancePct) < 5 ? (
                      <StatusBadge variant="success">Đúng kế hoạch</StatusBadge>
                    ) : line.variance > 0 ? (
                      <StatusBadge variant="danger">Vượt {line.variancePct.toFixed(1)}%</StatusBadge>
                    ) : (
                      <StatusBadge variant="info">Tiết kiệm {Math.abs(line.variancePct).toFixed(1)}%</StatusBadge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 font-semibold">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-slate-600">Tổng</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatVND(totals.plan)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatVND(totals.actual)}</td>
                <td colSpan={2} className="px-4 py-3 text-right tabular-nums">
                  <span className={totals.actual > totals.plan ? 'text-rose-600' : 'text-rtd-700'}>
                    {formatVND(totals.actual - totals.plan)}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <div className="p-5">
            <div className="text-xs text-slate-500 mb-3">Đơn vị: tỷ đồng</div>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    formatter={(v: number) => `${v.toFixed(2)} tỷ`}
                    contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Kế hoạch" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Thực tế" fill="#16a34a" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={(entry['Thực tế'] as number) > (entry['Kế hoạch'] as number) ? '#f43f5e' : '#16a34a'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function KpiCard({
  label, value, hint, accent,
}: { label: string; value: string; hint?: string; accent: 'green' | 'rose' | 'blue' }) {
  const colors = { green: 'text-rtd-700', blue: 'text-blue-700', rose: 'text-rose-700' }[accent];
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="text-sm text-slate-500 font-medium">{label}</div>
      <div className={cn('text-2xl font-bold mt-1 tabular-nums', colors)}>{value}</div>
      {hint && <div className="text-xs text-slate-400 mt-0.5">{hint}</div>}
    </div>
  );
}
