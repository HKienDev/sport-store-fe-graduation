# VJU Sport Store - Frontend (Next.js, React, E-commerce)

VJU Sport Store là nền tảng thương mại điện tử hiện đại dành cho các sản phẩm thể thao, cung cấp trải nghiệm mua sắm trực tuyến tối ưu cho cả khách hàng và quản trị viên. Dự án được xây dựng với Next.js 15+, React 19+, TailwindCSS và nhiều công nghệ hiện đại khác.

---

## Demo & Screenshots

- **Lưu ý**: Dự án từng được deploy lên Vercel để demo nhưng hiện đã hủy. Vui lòng chạy local theo hướng dẫn để trải nghiệm.

---

## Tính năng nổi bật

- Đăng ký, đăng nhập, xác thực người dùng (NextAuth, Google OAuth)
- Quản lý sản phẩm, danh mục, khuyến mãi, đơn hàng (Admin)
- Tìm kiếm, lọc, xem chi tiết sản phẩm, thêm vào giỏ hàng, thanh toán Stripe
- Quản lý tài khoản, đơn hàng, thông tin cá nhân (User)
- Chat hỗ trợ khách hàng trực tuyến
- Responsive UI/UX hiện đại, tối ưu hiệu suất
- Hệ thống đánh giá, phản hồi khách hàng
- Tối ưu SEO, bảo mật, phân quyền truy cập

---

## Trạng thái dự án

- **Phiên bản hiện tại:** v1.0.0 (Beta)
- **Tình trạng:** Đang phát triển, đã hoàn thiện các tính năng chính.
- **Kế hoạch tương lai:**
  - Tích hợp thêm phương thức thanh toán (PayPal, Momo).
  - Cải thiện hiệu suất tìm kiếm với Elasticsearch.
  - Thêm tính năng đa ngôn ngữ (i18n).

---

## Công nghệ sử dụng

- **Next.js** `15.3.1` (App Router, SSR, API routes)
- **React** `19.1.0` & **React DOM** `19.1.0`
- **TypeScript** `5.x`
- **TailwindCSS** `3.4.1` + `tailwindcss-animate`
- **NextAuth.js** `4.24.11` (JWT, Google OAuth)
- **Socket.io Client** `4.8.1` (Chat real-time)
- **Stripe**  
  - `@stripe/react-stripe-js` `3.6.0`  
  - `@stripe/stripe-js` `7.2.0`
- **Zod** `3.24.2` (Schema validation)
- **Framer Motion** `12.7.4` (Animation)
- **Recharts** `2.15.1` (Biểu đồ)
- **Lucide React** `0.475.0` (Icon)
- **Radix UI** (accordion, dialog, ...):  
  - `@radix-ui/react-*` `1.1.x ~ 2.2.x`
- **Chart.js** `4.4.8` & **react-chartjs-2** `5.3.0` (Biểu đồ)
- **React Hook Form** `7.55.0` (Form validation)
- **React Hot Toast** `2.5.1` (Toast notification)
- **Axios** `1.9.0` (HTTP client)
- **Lodash** `4.17.21` (Utility)
- **SweetAlert2** `11.17.2` (Alert UI)
- **MongoDB** `6.15.0` (driver)
- **clsx**, **date-fns**, **use-debounce**, **sonner**, ...

> Xem thêm chi tiết các package và version trong `package.json`.

---

## Cấu trúc thư mục chính

