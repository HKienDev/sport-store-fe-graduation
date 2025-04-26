'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cart from '@/components/user/cart/Cart';
import { CartState } from '@/types/cart';
import { cartService } from '@/services/cartService';
import { toast } from 'sonner';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartState>({
    items: [],
    totalQuantity: 0,
    cartTotal: 0,
    loading: false,
    error: null
  });

  const fetchCart = async () => {
    try {
      setCart(prev => ({ ...prev, loading: true }));
      const response = await cartService.getCart();
      if (response.success) {
        setCart({
          ...response.data,
          loading: false,
          error: null
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Lỗi khi lấy giỏ hàng:', error);
      setCart(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Không thể lấy thông tin giỏ hàng',
        loading: false 
      }));
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      setCart(prev => ({ ...prev, loading: true }));
      
      const response = await cartService.updateCartItemQuantity({
        sku: cart.items.find(item => item._id === itemId)?.product.sku || '',
        color: cart.items.find(item => item._id === itemId)?.color || '',
        size: cart.items.find(item => item._id === itemId)?.size || '',
        quantity
      });

      if (response.success) {
        await fetchCart();
        toast.success('Đã cập nhật số lượng sản phẩm');
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng:', error);
      setCart(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Không thể cập nhật số lượng',
        loading: false 
      }));
      toast.error('Không thể cập nhật số lượng sản phẩm');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      setCart(prev => ({ ...prev, loading: true }));
      
      const item = cart.items.find(item => item._id === itemId);
      if (!item) throw new Error('Không tìm thấy sản phẩm');

      const response = await cartService.removeFromCart({
        sku: item.product.sku,
        color: item.color,
        size: item.size
      });

      if (response.success) {
        await fetchCart();
        toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      setCart(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Không thể xóa sản phẩm',
        loading: false 
      }));
      toast.error('Không thể xóa sản phẩm khỏi giỏ hàng');
    }
  };

  const handleCheckout = async () => {
    try {
      setCart(prev => ({ ...prev, loading: true }));
      
      if (cart.items.length === 0) {
        toast.error('Giỏ hàng trống');
        return;
      }

      router.push('/user/checkout');
    } catch (error) {
      console.error('Lỗi khi thanh toán:', error);
      setCart(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Không thể tiến hành thanh toán',
        loading: false 
      }));
      toast.error('Không thể tiến hành thanh toán');
    }
  };

  return (
    <Cart
      cart={cart}
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveItem={handleRemoveItem}
      onCheckout={handleCheckout}
    />
  );
}