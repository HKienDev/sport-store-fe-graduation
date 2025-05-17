"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

const GoogleAuthHandler = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [isAuthenticated, user, router]);

  return <div className="text-center mt-10">Đang xử lý đăng nhập...</div>;
};

const GoogleSuccessPage = () => {
  return (
    <Suspense fallback={<div className="text-center mt-10">Đang tải...</div>}>
      <GoogleAuthHandler />
    </Suspense>
  );
};

export default GoogleSuccessPage;