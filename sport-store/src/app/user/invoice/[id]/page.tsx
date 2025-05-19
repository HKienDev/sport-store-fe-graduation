'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { getToken } from '@/config/token';
import InvoiceHeader from '@/components/user/invoice/InvoiceHeader';
import ProductList from '@/components/user/invoice/ProductList';
import PaymentSummary from '@/components/user/invoice/PaymentSummary';
import OrderStatusTimeline from '@/components/user/invoice/OrderStatusTimeline';
import AddressInfo from '@/components/user/invoice/AddressInfo';
import PaymentMethodComponent from '@/components/user/checkout/PaymentMethod';
import { PaymentMethod } from '@/types/order';
import { API_URL } from "@/utils/api";

interface Product {
  _id: string;
  name: string;
  slug: string;
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
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
  name: string;
  sku: string;
  _id: string;
}

interface Address {
  province: {
    name: string;
    code: number;
  };
  district: {
    name: string;
    code: number;
  };
  ward: {
    name: string;
    code: number;
  };
  street: string;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  address: Address;
}

interface ShippingMethod {
  method: string;
  fee: number;
}

interface StatusHistory {
  status: string;
  updatedAt: string;
  updatedBy: string;
  note: string;
  _id: string;
}

interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  subtotal: number;
  directDiscount: number;
  couponDiscount: number;
  shippingFee: number;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethod;
  status: string;
  notes: string;
  cancellationReason: string;
  isTotalSpentUpdated: boolean;
  shortId: string;
  statusHistory: StatusHistory[];
  createdAt: string;
  updatedAt: string;
}

interface ProcessedProduct {
  id: number;
  name: string;
  price: number;
  quantity: number;
  brand: string;
  image: string;
  categoryName: string;
  color: string;
  size: string;
}

export default function InvoicePage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [animateItems, setAnimateItems] = useState(false);
  const [processedProducts, setProcessedProducts] = useState<ProcessedProduct[]>([]);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD);

  const processOrderItems = useCallback((items: OrderItem[]): ProcessedProduct[] => {
    return items.map(item => ({
      id: parseInt(item.product._id.slice(-6), 16),
      name: item.product.name,
      price: item.product.salePrice,
      quantity: item.quantity,
      brand: item.product.brand,
      image: item.product.mainImage,
      categoryName: 'Chưa phân loại',
      color: item.product.colors?.[0] || 'Mặc định',
      size: item.product.sizes?.[0] || 'N/A'
    }));
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = getToken('access');
        if (!token) {
          setError('Vui lòng đăng nhập để xem hóa đơn');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/orders/my-orders/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache',
          }
        });

        if (response.data.success) {
          const orderData = response.data.data;
          setOrder(orderData);
          const processed = processOrderItems(orderData.items);
          setProcessedProducts(processed);
          setTimeout(() => {
            setAnimateItems(true);
          }, 100);
        } else {
          setError('Không thể tải thông tin đơn hàng');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Không thể tải thông tin đơn hàng');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id, processOrderItems]);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (!order) {
    return <div className="text-center py-8">Không tìm thấy thông tin đơn hàng</div>;
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isPrinting ? 'print-mode' : ''}`}>
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          .receipt-card { box-shadow: none !important; }
          .print-mt-0 { margin-top: 0 !important; }
          .print-break-avoid { break-inside: avoid; }
          .animated-scale { transform: none !important; }
        }
      `}</style>
      
      <InvoiceHeader 
        handlePrint={handlePrint}
      />

      <main className="max-w-7xl mx-auto px-4 py-8 print-mt-0">
        <div className={`receipt-card bg-white rounded-2xl shadow-lg overflow-hidden mb-6 ${animateItems ? 'animated-scale' : ''} transition-transform duration-500 print-break-avoid`}
             style={{transformOrigin: 'center top', transform: animateItems ? 'scale(1)' : 'scale(0.97)'}}>
          
          <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-3xl font-bold">HÓA ĐƠN</div>
                <div className="text-sm mt-1 text-red-100">Cảm ơn bạn đã mua hàng tại VJU SPORT</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">#{order.shortId}</div>
                <div className="text-sm mt-1 text-red-100">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
              </div>
            </div>
          </div>
          
          <OrderStatusTimeline 
            currentStatus={order.status}
            paymentStatus={order.paymentStatus}
            paymentMethod={order.paymentMethod}
            orderDate={new Date(order.createdAt)}
            statusHistory={order.statusHistory}
          />
          
          <div className="p-6">
            <AddressInfo 
              storeAddress={{
                name: `Phương thức: ${
                  order.shippingMethod.method === 'standard' ? 'GIAO HÀNG TIẾT KIỆM' :
                  order.shippingMethod.method === 'express' ? 'GIAO HÀNG NHANH' :
                  order.shippingMethod.method === 'same_day' ? 'GIAO HÀNG HỎA TỐC' : 'GIAO HÀNG TIẾT KIỆM'
                }`,
                phone: order.shortId,
                address: [
                  `Ngày dự kiến giao hàng: ${new Date(order.createdAt).toLocaleDateString('vi-VN')}`,
                  `Đơn vị vận chuyển: Viettel Post`
                ]
              }}
              deliveryAddress={{
                name: order.shippingAddress.fullName,
                phone: order.shippingAddress.phone,
                address: {
                  street: order.shippingAddress.address.street,
                  ward: order.shippingAddress.address.ward,
                  district: order.shippingAddress.address.district,
                  province: order.shippingAddress.address.province
                }
              }}
            />
            
            <ProductList 
              products={processedProducts}
              animateItems={true}
            />
            
            <PaymentSummary 
              subtotal={order.subtotal}
              discount={order.directDiscount}
              couponDiscount={order.couponDiscount}
              shipping={order.shippingFee}
              total={order.totalPrice}
              paid={
                (order.paymentMethod === PaymentMethod.STRIPE && order.paymentStatus === 'paid') ||
                (order.paymentMethod === PaymentMethod.COD && order.status === 'delivered')
                  ? order.totalPrice
                  : 0
              }
            />
          </div>
        </div>
      </main>

      {order.paymentStatus !== 'paid' && (
        <div className="mt-8">
          {order?.paymentMethod === 'Stripe' && order.paymentStatus === 'pending' && (
            <PaymentMethodComponent
              expandedSection={expandedSection}
              paymentMethod={selectedPaymentMethod}
              setPaymentMethod={setSelectedPaymentMethod}
              toggleSection={toggleSection}
              orderId={order._id}
              amount={order.totalPrice}
              onPaymentSuccess={() => window.location.reload()}
              onPaymentError={(error) => console.error(error)}
            />
          )}
        </div>
      )}
    </div>
  );
} 