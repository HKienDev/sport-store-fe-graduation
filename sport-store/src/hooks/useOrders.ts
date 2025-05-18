import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/authContext';
import { useToast } from '@/hooks/useToast';
import apiClient from '@/lib/api';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/constants';
import type { Order, OrderQueryParams } from '@/types/api';
import type { CreateOrderData, UpdateOrderData } from '@/types/base';
import { OrderStatus, PaymentStatus } from '@/types/base';
import { sendEmailFromTemplate } from '@/lib/email';
import NewOrderEmail from '@/email-templates/NewOrderEmail';

export function useOrders(options: OrderQueryParams = {}) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated, user } = useAuth();
    const { toast } = useToast();

    const fetchOrders = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await apiClient.orders.getAll(options);
            if (response.data.success && response.data.data) {
                setOrders(response.data.data.items);
                setTotal(response.data.data.total);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError(ERROR_MESSAGES.NETWORK_ERROR);
            toast({
                title: "Lỗi",
                description: ERROR_MESSAGES.NETWORK_ERROR,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    }, [options, toast]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated, fetchOrders]);

    const getOrderById = async (id: string) => {
        try {
            const response = await apiClient.orders.getById(id);
            if (!response.data.data) {
                throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
            }
            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch order:', error);
            toast({
                title: "Lỗi",
                description: ERROR_MESSAGES.NETWORK_ERROR,
                variant: "destructive"
            });
            throw error;
        }
    };

    const createOrder = async (data: CreateOrderData) => {
        try {
            if (!user) {
                throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
            }

            if (!data.phone) {
                throw new Error('Số điện thoại là bắt buộc');
            }

            const orderData: CreateOrderData = {
                ...data,
                status: OrderStatus.PENDING,
                paymentStatus: PaymentStatus.PENDING,
                phone: data.phone
            };

            const response = await apiClient.orders.create(orderData);
            if (!response.data.data) {
                throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
            }
            const order = response.data.data;
            // Gửi email xác nhận đơn hàng cho user
            try {
                await sendEmailFromTemplate({
                    to: order.shippingAddress?.email || user.email,
                    subject: `Xác nhận đơn hàng #${order.shortId} từ Sport Store`,
                    template: NewOrderEmail,
                    templateProps: {
                        shortId: order.shortId,
                        shippingAddress: order.shippingAddress,
                        items: order.items,
                        createdAt: order.createdAt,
                        subtotal: order.subtotal,
                        directDiscount: order.directDiscount,
                        couponDiscount: order.couponDiscount,
                        shippingFee: order.shippingFee,
                        totalPrice: order.totalPrice,
                        paymentMethod: order.paymentMethod,
                        paymentStatus: order.paymentStatus,
                    }
                });
            } catch (emailError) {
                console.error('Gửi email xác nhận đơn hàng thất bại:', emailError);
            }
            toast({
                title: "Thành công",
                description: SUCCESS_MESSAGES.ORDER_CREATED,
                variant: "default"
            });
            return order;
        } catch (error) {
            console.error('Failed to create order:', error);
            toast({
                title: "Lỗi",
                description: ERROR_MESSAGES.ORDER_CREATE_ERROR,
                variant: "destructive"
            });
            throw error;
        }
    };

    const cancelOrder = async (id: string) => {
        try {
            const updateData: UpdateOrderData = {
                id,
                status: OrderStatus.CANCELLED
            };

            const response = await apiClient.orders.update(id, updateData);
            if (!response.data.data) {
                throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
            }
            toast({
                title: "Thành công",
                description: SUCCESS_MESSAGES.ORDER_CANCELLED,
                variant: "default"
            });
            fetchOrders();
        } catch (error) {
            console.error('Failed to cancel order:', error);
            toast({
                title: "Lỗi",
                description: ERROR_MESSAGES.ORDER_CANCEL_ERROR,
                variant: "destructive"
            });
            throw error;
        }
    };

    const fetchOrdersByPhone = async (phone: string) => {
        try {
            setIsLoading(true);
            const response = await apiClient.orders.getByPhone(phone);
            setOrders(response.data.data || []);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải đơn hàng');
        } finally {
            setIsLoading(false);
        }
    };

    const updateOrder = async (id: string, data: UpdateOrderData) => {
        try {
            const response = await apiClient.orders.update(id, data);
            if (!response.data.data) {
                throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
            }
            toast({
                title: "Thành công",
                description: SUCCESS_MESSAGES.ORDER_UPDATED,
                variant: "default"
            });
            fetchOrders();
            return response.data.data;
        } catch (error) {
            console.error('Failed to update order:', error);
            toast({
                title: "Lỗi",
                description: ERROR_MESSAGES.ORDER_UPDATE_ERROR,
                variant: "destructive"
            });
            throw error;
        }
    };

    return {
        orders,
        total,
        isLoading,
        error,
        fetchOrders,
        fetchOrdersByPhone,
        getOrderById,
        createOrder,
        cancelOrder,
        updateOrder
    };
} 