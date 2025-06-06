"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { checkUserByPhone } from '@/utils/checkUserByPhone';
import type { ApiResponse } from '@/types/api';
import type { Order, OrderData, User, PaymentMethod, ShippingMethod } from '@/types/base';

interface OrderActionsProps {
  onClose: () => void;
  onResetForm: () => void;
}

export default function OrderActions({ onClose, onResetForm }: OrderActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateOrder = async (orderData: OrderData) => {
    try {
      setIsLoading(true);
      
      // Kiểm tra user bằng số điện thoại
      const user = await checkUserByPhone(orderData.shippingAddress.phone) as User | null;
      
      // Chuẩn bị dữ liệu order
      const orderPayload = {
        items: orderData.items.map(item => ({
          sku: item.sku,
          quantity: item.quantity,
          color: item.color || '',  // Đảm bảo không undefined
          size: item.size || ''     // Đảm bảo không undefined
        })),
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        shippingMethod: orderData.shippingMethod,
        note: orderData.note,
        userId: user?._id
      };

      // Gọi API tạo order
      const response = await fetchWithAuth<ApiResponse<Order>>('/orders/create', {
        method: 'POST',
        body: JSON.stringify(orderPayload)
      });

      if (response.success) {
        toast.success(
          user 
            ? `Tạo đơn hàng thành công cho khách hàng ${user.fullname}!`
            : "Tạo đơn hàng thành công cho khách vãng lai!"
        );
        onResetForm();
        router.push('/admin/orders/list');
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi tạo đơn hàng');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Có lỗi xảy ra khi tạo đơn hàng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const orderData: OrderData = {
      items: JSON.parse(formData.get('items') as string),
      shippingAddress: JSON.parse(formData.get('shippingAddress') as string),
      paymentMethod: formData.get('paymentMethod') as PaymentMethod,
      shippingMethod: formData.get('shippingMethod') as ShippingMethod,
      note: formData.get('note') as string
    };
    handleCreateOrder(orderData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-end gap-2 mt-4">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      >
        Hủy
      </button>
      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Đang xử lý...' : 'Tạo đơn hàng'}
      </button>
    </form>
  );
}