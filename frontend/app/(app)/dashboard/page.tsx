'use client';

import Link from 'next/link';
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  Receipt,
  ScrollText,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
import { PageTitle } from '@/components/page-title';
import { KpiCard } from '@/components/kpi-card';
import { StatusBadge } from '@/components/status-badge';
import { useAuthStore } from '@/lib/auth-store';
import { useMockStore } from '@/lib/mock-store';
import { MOCK_ADMIN_KPIS, MOCK_APPROVALS, MOCK_FINANCIAL_KPIS } from '@/lib/mock-data';
import { formatVND, cn } from '@/lib/utils';

const COMPANY_REVENUE = [
  { name: 'RTD Feed', value: 7_835_000_000, color: '#16a34a' },
  { name: 'RTD Farm', value: 3_240_000_000, color: '#3b82f6' },
  { name: 'RTD Food', value: 1_460_000_000, color: '#f59e0b' },
  { name: 'RTD Vet', value: 420_000_000, color: '#8b5cf6' },
  { name: 'RTD Logistics', value: 180_000_000, color: '#64748b' },
];

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const orgs = useMockStore((s) => s.orgs);
  const users = useMockStore((s) => s.users);

  const trendData = MOCK_FINANCIAL_KPIS.revenueByMonth.map((row) => ({
    month: row.month,
    'Doanh thu': row.revenue / 1_000_000_000,
    'Chi phí': row.expense / 1_000_000_000,
    'LN gộp': (row.revenue - row.expense) / 1_000_000_000,
  }));

  const pendingApprovals = MOCK_APPROVALS.filter((a) => a.status === 'PENDING');

  return (
    <div>
      <PageTitle
        title={`Xin chào, ${user?.fullName ?? 'bạn'}!`}
        subtitle={`Tổng quan tập đoàn — ${new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}`}
        actions={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-rtd-700 bg-rtd-50 px-2.5 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-rtd-500 live-dot" />
              Hệ thống hoạt động bình thường
            </span>
          </div>
        }
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <QuickAction href="/admin/organizations" icon={Building2} label="Tổ chức" color="green" />
        <QuickAction href="/admin/approvals" icon={CheckCircle2} label={`Phê duyệt (${pendingApprovals.length})`} color="amber" />
        <QuickAction href="/financial/journals" icon={ScrollText} label="Bút toán mới" color="blue" />
        <QuickAction href="/financial/reports" icon={TrendingUp} label="Báo cáo TC" color="violet" />
      </div>

      {/* Quản trị KPIs */}
      <SectionHeader title="Quản trị" icon={ShieldCheck} href="/admin/organizations" />
      <div data-tour="kpi-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          label="Tổ chức"
          value={orgs.length.toString()}
          hint={`${orgs.filter((o) => o.type === 'GROUP').length} Tập đoàn · ${orgs.filter((o) => o.type === 'COMPANY').length} Cty · ${orgs.filter((o) => o.type === 'BRANCH').length} CN`}
          icon={Building2}
          accent="green"
        />
        <KpiCard
          label="Người dùng"
          value={users.length.toString()}
          hint={`${users.filter((u) => u.isActive).length} đang hoạt động`}
          icon={Users}
          accent="blue"
          trend={{ value: 8.3, isPositive: true }}
        />
        <KpiCard
          label="Vai trò (Role)"
          value="5"
          hint="2 hệ thống · 3 tùy chỉnh"
          icon={ShieldCheck}
          accent="amber"
        />
        <KpiCard
          label="Phê duyệt chờ"
          value={pendingApprovals.length.toString()}
          hint={formatVND(pendingApprovals.reduce((s, a) => s + a.amount, 0))}
          icon={CheckCircle2}
          accent="rose"
        />
      </div>

      {/* Tài chính KPIs */}
      <SectionHeader title="Tài chính – Kế toán" icon={Wallet} href="/financial" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Doanh thu T5"
          value={formatVND(MOCK_FINANCIAL_KPIS.revenueMonth)}
          icon={TrendingUp}
          accent="green"
          trend={{ value: 9.3, isPositive: true }}
        />
        <KpiCard
          label="Chi phí T5"
          value={formatVND(MOCK_FINANCIAL_KPIS.expenseMonth)}
          icon={Wallet}
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
          icon={Receipt}
          accent="blue"
        />
      </div>

      {/* Charts */}
      <div data-tour="charts" className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-800">Doanh thu vs Chi phí — 6 tháng</h3>
              <p className="text-xs text-slate-500 mt-0.5">Đơn vị: tỷ đồng</p>
            </div>
            <Link href="/financial/reports" className="text-xs text-rtd-600 hover:text-rtd-700">
              Xem báo cáo →
            </Link>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  formatter={(v: number) => `${v.toFixed(2)} tỷ`}
                  contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="Doanh thu" stroke="#16a34a" strokeWidth={2} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="Chi phí" stroke="#f43f5e" strokeWidth={2} fill="url(#colorExpense)" />
                <Line type="monotone" dataKey="LN gộp" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-1">Cơ cấu doanh thu</h3>
          <p className="text-xs text-slate-500 mb-3">Theo công ty con — T5/2026</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={COMPANY_REVENUE}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={68}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {COMPANY_REVENUE.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => formatVND(v)} contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {COMPANY_REVENUE.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: c.color }} />
                  <span className="text-slate-700">{c.name}</span>
                </div>
                <span className="text-slate-500 tabular-nums">{formatVND(c.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2 columns: Pending approvals + Recent audits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              Phê duyệt đang chờ
            </h3>
            <Link href="/admin/approvals" className="text-xs text-rtd-600 hover:text-rtd-700 flex items-center gap-1">
              Tất cả <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {pendingApprovals.slice(0, 4).map((a) => (
              <Link key={a.id} href="/admin/approvals" className="block px-5 py-3 hover:bg-slate-50 transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-800 truncate">{a.targetSummary}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {a.requesterName} · Bước {a.currentStep}/{a.totalSteps}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold text-slate-900 tabular-nums">{formatVND(a.amount)}</div>
                    <StatusBadge variant="warning" dot>Chờ</StatusBadge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Zap className="w-4 h-4 text-rtd-600" />
              Hoạt động gần đây
            </h3>
            <Link href="/admin/audit-logs" className="text-xs text-rtd-600 hover:text-rtd-700 flex items-center gap-1">
              Tất cả <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {MOCK_ADMIN_KPIS.recentAudits.slice(0, 5).map((audit, i) => (
              <div key={i} className="px-5 py-3 flex items-start gap-3">
                <ActionPill action={audit.action} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-700">
                    <span className="font-medium">{audit.actor.split('@')[0]}</span>{' '}
                    <span className="text-slate-500">{audit.entity}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 truncate">{audit.detail}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {new Date(audit.at).toLocaleString('vi-VN')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  title, icon: Icon, href,
}: { title: string; icon: React.ComponentType<{ className?: string }>; href: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2 uppercase tracking-wide">
        <Icon className="w-4 h-4" />
        {title}
      </h2>
      <Link href={href} className="text-xs text-rtd-600 hover:text-rtd-700 flex items-center gap-1">
        Vào module <ChevronRight className="w-3 h-3" />
      </Link>
    </div>
  );
}

function QuickAction({
  href, icon: Icon, label, color,
}: { href: string; icon: React.ComponentType<{ className?: string }>; label: string; color: 'green' | 'blue' | 'amber' | 'violet' }) {
  const colors = {
    green: 'from-rtd-500 to-emerald-600 shadow-rtd-200',
    blue: 'from-blue-500 to-indigo-600 shadow-blue-200',
    amber: 'from-amber-500 to-orange-600 shadow-amber-200',
    violet: 'from-violet-500 to-purple-600 shadow-violet-200',
  }[color];
  return (
    <Link
      href={href}
      className="group bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition flex items-center gap-3"
    >
      <div className={cn('w-10 h-10 rounded-lg bg-gradient-to-br text-white flex items-center justify-center shadow-md group-hover:scale-105 transition', colors)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="font-medium text-slate-800 text-sm">{label}</div>
    </Link>
  );
}

function ActionPill({ action }: { action: string }) {
  const map: Record<string, string> = {
    CREATE: 'bg-rtd-100 text-rtd-700',
    UPDATE: 'bg-blue-100 text-blue-700',
    DELETE: 'bg-rose-100 text-rose-700',
    APPROVE: 'bg-amber-100 text-amber-700',
  };
  return (
    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide shrink-0', map[action] ?? 'bg-slate-100 text-slate-700')}>
      {action}
    </span>
  );
}
