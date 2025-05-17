import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { API_URL } from '@/utils/api';
import type { 
    ApiResponse, 
    PaginatedResponse,
    ProductQueryParams,
    OrderQueryParams
} from '@/types/api';
import type {
    Product,
    Category,
    Order,
    UploadResponse,
    CartItem,
    CreateProductData,
    UpdateProductData,
    CreateOrderData,
    UpdateOrderData
} from '@/types/base';
import type {
    LoginResponse,
    VerifyOTPRequest,
    UpdateProfileRequest,
    GoogleAuthResponse,
    ProfileResponse,
    AuthCheckResponse,
    TokenVerifyResponse,
    EmptyResponse
} from '@/types/auth';
import type { AxiosResponse } from 'axios';
import { TOKEN_CONFIG, getToken, setToken, clearTokens } from '@/config/token';

// Mở rộng kiểu AxiosInstance để thêm phương thức setAuthToken
interface CustomAxiosInstance extends AxiosInstance {
    setAuthToken: (token: string | null) => void;
}

// Mở rộng kiểu InternalAxiosRequestConfig để thêm thuộc tính _retry
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// Khởi tạo axiosInstance với cấu hình mặc định
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 10000, // Thêm timeout 10s
    // Thêm các cấu hình retry
    validateStatus: function (status) {
        return status >= 200 && status < 500; // Chỉ reject khi status >= 500
    }
}) as CustomAxiosInstance;

// Flag để kiểm soát việc refresh token
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

// Rate limiting cho refresh token
let lastRefreshTime = 0;
const REFRESH_COOLDOWN = 5000; // 5 giây
const MAX_REFRESH_ATTEMPTS = 3; // Số lần thử refresh tối đa
let refreshAttempts = 0;

// Kiểm tra xem có thể refresh token không
const canRefresh = () => {
    const now = Date.now();
    if (now - lastRefreshTime < REFRESH_COOLDOWN) {
        return false;
    }
    if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
        return false;
    }
    return true;
};

// Reset số lần thử refresh
const resetRefreshAttempts = () => {
    refreshAttempts = 0;
    lastRefreshTime = Date.now();
};

// Thêm interceptor để tự động thêm token vào header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken('access');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Thêm interceptor để xử lý refresh token
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        // Log lỗi chi tiết
        console.error('API Error:', {
            config: error.config,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });

        // Xử lý lỗi network
        if (error.message === 'Network Error') {
            console.error('Network Error - Kiểm tra kết nối mạng hoặc server');
            return Promise.reject(new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.'));
        }

        // Xử lý timeout
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout');
            return Promise.reject(new Error('Yêu cầu quá thời gian. Vui lòng thử lại.'));
        }

        const originalRequest = error.config as CustomAxiosRequestConfig | undefined;
        
        console.log('🔍 API Error:', {
            status: error.response?.status,
            url: originalRequest?.url,
            method: originalRequest?.method,
            isRetry: originalRequest?._retry
        });
        
        // Kiểm tra nếu lỗi 401 và chưa thử refresh
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            console.log('🔄 Bắt đầu quá trình refresh token');
            console.log('- isRefreshing:', isRefreshing);
            console.log('- refreshAttempts:', refreshAttempts);
            
            if (isRefreshing) {
                console.log('⏳ Đang có refresh token đang xử lý, thêm request vào queue');
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                });
            }
            
            originalRequest._retry = true;
            isRefreshing = true;
            
            try {
                // Kiểm tra xem có thể refresh không
                const canRefreshResult = canRefresh();
                console.log('✅ Có thể refresh token:', canRefreshResult);
                
                if (!canRefreshResult) {
                    console.log('❌ Không thể refresh token, clear tokens và chuyển hướng');
                    clearTokens();
                    window.location.href = '/auth/login';
                    return Promise.reject(error);
                }
                
                refreshAttempts++;
                console.log('🔢 Số lần thử refresh:', refreshAttempts);
                
                // Lấy refresh token từ localStorage
                const refreshToken = getToken('refresh');
                console.log('🎟️ Refresh token exists:', !!refreshToken);
                
                if (!refreshToken) {
                    console.log('❌ Không tìm thấy refresh token, clear tokens và chuyển hướng');
                    clearTokens();
                    window.location.href = '/auth/login';
                    return Promise.reject(error);
                }
                
                // Gọi API refresh token
                console.log('📤 Gọi API refresh token');
                const response = await axiosInstance.post('/auth/refresh-token', { refreshToken });
                console.log('📥 Kết quả refresh token:', response.data);
                
                if (response.data.success && response.data.data) {
                    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
                    
                    // Cập nhật tokens
                    setToken(accessToken, 'access');
                    setToken(newRefreshToken, 'refresh');
                    
                    // Reset các biến kiểm soát
                    resetRefreshAttempts();
                    isRefreshing = false;
                    
                    // Thêm token mới vào header của request gốc
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    
                    // Xử lý các request đang chờ
                    failedQueue.forEach(({ resolve }) => {
                        resolve();
                    });
                    failedQueue = [];
                    
                    // Thử lại request gốc
                    return axiosInstance(originalRequest);
                } else {
                    throw new Error('Invalid refresh token response');
                }
            } catch (refreshError) {
                console.error('❌ Lỗi khi refresh token:', refreshError);
                
                // Clear tokens và chuyển hướng
                clearTokens();
                window.location.href = '/auth/login';
                
                // Reject tất cả các request đang chờ
                failedQueue.forEach(({ reject }) => {
                    reject(refreshError);
                });
                failedQueue = [];
                
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        
        return Promise.reject(error);
    }
);

