import { CartState } from '@/types/cart';
import CartList from './CartList';
import CartSummary from './CartSummary';
import { useRouter } from 'next/navigation';

interface CartProps {
  cart: CartState;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
}

export default function Cart({ cart, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) {
  const router = useRouter();

  if (cart.loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  if (cart.error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-lg text-red-500 mb-4">{cart.error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-lg text-gray-500 mb-4">Giỏ hàng của bạn đang trống</p>
          <button 
            onClick={() => router.push('/user')} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Giỏ hàng của bạn</h1>
        <button
          onClick={() => router.push('/user')}
          className="text-blue-600 hover:text-blue-800"
        >
          Tiếp tục mua sắm
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CartList
            items={cart.items}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
          />
        </div>
        <div>
          <CartSummary 
            totalQuantity={cart.totalQuantity}
            cartTotal={cart.cartTotal}
            onCheckout={onCheckout}
          />
        </div>
      </div>
    </div>
  );
} 