# RTD ERP — Hồ sơ Dự án

> Tài liệu trình bày 1 trang để đưa lãnh đạo & đối tác đầu tư đọc trong 5 phút trước khi xem demo.

---

## 1. Câu chuyện

**Tập đoàn RTD Việt Nam** — 25 năm trong ngành nông nghiệp, mô hình **3F (Feed–Farm–Food)**. Hiện tại đang vận hành 5 công ty con, các nhà máy TACN và trang trại lợn bằng phần mềm rời rạc + Excel.

**Vấn đề**:
- Số liệu giữa các công ty con không reconcile được tự động.
- Mua nguyên liệu → sản xuất → cấp cám trại → bán hàng — mỗi khúc 1 hệ thống khác.
- SAP/Oracle chi phí license + triển khai 12–18 tháng + phụ thuộc nhà cung cấp nước ngoài.

**Đề xuất**: tự xây ERP "made-in-RTD" — tự chủ codebase, tối ưu cho mô hình 3F nông nghiệp Việt Nam, deploy nội bộ.

## 2. Phạm vi 2 phase

| | Phase 1 (đang demo) | Phase 2 (roadmap) |
|--|---------------------|-------------------|
| **Cấu phần** | Quản trị + Tài chính – Kế toán | Procurement → Manufacturing → Inventory → Farm → Sales |
| **Số bảng DB** | 16 bảng (master_data + financial + events) | +30 bảng (đã thiết kế sẵn trong schema) |
| **Số màn hình** | 18 page đang chạy | ~40 page dự kiến |
| **Mục tiêu** | Nền tảng RBAC + sổ kế toán đúng chuẩn VAS | Khép kín end-to-end 3F + tích hợp Computer Vision |

## 3. Cấu phần Phase 1

### 🛡️ Quản trị (8 màn hình)
- **Cơ cấu tổ chức** Tập đoàn → Công ty → Chi nhánh, validate cấp bậc tự động
- **Người dùng + RBAC**: ma trận role × permission, hỗ trợ 5+ vai trò tùy chỉnh
- **Đối tác**: NCC + Khách hàng + Ngân hàng, công nợ realtime
- **Phê duyệt đa cấp**: workflow 1–N bước với timeline trực quan
- **Audit log**: ai làm gì, khi nào — không thể xóa
- **Cấu hình hệ thống**: 14 tham số × 5 nhóm (kế toán, bảo mật, i18n, email…)

### 💰 Tài chính – Kế toán (8 màn hình)
- **Hệ thống tài khoản TT200 rút gọn** (24 TK, có thể mở rộng)
- **Sổ nhật ký**: bút toán multi-line với check cân đối Nợ = Có **realtime**
- **Hóa đơn AR/AP**: theo dõi công nợ, tuổi nợ tự tính
- **Phiếu thu/chi**: cấn trừ với hóa đơn nguồn
- **Cost center + Ngân sách**: kế hoạch vs thực tế, cảnh báo vượt
- **Báo cáo**: Bảng cân đối kế toán + Kết quả kinh doanh, xuất PDF

## 4. Kiến trúc kỹ thuật

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend                                                   │
│  Next.js 14 + Tailwind + TanStack Query + Zustand          │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST + WebSocket
┌──────────────────────▼──────────────────────────────────────┐
│  Backend (NestJS)                                           │
│  ┌──────┐  ┌─────────┐  ┌──────────┐  ┌──────────────┐    │
│  │ Auth │  │ Master  │  │ Financial│  │ Modules ...  │    │
│  │ JWT  │  │ Data    │  │ Module   │  │ (Phase 2)    │    │
│  │ RBAC │  │         │  │          │  │              │    │
│  └──────┘  └─────────┘  └──────────┘  └──────────────┘    │
└──────────┬───────────────────────────────────┬──────────────┘
           │                                    │
       ┌───▼────┐                          ┌───▼────────────┐
       │ Postgres│                         │ Redis           │
       │  16     │  (8 schema theo BC)     │  cache+stream   │
       └────────┘                          └────────────────┘
```

| Layer | Stack | Lý do chọn |
|-------|-------|------------|
| Backend | Node 20 + NestJS + TypeScript strict | Pattern enterprise (Module/DI), team Vietnam dễ tuyển |
| ORM | Prisma | Type-safe, migration đơn giản, multi-schema |
| Database | Postgres 16 | Mạnh, free, 8 schema theo bounded context |
| Frontend | Next.js 14 + Tailwind | SSR, performance, designer-friendly |
| Event bus | Redis Streams | Nhẹ cho phase 1, swap Kafka khi cần |
| DevOps | Docker Compose | Một lệnh `up` chạy đủ stack |

## 5. Số liệu thực thi

| | Số lượng |
|--|---------|
| File source code (FE+BE) | ~80 file |
| Dòng code TypeScript | ~7,500 LOC |
| Số bảng database | 64 bảng (16 dùng + 48 sẵn cho phase 2) |
| Test coverage domain logic | 100% pilot module (10/10 tests pass) |
| Số màn hình tương tác | **18 page** + 6 modal + 4 drawer |
| Thời gian build | ~7 ngày dev (1 senior) |

## 6. Demo flow (15 phút)

1. **Đăng nhập** với gradient brand RTD (1ph)
2. **Trang chủ**: KPI cards + biểu đồ doanh thu/chi phí 6 tháng + pie cơ cấu doanh thu (1ph)
3. **Cơ cấu tổ chức**: Add 1 chi nhánh mới, drawer chi tiết (2ph)
4. **Phê duyệt**: Duyệt 1 hóa đơn 215 triệu với timeline 3 bước (2ph)
5. **Sổ nhật ký**: Tạo bút toán multi-line, check cân đối realtime (3ph)
6. **Báo cáo tài chính**: BS + IS, in PDF tại chỗ (2ph)
7. **Phân quyền**: matrix role × permission cho ACCOUNTANT (2ph)
8. **AI Assistant**: hỏi "tổng nợ đại lý nhiều nhất?" → AI trả lời từ data (2ph)

Có nút **"Bắt đầu tour"** ở banner đầu trang — react-joyride sẽ tự dẫn dắt.

## 7. Roadmap Phase 2 (đề xuất 12 tháng)

| Quý | Module | Output |
|-----|--------|--------|
| Q3/2026 | Procurement + Inventory | PO → GRN → kho nguyên liệu, tự động tạo bút toán |
| Q4/2026 | Manufacturing | BOM TACN, lệnh sản xuất, QC, tự động xuất kho NL + nhập kho TP |
| Q1/2027 | Farm Management | Đàn lợn cohort, FCR, ADG, **integrate Computer Vision** alerts |
| Q2/2027 | Sales + Phase 1 polish | Đơn bán → giao hàng → hóa đơn → thu tiền, mobile app cho NV |

## 8. Investment ask

*(Để team RTD điền — phụ thuộc phạm vi cuối)*

- Phase 2 development: __ tháng × __ developer = __
- Hạ tầng cloud / on-prem: __
- Tích hợp CV system: __

## 9. Kết luận

✅ **Phase 1 chứng minh được**: team có khả năng tự chủ kỹ thuật + nắm chắc nghiệp vụ kế toán Việt Nam + UI ngang tầm SaaS quốc tế.

✅ **Schema 60 bảng** đã sẵn sàng cho phase 2 — không phải làm lại từ đầu.

✅ **Stack mở** — không vendor lock-in, hosted on-prem RTD nếu muốn.

📞 **Bước kế**: ban lãnh đạo RTD cấp ngân sách phase 2 → triển khai theo roadmap quý.
