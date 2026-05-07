import { type LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  label: string;
  value: string;
  hint?: string;
  trend?: { value: number; isPositive?: boolean };
  icon?: LucideIcon;
  accent?: 'green' | 'blue' | 'amber' | 'rose' | 'slate';
}

const ACCENT: Record<NonNullable<KpiCardProps['accent']>, string> = {
  green: 'bg-rtd-50 text-rtd-700',
  blue: 'bg-blue-50 text-blue-700',
  amber: 'bg-amber-50 text-amber-700',
  rose: 'bg-rose-50 text-rose-700',
  slate: 'bg-slate-100 text-slate-700',
};

export function KpiCard({ label, value, hint, trend, icon: Icon, accent = 'green' }: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-sm text-slate-500 font-medium">{label}</div>
          <div className="text-2xl font-bold text-slate-900 mt-1.5 tabular-nums">{value}</div>
          {hint && <div className="text-xs text-slate-400 mt-1 truncate">{hint}</div>}
        </div>
        {Icon && (
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', ACCENT[accent])}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          {trend.isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 text-rtd-600" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
          )}
          <span className={trend.isPositive ? 'text-rtd-600' : 'text-rose-500'}>
            {trend.isPositive ? '+' : ''}
            {trend.value}%
          </span>
          <span className="text-slate-500">so với kỳ trước</span>
        </div>
      )}
    </div>
  );
}
