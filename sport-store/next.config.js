/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Tạm thời bỏ qua lỗi ESLint trong quá trình build
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['upload.wikimedia.org', 'localhost', 'res.cloudinary.com', 'example.com', 'via.placeholder.com', 'lh3.googleusercontent.com'],
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '4000',
                pathname: '/uploads/**',
            },
        ],
    },
    // Thêm cấu hình để tối ưu hiệu suất
    reactStrictMode: true,
    // Thêm cấu hình để xử lý các file static
    poweredByHeader: false,
    compress: true,
    // Thêm cấu hình để xử lý các route
    async redirects() {
        return [
            {
                source: '/',
                destination: '/user',
                permanent: true,
            },
        ];
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: `
                            default-src 'self';
                            script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://va.vercel-scripts.com;
                            style-src 'self' 'unsafe-inline';
                            img-src 'self' data: https: http:;
                            frame-src 'self' https://js.stripe.com https://hooks.stripe.com;
                            connect-src 'self' http://localhost:4000 https://sport-store-be-graduation-production.up.railway.app https://api.stripe.com https://provinces.open-api.vn https://api.cloudinary.com;
                            font-src 'self';
                            object-src 'none';
                            media-src 'self';
                            worker-src 'self' blob:;
                        `.replace(/\s+/g, ' ').trim()
                    }
                ]
            },
            {
                source: '/_next/static/:static*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable'
                    }
                ]
            },
            {
                source: '/fonts/:font*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable'
                    }
                ]
            },
            {
                source: '/images/:image*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable'
                    }
                ]
            }
        ];
    },
}

module.exports = nextConfig 