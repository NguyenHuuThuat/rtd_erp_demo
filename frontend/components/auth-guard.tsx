'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!accessToken) router.replace('/login');
  }, [accessToken, router]);

  if (!accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Đang kiểm tra phiên đăng nhập…
      </div>
    );
  }

  return <>{children}</>;
}
