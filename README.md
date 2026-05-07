# RTD ERP — Demo Hệ thống Thông tin Quản lý

> Demo hệ thống ERP cho **Tập đoàn RTD Việt Nam** ([rtd.vn](https://rtd.vn)) — doanh nghiệp 25 năm trong ngành nông nghiệp với mô hình **3F: Feed–Farm–Food**.
>
> Demo này chứng minh tính khả thi của một dự án ERP tự xây dựng. **Phase 1** triển khai 2 cấu phần nền tảng: **Quản trị** và **Tài chính – Kế toán**. **Phase 2** mở rộng end-to-end nghiệp vụ 3F (procurement, manufacturing, inventory, farm, sales) — schema đã sẵn cho phase 2.

## 📌 Tình trạng dự án (Phase 1)

Phase 1 triển khai 2 cấu phần nền tảng — theo lộ trình **6 bước**:

| Bước | Phạm vi | Trạng thái |
|------|---------|------------|
| 1 | Foundation: cấu trúc, docker, schema Prisma (đủ cho cả phase 1 + phase 2) | ✅ xong |
| 2 | Backend: auth + master-data + administration + financial | 🟢 **đang thực hiện** |
| 3 | Frontend shell: layout, login, dashboard "Quản trị" + "Tài chính" | ⚪ chờ |
| 4 | FE pages chi tiết cho 2 cấu phần | ⚪ chờ |
| 5 | Seed data 6 tháng (2 cấu phần) | ⚪ chờ |
| 6 | Polish: tour 2 cấu phần, PDF báo cáo tài chính, AI assistant | ⚪ chờ |

### Cấu phần Phase 1

**1. Quản trị**
- Cơ cấu tổ chức (Tập đoàn → Công ty → Chi nhánh)
- Quản lý người dùng + đăng nhập + refresh token
- Phân quyền RBAC (role × permission)
- Danh mục dùng chung (đối tác, sản phẩm, đơn vị tính, tỉnh thành)
- Quy trình phê duyệt đa cấp (approval workflow)
- Audit log (ai làm gì, khi nào)
- Cấu hình hệ thống (kỳ kế toán, tiền tệ, định dạng)

**2. Tài chính – Kế toán**
- Hệ thống tài khoản (TT200 rút gọn) + sổ nhật ký + sổ cái
- Hóa đơn bán/mua + theo dõi công nợ
- Phiếu thu/chi + đối chiếu
- Trung tâm chi phí
- Ngân sách năm × tài khoản × cost center × tháng
- Báo cáo tài chính: Bảng cân đối, KQKD, Lưu chuyển tiền tệ
- Aging AR/AP

### Phase 2 (roadmap, schema đã sẵn)

Procurement → Manufacturing → Inventory → Farm → Sales — sẽ kết nối ngược về Tài chính qua sổ nhật ký.

## 🛠️ Yêu cầu hệ thống

- **Docker Desktop** ≥ 24
- **Node.js** ≥ 20 LTS
- **pnpm** ≥ 9 (`npm install -g pnpm@9`)
- RAM khuyến nghị: ≥ 16GB

## 🚀 Khởi động nhanh

```bash
# 1. Clone & cài dependency
pnpm install

# 2. Chuẩn bị file env
cp .env.example .env
cp backend/.env.example backend/.env

# 3. Khởi động hạ tầng (Postgres, Redis, Adminer, MailHog)
pnpm infra:up

# 4. Tạo schema và migrate
pnpm db:migrate

# 5. (sẽ có ở Bước 5) Seed dữ liệu 6 tháng giả lập
pnpm db:seed

# 6. (sẽ có ở Bước 2-3) Chạy backend + frontend song song
pnpm dev
```

Sau khi chạy xong:

| Service | URL | Ghi chú |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Bước 3+ |
| Backend API | http://localhost:3001 | Bước 2+ |
| Swagger | http://localhost:3001/api/docs | Bước 2+ |
| Adminer (DB UI) | http://localhost:8080 | server: `postgres`, user: `rtd`, db: `rtd_erp` |
| MailHog UI | http://localhost:8025 | Xem email phát đi từ app |

## 🏗️ Kiến trúc

### Stack công nghệ

**Backend**
- Node.js 20 + NestJS 10 + TypeScript strict
- PostgreSQL 16 (multi-schema theo bounded context)
- Prisma 5 ORM
- Redis 7 (cache + Streams cho event bus)
- BullMQ cho background jobs
- JWT + RBAC

**Frontend**
- Next.js 14 App Router + TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query, Zustand, React Hook Form + Zod
- Recharts + Tremor cho dashboard
- next-intl (vi/en)

**DevOps**
- Docker Compose
- Prisma migrations
- Hot reload FE + BE

### Bounded contexts (8 schema Postgres)

```
master_data ── nền tảng (org, user, partner, product, uom, location, RBAC)
financial   ── sổ kép, hóa đơn, thanh toán, ngân sách
inventory   ── kho, lot, dịch chuyển, kiểm kê
manufacturing ── công thức TACN, lệnh sản xuất, QC
farm        ── trại, dãy, ô, đàn lợn, theo dõi đàn, CV alerts
sales       ── đơn hàng, giao hàng, bảng giá, đại lý
procurement ── yêu cầu mua, PO, nhập kho, đánh giá NCC
events      ── outbox, audit log, idempotency
```

Chi tiết xem [docs/architecture.md](docs/architecture.md).

## 📁 Cấu trúc thư mục

```
rtd-erp-demo/
├── docker-compose.yml         # Hạ tầng dev (Postgres, Redis, Adminer, MailHog)
├── .env.example               # Mẫu cấu hình môi trường
├── package.json               # Root workspace + script tổng
├── pnpm-workspace.yaml        # pnpm workspace
├── tsconfig.base.json         # TS config dùng chung
│
├── docs/
│   ├── architecture.md        # ERD chi tiết, decisions
│   ├── api.md                 # Tham chiếu API (sinh từ Swagger)
│   └── demo-script.md         # Kịch bản demo 15 phút
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # ~60 model theo bounded context
│   │   ├── init/              # SQL khởi tạo schema (chạy trước migrate)
│   │   └── seed.ts            # Seed 6 tháng dữ liệu (Bước 5)
│   ├── src/
│   │   ├── modules/           # auth, master-data, financial, inventory, …
│   │   ├── common/            # guard, interceptor, filter, decorator
│   │   └── main.ts
│   └── test/
│
├── frontend/                  # Next.js 14 (Bước 3+)
│   ├── app/
│   │   ├── (auth)/
│   │   └── (dashboard)/
│   └── components/
│
└── packages/
    └── contracts/             # DTO + types share giữa BE/FE
```

## 🧪 Test & chất lượng

- TypeScript strict mode, `noImplicitAny`, `strictNullChecks`
- Lint: ESLint flat config + Prettier
- Test: Vitest, mục tiêu coverage ≥ 60% cho domain services
- Conventional commits (`feat:`, `fix:`, `chore:`, …)

## 📜 License & Branding

- Đây là demo nội bộ, mã nguồn dành riêng cho mục đích trình bày với ban lãnh đạo RTD và đối tác đầu tư.
- Logo và màu sắc trong demo là phong cách "RTD-style" — không sử dụng asset thương hiệu thật của RTD trừ khi được cấp phép rõ ràng.

## 🤝 Liên hệ

Mọi câu hỏi về kiến trúc, lộ trình, hoặc demo — liên hệ team phát triển dự án.
