"use client";

import { useState, ChangeEvent } from "react";
import { useCart } from "@/context/cartContext";
import { useShippingMethod, ShippingMethod } from "@/context/shippingMethodContext";
import { usePaymentMethod } from "@/context/paymentMethodContext";
import { usePromo } from "@/context/promoContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { CartItem } from "@/types/cart";
import { toast } from "sonner";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

interface Product {
  _id: string;
  name: string;
  description: string;
  brand: string;
  originalPrice: number;
  salePrice: number;
  stock: number;
  categoryId: string;
  isActive: boolean;
  mainImage: string;
  subImages: string[];
  colors: string[];
  sizes: string[];
  sku: string;
  tags: string[];
  rating: number;
  numReviews: number;
  viewCount: number;
  soldCount: number;
  reviews: Array<{
    user: string;
    name: string;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
  discountPercentage: number;
  isOutOfStock: boolean;
  isLowStock: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface Coupon {
  _id: string;
  code: string;
  type: string;
  value: number;
  minimumPurchaseAmount: number;
  startDate: string;
  endDate: string;
  status: string;
  usageCount: number;
  usageLimit: number;
}

interface CouponWithDiscount extends Coupon {
  discountAmount: number;
}

export default function OrderProducts() {
  const { items: cartItems, addItem, removeItem } = useCart();
  const { paymentMethod, setPaymentMethod } = usePaymentMethod();
  const { shippingMethod, setShippingMethod } = useShippingMethod();
  const { promoDetails, setPromoDetails } = usePromo();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [error, setError] = useState("");
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [promoCode, setPromoCode] = useState("");

  const fetchProduct = async (productId: string) => {
    try {
      if (!productId) {
        throw new Error('Vui lòng nhập mã sản phẩm');
      }

      console.log("🔍 [fetchProduct] Tìm sản phẩm với SKU:", productId);
      const response = await fetchWithAuth<{ product: Product }>(`/products/${productId}`);
      console.log("🔍 [fetchProduct] Kết quả:", response);
      
      if (!response.success || !response.data?.product) {
        throw new Error(response.message || 'Không thể tìm thấy sản phẩm');
      }

      return response.data.product;
    } catch (error) {
      console.error('❌ [fetchProduct] Lỗi:', error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Không thể tìm thấy sản phẩm');
    }
  };

  const handleProductIdChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newProductId = e.target.value.trim();
    setSearchTerm(newProductId);
    setSize("");
    setColor("");
    setAvailableSizes([]);
    setAvailableColors([]);
    setSelectedProduct(null);
    setError("");

    if (newProductId) {
      try {
        const product = await fetchProduct(newProductId);
        setSelectedProduct(product);
        setAvailableSizes(product.sizes);
        setAvailableColors(product.colors);
        setError("");
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Không thể tìm thấy sản phẩm');
        setSelectedProduct(null);
        setAvailableSizes([]);
        setAvailableColors([]);
      }
    }
  };

  const handleAddToCart = (product: Product) => {
    if (!size && availableSizes.length > 0) {
      toast.error("Vui lòng chọn kích thước");
      return;
    }
    if (!color && availableColors.length > 0) {
      toast.error("Vui lòng chọn màu sắc");
      return;
    }
    if (quantity < 1) {
      toast.error("Số lượng phải lớn hơn 0");
      return;
    }
    if (quantity > product.stock) {
      toast.error(`Số lượng vượt quá tồn kho (${product.stock})`);
      return;
    }

    const cartItem: CartItem = {
      _id: Date.now().toString(),
      product: {
        sku: product.sku,
        name: product.name,
        slug: product.sku.toLowerCase(),
        brand: product.brand,
        mainImage: product.mainImage || "/images/placeholder.png",
        salePrice: product.salePrice || product.originalPrice
      },
      quantity: quantity,
      color: color,
      size: size,
      totalPrice: (product.salePrice || product.originalPrice) * quantity
    };
    addItem(cartItem);
    toast.success("Đã thêm sản phẩm vào giỏ hàng");
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setQuantity(value < 1 ? 1 : value);
  };

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

  const handleApplyPromoCode = async () => {
    if (!promoCode) {
      toast.error("Vui lòng nhập mã giảm giá");
      return;
    }

    try {
      const subtotal = cartItems.reduce((total, item) => total + item.totalPrice, 0);
      const response = await fetchWithAuth<ApiResponse<Coupon>>(`/coupons/code/${promoCode}`);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Không thể áp dụng mã giảm giá");
      }

      // Đảm bảo TypeScript hiểu rằng response.data là một Coupon
      const couponData = response.data as unknown as Coupon;

      // Kiểm tra điều kiện áp dụng
      if (subtotal < couponData.minimumPurchaseAmount) {
        throw new Error(`Đơn hàng phải có giá trị tối thiểu ${couponData.minimumPurchaseAmount.toLocaleString('vi-VN')}đ để sử dụng mã này`);
      }

      // Tính số tiền giảm giá
      let discountAmount = 0;
      if (couponData.type === 'percentage') {
        discountAmount = (subtotal * couponData.value) / 100;
      } else if (couponData.type === 'fixed') {
        discountAmount = couponData.value;
      }

      // Cập nhật thông tin giảm giá
      const couponWithDiscount: CouponWithDiscount = {
        _id: couponData._id,
        code: couponData.code,
        type: couponData.type,
        value: couponData.value,
        minimumPurchaseAmount: couponData.minimumPurchaseAmount,
        startDate: couponData.startDate,
        endDate: couponData.endDate,
        status: couponData.status,
        usageCount: couponData.usageCount,
        usageLimit: couponData.usageLimit,
        discountAmount
      };

      setPromoDetails(couponWithDiscount);
      toast.success("Áp dụng mã giảm giá thành công");
    } catch (error) {
      console.error('❌ [handleApplyPromoCode] Lỗi:', error);
      setPromoDetails(null);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Không thể áp dụng mã giảm giá");
      }
    }
  };

