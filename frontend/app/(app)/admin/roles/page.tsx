'use client';

import { useState } from 'react';
import { CheckCircle2, Lock, Plus, Shield, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageTitle } from '@/components/page-title';
import { StatusBadge } from '@/components/status-badge';
import { MOCK_PERMISSIONS, MOCK_ROLES, type MockRole } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

// Build matrix: role × permission
function isPermissionGranted(role: MockRole, perm: { resource: string; action: string }): boolean {
  // SUPER_ADMIN: all
  if (role.code === 'SUPER_ADMIN') return true;
  // ADMIN: all except delete
  if (role.code === 'ADMIN') return perm.action !== 'delete';
  // ACCOUNTANT: financial.*, master_data read
  if (role.code === 'ACCOUNTANT') {
    return (
      perm.resource.startsWith('financial.') ||
      (perm.resource.startsWith('master_data.') && perm.action === 'read')
    );
  }
  // MANAGER_FACTORY: factory + read most
  if (role.code === 'MANAGER_FACTORY') {
    return perm.action === 'read' || perm.action === 'approve';
  }
  // VIEWER: read only
  return perm.action === 'read';
}

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState<MockRole>(MOCK_ROLES[0]);

  // Group permissions by resource
  const grouped = MOCK_PERMISSIONS.reduce<Record<string, typeof MOCK_PERMISSIONS>>((acc, p) => {
    (acc[p.resource] ??= []).push(p);
    return acc;
  }, {});

  return (
    <div>
      <PageTitle
        title="Vai trò & Phân quyền"
        subtitle={`${MOCK_ROLES.length} vai trò · ${MOCK_PERMISSIONS.length} permission`}
        actions={
          <button onClick={() => toast('Tạo role tùy chỉnh — đang xây')} className="btn-primary">
            <Plus className="w-4 h-4" />
            Tạo vai trò mới
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Roles list */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
              <h3 className="font-semibold text-sm text-slate-800">Danh sách vai trò</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {MOCK_ROLES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRole(r)}
                  className={cn(
                    'w-full text-left px-4 py-3 hover:bg-slate-50 flex items-start gap-3 transition',
                    selectedRole.id === r.id && 'bg-rtd-50',
                  )}
                >
                  <Shield
                    className={cn('w-5 h-5 mt-0.5 shrink-0', selectedRole.id === r.id ? 'text-rtd-600' : 'text-slate-400')}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-800">{r.code}</span>
                      {r.isSystem && (
                        <span title="Vai trò hệ thống — không thể xóa">
                          <Lock className="w-3 h-3 text-slate-400" />
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-700 mt-0.5">{r.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5 truncate">{r.description}</div>
                    <div className="flex items-center gap-3 mt-1.5 text-xs">
                      <span className="text-slate-500 inline-flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {r.userCount} user
                      </span>
                      <span className="text-slate-500 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {r.permissionCount} quyền
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Permission matrix */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800">{selectedRole.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedRole.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {selectedRole.isSystem && <StatusBadge variant="warning">Hệ thống</StatusBadge>}
                <button
                  onClick={() => toast('Lưu cấu hình — đang xây')}
                  className="btn-secondary text-xs py-1.5"
                  disabled={selectedRole.isSystem}
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {Object.entries(grouped).map(([resource, perms]) => (
                <div key={resource} className="border-b border-slate-100">
                  <div className="px-5 py-2.5 bg-slate-50/50 font-mono text-xs text-slate-600">
                    {resource}
                  </div>
                  <div className="divide-y divide-slate-50">
                    {perms.map((p) => {
                      const granted = isPermissionGranted(selectedRole, p);
                      return (
                        <div key={`${p.resource}-${p.action}`} className="px-5 py-2.5 flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={granted}
                            disabled={selectedRole.isSystem}
                            readOnly
                            className="rounded text-rtd-600 focus:ring-rtd-500 disabled:opacity-60"
                          />
                          <div className="flex-1">
                            <div className="text-sm text-slate-700">
                              <span className="font-mono text-xs text-slate-400 mr-2">{p.action}</span>
                              {p.description}
                            </div>
                          </div>
                          {granted && <StatusBadge variant="success">Có quyền</StatusBadge>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
