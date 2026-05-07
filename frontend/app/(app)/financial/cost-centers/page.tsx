'use client';

import { Briefcase, Building, Tractor, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageTitle } from '@/components/page-title';
import { MOCK_COST_CENTERS, type MockCostCenter } from '@/lib/mock-data';
import { formatVND, cn } from '@/lib/utils';

const TYPE_ICON: Record<MockCostCenter['type'], React.ComponentType<{ className?: string }>> = {
  FACTORY: Building,
  FARM: Tractor,
  OFFICE: Briefcase,
  OTHER: Briefcase,
};

const TYPE_LABEL: Record<MockCostCenter['type'], string> = {
  FACTORY: 'Nhà máy',
  FARM: 'Trang trại',
  OFFICE: 'Văn phòng',
  OTHER: 'Khác',
};

export default function CostCentersPage() {
  const totalExpense = MOCK_COST_CENTERS.reduce((s, c) => s + c.ytdExpense, 0);
  const totalBudget = MOCK_COST_CENTERS.reduce((s, c) => s + c.ytdBudget, 0);

  return (
    <div>
      <PageTitle
        title="Trung tâm chi phí"
        subtitle={`${MOCK_COST_CENTERS.length} cost center · Lũy kế từ đầu năm 2026`}
        actions={
          <button onClick={() => toast('Tạo cost center — đang xây')} className="btn-primary">
            Thêm cost center
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard label="Chi phí thực tế" value={formatVND(totalExpense)} hint="Tất cả CC" accent="rose" />
        <StatCard label="Ngân sách phân bổ" value={formatVND(totalBudget)} hint="Theo kế hoạch" accent="blue" />
        <StatCard
          label="Tỷ lệ sử dụng"
          value={`${((totalExpense / totalBudget) * 100).toFixed(1)}%`}
          hint={`Còn ${formatVND(totalBudget - totalExpense)}`}
          accent="green"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_COST_CENTERS.map((cc) => {
          const Icon = TYPE_ICON[cc.type];
          const usage = (cc.ytdExpense / cc.ytdBudget) * 100;
          const isOver = usage > 90;
          return (
            <div key={cc.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    cc.type === 'FACTORY' ? 'bg-blue-100 text-blue-700'
                      : cc.type === 'FARM' ? 'bg-rtd-100 text-rtd-700'
                      : 'bg-slate-100 text-slate-600',
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{cc.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      <code className="font-mono">{cc.code}</code> · {TYPE_LABEL[cc.type]}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
                <User className="w-3 h-3" />
                Quản lý: <span className="font-medium text-slate-700">{cc.managerName}</span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Đã chi</span>
                  <span className="font-semibold text-slate-900 tabular-nums">{formatVND(cc.ytdExpense)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Ngân sách</span>
                  <span className="text-slate-700 tabular-nums">{formatVND(cc.ytdBudget)}</span>
                </div>

                <div className="pt-1">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Tỷ lệ sử dụng</span>
                    <span className={cn('font-semibold', isOver ? 'text-rose-600' : 'text-rtd-700')}>
                      {usage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full transition-all', isOver ? 'bg-rose-500' : 'bg-rtd-500')}
                      style={{ width: `${Math.min(usage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({
  label, value, hint, accent,
}: { label: string; value: string; hint: string; accent: 'green' | 'blue' | 'rose' }) {
  const colors = { green: 'text-rtd-700', blue: 'text-blue-700', rose: 'text-rose-700' }[accent];
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="text-sm text-slate-500 font-medium">{label}</div>
      <div className={cn('text-2xl font-bold mt-1 tabular-nums', colors)}>{value}</div>
      <div className="text-xs text-slate-400 mt-0.5">{hint}</div>
    </div>
  );
}