  const handleRemovePromoCode = () => {
    setPromoDetails(null);
    setPromoCode("");
    toast.success("Đã xóa mã giảm giá");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Thông tin đơn hàng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form thêm sản phẩm */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="searchTerm">Mã sản phẩm</Label>
              <Input
                id="searchTerm"
                value={searchTerm}
                onChange={handleProductIdChange}
                placeholder="Nhập mã sản phẩm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Số lượng</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                placeholder="Nhập số lượng"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="size">Kích thước</Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn kích thước" />
                </SelectTrigger>
                <SelectContent>
                  {availableSizes && availableSizes.length > 0 ? (
                    availableSizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-gray-500">Không có kích thước</div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Màu sắc</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn màu sắc" />
                </SelectTrigger>
                <SelectContent>
                  {availableColors && availableColors.length > 0 ? (
                    availableColors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-gray-500">Không có màu sắc</div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedProduct && (
            <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">Sản phẩm: {selectedProduct.name}</p>
              <p>
                Giá: {selectedProduct.salePrice ? (
                  <>
                    <span className="line-through text-gray-400 mr-2">{selectedProduct.originalPrice.toLocaleString()}</span>
                    <span className="text-red-500">{selectedProduct.salePrice.toLocaleString()}</span>
                  </>
                ) : (
                  selectedProduct.originalPrice.toLocaleString()
                )} VNĐ
              </p>
              <p>Tồn kho: {selectedProduct.stock}</p>
            </div>
          )}

          {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded">{error}</p>}

          <Button onClick={() => handleAddToCart(selectedProduct as Product)} className="w-full">
            Thêm sản phẩm
          </Button>
        </div>

        {/* Danh sách sản phẩm đã thêm */}
        <div className="mt-6">
          <h3 className="font-semibold mb-4">Sản phẩm đã thêm</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {cartItems?.length > 0 ? (
              cartItems.map((item: CartItem) => (
                <div
                  key={item._id}
                  className="flex items-start justify-between bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.product.name}</p>
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                      <p>Số lượng: {item.quantity}</p>
                      <p>Đơn giá: {item.totalPrice.toLocaleString()} VNĐ</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">
                Chưa có sản phẩm nào
              </div>
            )}
          </div>
        </div>

        {/* Phương thức thanh toán vận chuyển */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-2">
            <Label>Phương thức thanh toán</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn phương thức thanh toán" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COD">Thanh toán khi nhận hàng (COD)</SelectItem>
                <SelectItem value="Stripe">Thanh toán qua Stripe</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Phương thức vận chuyển</Label>
            <Select value={shippingMethod} onValueChange={setShippingMethod}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn phương thức vận chuyển" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ShippingMethod.STANDARD}>Vận chuyển thường</SelectItem>
                <SelectItem value={ShippingMethod.EXPRESS}>Vận chuyển nhanh</SelectItem>
                <SelectItem value={ShippingMethod.SAME_DAY}>Vận chuyển trong ngày</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mã giảm giá */}
        <div className="pt-4 border-t">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Nhập mã giảm giá"
                disabled={!!promoDetails}
              />
            </div>
            {promoDetails ? (
              <Button onClick={handleRemovePromoCode} variant="destructive">
                Xóa
              </Button>
            ) : (
              <Button onClick={handleApplyPromoCode}>
                Áp dụng
              </Button>
            )}
          </div>
          {promoDetails && (
            <div className="mt-2 p-3 bg-green-50 rounded-md">
              <p className="text-sm text-green-600 font-medium">
                Đã áp dụng mã giảm giá: {promoDetails.code}
              </p>
              <p className="text-sm text-green-600">
                Giảm giá: {promoDetails?.type === 'percentage' ? `${promoDetails?.value}%` : `${promoDetails?.value?.toLocaleString()}đ`}
              </p>
              <p className="text-sm text-green-600">
                Số tiền giảm: {promoDetails?.discountAmount?.toLocaleString()}đ
              </p>
              <p className="text-sm text-green-600">
                Giá trị đơn hàng tối thiểu: {promoDetails?.minimumPurchaseAmount?.toLocaleString()}đ
              </p>
            </div>
          )}
        </div>

        {/* Tổng tiền */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span>Tạm tính:</span>
            <span>{cartItems && cartItems.length > 0 ? cartItems.reduce((total, item) => total + item.totalPrice, 0).toLocaleString("vi-VN") : "0"}đ</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Phí vận chuyển ({shippingMethod === ShippingMethod.EXPRESS ? "Nhanh" : shippingMethod === ShippingMethod.SAME_DAY ? "Trong ngày" : "Thường"}):</span>
            <span>{(shippingMethod === ShippingMethod.EXPRESS ? 45000 : 
                   shippingMethod === ShippingMethod.SAME_DAY ? 60000 : 
                   30000).toLocaleString("vi-VN")}đ</span>
          </div>
          {promoDetails && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Giảm giá ({promoDetails.code}):</span>
              <span>-{promoDetails.discountAmount.toLocaleString("vi-VN")}đ</span>
            </div>
          )}
          <div className="flex justify-between font-medium text-base pt-2 border-t">
            <span>Tổng cộng:</span>
            <span>{total.toLocaleString("vi-VN")}đ</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}