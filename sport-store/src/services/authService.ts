import type { 
    VerifyOTPRequest, 
    UpdateProfileRequest,
    GoogleAuthResponse,
    LoginResponse,
    AuthCheckResponse,
    TokenVerifyResponse,
    ProfileResponse,
    EmptyResponse,
    AuthUser
} from '@/types/auth';
import apiClient from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import { isAdmin } from '@/utils/roleUtils';
import { setAuthCookies, clearAuthCookies } from '@/utils/cookieUtils';
import { setAuthStorage, clearAuthStorage } from '@/utils/storageUtils';
import { TOKEN_CONFIG } from '@/config/token';
import { AxiosError } from 'axios';
import axios from 'axios';

interface AuthData {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
}

const setAuthData = ({ accessToken, refreshToken, user }: AuthData): void => {
    // Set data in both cookies and localStorage
    setAuthCookies(accessToken, refreshToken, JSON.stringify(user));
    setAuthStorage(accessToken, refreshToken, user);
    
    // Log role check
    console.log('🔑 User role:', user.role);
    console.log('👑 Is admin:', isAdmin(user));
};

// Auth service functions
export const login = async (email: string, password: string): Promise<ApiResponse<LoginResponse['data']>> => {
    try {
        console.log('🔐 Making login request to:', `/auth/login`);
        const response = await apiClient.auth.login(email, password);
        console.log('📥 Login response:', response.data);
        
        if (response.data.success && response.data.data) {
            const { user, accessToken, refreshToken } = response.data.data;
            // Lưu thông tin xác thực
            setAuthData({ accessToken, refreshToken, user });
            
            // Log role check
            console.log('🔑 User role:', user.role);
            console.log('👑 Is admin:', isAdmin(user));

            // Không redirect ở đây, để component xử lý
        }
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.code === 'ERR_NETWORK') {
                console.error('🚨 Network error - Kiểm tra kết nối mạng hoặc server');
            } else if (error.response?.status === 401) {
                console.error('🚨 Sai email hoặc mật khẩu');
            } else if (error.response?.status === 403) {
                console.error('🚨 Tài khoản bị khóa');
            } else {
                console.error('🚨 Login request error:', error.message);
            }
        } else {
            console.error('🚨 Login request error:', error);
        }
        throw error;
    }
};

export const register = async (data: { email: string; password: string; name: string }): Promise<ApiResponse<LoginResponse['data']>> => {
    try {
        const response = await apiClient.auth.register(data);
        return response.data;
    } catch (error) {
        console.error('Register error:', error);
        throw error;
    }
};

