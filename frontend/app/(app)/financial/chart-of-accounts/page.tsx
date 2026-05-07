'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, FileDown, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageTitle } from '@/components/page-title';
import { StatusBadge } from '@/components/status-badge';
import { MOCK_COA, type MockAccount } from '@/lib/mock-data';
import { formatVND, cn } from '@/lib/utils';

const TYPE_LABEL: Record<MockAccount['accountType'], string> = {
  ASSET: 'Tài sản',
  LIABILITY: 'Nợ phải trả',
  EQUITY: 'Vốn chủ sở hữu',
  REVENUE: 'Doanh thu',
  EXPENSE: 'Chi phí',
};

const TYPE_VARIANT: Record<MockAccount['accountType'], 'success' | 'warning' | 'primary' | 'info' | 'danger'> = {
  ASSET: 'success',
  LIABILITY: 'warning',
  EQUITY: 'primary',
  REVENUE: 'info',
  EXPENSE: 'danger',
};

interface AccountNode extends MockAccount {
  children: AccountNode[];
}

function buildTree(items: MockAccount[]): AccountNode[] {
  const byParent = new Map<string | null, MockAccount[]>();
  for (const a of items) {
    const list = byParent.get(a.parentCode) ?? [];
    list.push(a);
    byParent.set(a.parentCode, list);
  }
  const recurse = (parent: string | null): AccountNode[] =>
    (byParent.get(parent) ?? []).map((a) => ({ ...a, children: recurse(a.code) }));
  return recurse(null);
}

export default function ChartOfAccountsPage() {
  const tree = buildTree(MOCK_COA);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(MOCK_COA.filter((a) => !a.isLeaf).map((a) => a.code)));
  const [filterType, setFilterType] = useState<'all' | MockAccount['accountType']>('all');

  function toggle(code: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }

  const stats = {
    asset: MOCK_COA.filter((a) => a.accountType === 'ASSET' && a.isLeaf).reduce((s, a) => s + a.balance, 0),
    liability: MOCK_COA.filter((a) => a.accountType === 'LIABILITY' && a.isLeaf).reduce((s, a) => s + a.balance, 0),
    equity: MOCK_COA.filter((a) => a.accountType === 'EQUITY' && a.isLeaf).reduce((s, a) => s + a.balance, 0),
    revenue: MOCK_COA.filter((a) => a.accountType === 'REVENUE' && a.isLeaf).reduce((s, a) => s + a.balance, 0),
    expense: MOCK_COA.filter((a) => a.accountType === 'EXPENSE' && a.isLeaf).reduce((s, a) => s + a.balance, 0),
  };

  return (
    <div>
      <PageTitle
        title="Hệ thống tài khoản"
        subtitle={`${MOCK_COA.length} tài khoản · Theo TT200 (rút gọn)`}
        actions={
          <>
            <button onClick={() => toast('Xuất danh mục — đang xây')} className="btn-secondary">
              <FileDown className="w-4 h-4" />
              Xuất Excel
            </button>
            <button onClick={() => toast('Thêm tài khoản — đang xây')} className="btn-primary">
              <Plus className="w-4 h-4" />
              Thêm tài khoản
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <BalancePill label="Tài sản" value={stats.asset} variant="success" />
        <BalancePill label="Nợ phải trả" value={stats.liability} variant="warning" />
        <BalancePill label="Vốn CSH" value={stats.equity} variant="primary" />
        <BalancePill label="Doanh thu" value={stats.revenue} variant="info" />
        <BalancePill label="Chi phí" value={stats.expense} variant="danger" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
          <div className="flex bg-slate-100 rounded-lg p-0.5 text-xs">
            {(['all', 'ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'] as const).map((v) => (
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
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
            <tr>
              <th className="text-left font-semibold px-4 py-3">Mã & Tên</th>
              <th className="text-left font-semibold px-4 py-3 w-40">Loại</th>
              <th className="text-right font-semibold px-4 py-3 w-44">Số dư</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tree
              .filter((n) => filterType === 'all' || n.accountType === filterType)
              .map((node) => (
                <AccountRow key={node.code} node={node} depth={0} expanded={expanded} onToggle={toggle} />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AccountRow({
  node, depth, expanded, onToggle,
}: { node: AccountNode; depth: number; expanded: Set<string>; onToggle: (c: string) => void }) {
  const hasChildren = node.children.length > 0;
  const isOpen = expanded.has(node.code);
  return (
    <>
      <tr className={cn('hover:bg-slate-50', depth === 0 && 'bg-slate-50/50 font-medium')}>
        <td className="px-4 py-2.5">
          <div className="flex items-center gap-2" style={{ paddingLeft: depth * 20 }}>
            <button onClick={() => hasChildren && onToggle(node.code)} className="w-4">
              {hasChildren ? (
                isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              ) : null}
            </button>
            <span className="font-mono text-xs text-slate-500 w-10">{node.code}</span>
            <span className="text-slate-800">{node.name}</span>
            {!node.isLeaf && <span className="text-[10px] text-slate-400 italic">(tổng hợp)</span>}
          </div>
        </td>
        <td className="px-4 py-2.5">
          <StatusBadge variant={TYPE_VARIANT[node.accountType]}>{TYPE_LABEL[node.accountType]}</StatusBadge>
        </td>
        <td className="px-4 py-2.5 text-right tabular-nums">
          <span className={cn(node.balance < 0 && 'text-rose-600')}>{formatVND(node.balance)}</span>
        </td>
      </tr>
      {hasChildren && isOpen && node.children.map((c) => (
        <AccountRow key={c.code} node={c} depth={depth + 1} expanded={expanded} onToggle={onToggle} />
      ))}
    </>
  );
}

function BalancePill({
  label, value, variant,
}: { label: string; value: number; variant: 'success' | 'warning' | 'primary' | 'info' | 'danger' }) {
  const colors = {
    success: 'border-rtd-200 bg-rtd-50',
    warning: 'border-amber-200 bg-amber-50',
    primary: 'border-violet-200 bg-violet-50',
    info: 'border-blue-200 bg-blue-50',
    danger: 'border-rose-200 bg-rose-50',
  }[variant];
  return (
    <div className={cn('rounded-lg border p-3', colors)}>
      <div className="text-xs text-slate-600 font-medium">{label}</div>
      <div className="text-base font-bold text-slate-900 mt-0.5 tabular-nums">{formatVND(value)}</div>
    </div>
  );
}
