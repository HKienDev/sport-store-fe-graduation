import { Html, Head, Preview, Body, Container, Section, Heading, Text, Link, Hr, Row, Column } from '@react-email/components';
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
    <Body style={{ background: '#f9f9f9', fontFamily: 'Arial, sans-serif' }}>
      <Container style={{ maxWidth: 650, margin: '0 auto', background: '#fff', borderRadius: 8, padding: 32 }}>
        <Section style={{ textAlign: 'center', marginBottom: 24 }}>
          <Heading style={{ color: '#2563eb', fontSize: 24 }}>ĐƠN HÀNG MỚI TỪ KHÁCH HÀNG</Heading>
          <Text style={{ fontSize: 18, margin: '12px 0' }}>
            <b>{shippingAddress.fullName}</b> vừa đặt đơn hàng #{shortId}
          </Text>
          <Text style={{ color: '#666', fontSize: 14 }}>
            Thời gian đặt: {typeof createdAt === 'string' ? createdAt : new Date(createdAt).toLocaleString('vi-VN')}
          </Text>
        </Section>
        <Section>
          <Text><b>Thông tin khách hàng:</b></Text>
          <Text>Họ tên: {shippingAddress.fullName}</Text>
          <Text>SĐT: {shippingAddress.phone}</Text>
          <Text>Địa chỉ: {shippingAddress.address.street}, {shippingAddress.address.ward.name}, {shippingAddress.address.district.name}, {shippingAddress.address.province.name}</Text>
        </Section>
        <Hr />
        <Section>
          <Text style={{fontWeight: 'bold'}}>Chi tiết đơn hàng:</Text>
          <Section>
            <Row>
              <Column><Text style={{fontWeight: 'bold', color: '#666'}}>Sản phẩm</Text></Column>
              <Column><Text style={{fontWeight: 'bold', color: '#666', textAlign: 'center'}}>SL</Text></Column>
              <Column><Text style={{fontWeight: 'bold', color: '#666', textAlign: 'right'}}>Đơn giá</Text></Column>
            </Row>
            {items.map((item, idx) => (
              <Row key={idx}>
                <Column><Text>{item.name}</Text></Column>
                <Column><Text style={{textAlign: 'center'}}>{item.quantity}</Text></Column>
                <Column><Text style={{textAlign: 'right'}}>{item.price.toLocaleString('vi-VN')}đ</Text></Column>
              </Row>
            ))}
          </Section>
          <Text style={{ textAlign: 'right', fontWeight: 'bold', fontSize: 16, marginTop: 8 }}>
            Tổng thanh toán: {totalPrice.toLocaleString('vi-VN')}đ
          </Text>
        </Section>
        <Section>
          <Text><b>Phương thức thanh toán:</b> {paymentMethod}</Text>
          <Text><b>Trạng thái thanh toán:</b> {paymentStatus}</Text>
        </Section>
        <Section style={{ textAlign: 'center', margin: '24px 0' }}>
          <Link
            href={`https://admin.sportstore.com/orders/${shortId}`}
            style={{ display: 'inline-block', background: '#2563eb', color: '#fff', padding: '12px 32px', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}
          >
            Xem chi tiết đơn hàng trên trang quản trị
          </Link>
        </Section>
        <Hr />
        <Section style={{ textAlign: 'center', color: '#888', fontSize: 12 }}>
          <Text>Đây là email tự động từ hệ thống Sport Store. Vui lòng không trả lời email này.</Text>
          <Text>Mọi thắc mắc liên hệ: support@sportstore.com</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default AdminNewOrderEmail; 