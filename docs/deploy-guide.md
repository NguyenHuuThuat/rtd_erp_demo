# Hướng dẫn deploy demo lên web

> Demo đã được config để export thành **static site** (không cần Node server). Có 4 lựa chọn host, sắp theo độ dễ.

---

## ⭐ Lựa chọn 1: Drag-drop lên Netlify (5 phút, không cần git)

**Phù hợp**: muốn URL ngay, không muốn config gì cả.

1. Mở terminal:
   ```powershell
   cd c:\CongViec\Other_Project\RTD_Group\ERP_RTD\frontend
   pnpm build
   ```
2. Mở browser → vào https://app.netlify.com/drop
3. Đăng ký tài khoản free (chỉ cần email)
4. Kéo thả thư mục `frontend/out/` vào ô upload
5. Đợi ~30 giây → nhận URL dạng `https://wonderful-name-abc123.netlify.app`
6. Có thể đổi sang custom subdomain trong Settings → Site settings → Change name

**Ưu**: nhanh nhất, có HTTPS sẵn, không config.
**Nhược**: phải build local trước mỗi lần update. Account free 100GB bandwidth/tháng.

---

## ⭐⭐ Lựa chọn 2: Cloudflare Pages (5 phút, không cần git)

Tương tự Netlify nhưng Cloudflare có CDN tốt hơn ở Việt Nam.

1. `pnpm build` ở `frontend/`
2. Vào https://dash.cloudflare.com/?to=/:account/pages
3. **Upload assets** → chọn folder `frontend/out`
4. Đặt project name (vd `rtd-erp-demo`)
5. URL: `rtd-erp-demo.pages.dev`

**Ưu**: CDN nhanh ở VN, free unlimited bandwidth.

---

## ⭐⭐⭐ Lựa chọn 3: GitHub Pages auto-deploy (chuyên nghiệp, 1 lần config)

**Phù hợp**: muốn auto-build mỗi khi push code lên main.

### Bước 1 — Khởi tạo repo

```powershell
cd c:\CongViec\Other_Project\RTD_Group\ERP_RTD
git init
git add .
git commit -m "Initial: RTD ERP Phase 1 demo"
```

Tạo repo mới trên GitHub (vd `rtd-erp-demo`), copy URL repo, rồi:

```powershell
git remote add origin https://github.com/<username>/rtd-erp-demo.git
git branch -M main
git push -u origin main
```

### Bước 2 — Bật GitHub Pages

1. Trên GitHub: vào repo → **Settings** → **Pages**
2. Mục **"Build and deployment"** → **Source** = **"GitHub Actions"** (không phải "Deploy from a branch")
3. Lưu

### Bước 3 — File workflow đã có sẵn

`.github/workflows/deploy-pages.yml` đã được tạo sẵn — auto-build mỗi khi push lên `main` có thay đổi trong `frontend/`.

### Bước 4 — Nếu repo KHÔNG phải `<username>.github.io`

Mặc định GitHub Pages serve dưới subpath: `https://<username>.github.io/<repo-name>/` → cần đặt `basePath`.

Sửa file `frontend/next.config.mjs`, uncomment:
```javascript
basePath: '/rtd-erp-demo',
assetPrefix: '/rtd-erp-demo/',
```
(thay `rtd-erp-demo` bằng tên repo của bạn)

Commit + push.

### Bước 5 — Xem kết quả

- Vào tab **Actions** trên GitHub → đợi workflow xanh (~3 phút)
- URL demo: `https://<username>.github.io/<repo-name>/`

### Bước 6 — Custom domain (optional)

Settings → Pages → Custom domain → vd `demo.rtd.vn` → thêm CNAME record `demo.rtd.vn → <username>.github.io` ở DNS provider.

---

## Lựa chọn 4: Vercel (1-click cho Next.js)

**Phù hợp**: nếu muốn dùng full-stack feature sau này (API routes, middleware…).

1. Vào https://vercel.com → Sign in with GitHub
2. **Add New** → **Project** → chọn repo `rtd-erp-demo`
3. **Root Directory** = `frontend`
4. Click **Deploy**
5. URL: `https://rtd-erp-demo-abc.vercel.app`

Vercel tự detect Next.js. **Lưu ý**: Vercel chạy như Next.js server thật (không phải static export) — feature đầy đủ nhưng cũng tốn quota function executions.

Nếu muốn ép static-only: thêm `output: 'export'` đã có sẵn trong `next.config.mjs`.

---

## Cập nhật demo

Sau khi đổi code:

```powershell
cd c:\CongViec\Other_Project\RTD_Group\ERP_RTD\frontend
pnpm build
```

- **Netlify/Cloudflare drag-drop**: kéo thả `out/` lại
- **GitHub Pages**: `git add -A && git commit -m "update demo" && git push` → CI tự build
- **Vercel**: tự build sau khi push

---

## Kiểm tra trước khi share URL

Sau khi deploy, kiểm tra:
- [ ] `/` → redirect sang `/login/`
- [ ] Login với `RtdAdmin@2026` → vào dashboard
- [ ] Sidebar điều hướng được
- [ ] Charts render đúng
- [ ] Modal/Drawer mở/đóng OK
- [ ] AI chat icon ✨ góc dưới phải
- [ ] Banner xanh trên đầu
- [ ] Nút "▶ Bắt đầu tour" hoạt động
- [ ] Print button ở `/financial/reports/` mở dialog in
- [ ] Mobile responsive (mở DevTools → mobile view)

---

## Troubleshooting

**404 sau khi click navigation**
→ `trailingSlash: true` đã có. Nếu vẫn lỗi: check xem có serve qua HTTP không (file:// không chạy).

**CSS không load (trang trắng)**
→ Sai `basePath` / `assetPrefix`. Mở DevTools → Network → check 404 trên `/_next/...`.

**Tour guide không hiện**
→ react-joyride dùng `dynamic` với `ssr: false`, có thể chậm lần đầu. Refresh trang sau khi load xong.

**Cmd+K không bật**
→ Browser nào đó intercept `Ctrl+K` (Chrome address bar focus). Trên Mac dùng `⌘K`. Trên Windows dùng `Ctrl+K`.

---

## Kích thước & performance

- Tổng `out/` ~ **2 MB** (đã optimize, gzip xuống ~600 KB qua mạng)
- First Load JS lớn nhất: **224 KB** ở dashboard (do recharts)
- Time to Interactive: < 2s trên 4G
- Hosting bandwidth: free tier nào cũng dư xài cho demo
