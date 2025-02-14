"use client";
const Footer = () => (
    <footer className="bg-[#333333] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-5 gap-8">
          {/* Logo and Brand */}
          <div className="col-span-1 flex flex-col items-center">
            <img src="/Logo_vju.png" alt="VJU SPORT" className="h-20 mb-2" />
            <h3 className="text-xl font-bold text-center">VJU SPORT</h3>
          </div>
  
          {/* Customer Service */}
          <div className="col-span-1">
            <h4 className="font-bold mb-4">Dịch Vụ Khách Hàng</h4>
            <ul className="space-y-2">
              <li>Câu Hỏi Thường Gặp</li>
              <li>Chính Sách Bảo Mật</li>
              <li>Điều Khoản & Điều Kiện</li>
              <li>Hỗ Trợ</li>
            </ul>
          </div>
  
          {/* Collaboration */}
          <div className="col-span-1">
            <h4 className="font-bold mb-4">Hợp Tác</h4>
            <ul className="space-y-2">
              <li>Hợp Tác Với Chúng Tôi</li>
              <li>Cơ Hội Ký Hợp Tác</li>
              <li>Đăng Nhập Đối Tác</li>
            </ul>
          </div>
  
          {/* Contact */}
          <div className="col-span-1">
            <h4 className="font-bold mb-4">Liên Hệ</h4>
            <ul className="space-y-2">
              <li>Email: support@vjusport.com</li>
              <li>Điện thoại: +84 362 592 258</li>
              <li>Địa chỉ: Đường Láng Mai Dịch, Phường Cầu Diễn, Quận Nam Từ Liêm, Hà Nội</li>
            </ul>
          </div>
  
          {/* Learn More */}
          <div className="col-span-1">
            <h4 className="font-bold mb-4">Tìm Hiểu Thêm</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-gray-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.374 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.626-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
  
        {/* Copyright */}
        <div className="text-center pt-8 mt-8 border-t border-gray-700">
          <p>© 2025 Vju Sport | All Rights Reserved.</p>
        </div>
      </div>
    </footer>
);

export default Footer
