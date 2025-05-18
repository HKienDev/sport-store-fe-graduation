import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Link,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface NewOrderEmailProduct {
  name: string;
  price: string; // đã format
  image: string;
  quantity: number;
}

interface NewOrderEmailProps {
  shortId: string;
  fullName: string;
  createdAt: string; // đã format
  deliveryDate: string; // đã format
  items: NewOrderEmailProduct[];
  subtotal: string;
  directDiscount: string;
  couponDiscount: string;
  shippingFee: string;
  totalPrice: string;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: string;
}

const NewOrderEmail: React.FC<NewOrderEmailProps> = ({
  shortId,
  fullName,
  createdAt,
  deliveryDate,
  items,
  subtotal,
  directDiscount,
  couponDiscount,
  shippingFee,
  totalPrice,
  shippingAddress,
  paymentMethod,
  paymentStatus,
}) => {
  return (
    <Html>
      <Head />
      <Preview>Xác nhận đơn hàng #{shortId} từ Sport Store</Preview>
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
            <Heading style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: 1 }}>
              Cảm ơn bạn đã đặt hàng!
            </Heading>
            <Text style={{ color: '#e0e7ef', fontSize: 16, margin: '8px 0 0 0' }}>
              Xin chào <b>{fullName}</b>, đơn hàng của bạn đã được ghi nhận.
            </Text>
          </Section>

          {/* Thông tin đơn hàng tổng quan */}
          <Section style={{ padding: '24px 32px 0 32px', textAlign: 'center' }}>
            <table style={{ width: '100%', margin: '0 auto', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={orderInfoLabel}>Mã đơn hàng</td>
                  <td style={orderInfoValue}>#{shortId}</td>
                  <td style={orderInfoLabel}>Ngày đặt</td>
                  <td style={orderInfoValue}>{createdAt}</td>
                  <td style={orderInfoLabel}>Dự kiến giao</td>
                  <td style={orderInfoValue}>{deliveryDate}</td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Bảng sản phẩm */}
          <Section style={{ padding: '24px 32px 0 32px' }}>
            <Heading style={{ fontSize: 18, color: '#222', fontWeight: 700, margin: '0 0 12px 0', borderLeft: '4px solid #2563eb', paddingLeft: 12 }}>
              Chi tiết đơn hàng
            </Heading>
            <table style={productTable}>
              <thead>
                <tr>
                  <th style={thStyle}>Sản phẩm</th>
                  <th style={thStyle}>Số lượng</th>
                  <th style={thStyle}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} style={idx % 2 === 0 ? rowEven : rowOdd}>
                    <td style={{ ...tdStyle, minWidth: 180 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Img src={item.image} alt={item.name} width="48" height="48" style={{ borderRadius: 8, background: '#f3f4f6', marginRight: 8 }} />
                        <div>
                          <div style={{ fontWeight: 600, color: '#222', fontSize: 15 }}>{item.name}</div>
                          <div style={{ fontSize: 12, color: '#888' }}>{item.price} / sản phẩm</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 500 }}>{item.quantity}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700 }}>{item.price}</td>
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
                  <td style={summaryLabel}>Tổng tiền hàng:</td>
                  <td style={summaryValue}>{subtotal}</td>
                </tr>
                <tr>
                  <td style={summaryLabel}>Giảm giá trực tiếp:</td>
                  <td style={{ ...summaryValue, color: '#ef4444' }}>-{directDiscount}</td>
                </tr>
                <tr>
                  <td style={summaryLabel}>Mã giảm giá:</td>
                  <td style={{ ...summaryValue, color: '#ef4444' }}>-{couponDiscount}</td>
                </tr>
                <tr>
                  <td style={summaryLabel}>Phí vận chuyển:</td>
                  <td style={summaryValue}>{shippingFee}</td>
                </tr>
                <tr>
                  <td style={{ ...summaryLabel, fontWeight: 700, fontSize: 16 }}>Tổng thanh toán:</td>
                  <td style={{ ...summaryValue, color: '#2563eb', fontWeight: 700, fontSize: 18 }}>{totalPrice}</td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Thông tin giao hàng */}
          <Section style={{ padding: '24px 32px 0 32px' }}>
            <Heading style={{ fontSize: 16, color: '#222', fontWeight: 700, margin: '0 0 8px 0' }}>
              Thông tin giao hàng
            </Heading>
            <Text style={{ color: '#444', fontSize: 15 }}>{shippingAddress}</Text>
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
              href={`https://sport-store.vercel.app/orders/${shortId}`}
              style={{ display: 'inline-block', background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)', color: '#fff', padding: '14px 40px', borderRadius: 32, fontWeight: 700, fontSize: 16, textDecoration: 'none', boxShadow: '0 2px 8px #dbeafe', margin: '0 auto' }}
            >
              Xem chi tiết đơn hàng
            </Link>
          </Section>

          {/* Footer */}
          <Section style={{ background: '#f1f5f9', marginTop: 32, padding: '32px 0 0 0', textAlign: 'center', borderTop: '1px solid #e5e7eb' }}>
            <Text style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
              Mọi thắc mắc vui lòng liên hệ <Link href="mailto:support@sportstore.com" style={{ color: '#2563eb', textDecoration: 'underline' }}>support@sportstore.com</Link> hoặc <Link href="tel:0362195258" style={{ color: '#2563eb', textDecoration: 'underline' }}>0362195258</Link>
            </Text>
            <Text style={{ color: '#94a3b8', fontSize: 12, margin: '8px 0 0 0' }}>
              © 2025 Sport Store. Tất cả các quyền được bảo lưu.<br />Email này được gửi tự động, vui lòng không trả lời.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default NewOrderEmail;

// Style constants
const orderInfoLabel = { color: '#2563eb', fontWeight: 600, fontSize: 13, padding: '4px 8px', textTransform: 'uppercase', letterSpacing: 0.5 };
const orderInfoValue = { color: '#222', fontWeight: 700, fontSize: 15, padding: '4px 8px' };
const productTable = { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', marginBottom: 8 };
const thStyle = { background: '#f1f5f9', color: '#2563eb', fontWeight: 700, fontSize: 13, padding: '10px 8px', borderBottom: '2px solid #e5e7eb', textAlign: 'left' };
const tdStyle = { padding: '10px 8px', borderBottom: '1px solid #e5e7eb', fontSize: 14, color: '#222', background: '#fff' };
const rowEven = { background: '#f8fafc' };
const rowOdd = { background: '#fff' };
const summaryLabel = { color: '#64748b', fontWeight: 500, fontSize: 14, padding: '6px 0' };
const summaryValue = { color: '#222', fontWeight: 600, fontSize: 15, textAlign: 'right', padding: '6px 0' };

export type { NewOrderEmailProps }; 