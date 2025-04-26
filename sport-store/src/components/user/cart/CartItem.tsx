import Image from 'next/image';
import { CartItem as CartItemType } from '@/types/cart';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemoveItem }: CartItemProps) {
  const { product, quantity, color, size, totalPrice, _id } = item;

  return (
    <div className="flex items-center py-4 border-b">
      <div className="relative w-24 h-24">
        <Image
          src={product.mainImage}
          alt={product.name}
          fill
          className="object-cover rounded-md"
        />
      </div>
      <div className="flex-1 ml-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600">{product.brand}</p>
        <p className="text-gray-500 text-sm">
          Màu: {color} | Kích thước: {size}
        </p>
        <p className="text-gray-600">{(product.salePrice).toLocaleString('vi-VN')}đ</p>
        <div className="flex items-center mt-2">
          <button
            onClick={() => onUpdateQuantity(_id, quantity - 1)}
            disabled={quantity <= 1}
            className="px-2 py-1 border rounded-l hover:bg-gray-100 disabled:opacity-50"
          >
            -
          </button>
          <span className="px-4 py-1 border-t border-b">{quantity}</span>
          <button
            onClick={() => onUpdateQuantity(_id, quantity + 1)}
            className="px-2 py-1 border rounded-r hover:bg-gray-100 disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>
      <div className="ml-4 text-right">
        <p className="font-semibold">{(totalPrice).toLocaleString('vi-VN')}đ</p>
        <button
          onClick={() => onRemoveItem(_id)}
          className="mt-2 text-red-500 hover:text-red-700"
        >
          Xóa
        </button>
      </div>
    </div>
  );
} 