import { Html, Head, Preview, Body, Container, Section, Heading, Text, Hr } from '@react-email/components';
import * as React from 'react';

interface AdminPaymentErrorEmailProps {
  orderId: string;
  customerName: string;
  error: string;
  time: string;
}

const AdminPaymentErrorEmail: React.FC<AdminPaymentErrorEmailProps> = ({ orderId, customerName, error, time }) => (
  <Html>
    <Head />
    <Preview>Lỗi thanh toán đơn hàng #{orderId}</Preview>
    <Body style={{ background: '#f9f9f9', fontFamily: 'Arial, sans-serif' }}>
      <Container style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 8, padding: 24 }}>
        <Section style={{ textAlign: 'center' }}>
          <Heading>Lỗi thanh toán đơn hàng</Heading>
          <Text>Đơn hàng <Text style={{ fontWeight: 'bold', display: 'inline' }}>#{orderId}</Text> của khách hàng <Text style={{ fontWeight: 'bold', display: 'inline' }}>{customerName}</Text> gặp lỗi khi thanh toán.</Text>
        </Section>
        <Section>
          <Text><Text style={{ fontWeight: 'bold', display: 'inline' }}>Mô tả lỗi:</Text> {error}</Text>
          <Text><Text style={{ fontWeight: 'bold', display: 'inline' }}>Thời gian:</Text> {time}</Text>
        </Section>
        <Hr />
        <Section>
          <Text style={{ fontSize: 12, color: '#888' }}>Vui lòng kiểm tra và xử lý trên hệ thống quản trị.</Text>
          <Text style={{ fontSize: 12, color: '#888' }}>Mọi thắc mắc liên hệ: support@sportstore.com</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default AdminPaymentErrorEmail; 