```text
sport-store-fe-graduation/
  sport-store/
    src/
      app/                       # Next.js App Router: định nghĩa route, API, layout, error pages, phân quyền
        (admin)/                 # Giao diện & route cho admin
          admin/                 # Trang tổng quan admin
            accounts/            # Quản lý tài khoản admin
              list/              # Danh sách tài khoản
            categories/          # Quản lý danh mục sản phẩm
              add/               # Thêm danh mục
              edit/[id]/         # Sửa danh mục
              list/              # Danh sách danh mục
            coupons/             # Quản lý khuyến mãi
              add/               # Thêm khuyến mãi
              edit/[id]/         # Sửa khuyến mãi
              list/              # Danh sách khuyến mãi
            customers/           # Quản lý khách hàng
              details/[id]/      # Chi tiết khách hàng
              list/              # Danh sách khách hàng
            dashboard/           # Dashboard admin
            messages/            # Quản lý tin nhắn
            orders/              # Quản lý đơn hàng
              add/               # Thêm đơn hàng
              details/[id]/      # Chi tiết đơn hàng
              list/              # Danh sách đơn hàng
              search/            # Tìm kiếm đơn hàng
            products/            # Quản lý sản phẩm
              add/               # Thêm sản phẩm
              details/[id]/      # Chi tiết sản phẩm
              edit/              # Sửa sản phẩm
              list/              # Danh sách sản phẩm
        user/                    # Giao diện & route cho user
          cart/                  # Trang giỏ hàng
          checkout/              # Thanh toán
          invoice/[id]/          # Chi tiết hóa đơn
          messages/              # Chat hỗ trợ
          products/details/[id]/ # Chi tiết sản phẩm
          profile/               # Trang cá nhân
        api/                     # API routes (serverless functions)
        auth/                    # Trang xác thực (login, register, quên mật khẩu, xác thực OTP, ...)
        error-pages/             # Trang lỗi: 404, 500, unauthorized
        layout.tsx               # Layout tổng thể cho app
        globals.css              # CSS toàn cục
        providers.tsx            # Các provider context toàn cục
      components/                # UI component tái sử dụng
        admin/                   # Component cho admin
          adminLayout/           # Layout admin
          AdminProtectedRoute/   # Route bảo vệ cho admin
          categories/            # Quản lý danh mục (add, edit, list)
          coupons/               # Quản lý khuyến mãi (add, edit, list)
          customers/             # Quản lý khách hàng (details, list)
          dashboard/             # Dashboard admin
          orders/                # Quản lý đơn hàng (add, details, list, search)
          products/              # Quản lý sản phẩm (add, details, list)
        user/                    # Component cho user
          cart/                  # Giỏ hàng
          checkout/              # Thanh toán
          invoice/               # Hóa đơn
          orderUser/             # Đơn hàng user
          productDetail/         # Chi tiết sản phẩm
          products/              # Sản phẩm (productCard, productImages, productInfor, productList)
          profileUser/           # Hồ sơ user
          userLayout/            # Layout user (header, footer, menu)
        common/                  # Component dùng chung (chat, skeleton, ...)
        ui/                      # Component UI nhỏ (button, modal, input, ...)
        auth/                    # Component xác thực (login form, register form, google login, ...)
        emails/                  # Component cho email template
        checkout/                # Component cho quy trình thanh toán
        ScrollingText/           # Component hiệu ứng text
      context/                   # React context: quản lý trạng thái auth, cart, khách hàng, khuyến mãi, shipping, ...
      services/                  # Service layer: gọi API backend, xử lý dữ liệu (productService, orderService, ...)
      models/                    # Định nghĩa model dữ liệu (coupon, ...)
      schemas/                   # Zod schemas: validate dữ liệu (user, product, order, ...)
      utils/                     # Hàm tiện ích, helper (format, fetchWithAuth, token, cloudinary, ...)
      hooks/                     # Custom React hooks (useProducts, useCart, useAuthState, useToast, ...)
      config/                    # Cấu hình hệ thống (routes, token, stripe, api, constants, ...)
      styles/                    # File CSS riêng cho từng phần (admin.css, ...)
      email-templates/           # Giao diện email gửi cho user/admin (RegisterConfirmation, ForgotPasswordEmail, ...)
      lib/                       # Thư viện dùng chung (mongodb, api, auth, email, ...)
      types/                     # Định nghĩa TypeScript types/interfaces (product, user, order, api, ...)
      middleware.ts              # Middleware Next.js (xử lý auth, redirect, ...)
    public/
      images/                    # Ảnh tĩnh (logo, sản phẩm, ...), chia theo thư mục con
        products/                # Ảnh sản phẩm (theo từng id)
      ...                        # Các file ảnh/logo khác
    package.json                 # Thông tin dự án, scripts, dependencies
    tailwind.config.ts           # Cấu hình TailwindCSS
    next.config.js               # Cấu hình Next.js
    postcss.config.mjs           # Cấu hình PostCSS
    tsconfig.json                # Cấu hình TypeScript
    .eslintrc.json               # Cấu hình ESLint
    .gitignore                   # File gitignore
    ...
```

---

## Kết nối với Backend

Dự án frontend này hoạt động cùng với backend tại **[sport-store-be-graduation](https://github.com/HKienDev/sport-store-be-graduation)**.

- Clone và cài đặt backend theo hướng dẫn tại repo backend.
- Cấu hình `NEXT_PUBLIC_API_URL` trong `.env.local` để trỏ đến backend.

---

## Hướng dẫn cài đặt & chạy dự án

### 1. Clone repo:

```bash
git clone https://github.com/HKienDev/sport-store-fe-graduation.git
cd sport-store-fe-graduation/sport-store
```

### 2. Cài đặt dependencies:

```bash
npm install
```

### 3. Cấu hình biến môi trường (`.env.local`):

Tạo file `.env.local` trong thư mục `sport-store/` với nội dung mẫu:

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:4000/api         # Địa chỉ API backend

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id    # Google OAuth Client ID
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your_google_secret   # Google OAuth Client Secret

# App URL (nếu dùng callback OAuth, email...)
NEXT_PUBLIC_APP_URL=http://localhost:3000             # URL frontend

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret                  # Secret cho NextAuth (bắt buộc nếu dùng NextAuth)
NEXT_PUBLIC_AUTH_COOKIE_NAME=accessToken              # Tên cookie lưu access token
NEXT_PUBLIC_REFRESH_COOKIE_NAME=refreshToken          # Tên cookie refresh token
NEXT_PUBLIC_COOKIE_SECURE=false                       # Cookie chỉ hoạt động trên HTTPS (true/false)
NEXT_PUBLIC_COOKIE_SAME_SITE=lax                      # Cấu hình SameSite cho cookie

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name     # Cloudinary cloud name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_cloudinary_api_key # Cloudinary API key (nếu upload từ FE)
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset # Cloudinary upload preset
NEXT_PUBLIC_CLOUDINARY_FOLDER=your_folder             # Thư mục mặc định khi upload ảnh lên Cloudinary

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key    # Stripe publishable key

# (Chỉ cần nếu FE kết nối trực tiếp MongoDB)
# MONGODB_URI=your_mongodb_uri                         # Kết nối MongoDB
# MONGODB_DB=sport-store                               # Tên database MongoDB
```

> **Lưu ý:** Không commit file `.env.local` lên git!
> - Một số biến có thể không cần thiết cho mọi môi trường, hãy tham khảo tài liệu backend/frontend để cấu hình đúng.

### 4. Chạy dev:

```

### 4. Chạy dev:

```bash
npm run dev
```

Truy cập [http://localhost:3000](http://localhost:3000)

### 5. Build production:

```bash
npm run build && npm start
```

---

## Liên hệ

- **Email:** hoangtientrungkien2k3@gmail.com
- **Facebook:** [Hoàng Kiên](https://www.facebook.com/ZeussHk3002/)
- **Zalo:** +84 362 195 258

---

## License

Copyright © HKienDev
