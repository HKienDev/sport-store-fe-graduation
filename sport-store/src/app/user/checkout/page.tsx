'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { CartState, CartItem } from '@/types/cart';
import { cartService } from '@/services/cartService';
import { PaymentMethod, ShippingMethod, OrderStatus } from '@/types/order';
import { ShippingAddress } from '@/types/order';
import { Coupon } from '@/types/coupon';
import OrderItems from '@/components/user/checkout/OrderItems';
import OrderSummary from '@/components/user/checkout/OrderSummary';
import DeliveryMethod, { SHIPPING_FEES } from '@/components/user/checkout/DeliveryMethod';
import PaymentMethodComponent from '@/components/user/checkout/PaymentMethod';
import DeliveryInfo from '@/components/user/checkout/DeliveryInfo';
import CouponSection from '@/components/user/checkout/CouponSection';
import { ArrowLeft } from 'lucide-react';
import CheckoutStripePayment from '@/components/user/checkout/CheckoutStripePayment';
import StripePaymentForm from '@/components/user/checkout/StripePaymentForm';

export default function Checkout() {
  const [cart, setCart] = useState<CartState | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>('items');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    address: {
      province: {
        name: '',
        code: 0
      },
      district: {
        name: '',
        code: 0
      },
      ward: {
        name: '',
        code: 0
      },
      street: ''
    }
  });
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod>(ShippingMethod.STANDARD);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [showCouponOptions, setShowCouponOptions] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [originalTotal, setOriginalTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await cartService.getCart();
        if (response.success) {
          setCart(response.data);
          
          // Tính toán tổng tiền hàng và giảm giá
          let totalOriginalPrice = 0;
          let totalSalePrice = 0;
          let totalDirectDiscount = 0;
          
          console.log('🛒 Dữ liệu giỏ hàng:', response.data);
          
          response.data.items.forEach((item: CartItem) => {
            const originalPrice = item.product.originalPrice;
            const salePrice = item.product.salePrice;
            const quantity = item.quantity;
            
            console.log(`📦 Sản phẩm: ${item.product.name}`);
            console.log(`💰 Giá gốc: ${originalPrice}`);
            console.log(`💰 Giá khuyến mãi: ${salePrice}`);
            console.log(`🔢 Số lượng: ${quantity}`);
            console.log(`💵 Tổng tiền: ${salePrice * quantity}`);
            
            totalOriginalPrice += originalPrice * quantity;
            totalSalePrice += salePrice * quantity;
            totalDirectDiscount += (originalPrice - salePrice) * quantity;
          });
          
          console.log(`💰 Tổng tiền gốc: ${totalOriginalPrice}`);
          console.log(`💰 Tổng tiền sau giảm giá: ${totalSalePrice}`);
          console.log(`💰 Tổng giảm giá: ${totalDirectDiscount}`);
          
          setOriginalTotal(totalOriginalPrice);
          setSubtotal(totalSalePrice);
          setDiscount(totalOriginalPrice - totalSalePrice);
          setTotalAfterDiscount(totalSalePrice);
        } else {
          toast.error('Không thể tải thông tin giỏ hàng');
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Không thể tải thông tin giỏ hàng');
      }
    };

    fetchCart();
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  // Lấy phí vận chuyển từ DeliveryMethod
  const getShippingFee = useCallback(() => {
    const shippingMethod = SHIPPING_FEES.find(fee => fee.method === selectedShippingMethod);
    return shippingMethod ? shippingMethod.fee : 0;
  }, [selectedShippingMethod]);

  // Cập nhật phí vận chuyển khi thay đổi phương thức vận chuyển
  useEffect(() => {
    setShipping(getShippingFee());
  }, [getShippingFee]);

  const handleSubmitCoupon = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Gọi API get coupon by code
      const response = await api.get(`/coupons/${encodeURIComponent(couponCode.trim())}`);

      if (response.data.success && response.data.data) {
        const coupon = response.data.data;

        // Kiểm tra trạng thái
        if (coupon.status !== "Hoạt động") {
          throw new Error("Mã giảm giá không hoạt động");
        }

        // Kiểm tra ngày hiệu lực
        const now = new Date();
        // Xử lý ngày tháng từ API một cách an toàn
        const startDate = new Date(coupon.startDate);
        const endDate = new Date(coupon.endDate);
        
        console.log('Thời gian hiện tại:', now);
        console.log('Ngày bắt đầu:', startDate);
        console.log('Ngày kết thúc:', endDate);

        if (now < startDate) {
          throw new Error("Mã giảm giá chưa có hiệu lực");
        }

        if (now > endDate) {
          throw new Error("Mã giảm giá đã hết hạn");
        }

        // Kiểm tra số lần sử dụng
        if (coupon.usageCount >= coupon.usageLimit) {
          throw new Error("Mã giảm giá đã hết lượt sử dụng");
        }

        // Kiểm tra số lần sử dụng của user
        const userUsageCount = coupon.usedBy.filter((usage: { user: string }) => 
          usage.user === "67ef8e3547b8f021b9855447" // TODO: Thay bằng ID của user hiện tại
        ).length;

        if (userUsageCount >= coupon.userLimit) {
          throw new Error("Bạn đã sử dụng hết lượt cho mã giảm giá này");
        }

        // Tính tổng giá dựa trên salePrice
        const productSubtotal = cart?.items.reduce((total, item) => {
          return total + (item.product.salePrice * item.quantity);
        }, 0) || 0;

        // Kiểm tra giá trị đơn hàng tối thiểu
        if (coupon.minimumPurchaseAmount > 0 && productSubtotal < coupon.minimumPurchaseAmount) {
          throw new Error(`Đơn hàng tối thiểu ${coupon.minimumPurchaseAmount.toLocaleString('vi-VN')}đ để áp dụng mã này`);
        }

        // Nếu tất cả điều kiện đều hợp lệ, cập nhật state
        setAppliedCoupon(coupon);
        
        // Tính giảm giá từ mã giảm giá dựa trên salePrice
        if (coupon.type === 'percentage') {
          // Tính giảm giá theo phần trăm
          const discountAmount = (productSubtotal * coupon.value) / 100;
          setCouponDiscount(Math.round(discountAmount)); // Làm tròn để tránh số thập phân
        } else {
          // Giảm giá cố định
          setCouponDiscount(coupon.value);
        }
        
        toast.success(`Áp dụng mã giảm giá ${coupon.code} thành công!`);
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error(error instanceof Error ? error.message : 'Không thể áp dụng mã giảm giá');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      // Kiểm tra giỏ hàng
      if (!cart || cart.items.length === 0) {
        toast.error('Giỏ hàng trống');
        return;
      }

      // Validate shipping address
      if (!shippingAddress.fullName || !shippingAddress.phone || 
          !shippingAddress.address.province.name || !shippingAddress.address.district.name || 
          !shippingAddress.address.ward.name || !shippingAddress.address.street) {
        toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
        return;
      }

      // Create order data
      const orderData = {
        items: cart.items.map(item => ({
          sku: item.product.sku,
          quantity: Number(item.quantity),
          color: item.color || 'Mặc định',
          size: item.size || 'Mặc định'
        })),
        shippingAddress,
        shippingMethod: selectedShippingMethod,
        paymentMethod: selectedPaymentMethod,
        couponCode: appliedCoupon?.code || '',
        notes: '',
        status: OrderStatus.PENDING
      };

      console.log('📦 Dữ liệu đơn hàng:', orderData);

      // Tăng timeout lên 30s và thêm retry logic
      const createOrder = async (retryCount = 0) => {
        try {
          const response = await api.post('/orders', orderData, {
            timeout: 30000 // 30 seconds
          });
          return response;
        } catch (error: any) {
          if (error.code === 'ECONNABORTED' && retryCount < 2) {
            // Retry với delay tăng dần
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
            return createOrder(retryCount + 1);
          }
          throw error;
        }
      };

      const response = await createOrder();

      if (response.data.success) {
        // Xóa giỏ hàng sau khi đặt hàng thành công
        await cartService.clearCart();
        
        toast.success('Đặt hàng thành công!');
        const { orderId, requiresPayment, amount } = response.data.data;
        setCreatedOrderId(orderId);
        
        // Nếu phương thức thanh toán là Stripe
        if (requiresPayment) {
          setIsStripeModalOpen(true);
          setAmount(amount);
          try {
            const stripeResponse = await handleStripePayment(orderId, amount);
            if (stripeResponse.clientSecret) {
              setClientSecret(stripeResponse.clientSecret);
            }
          } catch (stripeError: any) {
            toast.error(stripeError.message || 'Không thể khởi tạo thanh toán');
          }
        } else {
          // Nếu là COD, chuyển hướng đến trang invoice
          router.push(`/user/invoice/${orderId}`);
        }
      } else {
        toast.error(response.data.message || 'Không thể tạo đơn hàng');
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
      if (error.code === 'ECONNABORTED') {
        toast.error('Quá thời gian xử lý, vui lòng thử lại');
      } else {
        toast.error(error.response?.data?.message || 'Đã có lỗi xảy ra khi tạo đơn hàng');
      }
    }
  };

  const handlePaymentSuccess = () => {
    setIsStripeModalOpen(false);
    if (createdOrderId) {
      router.push(`/user/invoice/${createdOrderId}`);
    }
  };

  const handlePaymentError = (error: string) => {
    toast.error(error);
  };

  // Tính tổng tiền thanh toán
  const total = totalAfterDiscount - couponDiscount + shipping;

  const handleGoBack = () => {
    router.back();
  };

  const handleStripePayment = async (orderId: string, amount: number) => {
    try {
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, amount }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Không thể tạo phiên thanh toán');
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Lỗi khi tạo phiên thanh toán');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button 
            onClick={handleGoBack}
            className="flex items-center text-gray-500 hover:text-gray-700 mr-6"
          >
            <ArrowLeft size={18} className="mr-1" />
            <span>Quay lại</span>
          </button>
          <h1 className="text-2xl font-bold">Thanh toán</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cột bên trái - 8/12 */}
          <div className="lg:col-span-8 space-y-6">
            <DeliveryMethod
              expandedSection={expandedSection}
              deliveryMethod={selectedShippingMethod}
              setDeliveryMethod={setSelectedShippingMethod}
              toggleSection={toggleSection}
              formatPrice={formatPrice}
            />

            <OrderItems
              expandedSection={expandedSection}
              toggleSection={toggleSection}
              formatPrice={formatPrice}
            />

            <PaymentMethodComponent
              expandedSection={expandedSection}
              paymentMethod={selectedPaymentMethod}
              setPaymentMethod={setSelectedPaymentMethod}
              toggleSection={toggleSection}
              orderId={createdOrderId ?? undefined}
              amount={totalAfterDiscount}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </div>

          {/* Cột bên phải - 4/12 */}
          <div className="lg:col-span-4 space-y-6">
            <DeliveryInfo 
              onAddressChange={setShippingAddress}
            />

            <CouponSection
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              onSubmitCoupon={handleSubmitCoupon}
              showCouponOptions={showCouponOptions}
              setShowCouponOptions={setShowCouponOptions}
            />

            <OrderSummary
              originalTotal={originalTotal}
              subtotal={subtotal}
              discount={discount}
              couponDiscount={couponDiscount}
              shipping={shipping}
              total={total}
              formatPrice={formatPrice}
              onPlaceOrder={handlePlaceOrder}
              appliedCoupon={appliedCoupon}
            />
          </div>
        </div>
      </div>
      
      {createdOrderId && (
        <CheckoutStripePayment
          isOpen={isStripeModalOpen}
          onClose={() => setIsStripeModalOpen(false)}
          orderId={createdOrderId}
          amount={total}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}
      
      {clientSecret && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Thanh toán đơn hàng</h2>
          <StripePaymentForm clientSecret={clientSecret} amount={amount} />
        </div>
      )}
    </div>
  );
}