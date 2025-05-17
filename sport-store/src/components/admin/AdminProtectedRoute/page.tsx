"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import { ROUTES } from '@/config/constants';

export default function AdminProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                console.log('❌ Chưa đăng nhập, chuyển hướng về trang login');
                router.replace(ROUTES.LOGIN);
                return;
            }
            if (user.role !== 'admin') {
                console.log('❌ Không phải admin, chuyển hướng về trang chủ');
                router.replace(ROUTES.HOME);
                return;
            }
        }
    }, [user, loading, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user || user.role !== 'admin') {
        return null;
    }

    return <>{children}</>;
} 