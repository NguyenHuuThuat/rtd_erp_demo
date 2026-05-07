/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export — sinh ra thư mục `out/` đẩy lên GitHub Pages / Cloudflare Pages / Netlify
  output: 'export',
  // Tắt image optimization (yêu cầu Node server) — dùng <img> bình thường
  images: { unoptimized: true },
  // Trailing slash để URL giống GitHub Pages serve folder
  trailingSlash: true,
  // Repo GitHub: NguyenHuuThuat/rtd_erp_demo → URL Pages: nguyenhuuthuat.github.io/rtd_erp_demo/
  basePath: '/rtd_erp_demo',
  assetPrefix: '/rtd_erp_demo/',
  // Nếu sau này dùng custom domain hoặc đổi sang repo `<username>.github.io` → bỏ 2 dòng trên.
  experimental: {
    typedRoutes: false,
  },
};

export default nextConfig;
