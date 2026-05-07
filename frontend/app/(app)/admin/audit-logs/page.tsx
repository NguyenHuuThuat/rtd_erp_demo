'use client';

import { PageTitle } from '@/components/page-title';
import { MOCK_ADMIN_KPIS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const ACTION_BADGE: Record<string, string> = {
  CREATE: 'bg-rtd-100 text-rtd-700',
  UPDATE: 'bg-blue-100 text-blue-700',
  DELETE: 'bg-rose-100 text-rose-700',
  APPROVE: 'bg-amber-100 text-amber-700',
};

// Mở rộng audit log để có đủ dữ liệu hiển thị
const EXTENDED_AUDITS = [
  ...MOCK_ADMIN_KPIS.recentAudits,
  { actor: 'gd.farm@rtd.vn', action: 'UPDATE', entity: 'PigGroup', detail: 'Đàn 24A - cập nhật cân nặng', at: '2026-05-05T08:30:00Z' },
  { actor: 'admin@rtd.local', action: 'CREATE', entity: 'User', detail: 'Tạo user kt.tonghop@rtd.vn', at: '2026-05-04T14:00:00Z' },
  { actor: 'kt.tonghop@rtd.vn', action: 'CREATE', entity: 'Journal', detail: 'JV-2026-05-001 (920 triệu)', at: '2026-05-02T11:30:00Z' },
  { actor: 'admin@rtd.local', action: 'DELETE', entity: 'Role', detail: 'Xóa role TEST_ROLE', at: '2026-05-01T16:00:00Z' },
  { actor: 'gd.feed@rtd.vn', action: 'APPROVE', entity: 'Budget', detail: 'Duyệt ngân sách Q2/2026 cho NM Hà Nam', at: '2026-04-28T10:15:00Z' },
];

export default function AuditLogsPage() {
  return (
    <div>
      <PageTitle
        title="Nhật ký hoạt động"
        subtitle="Lịch sử thao tác toàn hệ thống — ai làm gì, khi nào, trên đối tượng nào"
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
            <tr>
              <th className="text-left font-semibold px-4 py-3 w-32">Thời gian</th>
              <th className="text-left font-semibold px-4 py-3 w-24">Hành động</th>
              <th className="text-left font-semibold px-4 py-3">Người thực hiện</th>
              <th className="text-left font-semibold px-4 py-3">Đối tượng</th>
              <th className="text-left font-semibold px-4 py-3">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {EXTENDED_AUDITS.map((audit, i) => (
              <tr key={i} className="hover:bg-slate-50 transition">
                <td className="px-4 py-3 text-slate-500 text-xs tabular-nums">
                  {new Date(audit.at).toLocaleString('vi-VN')}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'text-[10px] font-semibold px-2 py-0.5 rounded uppercase',
                      ACTION_BADGE[audit.action] ?? 'bg-slate-100 text-slate-700',
                    )}
                  >
                    {audit.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700 font-medium">{audit.actor}</td>
                <td className="px-4 py-3 text-slate-600">{audit.entity}</td>
                <td className="px-4 py-3 text-slate-600">{audit.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
