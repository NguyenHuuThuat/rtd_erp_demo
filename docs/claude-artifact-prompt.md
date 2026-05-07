# Prompt copy lên Claude.ai để build Artifact host trực tiếp

## Cách dùng

1. Mở **claude.ai** (web)
2. Tạo chat mới
3. Copy **toàn bộ phần "PROMPT" bên dưới** rồi paste vào ô chat
4. Đợi Claude build artifact (~30-60 giây)
5. Click nút **"Publish"** ở góc trên artifact → nhận URL share (vd `claude.ai/public/artifacts/abc123…`)
6. Gửi URL đó cho đối tác

## Mẹo hậu kỳ

- Nếu artifact bị cắt ngắn: chat tiếp `"tiếp tục từ chỗ vừa cắt"` hoặc `"hoàn thiện trang còn thiếu"`
- Muốn thêm trang? Chat: `"thêm trang Quản lý Đối tác với 5 NCC + 5 KH, có filter theo loại"`
- Đổi màu/text? Chat: `"đổi tagline thành X"`, `"bớt buzzword 'AI roadmap' đi"`
- Nếu artifact lỗi runtime: chat `"page X bị lỗi Y, fix giúp"`

---

# === PROMPT (copy từ đây xuống) ===

Tạo cho tôi một **single-file React Artifact** demo hệ thống ERP cho **Tập đoàn RTD Việt Nam** (doanh nghiệp 25 năm ngành nông nghiệp, mô hình 3F: Feed-Farm-Food). Đây là Phase 1, cover 2 cấu phần: **Quản trị** và **Tài chính – Kế toán**. Demo sẽ host trên Claude artifact để đi thuyết trình với ban lãnh đạo + đối tác đầu tư.

## Yêu cầu kỹ thuật

- **1 file React component duy nhất** (default export), không dùng Next.js / React Router
- Dùng **Tailwind CSS** classes trực tiếp (không custom CSS file)
- Imports chỉ từ: `react`, `lucide-react` (icons), `recharts` (charts)
- Toàn bộ điều hướng giữa trang qua **internal state** (`currentPage`), không URL routing
- Toàn bộ dữ liệu **mock inline** — không gọi API ngoài
- **Tiếng Việt** toàn bộ UI
- Color theme: **xanh emerald/green nông nghiệp** (Tailwind `emerald-*` hoặc `green-*`)
- Visual: dày dặn như enterprise SaaS (cards với border, shadow nhẹ, generous padding)
- Format số tiền VND: `1.234.567 ₫` (dùng `Intl.NumberFormat('vi-VN')`)
- Số liệu cột bảng: `tabular-nums`

## Layout chung (mọi trang sau khi login)

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Banner xanh] 🟢 Demo Phase 1 — RTD ERP · 18 màn hình       [✕]    │
├──────────┬──────────────────────────────────────────────────────────┤
│          │  [🔍 Search...    ⌘K]    [🔔3]  [Avatar Quản trị viên ▾] │
│ Sidebar  ├──────────────────────────────────────────────────────────┤
│  • Trang │                                                          │
│   chủ    │   <main content>                                         │
│          │                                                          │
│  Quản    │                                                          │
│  trị     │                                                          │
│  • Tổ chức│                                                         │
│  • Users │                                                          │
│  • Phê duyệt [3]                                                    │
│  • Audit │                                                          │
│  • Cài đặt│                                                         │
│          │                                                          │
│  Tài chính│                                                         │
│  • Tổng quan│                                                       │
│  • Sổ NK │                                                          │
│  • Hóa đơn│                                                         │
│  • Báo cáo│                                                         │
│          │                                                          │
└──────────┴──────────────────────────────────────────────────────────┘
                                                          [✨ AI chat]
