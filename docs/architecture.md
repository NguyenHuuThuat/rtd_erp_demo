# Kiến trúc RTD ERP

Tài liệu này mô tả các quyết định kiến trúc, ERD, và quy ước cốt lõi của hệ thống.

## 0. Phạm vi (Phase 1 vs Phase 2)

**Phase 1 — đang xây**: 2 cấu phần nền tảng

| Cấu phần | Bounded contexts |
|----------|------------------|
| **Quản trị** | `master_data` (org, user, RBAC, partner, product, uom, location, system settings, approval flow) + `events` (audit log, outbox) |
| **Tài chính – Kế toán** | `financial` (CoA, journal, invoice, payment, cost center, budget) |

**Phase 2 — roadmap, schema đã sẵn**: 5 cấu phần nghiệp vụ

| Cấu phần | Bounded context |
|----------|-----------------|
| Mua hàng | `procurement` |
| Sản xuất | `manufacturing` |
| Kho | `inventory` |
| Trại lợn | `farm` |
| Bán hàng | `sales` |

Database migration **luôn tạo cả 8 schema** từ phase 1 (các bảng phase 2 sẽ rỗng) — để đối tác thấy được roadmap end-to-end.

---

## 1. Mục tiêu kiến trúc

| Mục tiêu | Cách đạt |
|----------|----------|
| Demo chạy 1 lệnh trên laptop dev | Docker compose chỉ với infra nhẹ; backend/frontend chạy hot-reload |
| Code "production-grade" để thuyết phục đối tác | NestJS + Prisma + TypeScript strict; test coverage ≥60% domain |
| Cover end-to-end nghiệp vụ 3F | 8 schema bounded context, dữ liệu seed reconcile |
| Sẵn sàng tích hợp CV/AI | Webhook endpoint + WebSocket; outbox pattern cho event |
| Mở rộng được lên multi-tenant thật | `companyId` ở mọi bảng transactional (RLS có thể bật sau) |

## 2. Quyết định kiến trúc (Architecture Decisions)

### ADR-1: Multi-schema Postgres thay vì 1 schema phẳng
- **Quyết định**: tách 8 schema theo bounded context (master_data, financial, inventory, manufacturing, farm, sales, procurement, events).
- **Lý do**: ranh giới rõ ràng giữa các module, dễ cấp quyền theo schema, dễ tách thành microservice nếu sau này cần.
- **Tradeoff**: query cross-schema cần FQN (`master_data.products`); Prisma multiSchema feature đã GA nên không vấn đề.

### ADR-2: Shared DB + cột `companyId` thay vì RLS
- **Quyết định**: dùng cột `companyId` trên mọi bảng transactional. Master data như products, partners có thể group-level (chia sẻ giữa các công ty con).
- **Lý do**: đơn giản cho demo, đủ để show concept multi-tenant. Đối tác có thể hỏi và ta sẵn sàng cho upgrade lên RLS.
- **Tradeoff**: developer phải nhớ filter `companyId`; sẽ có guard tự động trong Bước 2 để tránh lộ data cross-tenant.

### ADR-3: Redis Streams thay vì Kafka cho demo
- **Quyết định**: dùng Redis Streams làm event bus.
- **Lý do**: Kafka KRaft tốn ~1.5GB RAM khi idle; demo trên laptop đối tác không nên giật. Redis đã có sẵn cho cache + BullMQ.
- **Tradeoff**: throughput thấp hơn Kafka, nhưng demo không cần >1k events/s. Kiến trúc abstraction `EventBus` interface giúp swap sang Kafka sau dễ dàng.

### ADR-4: Outbox pattern cho event publishing
- **Quyết định**: ghi vào bảng `events.outbox` trong cùng transaction với business write; 1 worker BullMQ poll outbox và publish ra Redis Streams.
- **Lý do**: đảm bảo "exactly once" semantic — không có chuyện DB commit thành công nhưng event publish fail (hoặc ngược lại).

### ADR-5: Pig groups (cohort) là entity chính, không track từng con
- **Quyết định**: theo dõi đàn theo `pig_groups` (cohort) — mỗi nhóm có số lượng đầu, ngày nhập, ngày xuất, các log feed/health/weight.
- **Lý do**: 10.000 con × 6 tháng × event hằng ngày sẽ làm DB phình mà không tạo giá trị demo.
- **Lối thoát**: schema có sẵn entity `Animal` (optional) với FK `groupId`; bật khi cần track chi tiết bằng ear tag.

