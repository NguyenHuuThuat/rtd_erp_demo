import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'RTD ERP — Hệ thống Thông tin Quản lý',
  description: 'Demo ERP cho Tập đoàn RTD Việt Nam — Phase 1: Quản trị & Tài chính',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
