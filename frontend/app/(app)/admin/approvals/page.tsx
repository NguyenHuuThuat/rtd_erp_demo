'use client';

import { useState } from 'react';
import { Check, CheckCircle2, Clock, FileText, Filter, Receipt, Target, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageTitle } from '@/components/page-title';
import { Drawer } from '@/components/drawer';
import { StatusBadge } from '@/components/status-badge';
import { MOCK_APPROVALS, type MockApproval } from '@/lib/mock-data';
import { formatVND, formatDateTime, cn } from '@/lib/utils';

const TYPE_ICON: Record<MockApproval['targetType'], React.ComponentType<{ className?: string }>> = {
  PURCHASE_ORDER: FileText,
  INVOICE: Receipt,
  BUDGET: Target,
  JOURNAL: FileText,
};

const TYPE_LABEL: Record<MockApproval['targetType'], string> = {
  PURCHASE_ORDER: 'Đơn mua',
  INVOICE: 'Hóa đơn',
  BUDGET: 'Ngân sách',
  JOURNAL: 'Bút toán',
};

const STATUS_VARIANT: Record<MockApproval['status'], 'warning' | 'success' | 'danger'> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
};

const STATUS_LABEL: Record<MockApproval['status'], string> = {
  PENDING: 'Đang chờ',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối',
};