### ADR-6: Sổ kép đơn giản theo TT200 rút gọn
- **Quyết định**: bảng `Journal` + `JournalLine` với constraint `SUM(debit) = SUM(credit)`. Chart of accounts ~40 tài khoản chính (tài sản, công nợ, vốn, doanh thu, chi phí).
- **Lý do**: đối tác đầu tư cần nhìn báo cáo tài chính theo chuẩn VAS. Không làm full TT200 (~200 tài khoản chi tiết) vì không cần thiết cho demo.

### ADR-7: Stock movements append-only + materialized view tồn kho
- **Quyết định**: `stock_movements` là ledger không xóa/sửa; `stock_balances` là view materialized refresh theo trigger.
- **Lý do**: tránh race condition khi nhiều worker BullMQ cập nhật tồn kho song song; có audit trail tự nhiên.

### ADR-8: Soft delete chọn lọc
- **Quyết định**: `deletedAt` trên bảng master và header transactional (Order, Invoice, …); không soft delete trên child line items (cascade hard delete) và không trên audit/event.
- **Lý do**: cân bằng giữa khả năng phục hồi và đơn giản hóa query.

## 3. ERD chi tiết

### 3.1 master_data (16 bảng — bao gồm khối Quản trị)

```
Organization (Group → Company → Branch tree, parent self-ref)
   ▲
   │
User ── UserRole ── Role ── RolePermission ── Permission
   │                                              │
   │                                              └─ Resource × Action
   └── RefreshToken

Partner (type: SUPPLIER | CUSTOMER | BOTH | BANK)
Product (type: RAW_MATERIAL | FINISHED_FEED | MEDICINE | LIVESTOCK | PACKAGING | OTHER)
  ├─ ProductCategory (cây danh mục)
  └─ Uom ── UomConversion

Province (chuẩn GSO: 63 tỉnh, region: NORTH/CENTRAL/SOUTH)

# Khối Quản trị
SystemSetting (key/value, scope global hoặc theo company)
ApprovalFlow ── ApprovalStep
       │              ▲
       ▼              │
ApprovalRequest ── ApprovalDecision
```

### 3.2 inventory (6 bảng)

```
Warehouse (loại: RAW_MATERIAL | FINISHED_GOODS | FARM_FEED | MEDICINE)
   │
   ├─ StockLot (productId, lotCode, expiryDate, mfgDate)
   │
   ├─ StockMovement (type: IN | OUT | TRANSFER | ADJUSTMENT)
   │     │── StockMovementLine (lot, qty, unitCost)
   │
   ├─ StockBalance (view, materialized)
   │
   ├─ StockReservation (cho sales order chưa giao)
   │
   └─ StockCount ── StockCountLine
```

### 3.3 manufacturing (6 bảng)

```
Formula (BOM cho TACN: heo con, heo thịt, nái chửa, ...)
  └─ FormulaLine (raw material, % tỷ lệ, dung sai)

ProductionOrder (kế hoạch sản xuất)
  ├─ ProductionBatch (mẻ thực tế, machineLineId, batchNo)
  └─ QcRecord (chỉ tiêu: protein, ẩm, tro, năng lượng)

MachineLine (dây chuyền sản xuất tại nhà máy)
```

### 3.4 farm (10 bảng)

```
Farm (5 trại với địa danh thật)
 │
 ├─ Barn (nhiều dãy/farm)
 │   │
 │   └─ Pen (ô chuồng/dãy)
 │
 ├─ PigGroup (cohort: stage = WEANER | GROWER | FINISHER | SOW | BOAR)
 │     ├─ FeedLog (ngày, formula, kg cấp, FCR tính được)
 │     ├─ HealthLog (chẩn đoán, điều trị, withholding period)
 │     ├─ VaccinationRecord (loại vaccine, lô, ngày tiêm)
 │     ├─ WeightLog (sample weighing → ADG)
 │     └─ MortalityRecord (số con chết, nguyên nhân)
 │
 └─ CvAlert (alert từ hệ thống Computer Vision: cough, fever, abnormal-behavior)
```

### 3.5 sales (7 bảng)

