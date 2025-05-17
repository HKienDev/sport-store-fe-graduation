"use client";

import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TOKEN_CONFIG, getToken, setToken, clearTokens } from '@/config/token';
import { getUserData, setUserData, clearUserData } from '@/config/user';
import type { AuthUser } from '@/types/auth';
import { handleRedirect } from '@/utils/navigationUtils';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { SUCCESS_MESSAGES } from '@/config/constants';
import { UserRole } from '@/types/base';
import type {
    RegisterRequest,
    ResetPasswordRequest,
    VerifyOTPRequest,
    UpdateProfileRequest,
    LoginResponse
} from '@/types/auth';
import {
    register as registerService,
    logout as logoutService,
    verifyOTP as verifyOTPService,
    resendOTP as resendOTPService,
    forgotPassword as forgotPasswordService,
    resetPassword as resetPasswordService,
    updateProfile as updateProfileService,
    requestUpdate as requestUpdateService,
    updateUser as updateUserService,
    loginWithGoogle as loginWithGoogleService
} from '@/services/authService';
import { AxiosError } from 'axios';

// Constants
// const CHECK_INTERVAL = 5000; // 5 seconds

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<LoginResponse>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    verifyOTP: (data: VerifyOTPRequest) => Promise<void>;
    resendOTP: (data: { email: string }) => Promise<{ success: boolean }>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (data: ResetPasswordRequest) => Promise<void>;
    updateProfile: (data: UpdateProfileRequest) => Promise<void>;
    verifyAccount: (data: VerifyOTPRequest) => Promise<void>;
    requestUpdate: () => Promise<void>;
    updateUser: (data: UpdateProfileRequest) => Promise<void>;
    loginWithGoogle: (token: string) => Promise<{ success: boolean }>;
    setUser: (user: AuthUser | null) => void;
    checkAuthStatus: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const isAuthenticatingRef = useRef(false);
    const lastCheckRef = useRef<number>(0);
    const isInitializedRef = useRef(false);

    // Debug effect để theo dõi thay đổi trạng thái
    useEffect(() => {
        console.log("🔄 Auth state changed:", {
            user,
            isAuthenticated,
            loading,
            hasUser: !!user,
            userRole: user?.role
        });
    }, [user, isAuthenticated, loading]);

    const updateAuthState = useCallback((userData: AuthUser | null, isAuth: boolean) => {
        console.log("🔄 Updating auth state:", {
            userData,
            isAuth,
            currentUser: user,
            currentAuth: isAuthenticated
        });
        
        setUser(userData);
        setIsAuthenticated(isAuth);
        setLoading(false);
        
        if (userData) {
            setUserData(userData);
        }
    }, [user, isAuthenticated]);

    const checkAuthStatus = useCallback(async (): Promise<void> => {
        try {
            const now = Date.now();
            if (lastCheckRef.current && now - lastCheckRef.current < 5000) {
                console.log("⏳ Skipping auth check - too soon");
                return;
            }

            const accessToken = getToken('access');
            const refreshToken = getToken('refresh');
            const storedUser = getUserData();

            // DEBUG LOG
            console.log('[checkAuthStatus] accessToken:', accessToken, 'refreshToken:', refreshToken, 'storedUser:', storedUser);

            if (!accessToken && !refreshToken) {
                console.log("❌ No tokens found - clearing auth state");
                updateAuthState(null, false);
                clearUserData();
                return;
            }

            // Nếu có access token và stored user, sử dụng ngay
            if (accessToken && storedUser) {
                console.log("✅ Using stored user data with valid access token");
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                updateAuthState(storedUser, true);
                lastCheckRef.current = now;
                
                // Verify token ngầm
                try {
                    const response = await api.get("/auth/check");
                    // DEBUG LOG
                    console.log('[checkAuthStatus] /auth/check response:', response.data);
                    const userData = response.data.user || response.data.data;
                    if (response.data.success && userData) {
                        console.log("✅ Access token verified successfully");
                        updateAuthState(userData, true);
                        // DEBUG LOG
                        console.log('[checkAuthStatus] updateAuthState:', userData, true);
                    }
                } catch (error) {
                    console.error("❌ Error verifying access token:", error);
                    // Không xóa Authorization header ngay, để thử refresh token
                }
                return;
            }

            // Nếu có access token, verify nó
            if (accessToken) {
                try {
                    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                    const response = await api.get("/auth/check");
                    // DEBUG LOG
                    console.log('[checkAuthStatus] /auth/check response:', response.data);
                    const userData = response.data.user || response.data.data;
                    if (response.data.success && userData) {
                        console.log("✅ Access token is valid - updating user:", userData);
                        updateAuthState(userData, true);
                        // DEBUG LOG
                        console.log('[checkAuthStatus] updateAuthState:', userData, true);
                        lastCheckRef.current = now;
                        return;
                    }
                } catch (error) {
                    console.error("❌ Error verifying access token:", error);
                    // Không xóa Authorization header ngay, để thử refresh token
                }
            }

            // Nếu có refresh token, thử refresh
            if (refreshToken) {
                try {
                    console.log("🔄 Attempting to refresh token...");
                    const refreshResponse = await api.post("/auth/refresh-token", { refreshToken });
                    // DEBUG LOG
                    console.log('[checkAuthStatus] /auth/refresh-token response:', refreshResponse.data);
                    if (refreshResponse.data.success) {
                        const { accessToken: newAccessToken, refreshToken: newRefreshToken, user: userData } = refreshResponse.data.data;
                        
                        if (!userData) {
                            throw new Error("No user data in refresh response");
                        }
                        
                        console.log("✅ Token refresh successful - updating state:", userData);
                        // Lưu token mới
                        setToken(newAccessToken, 'access');
                        setToken(newRefreshToken, 'refresh');
                        // Cập nhật header cho API calls
                        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                        // Cập nhật state
                        updateAuthState(userData, true);
                        // DEBUG LOG
                        console.log('[checkAuthStatus] updateAuthState:', userData, true);
                        lastCheckRef.current = now;
                        return;
                    }
                } catch (refreshError) {
                    console.error("❌ Error refreshing token:", refreshError);
                    if (storedUser) {
                        console.log("⚠️ Using stored user data as fallback");
                        updateAuthState(storedUser, true);
                        // DEBUG LOG
                        console.log('[checkAuthStatus] updateAuthState:', storedUser, true);
                        return;
                    }
                }
            }

            // Chỉ xóa state nếu không có cách nào khác
            console.log("❌ Authentication failed - clearing state");
            updateAuthState(null, false);
            // DEBUG LOG
            console.log('[checkAuthStatus] updateAuthState:', null, false);
            clearUserData();
            clearTokens();
            delete api.defaults.headers.common['Authorization'];
        } catch (error) {
            console.error("Error checking auth status:", error);
            const storedUser = getUserData();
            if (storedUser) {
                console.log("⚠️ Error occurred, using stored user data as fallback");
                updateAuthState(storedUser, true);
                // DEBUG LOG
                console.log('[checkAuthStatus] updateAuthState:', storedUser, true);
            } else {
                updateAuthState(null, false);
                // DEBUG LOG
                console.log('[checkAuthStatus] updateAuthState:', null, false);
                clearTokens();
                clearUserData();
                delete api.defaults.headers.common['Authorization'];
            }
        }
    }, [updateAuthState]);

    // Khởi tạo state từ localStorage khi component mount
    useEffect(() => {
        const initializeAuth = async () => {
            // Kiểm tra nếu đã khởi tạo rồi thì không khởi tạo lại
            if (isInitializedRef.current) {
                return;
            }
            
            try {
                console.log("🚀 Initializing auth...");
                
                // Kiểm tra token từ localStorage và cookies
                const accessToken = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
                const storedUser = getUserData();
                
                const getCookie = (name: string) => {
                    const value = `; ${document.cookie}`;
                    const parts = value.split(`; ${name}=`);
                    if (parts.length === 2) return parts.pop()?.split(';').shift();
                    return null;
                };
                
                const cookieAccessToken = getCookie(TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME);
                const cookieRefreshToken = getCookie(TOKEN_CONFIG.REFRESH_TOKEN.COOKIE_NAME);
                
                // Ưu tiên sử dụng token từ localStorage
                const finalAccessToken = accessToken || cookieAccessToken;
                
                if (finalAccessToken) {
                    api.defaults.headers.common['Authorization'] = `Bearer ${finalAccessToken}`;
                }

                // Nếu có user data, set state
                if (storedUser) {
                    setUser(storedUser);
                    setIsAuthenticated(true);
                }

                // Chỉ gọi checkAuthStatus nếu có token hoặc user data
                if (finalAccessToken || storedUser) {
                    await checkAuthStatus();
                } else {
                    // Nếu không có token và user data, set loading = false và kết thúc
                    setLoading(false);
                }
                
                // Đồng bộ token giữa localStorage và cookies nếu cần
                if (!accessToken && cookieAccessToken) {
                    localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY, cookieAccessToken);
                }
                if (!localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY) && cookieRefreshToken) {
                    localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY, cookieRefreshToken);
                }
                
                // Đánh dấu đã khởi tạo
                isInitializedRef.current = true;
            } catch (error) {
                console.error("Error initializing auth:", error);
                clearTokens();
                clearUserData();
                setUser(null);
                setIsAuthenticated(false);
                setLoading(false);
            }
        };

        initializeAuth();
    }, [checkAuthStatus]);

    // Khi FE mount (hoặc sau login Google), luôn gọi checkAuthStatus để lấy user từ cookie
    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const login = async (email: string, password: string) => {
        try {
            if (isAuthenticatingRef.current) {
                console.log("⏳ Đang có request đăng nhập đang chạy, đợi kết quả");
                return { success: false, message: "Đang xử lý đăng nhập" };
            }

            isAuthenticatingRef.current = true;
            setLoading(true);
            console.log("🔑 Đang thử đăng nhập với email:", email);

            const response = await api.post("/auth/login", { email, password });
            console.log("📥 Login response:", response);

            if (!response.data) {
                console.error("❌ Không có dữ liệu trong response");
                return { success: false, message: "Không nhận được dữ liệu từ server" };
            }

            // Kiểm tra success từ response
            if (!response.data.success) {
                console.error("❌ Đăng nhập thất bại:", response.data.message);
                return { success: false, message: response.data.message };
            }

            // Lấy dữ liệu từ response.data.data
            const { accessToken, refreshToken, user } = response.data.data;

            if (!accessToken || !refreshToken || !user) {
                console.error("❌ Thiếu thông tin trong response:", response.data.data);
                return { success: false, message: "Dữ liệu đăng nhập không hợp lệ" };
            }

            // Lưu token
            setToken(accessToken, 'access');
            setToken(refreshToken, 'refresh');

            // Sau khi login thành công, luôn gọi checkAuthStatus để đồng bộ user từ BE
            console.log("✅ Đăng nhập thành công, đồng bộ user từ BE");
            await checkAuthStatus();

            // Cập nhật header cho các request tiếp theo
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

            console.log("✅ Đăng nhập thành công:", { user, isAuthenticated: true });
            return { success: true, message: SUCCESS_MESSAGES.LOGIN_SUCCESS, user };
        } catch (error) {
            console.error("❌ Lỗi đăng nhập:", error);
            setLoading(false);
            isAuthenticatingRef.current = false;
            return { 
                success: false, 
                message: error instanceof AxiosError 
                    ? error.response?.data?.message || "Đăng nhập thất bại" 
                    : "Đăng nhập thất bại" 
            };
        } finally {
            isAuthenticatingRef.current = false;
        }
    };

    const register = async (data: RegisterRequest) => {
        try {
            const response = await registerService(data);
            if (response.success) {
                toast.success(SUCCESS_MESSAGES.REGISTER_SUCCESS);
                await handleRedirect(router, null, window.location.pathname);
            }
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await logoutService();
            
            // Xóa tokens từ localStorage
            localStorage.removeItem(TOKEN_CONFIG.USER.STORAGE_KEY);
            localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
            localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY);
            
            // Xóa tokens từ cookies
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
            document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
            
            // Xóa Authorization header
            delete api.defaults.headers.common['Authorization'];
            
            // Cập nhật state
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
            
            toast.success(SUCCESS_MESSAGES.LOGOUT_SUCCESS);
            await handleRedirect(router, null, window.location.pathname);
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    };

    const verifyOTP = async (data: VerifyOTPRequest) => {
        try {
            await verifyOTPService(data);
            toast.success(SUCCESS_MESSAGES.ACCOUNT_VERIFIED);
            await handleRedirect(router, null, window.location.pathname);
        } catch (error) {
            console.error('OTP verification failed:', error);
            throw error;
        }
    };

    const resendOTP = async (data: { email: string }) => {
        try {
            setLoading(true);
            const response = await resendOTPService(data.email);
            console.log('Resend OTP response:', response);
            
            if (response.success) {
                setLoading(false);
                toast.success(SUCCESS_MESSAGES.ACCOUNT_VERIFIED);
                return { success: true };
            } else {
                setLoading(false);
                throw new Error(response.message || 'Gửi lại mã OTP thất bại');
            }
        } catch (error) {
            console.error('❌ Lỗi khi gửi lại mã OTP:', error);
            setLoading(false);
            throw error;
        }
    };

    const forgotPassword = async (email: string) => {
        try {
            await forgotPasswordService(email);
            toast.success(SUCCESS_MESSAGES.REGISTER_SUCCESS);
            await handleRedirect(router, null, window.location.pathname);
        } catch (error) {
            console.error('Forgot password failed:', error);
            throw error;
        }
    };

    const resetPassword = async (data: ResetPasswordRequest) => {
        try {
            await resetPasswordService(data.token, data.newPassword);
            toast.success(SUCCESS_MESSAGES.REGISTER_SUCCESS);
            await handleRedirect(router, null, window.location.pathname);
        } catch (error) {
            console.error('Reset password failed:', error);
            throw error;
        }
    };

    const updateProfile = async (data: UpdateProfileRequest) => {
        try {
            await updateProfileService(data);
            toast.success(SUCCESS_MESSAGES.UPDATE_PROFILE_SUCCESS);
            await handleRedirect(router, user, window.location.pathname);
        } catch (error) {
            console.error('Update profile failed:', error);
            throw error;
        }
    };

    const verifyAccount = async (data: VerifyOTPRequest) => {
        try {
            await verifyOTPService(data);
            toast.success(SUCCESS_MESSAGES.ACCOUNT_VERIFIED);
            await handleRedirect(router, null, window.location.pathname);
        } catch (error) {
            console.error('Account verification failed:', error);
            throw error;
        }
    };

    const requestUpdate = async () => {
        try {
            await requestUpdateService();
            toast.success(SUCCESS_MESSAGES.REGISTER_SUCCESS);
            await handleRedirect(router, user, window.location.pathname);
        } catch (error) {
            console.error('Request update failed:', error);
            throw error;
        }
    };

    const updateUser = async (data: UpdateProfileRequest) => {
        try {
            await updateUserService(data);
            toast.success(SUCCESS_MESSAGES.UPDATE_PROFILE_SUCCESS);
            await handleRedirect(router, user, window.location.pathname);
        } catch (error) {
            console.error('Update user failed:', error);
            throw error;
        }
    };

    const loginWithGoogle = async (token: string) => {
        try {
            setLoading(true);
            const response = await loginWithGoogleService(token);
            console.log('Google login response:', response);
            
            if (response.success && response.data?.user) {
                const userData = response.data.user as AuthUser;
                setUser(userData);
                setIsAuthenticated(true);
                setLoading(false);
                toast.success(SUCCESS_MESSAGES.LOGIN_SUCCESS);
                const urlParams = new URLSearchParams(window.location.search);
                const from = urlParams.get('from') || undefined;
                const redirectPath = from || (userData.role === UserRole.ADMIN ? '/admin/dashboard' : '/user');
                console.log('🔄 Redirecting after login:', redirectPath);
                await router.replace(redirectPath);
                return { success: true };
            } else {
                setUser(null);
                setIsAuthenticated(false);
                setLoading(false);
                throw new Error(response.message || 'Đăng nhập với Google thất bại');
            }
        } catch (error) {
            console.error('❌ Lỗi khi đăng nhập với Google:', error);
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
            throw error;
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        verifyOTP,
        resendOTP,
        forgotPassword,
        resetPassword,
        updateProfile,
        verifyAccount,
        requestUpdate,
        updateUser,
        loginWithGoogle,
        setUser,
        checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

