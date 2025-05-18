import * as React from 'react';

interface AdminPaymentErrorEmailProps {
  customerName: string;
  orderId: string;
  errorDescription: string;
  errorTime: string;
}

const AdminPaymentErrorEmail: React.FC<AdminPaymentErrorEmailProps> = ({
  customerName,
  orderId,
  errorDescription,
  errorTime,
}) => (
  <div>
    <h2>Thông báo lỗi thanh toán</h2>
    <p>
      Đã xảy ra lỗi thanh toán với đơn hàng của khách <strong>{customerName}</strong>.
    </p>
    <p>
      <strong>Mã đơn hàng:</strong> {orderId}
    </p>
    <p>
      <strong>Mô tả lỗi:</strong> {errorDescription}
    </p>
    <p>
      <strong>Thời gian:</strong> {errorTime}
    </p>
    <p>Vui lòng kiểm tra và hỗ trợ khách hàng nếu cần thiết.</p>
  </div>
);

export default AdminPaymentErrorEmail; 