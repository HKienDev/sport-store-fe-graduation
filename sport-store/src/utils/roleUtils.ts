import type { AuthUser } from '@/types/auth';
import type { AppRouter } from '@/types/router';
import { checkAuth } from '@/services/authService';

/**
 * Kiểm tra xem user có phải là admin không
 */
export const isAdmin = (user: AuthUser | null): boolean => {
    if (!user) return false;
    return user.role === 'admin' && user.isActive && user.isVerified;
};

/**
 * Kiểm tra quyền truy cập admin từ API response
 */
export const checkAdminAccess = async (): Promise<boolean> => {
    try {
        const response = await checkAuth();
        
        if (!response.success || !response.data?.user) {
            console.log('❌ API check auth thất bại hoặc không có user');
            return false;
        }

        const isAdminUser = isAdmin(response.data.user);
        console.log(isAdminUser ? '✅ Admin được phép truy cập' : '❌ Không phải admin');
        return isAdminUser;
    } catch (error) {
        console.error('❌ Lỗi khi kiểm tra quyền admin:', error);
        return false;
    }
};

/**
 * Xử lý chuyển hướng dựa trên quyền admin
 */
export const handleAdminAccess = async (router: AppRouter): Promise<boolean> => {
    const hasAccess = await checkAdminAccess();
    if (!hasAccess) {
        console.log('❌ Không phải admin');
        router.push('/auth/login');
    }
    return hasAccess;
};

export const hasAdminAccess = (user: AuthUser | null): boolean => {
    if (!user) return false;
    return isAdmin(user);
};

export const hasUserAccess = (user: AuthUser | null): boolean => {
    if (!user) return false;
    return user.isActive && user.isVerified;
}; 