```

- **Sidebar 240px**, fixed bên trái, có 2 nhóm collapsible
- **Topbar 56px**, fixed top, có search + notification dropdown + profile dropdown
- **Demo banner** trên cùng (gradient xanh): "🟢 Demo Phase 1 — RTD ERP · 18 màn hình · Quản trị + Tài chính – Kế toán" có nút "▶ Bắt đầu tour" + nút đóng
- **AI Assistant** floating button góc dưới phải, click mở chat panel

## 8 trang cần build

### 1. Login
- Background gradient `from-emerald-50 to-emerald-100`
- Logo RTD (icon `Leaf` màu xanh trong vòng tròn) + chữ "RTD ERP"
- Form: email + password
- Nút "Đăng nhập" màu emerald, có loading spinner
- Hint: "Demo: dùng `admin@rtd.local` / `RtdAdmin@2026` (hoặc bất kỳ)"
- Submit → 400ms delay → redirect dashboard
- **Auth mock**: bất kỳ email + password = "RtdAdmin@2026" đều pass (lưu state `isAuthenticated`)

### 2. Trang chủ (Dashboard)
- Header: "Xin chào, Quản trị viên!" + ngày hôm nay + badge xanh "Hệ thống hoạt động bình thường"
- 4 Quick Action cards (icon gradient): Tổ chức / Phê duyệt (3) / Bút toán mới / Báo cáo TC
- Section **"Quản trị"**: 4 KPI cards
  - Tổ chức: 10 (1 Tập đoàn + 5 Cty + 4 CN)
  - Người dùng: 8 (7 đang hoạt động) — trend +8.3%
  - Vai trò: 5 (2 hệ thống + 3 tùy chỉnh)
  - Phê duyệt chờ: 3 — tổng 14.4 tỷ
- Section **"Tài chính"**: 4 KPI cards
  - Doanh thu T5: 2.535 tỷ — trend +9.3%
  - Chi phí T5: 1.950 tỷ — trend +7.7% (negative)
  - Phải thu (AR): 1.955 tỷ — "3 hóa đơn quá hạn"
  - Phải trả (AP): 320 triệu — "2 NCC tới hạn 7 ngày"
- **Area chart** (Recharts) — 6 tháng trend Doanh thu / Chi phí / LN gộp với gradient fill
- **Pie chart** — cơ cấu doanh thu theo 5 cty con: RTD Feed (7.8 tỷ), RTD Farm (3.2 tỷ), RTD Food (1.5 tỷ), RTD Vet (0.42 tỷ), RTD Logistics (0.18 tỷ)
- 2 cột grid bên dưới: "Phê duyệt đang chờ" (4 yêu cầu) + "Hoạt động gần đây" (5 audit log)

### 3. Cơ cấu tổ chức
- Title + nút "Thêm đơn vị" emerald
- 4 stat pills: Tập đoàn (1) / Công ty (5) / Chi nhánh (4) / Đang hoạt động (10)
- **Cây tổ chức 3 cấp** với expand/collapse:
  - RTD (Tập đoàn, MST 0100000000, HN)
    - RTD-FEED (Cty, MST 0100000001, Hà Nam)
      - FEED-BR-HN (Chi nhánh, HN)
      - FEED-BR-HCM (Chi nhánh, HCM)
    - RTD-FARM (Cty, MST 0100000002, Hưng Yên)
      - FARM-TN (Chi nhánh, Thái Nguyên)
      - FARM-BG (Chi nhánh, Bắc Giang)
    - RTD-FOOD (Cty, MST 0100000003, HN)
    - RTD-VET (Cty, MST 0100000004, HN)
    - RTD-LOG (Cty, MST 0100000005, Hải Phòng)
- Mỗi node: icon Building, code, badge type (Tập đoàn xanh / Công ty xanh dương / Chi nhánh xám), MST, tỉnh
- Click node → **drawer phải** mở hiển thị chi tiết: 6 trường info + danh sách đơn vị con + nút "Chỉnh sửa" / "Xóa"
- Click "Thêm đơn vị" → **modal** hiện form: code (validate `[A-Z0-9_-]+`), tên, type (Tập đoàn/Cty/CN), parent (chỉ hiện parent hợp lệ theo type), MST, tỉnh
- Submit → toast xanh "Đã tạo đơn vị" → cây cập nhật ngay

### 4. Người dùng
- Title + nút "Import CSV" / "Thêm người dùng"
- Toolbar: search, filter theo đơn vị, filter theo role, toggle Tất cả/Hoạt động/Tạm khóa
- Bảng 8 user (Họ tên / Email / SĐT / Đơn vị / Vai trò badges / Đăng nhập gần nhất / Trạng thái):
  1. Quản trị hệ thống · admin@rtd.local · 0901234567 · Tập đoàn RTD · [SUPER_ADMIN] · vừa xong · ✓
  2. Nguyễn Văn An · gd.feed@rtd.vn · 0911000001 · RTD Feed · [ADMIN] · 06/05 08:30 · ✓
  3. Trần Thị Bình · gd.farm@rtd.vn · 0911000002 · RTD Farm · [ADMIN] · 07/05 07:15 · ✓
  4. Phạm Quốc Cường · kt.tonghop@rtd.vn · 0911000003 · Tập đoàn RTD · [ADMIN] · 07/05 09:00 · ✓
  5. Lê Thị Dung · ke.toan1@rtd.vn · 0911000004 · RTD Feed · [VIEWER] · 06/05 16:45 · ✓
  6. Hoàng Minh Đức · ke.toan2@rtd.vn · 0911000005 · RTD Farm · [VIEWER] · — · ✓
  7. Vũ Thị Hà · qly.kho@rtd.vn · 0911000006 · RTD Logistics · [VIEWER] · 05/05 14:20 · ✓
  8. Đỗ Văn Khánh · mua.hang@rtd.vn · 0911000007 · Tập đoàn RTD · [VIEWER] · 12/04 10:00 · ✗ (tạm khóa)
- Role badges màu: SUPER_ADMIN đỏ / ADMIN xanh / VIEWER xám
- Click row → drawer phải hiển thị info + tab "Bảo mật" (MFA chưa bật, 0 lần login fail, 2 thiết bị)

### 5. Phê duyệt
- 3 KPI cards: Đang chờ (3) màu vàng / Đã duyệt 5 ngày (1) xanh / Bị từ chối (1) đỏ
- Tab filter: Đang chờ duyệt / Của tôi / Tất cả
- 5 yêu cầu phê duyệt mẫu:
  1. **AR-2026-05-008** — PURCHASE_ORDER · "Mua 50 tấn ngô vàng — Cargill VN" · **1.200.000.000 ₫** · YC: Đỗ Văn Khánh · 07/05 10:15 · Bước 2/3 chờ Phạm Quốc Cường (KT trưởng) · status PENDING
  2. **AR-2026-05-009** — INVOICE · "HĐ bán cám heo nái — ĐL Bắc Giang" · **215.000.000 ₫** · YC: Lê Thị Dung · 07/05 09:00 · Bước 1/2 · PENDING
  3. **AR-2026-05-007** — BUDGET · "Ngân sách Q2/2026 — RTD Feed" · **12.500.000.000 ₫** · YC: Nguyễn Văn An · 06/05 15:00 · Bước 1/1 · PENDING
  4. **AR-2026-05-006** — PURCHASE_ORDER · "Mua bao bì PP 25kg — An Phát" · **85.000.000 ₫** · APPROVED 05/05
  5. **AR-2026-05-005** — INVOICE · "HĐ mua khô đậu tương — Vinacam" · **920.000.000 ₫** · REJECTED 04/05 (lý do: giá cao)
- Click 1 yêu cầu → **drawer phải** hiển thị:
  - Số tiền lớn ở trên
  - Người yêu cầu (avatar + tên + email + thời gian)
  - **Timeline 3 bước** dạng vertical (icon vòng tròn nối với nhau): bước đã APPROVED ✓ xanh, bước đang chờ vàng có ring, bước chưa tới xám
  - Mỗi bước hiện comment nếu có
  - Nếu PENDING: footer có textarea comment + nút "Từ chối" (đỏ) / "Duyệt" (xanh)
  - Click Duyệt → toast "Đã duyệt AR-XXX" → đóng drawer

### 6. Sổ nhật ký ⭐
- Title "Sổ nhật ký" + subtitle "10 bút toán · Cân đối Nợ = Có" + nút "Tạo bút toán" emerald
- Toolbar: search, filter theo loại, tab Tất cả/Đã ghi sổ/Nháp
- Bảng 10 bút toán (Mã / Ngày / Diễn giải / Loại / Tổng nợ / Tổng có / Trạng thái):
  - JV-2026-04-001 · 02/04 · Mua nguyên liệu ngô vàng nhập kho NM Hà Nam · HĐ mua · 1.250.000.000 / 1.250.000.000 · Đã ghi sổ
  - JV-2026-04-002 · 03/04 · Bán cám heo thịt cho ĐL Sơn Hùng - HCM · HĐ bán · 480.000.000 / 480.000.000 · Đã ghi sổ
  - JV-2026-04-003 · 05/04 · Thu tiền ĐL Sơn Hùng · Phiếu thu · 480.000.000 / 480.000.000 · Đã ghi sổ
  - JV-2026-04-004 · 08/04 · Chi lương khối VP T4/2026 · Phiếu chi · 320.000.000 / 320.000.000 · Đã ghi sổ
  - JV-2026-04-005 · 10/04 · Mua bao bì nhập kho NM Bắc Ninh · HĐ mua · 85.000.000 / 85.000.000 · Đã ghi sổ
  - JV-2026-04-006 · 15/04 · Bán heo xuất chuồng - lô 24A trại TN · HĐ bán · 1.840.000.000 / 1.840.000.000 · Đã ghi sổ
  - JV-2026-04-007 · 18/04 · Khấu hao TSCĐ tháng 4 · Thủ công · 245.000.000 / 245.000.000 · Đã ghi sổ
  - JV-2026-05-001 · 02/05 · Mua khô đậu tương nhập kho NM Hà Nam · HĐ mua · 920.000.000 / 920.000.000 · Đã ghi sổ
  - JV-2026-05-002 · 04/05 · Bán cám heo nái cho ĐL Bắc Giang · HĐ bán · 215.000.000 / 215.000.000 · Đã ghi sổ
  - JV-2026-05-003 · 06/05 · Tạm ứng công tác phí GĐ NM Hà Nam · Phiếu chi · 12.000.000 / 12.000.000 · Nháp (vàng)
- Footer bảng: tổng cộng + "✓ Cân đối"

- Click "Tạo bút toán" → **modal lớn** với form:
  - Header: Ngày ghi sổ (date input) + Loại (select 5 option) + Mã (auto)
  - Diễn giải (text input)
  - Bảng nhập multi-line:
    - Cột: Tài khoản (select) / Diễn giải / Nợ / Có / [delete]
    - 2 dòng mặc định, có nút "+ Thêm dòng"
    - Khi nhập Nợ > 0 → tự clear Có cùng dòng (và ngược lại)
  - Tài khoản dropdown options (24 TK theo TT200 rút gọn):
    - 111 Tiền mặt / 112 TGNH / 131 Phải thu KH / 152 NVL / 155 Thành phẩm / 211 TSCĐ / 214 Hao mòn / 331 Phải trả NB / 334 Phải trả NLĐ / 411 Vốn góp / 421 LNST / 511 Doanh thu BH / 632 Giá vốn / 641 CP bán hàng / 642 CP QLDN / 821 Thuế TNDN
  - Footer bảng: hiện Tổng Nợ / Tổng Có
  - **DƯỚI bảng có dòng status**:
    - Nếu cân đối: badge xanh "✓ Cân đối: Nợ = Có = X ₫"
    - Nếu lệch: badge đỏ "⚠ Chênh lệch: X ₫ (Nợ > Có / Có > Nợ)"
  - Nút "Lưu nháp" disabled khi chưa cân hoặc tổng = 0
  - Submit → toast "Đã tạo bút toán JV-XXX" → đóng modal, bút toán mới hiển thị đầu danh sách (status Nháp vàng)

### 7. Báo cáo Tài chính
- Title + nút "Excel" + nút "In / Xuất PDF" (gọi `window.print()`)
- 2 bảng song song (grid 2 cột):

**Bảng cân đối kế toán** (tại 31/05/2026):
- TÀI SẢN
  - 111 Tiền mặt: 850.000.000
  - 112 TGNH: 4.200.000.000
  - 131 Phải thu KH: 1.955.000.000
  - 152 NVL: 2.340.000.000
  - 155 Thành phẩm: 1.120.000.000
  - 211 TSCĐ hữu hình: 18.500.000.000
  - 214 — Hao mòn TSCĐ: -3.245.000.000
  - **TỔNG: 25.720.000.000**
- NGUỒN VỐN
  - 331 Phải trả NB: 320.000.000
  - 334 Phải trả NLĐ: 285.000.000
  - 411 Vốn góp: 20.000.000.000
  - 421 LNST chưa phân phối: 5.115.000.000
  - **TỔNG: 25.720.000.000**

**Kết quả kinh doanh** (lũy kế 5 tháng):
- 511 Doanh thu BH: 13.135.000.000
- 632 Giá vốn HB: 9.280.000.000
- 521 **Lợi nhuận gộp: 3.855.000.000** (in đậm)
- 641 CP bán hàng: 580.000.000
- 642 CP QLDN: 920.000.000
- 600 **LN thuần HĐKD: 2.355.000.000** (in đậm)
- 821 Thuế TNDN (20%): 471.000.000
- 900 **Lợi nhuận sau thuế: 1.884.000.000** (in đậm + highlight nền xanh nhạt)

### 8. Cài đặt hệ thống
- Sidebar trái: 5 nhóm (Tổng quan / Kế toán / Bảo mật / i18n / Email) — click chọn nhóm
- Bên phải: list setting của nhóm đang chọn, mỗi setting có label, description, control (input/select/toggle)
- Setting mẫu cho nhóm "Kế toán":
  - Tháng bắt đầu năm tài chính: 1
  - Tiền tệ mặc định: VND (select VND/USD/EUR/CNY)
  - Thuế suất GTGT mặc định: 8%
  - Hạn thanh toán mặc định: 30 ngày
- Setting nhóm "Bảo mật":
  - Timeout phiên: 60 phút
  - Bật MFA: toggle (off mặc định)
  - Độ dài mật khẩu tối thiểu: 12
- Có nút "Lưu thay đổi" góc trên (chỉ hiện khi có thay đổi)
- Click lưu → toast "Đã lưu cấu hình"

## Tính năng tương tác xuyên suốt

### Toast notifications
Tự build component `Toast` đơn giản: floating top-right, success xanh / error đỏ / info xám, auto dismiss 3s. Hook `useToast()` provide method `success()`, `error()`, `info()`.

### Topbar dropdowns
- **Notifications bell**: badge số chưa đọc (3), click mở dropdown 360px hiển thị 4 thông báo:
  - "Hóa đơn quá hạn" — INV-S-2026-04-013 quá hạn 3 ngày — 30p trước (warning)
  - "Yêu cầu phê duyệt mới" — PR-2026-05-012 (1.2 tỷ) — 2h trước (info)
  - "Backup hệ thống" — Backup hằng ngày hoàn tất 02:00 — 8h trước (success)
  - "Đăng nhập đáng ngờ" — IP lạ vào TK admin — 26h trước (warning, đã đọc)
  - Có nút "Đọc hết" → toast "Đã đánh dấu tất cả là đã đọc"
- **Profile avatar**: dropdown menu với:
  - Header: tên + email + badge "9 quyền · SUPER_ADMIN"
  - Items: Hồ sơ cá nhân / Cài đặt hệ thống / Phím tắt
  - Divider
  - Đăng xuất (đỏ) → reset state về login

### AI Assistant chat widget
- Floating button góc phải dưới (icon `Sparkles` gradient từ emerald-500 đến emerald-600), click toggle chat panel
- Panel 384px × 540px, header gradient nhạt, có status "● Sẵn sàng · Demo template"
- Tin nhắn đầu: greeting "Xin chào! Tôi là **RTD AI** — trợ lý dữ liệu. Hãy hỏi tôi về doanh thu, công nợ, phê duyệt, người dùng…"
- Phía dưới input: 5 chip gợi ý (Tổng doanh thu tháng này? / Có hóa đơn nào quá hạn? / Ai đang chờ duyệt? / Số dư tiền mặt? / Top 3 đại lý nợ nhiều?)
- Khi user gửi câu hỏi → loading 600ms → trả lời theo intent matching:
  - Match "doanh thu" → trả về số doanh thu T5/2026 + cơ cấu theo cty con
  - Match "quá hạn" / "công nợ" → liệt kê top 3 đại lý nợ + tổng dư nợ
  - Match "duyệt" → liệt kê 3 phê duyệt PENDING
  - Match "tiền mặt" / "số dư" → số dư TK 111 + 112
  - Match "lợi nhuận" → LNST 1.884 tỷ + breakdown
  - Default → "Mình chưa được train câu này. Thử hỏi: doanh thu / công nợ / duyệt / số dư"
- Format trả lời: support `**bold**` markdown lite (parse và render thành `<strong>`)
- Bubble user màu emerald-600, bubble assistant màu xám nhạt

### Search bar (Cmd+K hint)
Topbar có search input "Tìm tổ chức, người dùng, hóa đơn… (Ctrl+K)" với kbd hint. Click hoặc focus → toast "Tìm kiếm toàn cục — sắp ra mắt 🔍"

### Tour banner
Banner trên cùng có nút "▶ Bắt đầu tour" — click thì alert/toast "Tour interactive đang xây — phase tới sẽ có react-joyride" (vì artifact khó tích hợp lib này).

## Style guide

- Card: `bg-white rounded-xl border border-slate-200`, padding generous (p-5 hoặc p-6)
- Hover row: `hover:bg-slate-50 transition`
- Số tiền lớn: `tabular-nums font-semibold`
- Status badge: rounded, padding nhỏ, ring-1 ring-inset, có nhiều variant màu (success/warning/danger/info/primary/neutral)
- Empty state: icon xám trong vòng tròn + dòng "Không có dữ liệu" + dòng mô tả + CTA
- Chart palette: doanh thu emerald-500 (#16a34a), chi phí rose-500 (#f43f5e), lợi nhuận blue-500 (#3b82f6)
- Pie chart màu: emerald, blue, amber, violet, slate

## Mock data tổng hợp (paste vào đầu component)

```javascript
const ORGS = [
  { id:'org-rtd', code:'RTD', name:'Tập đoàn RTD Việt Nam', type:'GROUP', parentId:null, taxCode:'0100000000', province:'Hà Nội' },
  { id:'org-feed', code:'RTD-FEED', name:'Công ty TNHH RTD Feed', type:'COMPANY', parentId:'org-rtd', taxCode:'0100000001', province:'Hà Nam' },
  { id:'org-farm', code:'RTD-FARM', name:'Công ty TNHH RTD Farm', type:'COMPANY', parentId:'org-rtd', taxCode:'0100000002', province:'Hưng Yên' },
  { id:'org-food', code:'RTD-FOOD', name:'Công ty TNHH RTD Food', type:'COMPANY', parentId:'org-rtd', taxCode:'0100000003', province:'Hà Nội' },
  { id:'org-vet', code:'RTD-VET', name:'Công ty TNHH RTD Vet', type:'COMPANY', parentId:'org-rtd', taxCode:'0100000004', province:'Hà Nội' },
  { id:'org-log', code:'RTD-LOG', name:'Công ty TNHH RTD Logistics', type:'COMPANY', parentId:'org-rtd', taxCode:'0100000005', province:'Hải Phòng' },
  { id:'org-feed-hn', code:'FEED-BR-HN', name:'RTD Feed - Chi nhánh Hà Nội', type:'BRANCH', parentId:'org-feed', province:'Hà Nội' },
  { id:'org-feed-hcm', code:'FEED-BR-HCM', name:'RTD Feed - Chi nhánh TP.HCM', type:'BRANCH', parentId:'org-feed', province:'TP.HCM' },
  { id:'org-farm-tn', code:'FARM-TN', name:'RTD Farm - Trại Thái Nguyên', type:'BRANCH', parentId:'org-farm', province:'Thái Nguyên' },
  { id:'org-farm-bg', code:'FARM-BG', name:'RTD Farm - Trại Bắc Giang', type:'BRANCH', parentId:'org-farm', province:'Bắc Giang' },
];

