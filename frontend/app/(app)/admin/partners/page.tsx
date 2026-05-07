'use client';

import { useMemo, useState } from 'react';
import { Building, Filter, Plus, Receipt, Search, Truck, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageTitle } from '@/components/page-title';
import { StatusBadge } from '@/components/status-badge';
import { useMockStore } from '@/lib/mock-store';
import { formatVND, cn } from '@/lib/utils';

const TYPE_LABEL: Record<string, string> = {
  CUSTOMER: 'Khách hàng',
  SUPPLIER: 'Nhà cung cấp',
  BOTH: 'Cả hai / Ngân hàng',
};

export default function PartnersPage() {
  const partners = useMockStore((s) => s.partners);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'CUSTOMER' | 'SUPPLIER' | 'BOTH'>('all');

  const filtered = useMemo(() => {
    return partners.filter((p) => {
      if (search && !`${p.code} ${p.name}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterType !== 'all' && p.type !== filterType) return false;
      return true;
    });
  }, [partners, search, filterType]);

  const customers = partners.filter((p) => p.type === 'CUSTOMER');
  const suppliers = partners.filter((p) => p.type === 'SUPPLIER');
  const totalDebt = customers.reduce((s, p) => s + p.currentDebt, 0);
  const totalPayable = suppliers.reduce((s, p) => s + p.currentDebt, 0);

  return (
    <div>
      <PageTitle
        title="Đối tác"
        subtitle={`${partners.length} đối tác · ${customers.length} khách hàng · ${suppliers.length} NCC`}
        actions={
          <button onClick={() => toast('Form thêm đối tác — đang xây')} className="btn-primary">
            <Plus className="w-4 h-4" />
            Thêm đối tác
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard label="Khách hàng" value={customers.length.toString()} icon={Building} accent="green" />
        <SummaryCard label="Nhà cung cấp" value={suppliers.length.toString()} icon={Truck} accent="blue" />
        <SummaryCard label="Tổng phải thu" value={formatVND(totalDebt)} hint={`${customers.filter((c) => c.currentDebt > 0).length} KH có nợ`} icon={Receipt} accent="amber" />
        <SummaryCard label="Tổng phải trả" value={formatVND(totalPayable)} hint={`${suppliers.filter((s) => s.currentDebt > 0).length} NCC có nợ`} icon={Wallet} accent="rose" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-3 border-b border-slate-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo mã hoặc tên đối tác…"
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-slate-300"
            />
          </div>
          <Filter className="w-4 h-4 text-slate-400 ml-2" />
          <div className="flex bg-slate-100 rounded-lg p-0.5 text-xs">
            {(['all', 'CUSTOMER', 'SUPPLIER', 'BOTH'] as const).map((v) => (
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
          <div className="ml-auto text-xs text-slate-500">
            <strong>{filtered.length}</strong>/{partners.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="text-left font-semibold px-4 py-3">Mã</th>
                <th className="text-left font-semibold px-4 py-3">Tên đối tác</th>
                <th className="text-left font-semibold px-4 py-3">Loại</th>
                <th className="text-left font-semibold px-4 py-3 hidden md:table-cell">MST</th>
                <th className="text-left font-semibold px-4 py-3 hidden lg:table-cell">Tỉnh / Liên hệ</th>
                <th className="text-right font-semibold px-4 py-3">Hạn mức</th>
                <th className="text-right font-semibold px-4 py-3">Đang nợ</th>
                <th className="text-center font-semibold px-4 py-3">Hạn TT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">{p.code}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      variant={p.type === 'CUSTOMER' ? 'success' : p.type === 'SUPPLIER' ? 'info' : 'primary'}
                    >
                      {TYPE_LABEL[p.type]}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-mono text-xs hidden md:table-cell">
                    {p.taxCode || '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-600 hidden lg:table-cell">
                    <div>{p.province}</div>
                    <div className="text-xs text-slate-400">{p.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                    {p.creditLimit > 0 ? formatVND(p.creditLimit) : '—'}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {p.currentDebt > 0 ? (
                      <span className={p.currentDebt >= p.creditLimit * 0.9 ? 'text-rose-600 font-medium' : 'text-amber-600'}>
                        {formatVND(p.currentDebt)}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600 text-xs">
                    {p.paymentTermDays > 0 ? `${p.paymentTermDays} ngày` : '—'}
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
  label, value, hint, icon: Icon, accent,
}: { label: string; value: string; hint?: string; icon: React.ComponentType<{ className?: string }>; accent: 'green' | 'blue' | 'amber' | 'rose' }) {
  const colors = {
    green: 'border-l-rtd-500',
    blue: 'border-l-blue-500',
    amber: 'border-l-amber-500',
    rose: 'border-l-rose-500',
  }[accent];
  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 border-l-4 p-4', colors)}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-slate-500 font-medium">{label}</div>
          <div className="text-xl font-bold text-slate-900 mt-1 tabular-nums">{value}</div>
          {hint && <div className="text-xs text-slate-400 mt-0.5">{hint}</div>}
        </div>
        <Icon className="w-5 h-5 text-slate-300" />
      </div>
    </div>
  );
}
