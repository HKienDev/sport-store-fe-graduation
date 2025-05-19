'use client';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CreditCard, Package, Truck, Home } from 'lucide-react';

interface StatusHistory {
  status: string;
  updatedAt: string;
  updatedBy: string;
  note: string;
  _id: string;
}

interface OrderStatusTimelineProps {
  currentStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  orderDate: Date;
  statusHistory: StatusHistory[];
}

const OrderStatusTimeline = ({
  currentStatus,
  paymentStatus,
  paymentMethod,
  orderDate,
  statusHistory
}: OrderStatusTimelineProps) => {
  const statuses = [
    {
      status: 'pending',
      label: 'Chờ xác nhận',
      date: orderDate
    },
    {
      status: 'confirmed',
      label: 'Đã xác nhận',
      date: null
    },
    {
      status: 'shipping',
      label: 'Đang giao hàng',
      date: null
    },
    {
      status: 'delivered',
      label: 'Đã giao hàng',
      date: null
    }
  ];

  // Cập nhật ngày cho các trạng thái từ lịch sử
  statusHistory.forEach(history => {
    // Đồng bộ trạng thái 'shipping' với 'shipped' trong statusHistory
    const statusKey = history.status === 'shipped' ? 'shipping' : history.status;
    const status = statuses.find(s => s.status === statusKey);
    if (status) {
      status.date = new Date(history.updatedAt);
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'confirmed':
        return 'text-blue-500';
      case 'shipping':
        return 'text-orange-500';
      case 'delivered':
        return 'text-green-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Đã thanh toán';
      case 'failed':
        return 'Thanh toán thất bại';
      default:
        return 'Chờ thanh toán';
    }
  };

  return (
    <div className="p-6 border-t border-b">
      <div className="flex items-center justify-between mb-6">
        {statuses.map((status, index) => (
          <div
            key={status.status}
            className={`flex flex-col items-center flex-1 relative ${
              index < statuses.length - 1 ? 'after:content-[""] after:h-[2px] after:w-full after:absolute after:top-4 after:left-1/2 after:bg-gray-200' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                currentStatus === status.status
                  ? 'bg-red-500 text-white'
                  : statuses.findIndex(s => s.status === currentStatus) > index
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {statuses.findIndex(s => s.status === currentStatus) > index ? '✓' : index + 1}
            </div>
            <div className="text-sm font-medium mt-2">{status.label}</div>
            {status.date && (
              <div className="text-xs text-gray-500 mt-1">
                {format(status.date, 'HH:mm dd/M/yyyy', { locale: vi })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Hiển thị trạng thái thanh toán */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <div>
          <span className="font-medium">Phương thức thanh toán: </span>
          <span>{paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Thanh toán qua thẻ'}</span>
        </div>
        <div>
          <span className="font-medium">Trạng thái thanh toán: </span>
          <span className={getPaymentStatusColor(paymentStatus)}>
            {getPaymentStatusText(paymentStatus)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusTimeline; 