'use client';

import { Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { useTourStore } from '@/lib/tour-store';

export function DemoBanner() {
  const [hidden, setHidden] = useState(false);
  const startTour = useTourStore((s) => s.start);

  if (hidden) return null;

  return (
    <div className="bg-gradient-to-r from-rtd-600 via-emerald-600 to-rtd-700 text-white text-sm">
      <div className="max-w-screen-2xl mx-auto px-6 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span className="font-medium hidden sm:inline">Demo Phase 1 — RTD ERP</span>
          <span className="opacity-90 truncate">
            Dữ liệu giả lập · 18 màn hình · Quản trị + Tài chính – Kế toán
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={startTour}
            className="hidden md:inline-flex items-center gap-1 text-xs font-medium bg-white/15 hover:bg-white/25 px-3 py-1 rounded-full transition"
          >
            ▶ Bắt đầu tour
          </button>
          <button onClick={() => setHidden(true)} className="opacity-80 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