// Thêm phương thức setAuthToken vào axiosInstance
axiosInstance.setAuthToken = (token: string | null) => {
    if (token) {
        setToken(token, 'access');
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        clearTokens();
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    try {
        const response = await fetch(`${API_URL}${url}`, {
            ...options,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Tạo instance Axios khác nếu cần
export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 10000,
    validateStatus: (status) => status >= 200 && status < 500
});

// Thêm interceptor để xử lý refresh token
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig | undefined;
        
        console.log('🔍 API Error:', {
            status: error.response?.status,
            url: originalRequest?.url,
            method: originalRequest?.method,
            isRetry: originalRequest?._retry
        });
        
        // Kiểm tra nếu lỗi 401 và chưa thử refresh
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            console.log('🔄 Bắt đầu quá trình refresh token');
            console.log('- isRefreshing:', isRefreshing);
            console.log('- refreshAttempts:', refreshAttempts);
            
            if (isRefreshing) {
                console.log('⏳ Đang có refresh token đang xử lý, thêm request vào queue');
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                });
            }
            
            originalRequest._retry = true;
            isRefreshing = true;
            
            try {
                // Kiểm tra xem có thể refresh không
                const canRefreshResult = canRefresh();
                console.log('✅ Có thể refresh token:', canRefreshResult);
                
                if (!canRefreshResult) {
                    console.log('❌ Không thể refresh token, clear tokens và chuyển hướng');
                    clearTokens();
                    window.location.href = '/auth/login';
                    return Promise.reject(error);
                }
                
                refreshAttempts++;
                console.log('🔢 Số lần thử refresh:', refreshAttempts);
                
                // Lấy refresh token từ localStorage
                const refreshToken = getToken('refresh');
                console.log('🎟️ Refresh token exists:', !!refreshToken);
                
                if (!refreshToken) {
                    console.log('❌ Không tìm thấy refresh token, clear tokens và chuyển hướng');
                    clearTokens();
                    window.location.href = '/auth/login';
                    return Promise.reject(error);
                }
                
                // Gọi API refresh token
                console.log('📤 Gọi API refresh token');
                const response = await api.post('/auth/refresh-token', { refreshToken });
                console.log('📥 Kết quả refresh token:', response.data);
                
                if (response.data.success && response.data.data) {
                    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
                    
                    // Cập nhật tokens
                    localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY, accessToken);
                    localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY, newRefreshToken);
                    
                    // Reset các biến kiểm soát
                    resetRefreshAttempts();
                    isRefreshing = false;
                    
                    // Thêm token mới vào header của request gốc
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    
                    // Xử lý các request đang chờ
                    failedQueue.forEach(({ resolve }) => {
                        resolve();
                    });
                    failedQueue = [];
                    
                    // Thử lại request gốc
                    return api(originalRequest);
                } else {
                    throw new Error('Invalid refresh token response');
                }
            } catch (refreshError) {
                console.error('❌ Lỗi khi refresh token:', refreshError);
                
                // Clear tokens và chuyển hướng
                clearTokens();
                window.location.href = '/auth/login';
                
                // Reject tất cả các request đang chờ
                failedQueue.forEach(({ reject }) => {
                    reject(refreshError);
                });
                failedQueue = [];
                
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        
        return Promise.reject(error);
    }
);

