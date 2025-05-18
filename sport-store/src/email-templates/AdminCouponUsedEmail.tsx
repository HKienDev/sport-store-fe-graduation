import { Html, Head, Preview, Body, Container, Section, Heading, Text, Hr } from '@react-email/components';
import * as React from 'react';

interface AdminCouponUsedEmailProps {
  couponCode: string;
  customerName: string;
  orderId: string;
  time: string;
}

const AdminCouponUsedEmail: React.FC<AdminCouponUsedEmailProps> = ({ couponCode, customerName, orderId, time }) => (
  <Html>
    <Head />
    <Preview>Mã giảm giá đã được sử dụng: {couponCode}</Preview>
    <Body style={{ background: '#f9f9f9', fontFamily: 'Arial, sans-serif' }}>
      <Container style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 8, padding: 24 }}>
        <Section style={{ textAlign: 'center' }}>
          <Heading>Mã giảm giá đã được sử dụng</Heading>
          <Text>Mã coupon: <b>{couponCode}</b></Text>
          <Text>Khách hàng: <b>{customerName}</b></Text>
          <Text>Đơn hàng liên quan: {orderId}</Text>
          <Text>Thời gian sử dụng: {time}</Text>
        </Section>
        <Hr />
        <Section>
          <Text style={{ fontSize: 12, color: '#888' }}>Vui lòng kiểm tra lịch sử sử dụng mã giảm giá trên hệ thống.</Text>
          <Text style={{ fontSize: 12, color: '#888' }}>Mọi thắc mắc liên hệ: support@sportstore.com</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default AdminCouponUsedEmail; 