export const logout = async (): Promise<ApiResponse<EmptyResponse>> => {
    try {
        const response = await apiClient.auth.logout();
        clearAuthData();
        return response.data;
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
};

export const forgotPassword = async (email: string): Promise<ApiResponse<EmptyResponse['data']>> => {
    try {
        const response = await apiClient.auth.forgotPassword(email);
        return response.data;
    } catch (error) {
        console.error('Forgot password error:', error);
        throw error;
    }
};

export const resetPassword = async (token: string, newPassword: string): Promise<ApiResponse<EmptyResponse['data']>> => {
    try {
        const response = await apiClient.auth.resetPassword(token, newPassword);
        return response.data;
    } catch (error) {
        console.error('Reset password error:', error);
        throw error;
    }
};

export const verifyOTP = async (data: VerifyOTPRequest): Promise<ApiResponse<EmptyResponse['data']>> => {
    try {
        const response = await apiClient.auth.verifyOTP(data);
        return response.data;
    } catch (error) {
        console.error('Verify OTP error:', error);
        throw error;
    }
};

export const resendOTP = async (email: string): Promise<ApiResponse<EmptyResponse['data']>> => {
    try {
        const response = await apiClient.auth.resendOTP(email);
        if (response.data.success) {
            return response.data;
        }
        return response.data;
    } catch (error) {
        console.error('Resend OTP error:', error);
        throw error;
    }
};

export const updateProfile = async (data: UpdateProfileRequest): Promise<ApiResponse<ProfileResponse['data']>> => {
    try {
        const response = await apiClient.auth.updateProfile(data);
        if (response.data.success && response.data.data?.user) {
            const { user } = response.data.data;
            const userStr = JSON.stringify(user);
            localStorage.setItem(TOKEN_CONFIG.USER.STORAGE_KEY, userStr);
            document.cookie = `${TOKEN_CONFIG.USER.COOKIE_NAME}=${userStr}; path=/; secure; samesite=strict`;
            
            // Log role check
            console.log('🔑 User role:', user.role);
            console.log('👑 Is admin:', isAdmin(user));
        }
        return response.data;
    } catch (error) {
        console.error('Update profile error:', error);
        throw error;
    }
};

export const changePassword = async (data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<EmptyResponse['data']>> => {
    try {
        const response = await apiClient.auth.changePassword(data);
        return response.data;
    } catch (error) {
        console.error('Change password error:', error);
        throw error;
    }
};

export const googleAuth = async (): Promise<ApiResponse<{ url: string }>> => {
    try {
        const response = await apiClient.auth.googleAuth();
        return response.data;
    } catch (error) {
        console.error('Google auth error:', error);
        throw error;
    }
};

export const googleCallback = async (code: string): Promise<ApiResponse<GoogleAuthResponse['data']>> => {
    try {
        const response = await apiClient.auth.googleCallback(code);
        if (response.data.success && response.data.data) {
            const { user, accessToken, refreshToken } = response.data.data;
            setAuthData({ accessToken, refreshToken, user });
            
            // Log role check
            console.log('🔑 User role:', user.role);
            console.log('👑 Is admin:', isAdmin(user));
            
            // Không redirect ở đây, để component/context xử lý
        }
        return response.data;
    } catch (error) {
        console.error('Google callback error:', error);
        throw error;
    }
};

export const verifyAccount = async (data: VerifyOTPRequest): Promise<ApiResponse<EmptyResponse['data']>> => {
    try {
        const response = await apiClient.auth.verifyAccount(data);
        return response.data;
    } catch (error) {
        console.error('Verify account error:', error);
        throw error;
    }
};

export const requestUpdate = async (): Promise<ApiResponse<EmptyResponse['data']>> => {
    try {
        const response = await apiClient.auth.requestUpdate();
        return response.data;
    } catch (error) {
        console.error('Request update error:', error);
        throw error;
    }
};

export const updateUser = async (data: UpdateProfileRequest): Promise<ApiResponse<ProfileResponse['data']>> => {
    try {
        const response = await apiClient.auth.updateUser(data);
        if (response.data.success && response.data.data) {
            localStorage.setItem(TOKEN_CONFIG.USER.STORAGE_KEY, JSON.stringify(response.data.data));
            document.cookie = `${TOKEN_CONFIG.USER.COOKIE_NAME}=${JSON.stringify(response.data.data)}; path=/;`;
        }
        return response.data;
    } catch (error) {
        console.error('Update user error:', error);
        throw error;
    }
};

export const getProfile = async (): Promise<ApiResponse<ProfileResponse['data']>> => {
    try {
        const response = await apiClient.auth.getProfile();
        if (response.data.success && response.data.data?.user) {
            const { user } = response.data.data;
            const userStr = JSON.stringify(user);
            localStorage.setItem(TOKEN_CONFIG.USER.STORAGE_KEY, userStr);
            document.cookie = `${TOKEN_CONFIG.USER.COOKIE_NAME}=${userStr}; path=/; secure; samesite=strict`;
        }
        return response.data;
    } catch (error) {
        console.error('Get profile error:', error);
        throw error;
    }
};

export const verifyToken = async (): Promise<ApiResponse<TokenVerifyResponse['data']>> => {
    try {
        const response = await apiClient.auth.verifyToken();
        return response.data;
    } catch (error) {
        console.error('Verify token error:', error);
        throw error;
    }
};

export const checkAuth = async (): Promise<ApiResponse<AuthCheckResponse>> => {
    try {
        // Thêm delay 1s để tránh race condition sau khi login
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = await apiClient.auth.check();
        if (response.data.success && response.data.data) {
            const { user } = response.data.data;
            // Cập nhật thông tin user trong localStorage và cookie
            const userStr = JSON.stringify(user);
            localStorage.setItem(TOKEN_CONFIG.USER.STORAGE_KEY, userStr);
            document.cookie = `${TOKEN_CONFIG.USER.COOKIE_NAME}=${userStr}; path=/; secure; samesite=strict`;
        }
        return response.data;
    } catch (error) {
        // Nếu lỗi CORS hoặc Network, thử lấy user từ localStorage
        if (error instanceof AxiosError) {
            if (error.code === 'ERR_NETWORK' || error.message?.includes('CORS')) {
                const userStr = localStorage.getItem(TOKEN_CONFIG.USER.STORAGE_KEY);
                if (userStr) {
                    const user = JSON.parse(userStr);
                    return {
                        success: true,
                        message: 'Loaded user from cache',
                        data: { user }
                    } as ApiResponse<AuthCheckResponse>;
                }
            }
        }
        console.error('Auth check error:', error);
        throw error;
    }
};

export const getCurrentUser = async (): Promise<ApiResponse<ProfileResponse['data']>> => {
    try {
        const response = await apiClient.auth.getProfile();
        return response.data;
    } catch (error) {
        console.error('Get current user error:', error);
        throw error;
    }
};

export const refreshToken = async (): Promise<ApiResponse<LoginResponse['data']>> => {
    try {
        const response = await apiClient.auth.refreshToken();
        return response.data;
    } catch (error) {
        console.error('Refresh token error:', error);
        throw error;
    }
};

export const loginWithGoogle = async (token: string): Promise<ApiResponse<LoginResponse['data']>> => {
    try {
        const response = await apiClient.auth.googleCallback(token);
        if (response.data.success && response.data.data) {
            const { user, accessToken, refreshToken } = response.data.data;
            setAuthData({ accessToken, refreshToken, user });
        }
        return response.data;
    } catch (error) {
        console.error('Login with Google error:', error);
        throw error;
    }
};

function clearAuthData(): void {
    // Clear cookies and localStorage
    clearAuthCookies();
    clearAuthStorage();
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const checkAuthStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/auth/check`);
    return response.data;
  } catch (error) {
    console.error('Error checking auth status:', error);
    return { isAuthenticated: false };
  }
}; 