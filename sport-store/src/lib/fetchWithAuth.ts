import apiClient from './api';
import type { ApiResponse } from '@/types/api';

export const fetchWithAuth = async <T>(
    url: string,
    _options: RequestInit = {}
): Promise<ApiResponse<T>> => {
    try {
        // Kiểm tra xác thực bằng cách gọi API verify-token thay vì checkAuth
        const authResponse = await apiClient.auth.verifyToken();
        if (!authResponse.data.success) {
            throw new Error('Auth check failed');
        }

        const response = await fetch(url, {
            ..._options,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ..._options.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch with auth error:', error);
        throw error;
    }
}; 