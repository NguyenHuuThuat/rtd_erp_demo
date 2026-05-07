# RTD ERP — Tham chiếu API

> Tài liệu API sẽ được sinh tự động từ Swagger ở Bước 2.
> Khi backend chạy: mở `http://localhost:3001/api/docs`.

## Endpoint cố định

- `GET /health` — health check
- `GET /api/docs` — Swagger UI
- `GET /api/docs-json` — OpenAPI JSON

## Quy ước chung (sẽ điền chi tiết ở Bước 2)

- Versioning: prefix `/api/v1`
- Auth: `Authorization: Bearer <access_token>`
- Pagination: `?page=1&pageSize=20`
- Filter: `?filter[field]=value`
- Sort: `?sort=field,-createdAt`
- Lỗi: theo chuẩn RFC 7807 Problem Details
