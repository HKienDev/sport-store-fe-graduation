import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { AuthUser } from '@/types/auth';
import { debounce } from 'lodash';

// Định nghĩa enum UserRole
export enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
}

// Thời gian chờ chuyển hướng (ms)
const REDIRECT_DELAY = 300;

// Trạng thái chuyển hướng
let isRedirecting = false;

// Debounced version của handleRedirect
export const handleRedirect = debounce(async (
    router: AppRouterInstance,
    user: AuthUser | null,
    currentPath: string
): Promise<void> => {
    try {
        console.log('[handleRedirect] Bắt đầu chuyển hướng:', { user, currentPath });
        if (isRedirecting) {
            console.log('[handleRedirect] ⚠️ Đang trong quá trình chuyển hướng, bỏ qua');
            return;
        }
        if (!router) {
            console.warn('[handleRedirect] ⚠️ Router không khả dụng, không thể chuyển hướng');
            return;
        }
        isRedirecting = true;
        let redirectPath = '/';
        let reason = '';
        if (user) {
            console.log('[handleRedirect] 👤 User info:', user);
            if (user.role === UserRole.ADMIN) {
                redirectPath = '/admin/dashboard';
                reason = 'role=admin';
            } else {
                redirectPath = '/user';
                reason = 'role=user';
            }
            if (currentPath.startsWith('/auth/')) {
                if (redirectPath === currentPath) {
                    console.log('[handleRedirect] ⚠️ Đường dẫn chuyển hướng giống với đường dẫn hiện tại, bỏ qua');
                    isRedirecting = false;
                    return;
                }
            }
        } else {
            if (currentPath.startsWith('/admin/') || currentPath.startsWith('/user/')) {
                redirectPath = '/auth/login';
                reason = 'no user, cần xác thực';
            }
        }
        console.log('[handleRedirect] 🔄 Thực hiện chuyển hướng:', { from: currentPath, to: redirectPath, hasUser: !!user, userRole: user?.role, reason });
        await router.push(redirectPath);
        await new Promise(resolve => setTimeout(resolve, REDIRECT_DELAY));
        isRedirecting = false;
    } catch (error) {
        console.error('[handleRedirect] ❌ Lỗi khi chuyển hướng:', error);
        isRedirecting = false;
        throw error;
    }
}, 500); 