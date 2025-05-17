"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { handleRedirect } from "@/utils/navigationUtils";

interface LoginFormProps {
  error: string;
  loading: boolean;
}

const LoginForm = ({ error, loading }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(email, password);
      if (!result.success) {
        toast.error(result.message || "Đăng nhập thất bại");
      } else {
        await handleRedirect(router, result.data?.user ?? null, window.location.pathname);
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof AxiosError) {
        if (error.response) {
          // Lỗi từ server
          const errorMessage = error.response.data?.message;
          const errors = error.response.data?.errors;

          // Xử lý các trường hợp lỗi cụ thể
          switch (errorMessage) {
            case 'INVALID_CREDENTIALS':
              toast.error('Email hoặc mật khẩu không chính xác');
              break;
            case 'ACCOUNT_NOT_VERIFIED':
              toast.error('Tài khoản chưa được xác thực. Vui lòng kiểm tra email');
              break;
            case 'ACCOUNT_INACTIVE':
              toast.error('Tài khoản đã bị khóa. Vui lòng liên hệ hỗ trợ');
              break;
            case 'ACCOUNT_BLOCKED':
              toast.error('Tài khoản đã bị chặn. Vui lòng liên hệ hỗ trợ');
              break;
            default:
              // Hiển thị lỗi từ server nếu có
              if (errors && errors.length > 0) {
                toast.error(errors[0].message);
              } else {
                toast.error(errorMessage || "Lỗi server");
              }
          }
        } else if (error.request) {
          // Không nhận được response
          toast.error("Không thể kết nối đến server");
        } else {
          // Lỗi khác
          toast.error("Đăng nhập thất bại");
        }
      } else {
        toast.error("Đăng nhập thất bại");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center w-full">
      {/* Error Message */}
      {error && (
        <div className="w-full bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-200 flex items-start">
          <div className="flex-shrink-0 mr-2 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="break-words">{error}</div>
        </div>
      )}

      {/* Input Fields */}
      <div className="space-y-4 w-full">
        {/* Email Input */}
        <div className="relative w-full">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm text-sm text-black placeholder-gray-500 bg-white hover:bg-gray-50 focus:bg-white transition-colors"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="relative w-full">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm text-sm text-black placeholder-gray-500 bg-white hover:bg-gray-50 focus:bg-white transition-colors"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="flex justify-between w-full text-sm text-gray-700">
        <a href="/auth/forgotPasswordEmail" className="hover:text-red-600 transition-colors">
          Quên mật khẩu?
        </a>
        <a href="/auth/register" className="font-medium hover:text-red-600 transition-colors">
          Đăng ký ngay
        </a>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-70 font-medium text-sm shadow-lg transition-all transform hover:translate-y-px active:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang đăng nhập...
          </span>
        ) : (
          "Tiếp tục"
        )}
      </button>
    </form>
  );
};

export default LoginForm;