"use client";

import { useAuth } from "@/context/authContext";
import { usePathname, useRouter } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const AuthButtons = () => {
  const { user, isAuthenticated, checkAuthStatus } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname.startsWith("/auth");
  const [isChecking, setIsChecking] = useState(true);

  // Kiểm tra trạng thái xác thực khi component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsChecking(true);
        await checkAuthStatus();
      } catch (error) {
        console.error("❌ Error checking auth status:", error);
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, [checkAuthStatus]);

  console.log("🔍 AuthButtons - Auth state:", { 
    user, 
    isAuthenticated, 
    isAuthPage,
    hasUser: !!user,
    userRole: user?.role,
    isChecking
  });

  // Không hiển thị gì khi đang kiểm tra
  if (isChecking) {
    return null;
  }

  // Không hiển thị nút khi đã đăng nhập hoặc đang ở trang auth
  if (isAuthPage || isAuthenticated) {
    console.log("🔒 AuthButtons - Hiding buttons:", { isAuthPage, isAuthenticated });
    return null;
  }

  const handleLogin = async () => {
    try {
      // Kiểm tra xác thực trước khi chuyển hướng
      await checkAuthStatus();
      
      // Nếu đã xác thực, không cần chuyển hướng
      if (isAuthenticated) {
        toast.success("Bạn đã đăng nhập thành công");
        return;
      }
      
      // Nếu chưa xác thực, chuyển hướng đến trang đăng nhập
      router.push('/auth/login');
    } catch (error) {
      console.error("❌ Error checking auth status:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  const handleRegister = async () => {
    try {
      // Kiểm tra xác thực trước khi chuyển hướng
      await checkAuthStatus();
      
      // Nếu đã xác thực, không cần chuyển hướng
      if (isAuthenticated) {
        toast.success("Bạn đã đăng nhập thành công");
        return;
      }
      
      // Nếu chưa xác thực, chuyển hướng đến trang đăng ký
      router.push('/auth/register');
    } catch (error) {
      console.error("❌ Error checking auth status:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleLogin}
        className="group relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-lg hover:from-gray-50 hover:to-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 hover:shadow-md"
      >
        <LogIn className="w-4 h-4 mr-2 text-gray-500 group-hover:text-purple-600 transition-colors duration-300" />
        <span className="relative z-10">Đăng Nhập</span>
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-purple-500/5 transition-all duration-300"></div>
      </button>
      <button
        onClick={handleRegister}
        className="group relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 rounded-lg hover:from-purple-700 hover:via-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
      >
        <UserPlus className="w-4 h-4 mr-2 text-white/90 group-hover:text-white transition-colors duration-300" />
        <span className="relative z-10">Đăng Ký</span>
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/10 transition-all duration-300"></div>
      </button>
    </div>
  );
};

export default AuthButtons;