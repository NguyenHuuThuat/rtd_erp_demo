'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminOverview() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-slate-500 text-sm">
      Đang chuyển sang Trang chủ…
    </div>
  );
}
