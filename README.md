# RTD ERP — Demo Phase 1

Demo Hệ thống Thông tin Quản lý cho **Tập đoàn RTD Việt Nam** (mô hình 3F: Feed–Farm–Food).

## 🎬 Demo trực tuyến

**👉 [https://nguyenhuuthuat.github.io/rtd_erp_demo/](https://nguyenhuuthuat.github.io/rtd_erp_demo/)**

Đăng nhập:
- Email: `admin@rtd.local` (hoặc bất kỳ)
- Mật khẩu: `RtdAdmin@2026`

## 📋 Phạm vi Phase 1

| Cấu phần | Màn hình |
|----------|----------|
| **Quản trị** | Cơ cấu tổ chức · Người dùng · Vai trò & Phân quyền · Đối tác · Phê duyệt · Audit log · Cài đặt |
| **Tài chính – Kế toán** | Hệ thống tài khoản (TT200) · Sổ nhật ký · Hóa đơn · Phiếu thu/chi · Trung tâm chi phí · Ngân sách · Báo cáo |

## 🛠️ Cấu trúc

File **`index.html`** duy nhất chứa toàn bộ demo:
- React 18 + Tailwind CSS qua CDN
- 16 màn hình tương tác đầy đủ
- Mock data inline — không cần backend, không cần build
- Mở trực tiếp `index.html` bằng browser hoặc deploy lên bất cứ static host nào

## ✨ Tính năng nổi bật

- 🏢 **Cơ cấu tổ chức** Tập đoàn → Cty → Chi nhánh với modal thêm + drawer chi tiết
- 🛡️ **RBAC matrix** role × permission, 5 vai trò × 24 quyền
- ✅ **Phê duyệt đa cấp** với timeline 1-3 bước, drawer Duyệt/Từ chối + comment
- 📒 **Sổ nhật ký** multi-line form, **kiểm tra cân đối Nợ = Có realtime**
- 📊 **Dashboard** với Area chart 6 tháng + Pie chart cơ cấu doanh thu
- 📑 **Báo cáo TC** chuẩn TT200 (BS + IS), in PDF qua `window.print()`
- 🤖 **AI Assistant** (template) trả lời câu hỏi về dữ liệu

## 📞 Liên hệ

Mọi câu hỏi về demo, kiến trúc, hoặc roadmap Phase 2 — liên hệ team phát triển dự án.
