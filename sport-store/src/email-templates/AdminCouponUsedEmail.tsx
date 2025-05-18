import * as React from 'react';

interface AdminCouponUsedEmailProps {
  couponCode: string;
  customerName: string;
  orderId: string;
  discountValue: string;
  usedTime: string;
}

const AdminCouponUsedEmail: React.FC<AdminCouponUsedEmailProps> = ({
  couponCode,
  customerName,
  orderId,
  discountValue,
  usedTime,
}) => (
  <div>
    <h2>Mã giảm giá đã được sử dụng</h2>
    <p>
      Mã giảm giá <strong>{couponCode}</strong> vừa được sử dụng bởi khách hàng <strong>{customerName}</strong>.
    </p>
    <p>
      <strong>Mã đơn hàng:</strong> {orderId}
    </p>
    <p>
      <strong>Giá trị giảm:</strong> {discountValue} VND
    </p>
    <p>
      <strong>Thời gian sử dụng:</strong> {usedTime}
    </p>
    <p>Vui lòng theo dõi để phát hiện lạm dụng nếu có.</p>
  </div>
);

export default AdminCouponUsedEmail; 