export default function ApprovalsPage() {
  const [filterTab, setFilterTab] = useState<'pending' | 'mine' | 'all'>('pending');
  const [detail, setDetail] = useState<MockApproval | null>(null);
  const [comment, setComment] = useState('');

  const filtered = MOCK_APPROVALS.filter((a) => {
    if (filterTab === 'pending') return a.status === 'PENDING';
    return true;
  });

  const pending = MOCK_APPROVALS.filter((a) => a.status === 'PENDING');
  const totalPendingAmount = pending.reduce((s, a) => s + a.amount, 0);

  function decide(approval: MockApproval, result: 'APPROVED' | 'REJECTED') {
    if (result === 'REJECTED' && !comment.trim()) {
      toast.error('Phải có lý do khi từ chối');
      return;
    }
    toast.success(
      result === 'APPROVED' ? `Đã duyệt ${approval.code}` : `Đã từ chối ${approval.code}`,
    );
    setDetail(null);
    setComment('');
  }

  return (
    <div>
      <PageTitle
        title="Phê duyệt"
        subtitle={`${pending.length} yêu cầu đang chờ · Tổng giá trị ${formatVND(totalPendingAmount)}`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KpiBox label="Đang chờ" value={pending.length} variant="warning" />
        <KpiBox label="Đã duyệt (5 ngày)" value={MOCK_APPROVALS.filter((a) => a.status === 'APPROVED').length} variant="success" />
        <KpiBox label="Bị từ chối" value={MOCK_APPROVALS.filter((a) => a.status === 'REJECTED').length} variant="danger" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-3 border-b border-slate-100 flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex bg-slate-100 rounded-lg p-0.5 text-xs">
            {(['pending', 'mine', 'all'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setFilterTab(v)}
                className={cn(
                  'px-3 py-1 rounded transition',
                  filterTab === v ? 'bg-white text-slate-800 shadow-sm font-medium' : 'text-slate-500',
                )}
              >
                {v === 'pending' ? 'Đang chờ duyệt' : v === 'mine' ? 'Của tôi' : 'Tất cả'}
              </button>
            ))}
          </div>
        </div>

        <div data-tour="approval-list" className="divide-y divide-slate-100">
          {filtered.map((a) => {
            const Icon = TYPE_ICON[a.targetType];
            return (
              <button
                key={a.id}
                onClick={() => setDetail(a)}
                className="w-full text-left px-5 py-4 hover:bg-slate-50 transition flex items-start gap-4"
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                    a.status === 'PENDING' ? 'bg-amber-100 text-amber-700'
                      : a.status === 'APPROVED' ? 'bg-rtd-100 text-rtd-700'
                      : 'bg-rose-100 text-rose-700',
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-slate-500">{a.code}</span>
                    <StatusBadge variant="neutral">{TYPE_LABEL[a.targetType]}</StatusBadge>
                    <StatusBadge variant={STATUS_VARIANT[a.status]} dot={a.status === 'PENDING'}>
                      {STATUS_LABEL[a.status]}
                    </StatusBadge>
                  </div>
                  <div className="font-medium text-slate-800 mt-1">{a.targetSummary}</div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                    <span>YC: <strong>{a.requesterName}</strong></span>
                    <span className="text-slate-400">·</span>
                    <span><Clock className="w-3 h-3 inline mr-1" />{formatDateTime(a.submittedAt)}</span>
                    {a.status === 'PENDING' && (
                      <>
                        <span className="text-slate-400">·</span>
                        <span className="text-amber-700">
                          Bước {a.currentStep}/{a.totalSteps}: {a.currentApprover}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-bold text-slate-900 tabular-nums">{formatVND(a.amount)}</div>
                  <div className="text-xs text-slate-500">{a.flowName}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <Drawer
        open={detail !== null}
        onClose={() => {
          setDetail(null);
          setComment('');
        }}
        title={detail?.code ?? ''}
        subtitle={detail?.flowName}
        width="xl"
        footer={
          detail?.status === 'PENDING' && (
            <div className="space-y-3">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ghi chú / lý do (bắt buộc khi từ chối)…"
                rows={2}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-rtd-400"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => decide(detail, 'REJECTED')} className="btn-danger">
                  <X className="w-4 h-4" />
                  Từ chối
                </button>
                <button onClick={() => decide(detail, 'APPROVED')} className="btn-primary">
                  <Check className="w-4 h-4" />
                  Duyệt
                </button>
              </div>
            </div>
          )
        }
      >
        {detail && (
          <div className="p-6 space-y-6">
            <div>
              <div className="text-2xl font-bold text-slate-900">{formatVND(detail.amount)}</div>
              <div className="text-sm text-slate-700 mt-1">{detail.targetSummary}</div>
              <div className="text-xs text-slate-500 mt-1">
                Đối tượng: <span className="font-mono">{detail.targetCode}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Người yêu cầu
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rtd-100 text-rtd-700 flex items-center justify-center font-semibold">
                  {detail.requesterName.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-slate-800">{detail.requesterName}</div>
                  <div className="text-xs text-slate-500">{detail.requesterEmail}</div>
                  <div className="text-xs text-slate-400">Gửi lúc {formatDateTime(detail.submittedAt)}</div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Lộ trình duyệt
              </div>
              <div className="space-y-3">
                {detail.history.map((h) => (
                  <div key={h.step} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                          h.result === 'APPROVED' ? 'bg-rtd-100 text-rtd-700'
                            : h.result === 'REJECTED' ? 'bg-rose-100 text-rose-700'
                            : h.step === detail.currentStep && detail.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-300'
                              : 'bg-slate-100 text-slate-400',
                        )}
                      >
                        {h.result === 'APPROVED' ? <Check className="w-4 h-4" /> : h.result === 'REJECTED' ? <X className="w-4 h-4" /> : h.step}
                      </div>
                      {h.step < detail.history.length && <div className="w-0.5 flex-1 bg-slate-200 my-1 min-h-[20px]" />}
                    </div>
                    <div className="flex-1 pb-3">
                      <div className="font-medium text-slate-800 text-sm">{h.name}</div>
                      <div className="text-xs text-slate-500">{h.approver}</div>
                      {h.at && <div className="text-xs text-slate-400 mt-0.5">{formatDateTime(h.at)}</div>}
                      {h.comment && (
                        <div className="text-xs text-slate-600 mt-1 bg-slate-50 px-2 py-1 rounded italic">
                          "{h.comment}"
                        </div>
                      )}
                      {h.result === 'PENDING' && h.step === detail.currentStep && (
                        <StatusBadge variant="warning" dot>Đang chờ duyệt</StatusBadge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

function KpiBox({ label, value, variant }: { label: string; value: number; variant: 'warning' | 'success' | 'danger' }) {
  const colors = {
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    success: 'bg-rtd-50 border-rtd-200 text-rtd-900',
    danger: 'bg-rose-50 border-rose-200 text-rose-900',
  }[variant];
  const icons = {
    warning: <Clock className="w-5 h-5" />,
    success: <CheckCircle2 className="w-5 h-5" />,
    danger: <X className="w-5 h-5" />,
  }[variant];
  return (
    <div className={cn('rounded-xl border-2 p-4 flex items-center justify-between', colors)}>
      <div>
        <div className="text-xs font-medium opacity-80">{label}</div>
        <div className="text-3xl font-bold mt-1 tabular-nums">{value}</div>
      </div>
      <div className="opacity-60">{icons}</div>
    </div>
  );
}
