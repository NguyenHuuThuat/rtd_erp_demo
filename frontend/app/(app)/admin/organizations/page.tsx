'use client';

import { useMemo, useState } from 'react';
import {
  Building2,
  ChevronDown,
  ChevronRight,
  Edit2,
  MapPin,
  Plus,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { PageTitle } from '@/components/page-title';
import { Modal } from '@/components/modal';
import { Drawer } from '@/components/drawer';
import { StatusBadge } from '@/components/status-badge';
import { OrganizationForm } from '@/components/forms/organization-form';
import { useMockStore } from '@/lib/mock-store';
import { type MockOrg } from '@/lib/mock-data';
import { cn, formatDateTime } from '@/lib/utils';

interface OrgNode extends MockOrg {
  children: OrgNode[];
}

function buildTree(orgs: MockOrg[]): OrgNode[] {
  const byParent = new Map<string | null, MockOrg[]>();
  for (const o of orgs) {
    const list = byParent.get(o.parentId) ?? [];
    list.push(o);
    byParent.set(o.parentId, list);
  }
  const recurse = (parent: string | null): OrgNode[] =>
    (byParent.get(parent) ?? []).map((o) => ({ ...o, children: recurse(o.id) }));
  return recurse(null);
}

const TYPE_LABEL: Record<MockOrg['type'], string> = {
  GROUP: 'Tập đoàn',
  COMPANY: 'Công ty',
  BRANCH: 'Chi nhánh',
};

export default function OrganizationsPage() {
  const orgs = useMockStore((s) => s.orgs);
  const deleteOrg = useMockStore((s) => s.deleteOrg);
  const tree = useMemo(() => buildTree(orgs), [orgs]);

  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(orgs.filter((o) => o.parentId === null || o.type === 'GROUP').map((o) => o.id)),
  );

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<MockOrg | null>(null);
  const [detailTarget, setDetailTarget] = useState<MockOrg | null>(null);

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleDelete(o: MockOrg) {
    const childCount = orgs.filter((x) => x.parentId === o.id).length;
    if (childCount > 0) {
      toast.error(`Không thể xóa: "${o.name}" còn ${childCount} đơn vị con`);
      return;
    }
    if (!confirm(`Xóa đơn vị "${o.name}"?`)) return;
    deleteOrg(o.id);
    toast.success(`Đã xóa "${o.name}"`);
    setDetailTarget(null);
  }

  return (
    <div>
      <PageTitle
        title="Cơ cấu tổ chức"
        subtitle={`${orgs.length} đơn vị · Tập đoàn → Công ty → Chi nhánh`}
        actions={
          <>
            <button onClick={() => toast('Xuất Excel — đang xây')} className="btn-secondary">
              Xuất Excel
            </button>
            <button onClick={() => setCreateOpen(true)} className="btn-primary">
              <Plus className="w-4 h-4" />
              Thêm đơn vị
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatPill label="Tập đoàn" value={orgs.filter((o) => o.type === 'GROUP').length} variant="primary" />
        <StatPill label="Công ty con" value={orgs.filter((o) => o.type === 'COMPANY').length} variant="info" />
        <StatPill label="Chi nhánh" value={orgs.filter((o) => o.type === 'BRANCH').length} variant="neutral" />
        <StatPill label="Đang hoạt động" value={orgs.filter((o) => o.isActive).length} variant="success" />
      </div>

      <div data-tour="org-tree" className="bg-white rounded-xl border border-slate-200 p-2">
        {tree.map((node) => (
          <OrgRow
            key={node.id}
            node={node}
            depth={0}
            expanded={expanded}
            onToggle={toggle}
            onSelect={setDetailTarget}
          />
        ))}
      </div>

      {/* Create/Edit modal */}
      <Modal
        open={createOpen || editTarget !== null}
        onClose={() => {
          setCreateOpen(false);
          setEditTarget(null);
        }}
        title={editTarget ? `Sửa đơn vị: ${editTarget.name}` : 'Thêm đơn vị mới'}
        description={editTarget ? 'Cập nhật thông tin tổ chức' : 'Tạo công ty con hoặc chi nhánh mới'}
        size="lg"
      >
        <OrganizationForm
          initialData={editTarget}
          onClose={() => {
            setCreateOpen(false);
            setEditTarget(null);
          }}
        />
      </Modal>

      {/* Detail drawer */}
      <Drawer
        open={detailTarget !== null}
        onClose={() => setDetailTarget(null)}
        title={detailTarget?.name ?? ''}
        subtitle={detailTarget ? `${TYPE_LABEL[detailTarget.type]} · ${detailTarget.code}` : ''}
        footer={
          detailTarget && (
            <div className="flex justify-between items-center">
              <button onClick={() => handleDelete(detailTarget)} className="btn-ghost text-rose-600 hover:bg-rose-50">
                <Trash2 className="w-4 h-4" />
                Xóa
              </button>
              <div className="flex gap-2">
                <button onClick={() => setDetailTarget(null)} className="btn-ghost">
                  Đóng
                </button>
                <button
                  onClick={() => {
                    setEditTarget(detailTarget);
                    setDetailTarget(null);
                  }}
                  className="btn-primary"
                >
                  <Edit2 className="w-4 h-4" />
                  Chỉnh sửa
                </button>
              </div>
            </div>
          )
        }
      >
        {detailTarget && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <DetailField label="Mã đơn vị" value={detailTarget.code} mono />
              <DetailField label="Loại" value={TYPE_LABEL[detailTarget.type]} />
              <DetailField label="Mã số thuế" value={detailTarget.taxCode ?? '—'} mono />
              <DetailField label="Tỉnh / Thành" value={detailTarget.provinceCode ?? '—'} />
              <DetailField label="Trạng thái" value={detailTarget.isActive ? 'Hoạt động' : 'Tạm khóa'} />
              <DetailField
                label="Đơn vị cha"
                value={
                  detailTarget.parentId
                    ? orgs.find((o) => o.id === detailTarget.parentId)?.name ?? '—'
                    : '— (Tập đoàn gốc)'
                }
              />
            </div>

            <div className="border-t border-slate-100 pt-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Đơn vị con</div>
              {orgs.filter((o) => o.parentId === detailTarget.id).length === 0 ? (
                <div className="text-sm text-slate-400 italic">Không có đơn vị con</div>
              ) : (
                <div className="space-y-1.5">
                  {orgs
                    .filter((o) => o.parentId === detailTarget.id)
                    .map((c) => (
                      <div key={c.id} className="flex items-center gap-2 text-sm">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-700">{c.name}</span>
                        <span className="text-xs text-slate-400 font-mono">({c.code})</span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Thông tin hệ thống
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
                <div>
                  <div className="text-slate-400">Tạo lúc</div>
                  <div>{formatDateTime(new Date())}</div>
                </div>
                <div>
                  <div className="text-slate-400">Cập nhật cuối</div>
                  <div>{formatDateTime(new Date())}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

function OrgRow({
  node,
  depth,
  expanded,
  onToggle,
  onSelect,
}: {
  node: OrgNode;
  depth: number;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  onSelect: (org: MockOrg) => void;
}) {
  const hasChildren = node.children.length > 0;
  const isOpen = expanded.has(node.id);

  return (
    <>
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition',
          depth === 0 && 'bg-slate-50/50',
        )}
        style={{ paddingLeft: 12 + depth * 24 }}
      >
        <button
          onClick={() => hasChildren && onToggle(node.id)}
          className="w-5 flex justify-center"
          disabled={!hasChildren}
        >
          {hasChildren ? (
            isOpen ? (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-500" />
            )
          ) : null}
        </button>
        <Building2
          className={cn(
            'w-4 h-4 shrink-0',
            node.type === 'GROUP' ? 'text-rtd-600' : node.type === 'COMPANY' ? 'text-blue-600' : 'text-slate-500',
          )}
        />
        <button
          onClick={() => onSelect(node)}
          className={cn(
            'font-medium hover:text-rtd-700 hover:underline cursor-pointer',
            depth === 0 ? 'text-slate-900' : 'text-slate-700',
          )}
        >
          {node.name}
        </button>
        <code className="text-xs text-slate-400 px-1.5 py-0.5 bg-slate-100 rounded">{node.code}</code>
        <StatusBadge variant={node.type === 'GROUP' ? 'success' : node.type === 'COMPANY' ? 'info' : 'neutral'}>
          {TYPE_LABEL[node.type]}
        </StatusBadge>
        {node.taxCode && (
          <span className="text-xs text-slate-400 hidden lg:inline">MST: {node.taxCode}</span>
        )}
        <div className="ml-auto flex items-center gap-2">
          {node.provinceCode && (
            <span className="text-xs text-slate-400 hidden md:inline-flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {node.provinceCode}
            </span>
          )}
          {!node.isActive && <StatusBadge variant="warning">Tạm khóa</StatusBadge>}
        </div>
      </div>
      {hasChildren && isOpen && node.children.map((child) => (
        <OrgRow key={child.id} node={child} depth={depth + 1} expanded={expanded} onToggle={onToggle} onSelect={onSelect} />
      ))}
    </>
  );
}

function StatPill({
  label,
  value,
  variant,
}: {
  label: string;
  value: number;
  variant: 'success' | 'info' | 'neutral' | 'primary';
}) {
  const colors = {
    success: 'border-rtd-200 bg-rtd-50 text-rtd-800',
    info: 'border-blue-200 bg-blue-50 text-blue-800',
    neutral: 'border-slate-200 bg-slate-50 text-slate-700',
    primary: 'border-violet-200 bg-violet-50 text-violet-800',
  }[variant];
  return (
    <div className={cn('rounded-xl border p-4', colors)}>
      <div className="text-xs font-medium opacity-80">{label}</div>
      <div className="text-2xl font-bold mt-1 tabular-nums">{value}</div>
    </div>
  );
}

function DetailField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-xs text-slate-500 mb-0.5">{label}</div>
      <div className={cn('text-sm text-slate-800', mono && 'font-mono')}>{value}</div>
    </div>
  );
}
