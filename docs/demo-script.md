# Kịch bản demo 15 phút cho đối tác

> File này dùng cho người trình bày demo. Mở browser http://localhost:3000 trước.

## Chuẩn bị 30 giây trước demo

- Login sẵn với `admin@rtd.local` / `RtdAdmin@2026`
- Mở trang `/dashboard`
- Mở thêm 1 tab `/financial/reports` (sẵn để show PDF)
- Phóng to trình duyệt 110%
- Đóng các tab khác để khán giả không bị phân tâm

---

## 0. Mở đầu (30 giây)

> "Hôm nay tôi xin trình bày demo Phase 1 của hệ thống ERP tự xây cho Tập đoàn RTD. Phase 1 cover 2 cấu phần nền tảng: **Quản trị** và **Tài chính – Kế toán**. Phase 2 sẽ mở rộng sang Procurement → Manufacturing → Trại lợn → Bán hàng — toàn bộ chuỗi 3F."

Click nút **"▶ Bắt đầu tour"** ở banner xanh trên cùng — để khán giả thấy hệ thống có hướng dẫn tích hợp. Sau đó skip tour, đi theo flow thủ công bên dưới.

---

## 1. Trang chủ — KPI tổng quan (1 phút)

**URL**: `/dashboard`

**Điểm nhấn**:
- 8 KPI cards (4 Quản trị + 4 Tài chính) phản ánh tình trạng tập đoàn
- Area chart 6 tháng cho thấy doanh thu/chi phí/lợi nhuận gộp
- Pie chart cơ cấu doanh thu — RTD Feed chiếm ~60%
- Phê duyệt chờ + Hoạt động gần đây

**Câu nói**:
> "Một dashboard, nhìn được toàn tập đoàn. Số liệu lấy từ sổ kế toán thật, không phải nhập tay vào Excel."

---

## 2. Cơ cấu tổ chức (2 phút)

**URL**: `/admin/organizations`

**Demo**:
1. Show cây Tập đoàn → 5 cty con → 4 chi nhánh
2. Click **"Thêm đơn vị"** → chọn loại "Chi nhánh", parent = "RTD Feed", code "FEED-BR-DN"
3. Submit → toast xanh "Đã tạo" → cây tự cập nhật
4. Click vào tên đơn vị bất kỳ → drawer phải hiện chi tiết với 6 trường info

**Câu nói**:
> "Mọi đơn vị đều phân cấp 3 tầng — hệ thống tự kiểm tra: Chi nhánh chỉ trực thuộc Công ty, không thể tạo Công ty trực thuộc Chi nhánh."

---

## 3. Phân quyền RBAC (1 phút)

**URL**: `/admin/roles`

**Demo**:
- Click role **ACCOUNTANT** ở danh sách bên trái
- Bên phải hiện ma trận: TK kế toán có quyền write, master_data chỉ có quyền read

**Câu nói**:
> "Phân quyền theo nguyên tắc least-privilege. Kế toán không sửa được tổ chức, người xem không sửa được sổ. Tất cả lưu vết trong Audit log."

---

## 4. Phê duyệt đa cấp (2 phút)

**URL**: `/admin/approvals`

**Demo**:
1. Click yêu cầu **AR-2026-05-008** — Mua 50 tấn ngô vàng 1.2 tỷ
2. Drawer phải mở → timeline 3 bước: TP Mua → KT trưởng → TGĐ
3. Bước 1 (TP Mua) đã APPROVED, bước 2 (KT trưởng) đang chờ
4. Nhập comment "OK theo kế hoạch sản xuất" → click **"Duyệt"**
5. Toast "Đã duyệt AR-2026-05-008"

**Câu nói**:
> "Workflow phê duyệt config được — mỗi loại document có flow riêng (PO > 500tr cần 3 cấp, hóa đơn > 200tr cần 2 cấp). SLA + escalation tự động."

---

## 5. Sổ nhật ký kế toán (3 phút) — *điểm mạnh nhất*

**URL**: `/financial/journals`

**Demo**:
1. Show 10 bút toán đã có, footer "Tổng nợ = Tổng có ✓ Cân đối"
2. Click **"Tạo bút toán"** → modal mở
3. Diễn giải: "Mua máy in văn phòng"
4. Dòng 1: TK 642 (CP quản lý), Nợ = 5,000,000
5. Dòng 2: TK 111 (Tiền mặt), Có = 5,000,000
6. **Chỉ vào dòng "✓ Cân đối: Nợ = Có = 5,000,000 ₫"** (màu xanh, realtime)
7. Thử đổi Nợ thành 6,000,000 → ngay lập tức chuyển thành "⚠ Chênh lệch: 1,000,000 ₫"
8. Sửa lại = 5,000,000 → click "Lưu nháp" → toast + bút toán xuất hiện đầu danh sách

