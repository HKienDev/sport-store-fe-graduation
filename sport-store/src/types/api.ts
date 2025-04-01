import type { User, Product, Order, CartItem } from './base';
import type { LoginResponse, AuthCheckResponse, TokenVerifyResponse, ProfileResponse, GoogleAuthResponse } from './auth';

export type ApiResponseData = 
    | User 
    | User[] 
    | Product 
    | Product[] 
    | Order 
    | Order[] 
    | CartItem 
    | CartItem[]
    | LoginResponse['data']
    | AuthCheckResponse['data']
    | TokenVerifyResponse['data']
    | ProfileResponse['data']
    | GoogleAuthResponse['data']
    | { url: string }
    | null
    | undefined;

export interface ApiResponse<T = ApiResponseData> {
    success: boolean;
    message?: string;
    data?: T;
}

export interface ApiError {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
    response?: {
        data?: {
            message: string;
            errors?: Record<string, string[]>;
        };
    };
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ProductQueryParams extends PaginationParams {
    categoryId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    isActive?: boolean;
}

export interface OrderQueryParams extends PaginationParams {
    userId?: string;
    status?: Order['status'];
    paymentStatus?: Order['paymentStatus'];
    startDate?: string;
    endDate?: string;
}

export type { User, Product, Order, CartItem }; 