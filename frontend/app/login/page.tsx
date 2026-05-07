'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, Loader2 } from 'lucide-react';
import { api, USE_MOCK } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { MOCK_USER } from '@/lib/mock-data';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@rtd.local');
  const [password, setPassword] = useState('RtdAdmin@2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        // Mock auth: chấp nhận password "RtdAdmin@2026" cho admin@rtd.local
        await new Promise((r) => setTimeout(r, 400));
        if (password !== 'RtdAdmin@2026') throw new Error('Mật khẩu không đúng (demo: RtdAdmin@2026)');
        setSession({
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          user: { ...MOCK_USER, email },
        });
      } else {
        const res = await api.post('/auth/login', { email, password });
        const payload = res.data.data ?? res.data;
        setSession({
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
          user: payload.user,
        });
      }
      router.push('/dashboard');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Đăng nhập thất bại';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rtd-50 via-emerald-50 to-rtd-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rtd-600 text-white shadow-lg shadow-rtd-200">
            <Leaf className="w-8 h-8" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-rtd-800">RTD ERP</h1>
          <p className="text-sm text-slate-500 mt-1">Hệ thống Thông tin Quản lý — Tập đoàn RTD</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-rtd-100/50 p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-1">Đăng nhập</h2>
          <p className="text-sm text-slate-500 mb-6">Phase 1 — Quản trị &amp; Tài chính</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-rtd-500 focus:border-transparent transition"
                placeholder="ten@rtd.vn"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-rtd-500 focus:border-transparent transition"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rtd-600 hover:bg-rtd-700 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Đăng nhập
            </button>
          </form>

          {USE_MOCK && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="text-xs text-slate-500 leading-relaxed">
                <span className="font-semibold text-amber-600">⚡ Demo mode:</span> chưa cắm DB.
                <br />
                Dùng mật khẩu mặc định: <code className="bg-slate-100 px-1 rounded">RtdAdmin@2026</code>
              </div>
            </div>
          )}
        </div>

        <div className="text-center text-xs text-slate-400 mt-6">
          © 2026 Tập đoàn RTD Việt Nam — Demo ERP nội bộ
        </div>
      </div>
    </div>
  );
}