const MONTHLY_TREND = [
  { month:'T12/25', revenue:1820, expense:1440 },
  { month:'T01/26', revenue:2100, expense:1680 },
  { month:'T02/26', revenue:1950, expense:1580 },
  { month:'T03/26', revenue:2410, expense:1890 },
  { month:'T04/26', revenue:2320, expense:1810 },
  { month:'T05/26', revenue:2535, expense:1950 },
]; // đơn vị: triệu

const COMPANY_REVENUE = [
  { name:'RTD Feed', value:7835, color:'#16a34a' },
  { name:'RTD Farm', value:3240, color:'#3b82f6' },
  { name:'RTD Food', value:1460, color:'#f59e0b' },
  { name:'RTD Vet', value:420, color:'#8b5cf6' },
  { name:'RTD Logistics', value:180, color:'#64748b' },
]; // triệu
```

## Bắt đầu build

Tạo artifact `RtdErp` với toàn bộ functionality trên. Code sạch, có comment Vietnamese cho phần business logic phức tạp (multi-line journal balance check, tree builder). Đảm bảo:
- Login đầu tiên hiện ra, login xong vào dashboard
- Sidebar điều hướng được giữa 8 trang
- Modal/Drawer mở/đóng OK với ESC + click outside
- Toast hoạt động
- AI chat reply đúng intent
- Print stylesheet — khi `window.print()` ẩn sidebar/topbar

Nếu code dài, cứ output đầy đủ — tôi sẽ hỏi tiếp nếu thiếu.

# === HẾT PROMPT (copy đến đây) ===

---

## Sau khi có artifact

### Publish + share
1. Click nút **"Publish"** ở góc trên artifact
2. Claude generate URL public dạng `claude.ai/public/artifacts/...`
3. Copy URL → gửi email/Zalo cho ban lãnh đạo + đối tác
4. URL chạy được trên mọi browser, không cần login Claude

### Iterate trong cùng chat
- `"Thêm trang Đối tác với 5 nhà cung cấp + 5 khách hàng"`
- `"Đổi màu emerald thành màu nâu đất nông nghiệp"`
- `"Bớt buzzword, chỉ giữ số liệu"`
- `"Thêm chart line cho LN gộp"`
- `"AI chat trả lời thêm 2 intent: nhân sự và kho"`
- `"Thêm logo placeholder hình con lợn vàng"`

### Backup nhiều artifact
Có thể tạo nhiều artifact với prompt khác nhau:
- 1 artifact "demo nhanh 3 phút" (login → 1-2 trang trọng tâm)
- 1 artifact "demo đầy đủ 15 phút" (8 trang)
- 1 artifact "chỉ Tài chính" (deep dive vào kế toán)

Mỗi artifact 1 URL khác — tùy đối tác mà gửi loại nào.

## Giới hạn cần biết của Claude Artifact

| Giới hạn | Thực tế |
|----------|---------|
| Single file | OK — gói gọn được trong 1 component |
| Không có DB | OK — mock data inline |
| Không có URL routing thật | Workaround bằng internal state (page tab) |
| Lib import | Chỉ một số: react, lucide-react, recharts, framer-motion, three.js | 
| react-joyride | **Không có sẵn** — phải tự build tour bằng overlay đơn giản |
| react-hot-toast | **Không có sẵn** — tự build toast component |
| File upload | Không support |
| API calls | Bị chặn ngoài fetch tới claude.ai |
| Persist data | localStorage works (qua reload), nhưng share URL cho người khác thì họ có state riêng |
| Code size | Khuyên ≤ 2500 dòng để stable |

→ Prompt này tôi đã viết để **tự build toast/modal/drawer**, không dùng lib ngoài, gọn trong giới hạn 2000-2500 dòng.
