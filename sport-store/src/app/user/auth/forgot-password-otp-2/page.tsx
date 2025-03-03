'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPasswordOTP() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  useEffect(() => {
    inputRefs.current[0]?.focus();
    const storedEmail = localStorage.getItem('forgotPasswordEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setError('Không tìm thấy email. Vui lòng thử lại.');
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    setOtp(pastedData.split('').concat(Array(6 - pastedData.length).fill('')));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Vui lòng nhập đầy đủ mã OTP.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/auth/verify-forgot-password-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpString })
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Mã OTP không hợp lệ hoặc đã hết hạn.');
        return;
      }

      // Tạo resetToken ngẫu nhiên
      const resetToken = data.resetToken || Math.random().toString(36).substr(2, 10);

      // Lưu resetToken vào localStorage để sử dụng ở bước tiếp theo
      localStorage.setItem('resetPasswordToken', resetToken);

      // Điều hướng sang trang đặt lại mật khẩu
      router.push('/user/auth/forgot-password-reset-3');
    } catch (error) {
      console.error('Lỗi khi xác thực OTP:', error);
      setError('Lỗi hệ thống, vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError('Không tìm thấy email để gửi lại mã.');
      return;
    }
    setError('');
    try {
      const response = await fetch('http://localhost:4000/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!response.ok) {
        setError('Không thể gửi lại mã OTP, vui lòng thử lại.');
      }
    } catch (err: unknown) {
      console.error('Lỗi khi xác thực OTP:', err);
      setError('Lỗi hệ thống, vui lòng thử lại sau.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Cài lại mật khẩu</h2>
          <p className="mt-2 text-sm text-gray-600">
            Chúng tôi đã gửi mã đến <span className="text-blue-600">{email || 'email của bạn'}</span>
          </p>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                className="w-14 h-14 text-center text-2xl font-semibold border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.some(digit => !digit)}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang xử lý...' : 'Tiếp tục'}
          </button>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-500">Không nhận được mã? </span>
          <button
            onClick={handleResendCode}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Ấn để nhận lại mã
          </button>
        </div>

        <div className="text-center">
          <Link href="/user/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
            Quay lại trang đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}