**Câu nói**:
> "Đây là điểm mà Excel không làm được. Mỗi bút toán bắt buộc cân đối — nguyên tắc kế toán kép theo đúng chuẩn TT200. Không có chuyện 'sót dòng' hay 'sai số' lớp lang."

---

## 6. Báo cáo tài chính (2 phút)

**URL**: `/financial/reports`

**Demo**:
1. Show 2 bảng song song: Bảng cân đối kế toán + Kết quả kinh doanh
2. Số liệu **lấy từ sổ kế toán**, không nhập tay
3. Click **"In / Xuất PDF"** → trình duyệt mở hộp thoại in → chọn "Lưu thành PDF"
4. **Header in tự thêm tên tập đoàn + ngày in**

**Câu nói**:
> "Báo cáo tự sinh, đúng chuẩn TT200. Lợi nhuận sau thuế lũy kế 5 tháng: **1.88 tỷ**. Cần báo cáo theo công ty con? Chỉ cần thêm filter — schema đã có cột companyId."

---

## 7. Ngân sách Plan vs Actual (1 phút)

**URL**: `/financial/budgets`

**Demo**:
1. Toggle Q1 → Q2/2026
2. Show bảng so sánh kế hoạch vs thực tế cho 7 dòng (3 cost center)
3. Switch sang view "Biểu đồ" — cột vượt ngân sách màu đỏ tự động

**Câu nói**:
> "Ngân sách đa chiều: theo tài khoản × cost center × tháng. Vượt 5% → cảnh báo. Vượt 10% → escalate lên TGĐ."

---

## 8. AI Assistant (1.5 phút) — *điểm "wow"*

**Click icon ✨ góc dưới phải** mọi trang.

**Demo**:
- Hỏi: **"Tổng doanh thu tháng này?"**
- AI trả lời: doanh thu T5 + cơ cấu theo cty con
- Hỏi: **"Có hóa đơn nào quá hạn?"**
- AI trả lời: top 3 đại lý nợ nhiều, tổng dư nợ
- Hỏi: **"Ai đang chờ duyệt?"**
- AI liệt kê 3 yêu cầu pending

**Câu nói**:
> "Hiện đang dùng template demo. Phase 2 sẽ tích hợp **Claude API** — hỏi tự nhiên bằng tiếng Việt, AI trả lời từ data thực tế. Đây là roadmap cạnh tranh trực tiếp với báo cáo BI 'kéo thả' của SAP — nhưng linh hoạt và rẻ hơn 10 lần."

---

## 9. Kết bài (30 giây)

> "Đó là Phase 1 — 18 màn hình tương tác đầy đủ, build trong 7 ngày. Phase 2 (Procurement → Sản xuất → Trại → Bán hàng) là 12 tháng tiếp theo — schema và pattern đã sẵn 100%. Khi RTD bật đầu tư, chúng tôi triển khai theo quý."

> "Câu hỏi của các anh chị?"

---

## Câu hỏi thường gặp + cách trả lời

**"Code này khác gì SAP/Oracle?"**
> Hệ thống thiết kế cho mô hình 3F nông nghiệp Việt Nam, chuẩn VAS, ngôn ngữ Việt. SAP cấu hình mất 12-18 tháng + license cao. Tự xây mất chi phí dev nhưng team chủ động hoàn toàn.

**"Bao giờ Phase 2 xong?"**
> 12 tháng theo roadmap — schema và pattern đã sẵn nên rủi ro công nghệ thấp. Rủi ro chính là phối hợp nghiệp vụ với các phòng ban (mua hàng, sản xuất, trại) để chuẩn hóa quy trình.

**"Làm sao tích hợp với hệ thống Computer Vision của RTD?"**
> Schema có sẵn bảng `cv_alerts` với fields: cameraId, alertType, severity, confidence. Phase 2 sẽ expose webhook nhận event và đẩy realtime ra UI qua WebSocket.

**"Demo có dữ liệu thật không?"**
> Hiện là dữ liệu giả lập 6 tháng. Khi backend kết nối DB thật, swap 1 dòng env (`USE_MOCK=false`) là chạy với data thật ngay.

**"Bao nhiêu user dùng được đồng thời?"**
> Phase 1 này test ổn với 50 concurrent user trên 1 server 4-core/8GB. Scale ngang được vì stateless + JWT.
