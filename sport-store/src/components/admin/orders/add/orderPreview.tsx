"use client";

import { useState } from "react";
import { useCart } from "@/context/cartContext";
import { useShippingMethod, ShippingMethod } from "@/context/shippingMethodContext";
import { usePaymentMethod, PaymentMethod } from "@/context/paymentMethodContext";
import { useCustomer } from "@/context/customerContext";
import { usePromo } from "@/context/promoContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CartItem } from "@/types/cart";
import { toast } from "sonner";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { Check, Truck, CreditCard, Package, AlertCircle } from "lucide-react";
import Image from "next/image";

interface OrderPreviewProps {
  onConfirmOrder: () => void;
  onBack: () => void;
}

export default function OrderPreview({ onConfirmOrder, onBack }: OrderPreviewProps) {
  const { items: cartItems } = useCart();
  const { paymentMethod } = usePaymentMethod();
  const { shippingMethod } = useShippingMethod();
  const { customer } = useCustomer();
  const { promoDetails } = usePromo();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tính tổng tiền
  const calculateTotal = () => {
    // Tính tổng tiền sản phẩm
    const subtotal = cartItems.reduce((total, item) => total + item.totalPrice, 0);
    
    // Tính phí vận chuyển
    const shippingFee = shippingMethod === ShippingMethod.EXPRESS ? 45000 : 
                       shippingMethod === ShippingMethod.SAME_DAY ? 60000 : 
                       30000;
    
    // Tính giảm giá từ mã khuyến mãi (chỉ áp dụng cho giá sản phẩm, không áp dụng cho phí vận chuyển)
    let discountAmount = 0;
    if (promoDetails) {
      if (promoDetails.type === 'percentage') {
        discountAmount = (subtotal * promoDetails.value) / 100;
      } else if (promoDetails.type === 'fixed') {
        discountAmount = promoDetails.value;
      }
    }
    
    // Tổng cộng = (Giá sản phẩm - Giảm giá) + Phí vận chuyển
    return (subtotal - discountAmount) + shippingFee;
  };

  const total = calculateTotal();
  const subtotal = cartItems.reduce((total, item) => total + item.totalPrice, 0);
  const shippingFee = shippingMethod === ShippingMethod.EXPRESS ? 45000 : 
                     shippingMethod === ShippingMethod.SAME_DAY ? 60000 : 
                     30000;
  const discountAmount = promoDetails ? promoDetails.discountAmount : 0;

  // Xử lý xác nhận đơn hàng
  const handleConfirmOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Vui lòng thêm sản phẩm vào đơn hàng");
      return;
    }

    // Kiểm tra thông tin khách hàng
    if (!customer.fullName || !customer.phone || !customer.province || !customer.district || !customer.ward) {
      toast.error("Vui lòng điền đầy đủ thông tin khách hàng");
      return;
    }

    setIsSubmitting(true);
    try {
      // Tạo đơn hàng
      const orderData = {
        items: cartItems.map(item => ({
          sku: item.product.sku,
          quantity: item.quantity,
          color: item.color,
          size: item.size
        })),
        shippingAddress: {
          fullName: customer.fullName,
          phone: customer.phone,
          address: {
            province: {
              name: customer.province.name,
              code: customer.province.code
            },
            district: {
              name: customer.district.name,
              code: customer.district.code
            },
            ward: {
              name: customer.ward.name,
              code: customer.ward.code
            },
            street: customer.street
          }
        },
        paymentMethod: paymentMethod,
        shippingMethod: shippingMethod.toLowerCase(),
        couponCode: promoDetails?.code
      };

      const response = await fetchWithAuth("/orders", {
        method: "POST",
        body: JSON.stringify(orderData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.success) {
        throw new Error(response.message || "Không thể tạo đơn hàng");
      }

      toast.success("Đã tạo đơn hàng thành công");
      onConfirmOrder();
    } catch (error) {
      console.error("❌ [handleConfirmOrder] Lỗi:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Không thể tạo đơn hàng");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hiển thị phương thức thanh toán
  const renderPaymentMethod = () => {
    switch (paymentMethod) {
      case PaymentMethod.COD:
        return (
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-500" />
            <span>Thanh toán khi nhận hàng (COD)</span>
          </div>
        );
      case PaymentMethod.BANKING:
        return (
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-500" />
            <span>Chuyển khoản ngân hàng</span>
          </div>
        );
      case PaymentMethod.MOMO:
        return (
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-pink-500" />
            <span>Thanh toán qua Momo</span>
          </div>
        );
      default:
        return <span>Chưa chọn phương thức thanh toán</span>;
    }
  };

  // Hiển thị phương thức vận chuyển
  const renderShippingMethod = () => {
    switch (shippingMethod) {
      case ShippingMethod.STANDARD:
        return (
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-gray-500" />
            <span>Vận chuyển thường (3-5 ngày)</span>
          </div>
        );
      case ShippingMethod.EXPRESS:
        return (
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-500" />
            <span>Vận chuyển nhanh (1-2 ngày)</span>
          </div>
        );
      case ShippingMethod.SAME_DAY:
        return (
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-green-500" />
            <span>Vận chuyển trong ngày</span>
          </div>
        );
      default:
        return <span>Chưa chọn phương thức vận chuyển</span>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Check className="h-5 w-5" />
            Xác nhận đơn hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Thông tin sản phẩm */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-500" />
              Sản phẩm đã chọn
            </h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {cartItems?.length > 0 ? (
                cartItems.map((item: CartItem) => (
                  <div
                    key={item._id}
                    className="flex items-start gap-4 bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
                      <Image
                        src={item.product.mainImage || "/images/placeholder.png"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.product.name}</p>
                      <div className="text-sm text-gray-600 mt-1 space-y-1">
                        <p>Số lượng: {item.quantity}</p>
                        <p>Đơn giá: {item.product.salePrice.toLocaleString("vi-VN")}đ</p>
                        <p>Thành tiền: {(item.product.salePrice * item.quantity).toLocaleString("vi-VN")}đ</p>
                        {(item.size || item.color) && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {item.size && <Badge variant="outline">{item.size}</Badge>}
                            {item.color && <Badge variant="outline">{item.color}</Badge>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <AlertCircle className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                  <p>Chưa có sản phẩm nào trong đơn hàng</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Thông tin thanh toán và vận chuyển */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-500" />
                Phương thức thanh toán
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                {renderPaymentMethod()}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-500" />
                Phương thức vận chuyển
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                {renderShippingMethod()}
              </div>
            </div>
          </div>

          <Separator />

          {/* Mã giảm giá */}
          {promoDetails && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-700 mb-2">Mã giảm giá đã áp dụng</h3>
              <div className="space-y-1">
                <p className="text-sm text-green-600">
                  <span className="font-medium">Mã:</span> {promoDetails.code}
                </p>
                <p className="text-sm text-green-600">
                  <span className="font-medium">Giảm giá:</span> {promoDetails.type === 'percentage' ? `${promoDetails.value}%` : `${promoDetails.value.toLocaleString("vi-VN")}đ`}
                </p>
                <p className="text-sm text-green-600">
                  <span className="font-medium">Số tiền giảm:</span> {promoDetails.discountAmount.toLocaleString("vi-VN")}đ
                </p>
              </div>
            </div>
          )}

          <Separator />

          {/* Tổng tiền */}
          <div className="bg-blue-50 p-6 rounded-lg space-y-3">
            <h3 className="font-semibold text-lg text-blue-700">Chi tiết thanh toán</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tạm tính:</span>
                <span>{subtotal.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Phí vận chuyển:</span>
                <span>{shippingFee.toLocaleString("vi-VN")}đ</span>
              </div>
              {promoDetails && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Giảm giá ({promoDetails.code}):</span>
                  <span>-{discountAmount.toLocaleString("vi-VN")}đ</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between font-medium text-lg text-blue-700">
                <span>Tổng cộng:</span>
                <span>{total.toLocaleString("vi-VN")}đ</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={onBack}>
            Quay lại
          </Button>
          <Button 
            onClick={handleConfirmOrder} 
            disabled={cartItems.length === 0 || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "Đang xử lý..." : "Xác nhận đơn hàng"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 