'use client';

import { FileDown, Printer } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageTitle } from '@/components/page-title';
import { formatVND } from '@/lib/utils';

const BS_DATA = [
  { section: 'TÀI SẢN', items: [
    { code: '111', name: 'Tiền mặt', amount: 850_000_000 },
    { code: '112', name: 'Tiền gửi ngân hàng', amount: 4_200_000_000 },
    { code: '131', name: 'Phải thu khách hàng', amount: 1_955_000_000 },
    { code: '152', name: 'Nguyên vật liệu', amount: 2_340_000_000 },
    { code: '155', name: 'Thành phẩm', amount: 1_120_000_000 },
    { code: '211', name: 'Tài sản cố định hữu hình', amount: 18_500_000_000 },
    { code: '214', name: '— Hao mòn TSCĐ', amount: -3_245_000_000 },
  ]},
  { section: 'NGUỒN VỐN', items: [
    { code: '331', name: 'Phải trả người bán', amount: 320_000_000 },
    { code: '334', name: 'Phải trả người lao động', amount: 285_000_000 },
    { code: '411', name: 'Vốn góp của chủ sở hữu', amount: 20_000_000_000 },
    { code: '421', name: 'Lợi nhuận sau thuế chưa phân phối', amount: 5_115_000_000 },
  ]},
];

const IS_DATA = [
  { code: '511', name: 'Doanh thu bán hàng', amount: 13_135_000_000 },
  { code: '632', name: 'Giá vốn hàng bán', amount: 9_280_000_000 },
  { code: '521', name: 'Lợi nhuận gộp', amount: 3_855_000_000, isBold: true },
  { code: '641', name: 'Chi phí bán hàng', amount: 580_000_000 },
  { code: '642', name: 'Chi phí quản lý DN', amount: 920_000_000 },
  { code: '600', name: 'Lợi nhuận thuần từ HĐKD', amount: 2_355_000_000, isBold: true },
  { code: '821', name: 'Chi phí thuế TNDN (20%)', amount: 471_000_000 },
  { code: '900', name: 'Lợi nhuận sau thuế', amount: 1_884_000_000, isBold: true, isHighlight: true },
];

export default function ReportsPage() {
  const totalAsset = BS_DATA[0].items.reduce((s, i) => s + i.amount, 0);
  const totalEquity = BS_DATA[1].items.reduce((s, i) => s + i.amount, 0);

  function handlePrint() {
    toast('Mở hộp thoại in — chọn "Lưu thành PDF"', { icon: '🖨️' });
    setTimeout(() => window.print(), 300);
  }

  return (
    <div>
      {/* Print-only header */}
      <div className="print-only mb-6">
        <h1 className="text-2xl font-bold">TẬP ĐOÀN RTD VIỆT NAM</h1>
        <div className="text-sm">Báo cáo tài chính · Lũy kế 5 tháng đầu năm 2026</div>
        <div className="text-xs text-slate-500 mt-1">In ngày: {new Date().toLocaleDateString('vi-VN')}</div>
      </div>

      <div className="no-print">
      <PageTitle
        title="Báo cáo Tài chính"
        subtitle="Bảng cân đối kế toán & Kết quả kinh doanh — Lũy kế 5 tháng đầu 2026"
        actions={
          <>
            <button onClick={() => toast('Xuất Excel — đang xây')} className="btn-secondary">
              <FileDown className="w-4 h-4" />
              Excel
            </button>
            <button onClick={handlePrint} className="btn-primary">
              <Printer className="w-4 h-4" />
              In / Xuất PDF
            </button>
          </>
        }
      />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bảng cân đối kế toán */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-semibold text-slate-800">Bảng cân đối kế toán</h3>
            <p className="text-xs text-slate-500 mt-0.5">Tại ngày 31/05/2026</p>
          </div>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              {BS_DATA.map((section) => (
                <>
                  <tr key={section.section} className="bg-slate-50">
                    <td colSpan={3} className="px-4 py-2 text-xs font-semibold text-slate-700 uppercase">
                      {section.section}
                    </td>
                  </tr>
                  {section.items.map((item) => (
                    <tr key={item.code}>
                      <td className="px-4 py-2 font-mono text-xs text-slate-500 w-12">{item.code}</td>
                      <td className="px-4 py-2 text-slate-700">{item.name}</td>
                      <td className="px-4 py-2 text-right tabular-nums text-slate-800">
                        {formatVND(item.amount)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-rtd-50 font-semibold">
                    <td className="px-4 py-2"></td>
                    <td className="px-4 py-2 text-rtd-800 text-xs uppercase">Tổng cộng</td>
                    <td className="px-4 py-2 text-right tabular-nums text-rtd-900">
                      {formatVND(section.section === 'TÀI SẢN' ? totalAsset : totalEquity)}
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* Kết quả kinh doanh */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-semibold text-slate-800">Kết quả kinh doanh</h3>
            <p className="text-xs text-slate-500 mt-0.5">Lũy kế từ 01/01 đến 31/05/2026</p>
          </div>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              {IS_DATA.map((row) => (
                <tr key={row.code} className={row.isHighlight ? 'bg-rtd-50' : ''}>
                  <td className="px-4 py-2 font-mono text-xs text-slate-500 w-12">{row.code}</td>
                  <td
                    className={`px-4 py-2 ${row.isBold ? 'font-semibold text-slate-900' : 'text-slate-700'}`}
                  >
                    {row.name}
                  </td>
                  <td
                    className={`px-4 py-2 text-right tabular-nums ${
                      row.isBold ? 'font-semibold text-slate-900' : 'text-slate-800'
                    } ${row.isHighlight ? 'text-rtd-700' : ''}`}
                  >
                    {formatVND(row.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
