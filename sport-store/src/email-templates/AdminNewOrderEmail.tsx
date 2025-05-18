import * as React from 'react';

interface Product {
  name: string;
  quantity: number;
  price: string;
}

interface AdminNewOrderEmailProps {
  customerName: string;
  orderId: string;
  totalAmount: string;
  orderTime: string;
  products: Product[];
}

const AdminNewOrderEmail: React.FC<AdminNewOrderEmailProps> = ({
  customerName,
  orderId,
  totalAmount,
  orderTime,
  products,
}) => (
  <div>
    <h2>Thông báo đơn hàng mới</h2>
    <p>
      Khách hàng <strong>{customerName}</strong> vừa đặt một đơn hàng mới.
    </p>
    <p>
      <strong>Mã đơn hàng:</strong> {orderId}
    </p>
    <p>
      <strong>Tổng tiền:</strong> {totalAmount} VND
    </p>
    <p>
      <strong>Thời gian đặt:</strong> {orderTime}
    </p>
    <h3>Danh sách sản phẩm:</h3>
    <ul>
      {products.map((item, idx) => (
        <li key={idx}>
          {item.name} (Số lượng: {item.quantity}) - {item.price} VND
        </li>
      ))}
    </ul>
    <p>Vui lòng kiểm tra và xử lý đơn hàng sớm nhất.</p>
  </div>
);

export default AdminNewOrderEmail; 