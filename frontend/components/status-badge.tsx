import { cn } from '@/lib/utils';

type Variant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';

const VARIANT: Record<Variant, string> = {
  success: 'bg-rtd-100 text-rtd-700 ring-rtd-200',
  warning: 'bg-amber-100 text-amber-800 ring-amber-200',
  danger: 'bg-rose-100 text-rose-700 ring-rose-200',
  info: 'bg-blue-100 text-blue-700 ring-blue-200',
  neutral: 'bg-slate-100 text-slate-600 ring-slate-200',
  primary: 'bg-violet-100 text-violet-700 ring-violet-200',
};

export function StatusBadge({
  variant = 'neutral',
  children,
  dot = false,
}: {
  variant?: Variant;
  children: React.ReactNode;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded ring-1 ring-inset',
        VARIANT[variant],
      )}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
