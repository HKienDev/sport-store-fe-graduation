import { CartItem as CartItemType } from '@/types/cart';
import CartItem from './CartItem';

interface CartListProps {
  items: CartItemType[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export default function CartList({ items, onUpdateQuantity, onRemoveItem }: CartListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Giỏ hàng của bạn đang trống</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItem
          key={item._id}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </div>
  );
} 