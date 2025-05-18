import * as React from 'react';

interface BestSeller {
  name: string;
  sold: number;
}

interface AdminPeriodicReportEmailProps {
  reportType: string;
  reportTime: string;
  totalOrders: string;
  totalRevenue: string;
  newCustomers: string;
  bestSellers: BestSeller[];
}

const AdminPeriodicReportEmail: React.FC<AdminPeriodicReportEmailProps> = ({
  reportType,
  reportTime,
  totalOrders,
  totalRevenue,
  newCustomers,
  bestSellers,
}) => (
  <div>
    <h2>Báo cáo {reportType}</h2>
    <p>
      <strong>Thời gian:</strong> {reportTime}
    </p>
    <p>
      <strong>Tổng số đơn hàng:</strong> {totalOrders}
    </p>
    <p>
      <strong>Tổng doanh thu:</strong> {totalRevenue} VND
    </p>
    <p>
      <strong>Số khách hàng mới:</strong> {newCustomers}
    </p>
    <h3>Sản phẩm bán chạy:</h3>
    <ul>
      {bestSellers.map((item, idx) => (
        <li key={idx}>
          {item.name} (Đã bán: {item.sold})
        </li>
      ))}
    </ul>
    <p>Vui lòng xem chi tiết trong hệ thống quản trị.</p>
  </div>
);

export default AdminPeriodicReportEmail; 