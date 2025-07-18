# Khắc phục vấn đề màn hình trắng

## Nguyên nhân thường gặp

### 1. Base URL không đúng
- **Vấn đề**: Khi deploy lên GitHub Pages, base URL phải là `/doantotnghiep-client/`
- **Giải pháp**: Đã cập nhật `vite.config.ts` để tự động detect production build

### 2. Client-side routing không hoạt động
- **Vấn đề**: GitHub Pages không hỗ trợ client-side routing mặc định
- **Giải pháp**: Đã thêm file `404.html` và script redirect trong `index.html`

### 3. Apollo Client lỗi kết nối
- **Vấn đề**: Server GraphQL không phản hồi
- **Giải pháp**: Đã thêm error handling cho Apollo Client

### 4. Assets không load được (404 errors)
- **Vấn đề**: Đường dẫn assets không đúng khi preview
- **Giải pháp**: Tạo custom server để test production build

## Cách kiểm tra và debug

### 1. Mở Developer Tools
```bash
# Mở browser và nhấn F12
# Kiểm tra Console tab để xem lỗi
```

### 2. Kiểm tra Network tab
- Xem các request có thành công không
- Kiểm tra GraphQL endpoint có hoạt động không

### 3. Test local development
```bash
npm run dev
```

### 4. Test production build (CÁCH MỚI)
```bash
# Build project
npm run build

# Chạy custom server để test production build
npm run serve

# Truy cập: http://localhost:3000/doantotnghiep-client/
```

### 5. Test với Vite preview (Cách cũ)
```bash
npm run build
npm run preview
# Truy cập: http://localhost:3000/doantotnghiep-client/
```

## Các bước đã thực hiện để khắc phục

1. ✅ Cập nhật `vite.config.ts` với base URL động
2. ✅ Thêm file `404.html` cho GitHub Pages SPA routing
3. ✅ Thêm script redirect trong `index.html`
4. ✅ Thêm error handling cho Apollo Client
5. ✅ Thêm console logging để debug
6. ✅ Tạo custom server (`serve.js`) để test production build
7. ✅ Thêm script `npm run serve` để chạy server

## Nếu vẫn gặp vấn đề

1. **Kiểm tra console errors** trong browser Developer Tools
2. **Kiểm tra server GraphQL** có hoạt động không: `https://doantotnghiep-server.onrender.com/graphql`
3. **Thử clear cache** và reload trang
4. **Kiểm tra network connectivity**
5. **Test với custom server**: `npm run serve`

## Deploy lên GitHub Pages

```bash
npm run build
npm run deploy
```

Đảm bảo repository có GitHub Pages enabled và source được set là `gh-pages` branch.

## Các script có sẵn

- `npm run dev` - Development server
- `npm run build` - Build production
- `npm run serve` - Custom server để test production build
- `npm run preview` - Vite preview server
- `npm run deploy` - Deploy lên GitHub Pages 