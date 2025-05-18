import * as React from 'react';

interface AdminProductLowStockEmailProps {
  productName: string;
  productSku: string;
  stockLeft: string;
}

const AdminProductLowStockEmail: React.FC<AdminProductLowStockEmailProps> = ({
  productName,
  productSku,
  stockLeft,
}) => (
  <div>
    <h2>Cảnh báo sản phẩm sắp hết hàng</h2>
    <p>
      Sản phẩm <strong>{productName}</strong> (Mã: {productSku}) sắp hết hàng.
    </p>
    <p>
      <strong>Số lượng còn lại:</strong> {stockLeft}
    </p>
    <p>Vui lòng kiểm tra và nhập thêm hàng hoặc ẩn sản phẩm khỏi shop nếu cần thiết.</p>
  </div>
);

export default AdminProductLowStockEmail; 