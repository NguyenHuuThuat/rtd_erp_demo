'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useTourStore } from '@/lib/tour-store';
import type { CallBackProps, Step } from 'react-joyride';

// Joyride uses window — load client-side only
const Joyride = dynamic(() => import('react-joyride'), { ssr: false });

const STEPS: Array<Step & { goTo?: string }> = [
  {
    target: 'body',
    placement: 'center',
    title: '👋 Chào mừng đến RTD ERP Demo',
    content:
      'Tour này sẽ dẫn bạn qua 8 màn hình chính trong khoảng 2 phút. Bạn có thể bỏ qua bất cứ lúc nào.',
    disableBeacon: true,
    goTo: '/dashboard',
  },
  {
    target: '[data-tour="kpi-grid"]',
    title: '📊 Trang chủ — KPI tổng quan',
    content:
      'Xem nhanh số liệu Quản trị + Tài chính của toàn tập đoàn. Nhấn vào card bất kỳ để xem chi tiết.',
  },
  {
    target: '[data-tour="charts"]',
    title: '📈 Biểu đồ doanh thu/chi phí',
    content: 'Area chart 6 tháng + pie chart cơ cấu doanh thu theo công ty con — số liệu lũy kế.',
  },
  {
    target: 'body',
    placement: 'center',
    title: '🏢 Cơ cấu tổ chức',
    content: 'Tiếp theo: cây tổ chức Tập đoàn → 5 Cty con → các chi nhánh.',
    goTo: '/admin/organizations',
  },
  {
    target: '[data-tour="org-tree"]',
    title: 'Cây tổ chức 3 cấp',
    content:
      'Click vào tên đơn vị để xem detail (drawer phải). Nút "Thêm đơn vị" mở form modal có validate cấp bậc.',
  },
  {
    target: 'body',
    placement: 'center',
    title: '✅ Phê duyệt đa cấp',
    content: 'Approval workflow — quy trình phê duyệt nhiều bước cho hóa đơn, PO, ngân sách.',
    goTo: '/admin/approvals',
  },
  {
    target: '[data-tour="approval-list"]',
    title: 'Hộp duyệt với timeline',
    content: 'Click 1 yêu cầu → drawer hiện lộ trình duyệt 3 bước, nhập comment, Duyệt/Từ chối.',
  },
  {
    target: 'body',
    placement: 'center',
    title: '📒 Sổ nhật ký kế toán',
    content: 'Tài chính: bút toán theo TT200 với check cân đối Nợ = Có tự động.',
    goTo: '/financial/journals',
  },
  {
    target: '[data-tour="journal-create"]',
    title: 'Tạo bút toán multi-line',
    content:
      'Click "Tạo bút toán" → form nhập nhiều dòng, chọn TK từ TT200, hệ thống tự kiểm tra cân đối realtime.',
  },
  {
    target: 'body',
    placement: 'center',
    title: '📑 Báo cáo tài chính',
    content: 'Bảng cân đối kế toán + Kết quả kinh doanh chuẩn TT200, xuất PDF được.',
    goTo: '/financial/reports',
  },
  {
    target: 'body',
    placement: 'center',
    title: '🤖 AI Assistant',
    content:
      'Góc dưới phải có chat widget — hỏi câu hỏi về dữ liệu bằng tiếng Việt. Phase tới sẽ tích hợp Claude API thật.',
  },
  {
    target: 'body',
    placement: 'center',
    title: '🎉 Hoàn thành tour',
    content:
      'Đó là Phase 1. Phase 2 (Procurement → Manufacturing → Inventory → Farm → Sales) — schema đã sẵn 60 bảng.',
  },
];

export function TourGuide() {
  const running = useTourStore((s) => s.running);
  const stop = useTourStore((s) => s.stop);
  const pathname = usePathname();
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || !running || pathname === '/login') return null;

  function handleCallback(data: CallBackProps) {
    const { action, index, status, type } = data;
    if (status === 'finished' || status === 'skipped') {
      stop();
      setStepIndex(0);
      return;
    }
    if (type === 'step:after' || type === 'error:target_not_found') {
      const next = action === 'prev' ? index - 1 : index + 1;
      const step = STEPS[next];
      if (step?.goTo) router.push(step.goTo);
      setStepIndex(next);
    }
  }

  return (
    <Joyride
      steps={STEPS}
      stepIndex={stepIndex}
      run={running}
      continuous
      showSkipButton
      showProgress
      disableOverlayClose
      callback={handleCallback}
      styles={{
        options: {
          primaryColor: '#16a34a',
          zIndex: 10_000,
        },
        tooltip: { borderRadius: 12, padding: 18 },
        tooltipTitle: { fontSize: 16, fontWeight: 600, marginBottom: 6 },
        tooltipContent: { fontSize: 14, padding: 0 },
        buttonNext: { backgroundColor: '#16a34a', borderRadius: 8, padding: '8px 14px' },
        buttonBack: { color: '#64748b' },
        buttonSkip: { color: '#94a3b8' },
      }}
      locale={{
        back: 'Trở lại',
        close: 'Đóng',
        last: 'Hoàn thành',
        next: 'Tiếp →',
        skip: 'Bỏ qua',
        open: 'Mở',
      }}
    />
  );
}
