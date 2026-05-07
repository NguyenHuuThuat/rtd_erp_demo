'use client';

import { create } from 'zustand';
import {
  MOCK_INVOICES,
  MOCK_JOURNALS,
  MOCK_ORGS,
  MOCK_PARTNERS,
  MOCK_PAYMENTS,
  MOCK_USERS,
  type MockInvoice,
  type MockJournal,
  type MockOrg,
  type MockPartner,
  type MockPayment,
  type MockUser,
} from './mock-data';

interface MockStoreState {
  orgs: MockOrg[];
  users: MockUser[];
  partners: MockPartner[];
  journals: MockJournal[];
  invoices: MockInvoice[];
  payments: MockPayment[];
  notifications: { id: string; title: string; body: string; at: string; read: boolean; type: 'info' | 'warning' | 'success' }[];
  // org
  addOrg: (o: Omit<MockOrg, 'id'>) => MockOrg;
  updateOrg: (id: string, patch: Partial<MockOrg>) => void;
  deleteOrg: (id: string) => void;
  // user
  addUser: (u: Omit<MockUser, 'id'>) => MockUser;
  toggleUserActive: (id: string) => void;
  // journal
  addJournal: (j: Omit<MockJournal, 'id'>) => MockJournal;
  // notification
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const seedNotifications = [
  { id: 'n1', title: 'Hóa đơn quá hạn', body: 'INV-S-2026-04-013 — ĐL Minh Phú quá hạn 3 ngày', at: new Date(Date.now() - 30 * 60_000).toISOString(), read: false, type: 'warning' as const },
  { id: 'n2', title: 'Yêu cầu phê duyệt mới', body: 'Đơn mua hàng PR-2026-05-012 (1.2 tỷ) chờ duyệt', at: new Date(Date.now() - 2 * 3600_000).toISOString(), read: false, type: 'info' as const },
  { id: 'n3', title: 'Backup hệ thống', body: 'Backup DB hằng ngày hoàn tất lúc 02:00', at: new Date(Date.now() - 8 * 3600_000).toISOString(), read: false, type: 'success' as const },
  { id: 'n4', title: 'Đăng nhập đáng ngờ', body: 'Có lần đăng nhập từ IP lạ vào TK admin@rtd.local', at: new Date(Date.now() - 26 * 3600_000).toISOString(), read: true, type: 'warning' as const },
];

export const useMockStore = create<MockStoreState>((set) => ({
  orgs: [...MOCK_ORGS],
  users: [...MOCK_USERS],
  partners: [...MOCK_PARTNERS],
  journals: [...MOCK_JOURNALS],
  invoices: [...MOCK_INVOICES],
  payments: [...MOCK_PAYMENTS],
  notifications: seedNotifications,

  addOrg: (o) => {
    const newOrg = { ...o, id: `org-${Date.now()}` };
    set((s) => ({ orgs: [...s.orgs, newOrg] }));
    return newOrg;
  },
  updateOrg: (id, patch) =>
    set((s) => ({ orgs: s.orgs.map((o) => (o.id === id ? { ...o, ...patch } : o)) })),
  deleteOrg: (id) => set((s) => ({ orgs: s.orgs.filter((o) => o.id !== id) })),

  addUser: (u) => {
    const newUser = { ...u, id: `u-${Date.now()}` };
    set((s) => ({ users: [...s.users, newUser] }));
    return newUser;
  },
  toggleUserActive: (id) =>
    set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)) })),

  addJournal: (j) => {
    const newJ = { ...j, id: `j-${Date.now()}` };
    set((s) => ({ journals: [newJ, ...s.journals] }));
    return newJ;
  },

  markNotificationRead: (id) =>
    set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
  markAllNotificationsRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
}));