// API methods
const apiClient = {
    // Thêm phương thức setAuthToken vào apiClient
    setAuthToken: (token: string | null) => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }
    },
    
    // Thêm các phương thức HTTP trực tiếp vào apiClient
    get: (url: string, config?: AxiosRequestConfig) => api.get(url, config),
    post: (url: string, data?: unknown, config?: AxiosRequestConfig) => api.post(url, data, config),
    put: (url: string, data?: unknown, config?: AxiosRequestConfig) => api.put(url, data, config),
    delete: (url: string, config?: AxiosRequestConfig) => api.delete(url, config),
    
    // Auth
    auth: {
        login: async (email: string, password: string) => {
            try {
                console.log('🔐 Making login request to:', `${API_URL}/auth/login`);
                const response = await api.post<ApiResponse<LoginResponse['data']>>('/auth/login', { email, password });
                console.log('📥 Login response:', response.data);
                return response;
            } catch (error) {
                console.error('🚨 Login request error:', error);
                throw error;
            }
        },
        register: async (data: { email: string; password: string; name: string }) => {
            return api.post<ApiResponse<LoginResponse['data']>>('/auth/register', data);
        },
        logout: async () => {
            try {
                const response = await api.post<ApiResponse<EmptyResponse>>('/auth/logout');
                // Xóa cookies và localStorage khi logout
                document.cookie.split(';').forEach(cookie => {
                    const [name] = cookie.split('=');
                    document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                });
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                return response;
            } catch (error) {
                console.error('Logout error:', error);
                throw error;
            }
        },
        forgotPassword: async (email: string) => {
            return api.post<ApiResponse<EmptyResponse['data']>>('/auth/forgot-password', { email });
        },
        resetPassword: async (token: string, password: string) => {
            return api.post<ApiResponse<EmptyResponse['data']>>('/auth/reset-password', { token, password });
        },
        verifyOTP: async (data: VerifyOTPRequest) => {
            return api.post<ApiResponse<EmptyResponse['data']>>('/auth/verify-otp', data);
        },
        resendOTP: async (email: string) => {
            return api.post<ApiResponse<EmptyResponse['data']>>('/auth/resend-otp', { email });
        },
        updateProfile: async (data: UpdateProfileRequest) => {
            return api.put<ApiResponse<ProfileResponse['data']>>('/auth/profile', data);
        },
        changePassword: async (data: { currentPassword: string; newPassword: string }) => {
            return api.post<ApiResponse<EmptyResponse['data']>>('/auth/change-password', data);
        },
        googleAuth: async () => {
            return api.get<ApiResponse<{ url: string }>>('/auth/google');
        },
        googleCallback: async (code: string) => {
            return api.get<ApiResponse<GoogleAuthResponse['data']>>(`/auth/google/callback?code=${code}`);
        },
        verifyAccount: async (data: VerifyOTPRequest) => {
            return api.post<ApiResponse<EmptyResponse['data']>>('/auth/verify-account', data);
        },
        requestUpdate: async () => {
            return api.post<ApiResponse<EmptyResponse['data']>>('/auth/request-update');
        },
        updateUser: async (data: UpdateProfileRequest) => {
            return api.put<ApiResponse<ProfileResponse['data']>>('/auth/user', data);
        },
        getProfile: async () => {
            return api.get<ApiResponse<ProfileResponse['data']>>('/auth/profile');
        },
        verifyToken: async () => {
            return api.get<ApiResponse<TokenVerifyResponse['data']>>('/auth/verify-token');
        },
        check: async () => {
            try {
                const token = getToken('access');
                if (!token) {
                    throw new Error('No token found');
                }
                
                const response = await api.get<ApiResponse<AuthCheckResponse>>('/api/auth/check', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Cache-Control': 'no-cache'
                    }
                });
                
                return response;
            } catch (error) {
                console.error('Auth check error:', error);
                throw error;
            }
        },
        refreshToken: async () => {
            return api.post<ApiResponse<LoginResponse['data']>>('/auth/refresh-token');
        }
    },

    // Products
    products: {
        getAll: (params?: ProductQueryParams): Promise<AxiosResponse<ApiResponse<PaginatedResponse<Product>>>> =>
            api.get(`/products`, { params }),
        
        getById: (id: string): Promise<AxiosResponse<ApiResponse<Product>>> =>
            api.get(`/products/${id}`),
        
        create: (data: CreateProductData): Promise<AxiosResponse<ApiResponse<Product>>> => {
            // Lấy token từ localStorage
            const token = getToken('access');
            
            if (!token) {
                console.error('No token found for product creation');
                throw new Error('No token found');
            }
            
            console.log('Creating product with token:', token);
            console.log('Product data being sent:', JSON.stringify(data, null, 2));
            
            return api.post(`/products`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then(response => {
                console.log('Product creation response:', response);
                return response;
            }).catch(error => {
                console.error('Product creation error:', error);
                if (error.response) {
                    console.error('Error response data:', error.response.data);
                    console.error('Error response status:', error.response.status);
                }
                throw error;
            });
        },
        
        update: (id: string, data: UpdateProductData): Promise<AxiosResponse<ApiResponse<Product>>> =>
            api.put(`/products/${id}`, data),
        
        delete: (id: string): Promise<AxiosResponse<ApiResponse<Product>>> =>
            api.delete(`/products/${id}`)
    },

    // Categories
    categories: {
        getAll: (params?: { page?: string; limit?: string; search?: string }): Promise<AxiosResponse<ApiResponse<Category[]>>> =>
            api.get(`/categories`, { params }),
        
        getById: (categoryId: string): Promise<AxiosResponse<ApiResponse<Category>>> =>
            api.get(`/categories/${categoryId}`),
        
        create: (data: { name: string; slug: string; parentId?: string }): Promise<AxiosResponse<ApiResponse<Category>>> =>
            api.post(`/categories`, data),
        
        update: (categoryId: string, data: { name: string; slug: string; parentId?: string }): Promise<AxiosResponse<ApiResponse<Category>>> =>
            api.put(`/categories/${categoryId}`, data),
        
        delete: (categoryId: string): Promise<AxiosResponse<ApiResponse>> =>
            api.delete(`/categories/${categoryId}`)
    },

    // Orders
    orders: {
        getAll: (params?: OrderQueryParams): Promise<AxiosResponse<ApiResponse<PaginatedResponse<Order>>>> =>
            api.get(`/orders`, { params }),
        
        getById: (id: string): Promise<AxiosResponse<ApiResponse<Order>>> =>
            api.get(`/orders/${id}`),
        
        create: (data: CreateOrderData): Promise<AxiosResponse<ApiResponse<Order>>> =>
            api.post(`/orders`, data),
        
        update: (id: string, data: UpdateOrderData): Promise<AxiosResponse<ApiResponse<Order>>> =>
            api.put(`/orders/${id}`, data),
        
        delete: (id: string): Promise<AxiosResponse<ApiResponse>> =>
            api.delete(`/orders/${id}`),
        
        getByPhone: (phone: string): Promise<AxiosResponse<ApiResponse<Order[]>>> =>
            api.get(`/orders/by-phone`, { params: { phone } })
    },

    // Upload
    upload: {
        uploadFile: (file: File) => {
            const formData = new FormData();
            formData.append('file', file);
            return api.post<ApiResponse<UploadResponse>>('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        }
    },

    // Cart
    cart: {
        getCart: (): Promise<AxiosResponse<ApiResponse<CartItem[]>>> =>
            api.get(`/cart`),
        
        addToCart: (data: { sku: string; quantity: number; color?: string; size?: string }) =>
            api.post<ApiResponse<CartItem[]>>('/cart/add', data),
        
        updateCart: (data: { sku: string; quantity: number; color?: string; size?: string }) =>
            api.put<ApiResponse<CartItem[]>>('/cart/update', data),
        
        removeFromCart: (data: { sku: string; color?: string; size?: string }) =>
            api.post<ApiResponse<CartItem[]>>('/cart/remove', data),
        
        clearCart: () =>
            api.delete<ApiResponse<EmptyResponse['data']>>('/cart'),
    }
};

// Export apiClient làm default export
export default apiClient;