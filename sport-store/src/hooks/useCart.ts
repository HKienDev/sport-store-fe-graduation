import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/authContext';
import apiClient from '@/lib/api';
import { useApiCall } from './useApiCall';
import type { CartItem } from '@/types/base';
import type { EmptyResponse } from '@/types/auth';
import { SUCCESS_MESSAGES } from '@/config/constants';

export function useCart() {
    const { user } = useAuth();
    const { execute: executeCartApiCall } = useApiCall<CartItem[]>();
    const { execute: executeClearCartApiCall } = useApiCall<EmptyResponse['data']>();

    const addToCart = useCallback(async (sku: string, quantity: number = 1, color?: string, size?: string) => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
            return;
        }

        return await executeCartApiCall(
            () => apiClient.cart.addToCart({ sku, quantity, color, size }),
            { onSuccess: () => toast.success(SUCCESS_MESSAGES.ADD_TO_CART_SUCCESS) }
        );
    }, [user, executeCartApiCall]);

    const updateCartItem = useCallback(async (sku: string, quantity: number, color?: string, size?: string) => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để cập nhật giỏ hàng');
            return;
        }

        return await executeCartApiCall(
            () => apiClient.cart.updateCart({ sku, quantity, color, size }),
            { onSuccess: () => toast.success(SUCCESS_MESSAGES.UPDATE_CART_SUCCESS) }
        );
    }, [user, executeCartApiCall]);

    const removeFromCart = useCallback(async (sku: string, color?: string, size?: string) => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để xóa khỏi giỏ hàng');
            return;
        }

        return await executeCartApiCall(
            () => apiClient.cart.removeFromCart({ sku, color, size }),
            { onSuccess: () => toast.success(SUCCESS_MESSAGES.REMOVE_FROM_CART_SUCCESS) }
        );
    }, [user, executeCartApiCall]);

    const clearCart = useCallback(async () => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để xóa giỏ hàng');
            return;
        }

        return await executeClearCartApiCall(
            () => apiClient.cart.clearCart(),
            { onSuccess: () => toast.success(SUCCESS_MESSAGES.CLEAR_CART_SUCCESS) }
        );
    }, [user, executeClearCartApiCall]);

    return {
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart
    };
} 