```
SalesOrder (đại lý đặt heo thương phẩm hoặc TACN)
  ├─ SalesOrderLine
  └─ DeliveryNote ── DeliveryNoteLine

PriceList (theo kênh: ĐẠI LÝ | TIÊU DÙNG | NỘI BỘ)
  └─ PriceListItem (productId, price, validFrom, validTo)

Contract (hợp đồng khung với đại lý)
Territory (vùng phụ trách: 30 tỉnh thành)
```

### 3.6 procurement (6 bảng)

```
PurchaseRequisition (yêu cầu mua từ nội bộ)
  └─ PurchaseRequisitionLine

PurchaseOrder (PO gửi nhà cung cấp)
  ├─ PurchaseOrderLine
  └─ GoodsReceiptNote ── GoodsReceiptNoteLine

SupplierEvaluation (đánh giá NCC: chất lượng, đúng hạn, giá)
```

### 3.7 financial (10 bảng)

```
ChartOfAccount (TT200 rút gọn ~40 tài khoản, parent self-ref)

Journal (mỗi nghiệp vụ tạo 1 journal)
  └─ JournalLine (account, debit, credit) — constraint SUM(debit)=SUM(credit)

Invoice (type: SALES | PURCHASE)
  ├─ InvoiceLine
  └─ Payment ── PaymentAllocation

CostCenter (theo nhà máy / trại)
Budget ── BudgetLine
```

### 3.8 events (3 bảng)

```
Outbox (transactional outbox: aggregateType, aggregateId, eventType, payload, status)
AuditLog (entity, entityId, action, actorId, before, after — JSONB)
IdempotencyKey (key, requestHash, response, expiresAt)
```

## 4. Luồng nghiệp vụ huyết mạch

```
[Procurement]                                     [Manufacturing]
PurchaseOrder ──► GoodsReceiptNote                 ProductionOrder
       │                  │                              │
       │                  ▼                              ▼
       │           StockMovement(IN raw)            ProductionBatch
       │                                                 │
       │                                                 ▼
       │                                       StockMovement(OUT raw, IN feed)
       │                                                 │
       └─────────► JournalEntry                          │
                                                         │
                                                  [Internal Transfer]
                                                  StockMovement(TRANSFER)
                                                         │
                                                         ▼
                                                  [Farm Warehouse]
                                                         │
                                                         ▼
[Farm]                                              FeedLog
PigGroup ──► WeightLog ──► (ADG, FCR computed)
       │
       ├──► MortalityRecord
       └──► HealthLog ◄── CvAlert (CV webhook)
                                  
[Sales]
SalesOrder ──► DeliveryNote ──► StockMovement(OUT FG)
       │              │                  │
       │              ▼                  │
       │         (xuất chuồng)           │
       │                                 │
       ▼                                 ▼
   Invoice ──► Payment ──► JournalEntry (debit AR / credit Revenue)
```

## 5. Quy ước thiết kế DB

| Quy ước | Ví dụ |
|---------|-------|
| ID là UUID v4 | `id String @id @default(uuid())` |
| Audit columns trên bảng transactional | `createdAt`, `updatedAt`, `createdBy`, `deletedAt` |
| Tiền tệ: Decimal(18, 4) | `amount Decimal @db.Decimal(18, 4)` |
| Số lượng: Decimal(18, 6) | đủ cho 1.234.567,123456 kg |
| Mã code (hiển thị cho user) | `code String @unique` (tự sinh: `PO-2026-00001`) |
| Enum trong Prisma | `enum OrderStatus { DRAFT CONFIRMED ... }` |
| Index cho lookup phổ biến | `@@index([companyId, status, createdAt])` |
| Soft delete | `deletedAt DateTime?` + Prisma middleware filter |

## 6. Quy ước API (sẽ chi tiết hóa Bước 2)

- Prefix `/api/v1`
- REST cho CRUD + GraphQL cho dashboard query phức tạp
- DTO validate bằng Zod (share với FE qua `packages/contracts`)
- Pagination: cursor-based cho danh sách lớn, offset cho master data
- Lỗi: RFC 7807 Problem Details
- Idempotency: header `Idempotency-Key` cho POST tài chính

## 7. Quy ước event (sẽ chi tiết hóa Bước 5)

- Tên event: `<context>.<aggregate>.<verb>` (vd `farm.pig_group.created`)
- Format payload: CloudEvents 1.0
- Stream: `rtd:events:<context>` trên Redis
- Consumer group per service
- Replay được trong 7 ngày retention
