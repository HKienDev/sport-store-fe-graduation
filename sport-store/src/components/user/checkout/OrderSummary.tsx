'use client';

import { motion } from 'framer-motion';
import { ArrowRightIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import type { Coupon } from '@/types/coupon';

interface OrderSummaryProps {
  originalTotal: number;
  subtotal: number;
  discount: number;
  couponDiscount: number;
  shipping: number;
  total: number;
  formatPrice: (price: number) => string;
  onPlaceOrder: () => void;
  appliedCoupon?: Coupon | null;
}

export default function OrderSummary({
  originalTotal,
  subtotal,
  discount,
  couponDiscount,
  shipping,
  total,
  formatPrice,
  onPlaceOrder,
  appliedCoupon
}: OrderSummaryProps) {
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-medium text-gray-900">ĐƠN HÀNG</h2>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-700">Tổng giá gốc</span>
            <span className="font-medium">{formatPrice(originalTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Tổng tiền hàng</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Giảm giá trực tiếp</span>
            <span className="font-medium text-green-600">-{formatPrice(discount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">
              Mã giảm giá {appliedCoupon ? `(${appliedCoupon.code})` : ''}
            </span>
            <span className="font-medium text-green-600">-{formatPrice(couponDiscount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Phí vận chuyển</span>
            <span className="font-medium">{formatPrice(shipping)}</span>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-900 font-medium">Tổng tiền thanh toán</span>
            <span className="text-xl font-bold text-red-600">{formatPrice(total)}</span>
          </div>
          
          {(discount > 0 || couponDiscount > 0) && (
            <div className="text-green-600 text-right text-sm mt-1">
              Tiết kiệm {formatPrice(discount + couponDiscount)}
            </div>
          )}
          
          <div className="text-gray-500 text-right text-xs">
            (Đã bao gồm thuế VAT nếu có)
          </div>
        </div>
        
        <button 
          onClick={onPlaceOrder}
          className="w-full mt-6 bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all shadow-md flex items-center justify-center"
        >
          ĐẶT HÀNG
          <ArrowRightIcon className="h-5 w-5 ml-2" />
        </button>
        
        <div className="flex items-center justify-center text-sm text-gray-500 mt-2">
          <ShieldCheckIcon className="h-4 w-4 mr-1" />
          <span>Thanh toán an toàn & bảo mật</span>
        </div>
      </div>
    </motion.div>
  );
} 