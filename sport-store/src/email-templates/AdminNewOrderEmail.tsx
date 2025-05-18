import { Html, Head, Preview, Body, Container, Section, Heading, Text, Link, Img } from '@react-email/components';
import * as React from 'react';

interface Product {
  name: string;
  quantity: number;
  price: number;
}

interface AdminNewOrderEmailProps {
  shortId: string;
  createdAt: string | Date;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: {
      street: string;
      ward: { name: string };
      district: { name: string };
      province: { name: string };
    };
  };
  items: Product[];
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
}

// Hàm chuyển đổi sang giờ Việt Nam
const toVNTimeString = (dateStr: string | Date) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
};

const AdminNewOrderEmail: React.FC<AdminNewOrderEmailProps> = ({
  shortId,
  createdAt,
  shippingAddress,
  items,
  totalPrice,
  paymentMethod,
  paymentStatus
}) => (
  <Html>
    <Head />
    <Preview>Khách hàng {shippingAddress.fullName} vừa tạo đơn hàng mới #{shortId}</Preview>
    <Body style={{ background: '#f4f7fa', fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }}>
      <Container style={{ maxWidth: 650, margin: '32px auto', background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px #e0e7ef', padding: 0, overflow: 'hidden' }}>
        {/* Header với background gradient và logo */}
        <Section style={{ background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)', padding: '32px 0 16px 0', textAlign: 'center' }}>
          <Img
            src="https://sport-store.vercel.app/vju-logo-main.png"
            width="160"
            height="auto"
            alt="Sport Store Logo"
            style={{ margin: '0 auto 12px auto', display: 'block' }}
          />
          <Heading style={{ color: '#fff', fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: 1 }}>
            ĐƠN HÀNG MỚI TỪ KHÁCH HÀNG
          </Heading>
          <Text style={{ color: '#e0e7ef', fontSize: 16, margin: '8px 0 0 0' }}>
            <b>{shippingAddress.fullName}</b> vừa đặt đơn hàng #{shortId}
          </Text>
          <Text style={{ color: '#e0e7ef', fontSize: 14, margin: '4px 0 0 0' }}>
            Thời gian đặt: {toVNTimeString(createdAt)}
          </Text>
        </Section>

        {/* Thông tin khách hàng */}
        <Section style={{ padding: '24px 32px 0 32px' }}>
          <Heading style={{ fontSize: 16, color: '#222', fontWeight: 700, margin: '0 0 8px 0' }}>
            Thông tin khách hàng
          </Heading>
          <Text style={{ color: '#444', fontSize: 15 }}>Họ tên: {shippingAddress.fullName}</Text>
          <Text style={{ color: '#444', fontSize: 15 }}>SĐT: {shippingAddress.phone}</Text>
          <Text style={{ color: '#444', fontSize: 15 }}>
            Địa chỉ: {shippingAddress.address.street}, {shippingAddress.address.ward.name}, {shippingAddress.address.district.name}, {shippingAddress.address.province.name}
          </Text>
        </Section>

        {/* Bảng sản phẩm */}
        <Section style={{ padding: '24px 32px 0 32px' }}>
          <Heading style={{ fontSize: 16, color: '#222', fontWeight: 700, margin: '0 0 12px 0', borderLeft: '4px solid #2563eb', paddingLeft: 12 }}>
            Chi tiết đơn hàng
          </Heading>
          <table style={productTable}>
            <thead>
              <tr>
                <th style={thStyle}>Sản phẩm</th>
                <th style={thStyle}>Số lượng</th>
                <th style={thStyle}>Đơn giá</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} style={idx % 2 === 0 ? rowEven : rowOdd}>
                  <td style={{ ...tdStyle, minWidth: 180 }}>{item.name}</td>
                  <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 500 }}>{item.quantity}</td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700 }}>{item.price.toLocaleString('vi-VN')}đ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        {/* Tổng kết đơn hàng */}
        <Section style={{ padding: '24px 32px 0 32px' }}>
          <table style={{ width: '100%', background: '#f1f5f9', borderRadius: 8, padding: 16, margin: '0 0 8px 0' }}>
            <tbody>
              <tr>
                <td style={summaryLabel}>Tổng thanh toán:</td>
                <td style={{ ...summaryValue, color: '#2563eb', fontWeight: 700, fontSize: 18 }}>{totalPrice.toLocaleString('vi-VN')}đ</td>
              </tr>
            </tbody>
          </table>
        </Section>

        {/* Phương thức thanh toán */}
        <Section style={{ padding: '24px 32px 0 32px' }}>
          <Heading style={{ fontSize: 16, color: '#222', fontWeight: 700, margin: '0 0 8px 0' }}>
            Phương thức thanh toán
          </Heading>
          <Text style={{ color: '#444', fontSize: 15 }}>{paymentMethod}</Text>
          <Text style={{ color: '#444', fontSize: 15 }}>Trạng thái: {paymentStatus}</Text>
        </Section>

        {/* Nút CTA */}
        <Section style={{ textAlign: 'center', padding: '32px 0 0 0' }}>
          <Link
            href={`https://admin.sportstore.com/orders/${shortId}`}
            style={{ display: 'inline-block', background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)', color: '#fff', padding: '14px 40px', borderRadius: 32, fontWeight: 700, fontSize: 16, textDecoration: 'none', boxShadow: '0 2px 8px #dbeafe', margin: '0 auto' }}
          >
            Xem chi tiết đơn hàng trên trang quản trị
          </Link>
        </Section>

        {/* Footer */}
        <Section style={{ background: '#f1f5f9', marginTop: 32, padding: '32px 0 0 0', textAlign: 'center', borderTop: '1px solid #e5e7eb' }}>
          <Text style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
            Đây là email tự động từ hệ thống Sport Store. Vui lòng không trả lời email này.<br />Mọi thắc mắc liên hệ: <Link href="mailto:support@sportstore.com" style={{ color: '#2563eb', textDecoration: 'underline' }}>support@sportstore.com</Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default AdminNewOrderEmail;

// Style constants
const productTable = { width: '100%', borderCollapse: 'collapse' as const, background: '#fff', borderRadius: 8, overflow: 'hidden', marginBottom: 8 };
const thStyle = { background: '#f1f5f9', color: '#2563eb', fontWeight: 700, fontSize: 13, padding: '10px 8px', borderBottom: '2px solid #e5e7eb', textAlign: 'left' as const };
const tdStyle = { padding: '10px 8px', borderBottom: '1px solid #e5e7eb', fontSize: 14, color: '#222', background: '#fff' };
const rowEven = { background: '#f8fafc' };
const rowOdd = { background: '#fff' };
const summaryLabel = { color: '#64748b', fontWeight: 500, fontSize: 14, padding: '6px 0' };
const summaryValue = { color: '#222', fontWeight: 600, fontSize: 15, textAlign: 'right' as const, padding: '6px 0' }; 