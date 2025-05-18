import { Html, Head, Preview, Body, Container, Section, Heading, Text, Hr } from '@react-email/components';
import * as React from 'react';

interface AdminCancelRequestEmailProps {
  orderId: string;
  customerName: string;
  reason: string;
  time: string;
}

const AdminCancelRequestEmail: React.FC<AdminCancelRequestEmailProps> = ({ orderId, customerName, reason, time }) => (
  <Html>
    <Head />
    <Preview>Yêu cầu hủy đơn hàng #{orderId} từ khách hàng</Preview>
    <Body style={{ background: '#f9f9f9', fontFamily: 'Arial, sans-serif' }}>
      <Container style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 8, padding: 24 }}>
        <Section style={{ textAlign: 'center' }}>
          <Heading>Yêu cầu hủy đơn hàng</Heading>
          <Text>Khách hàng <b>{customerName}</b> vừa gửi yêu cầu hủy đơn hàng.</Text>
        </Section>
        <Section>
          <Text><b>Mã đơn hàng:</b> {orderId}</Text>
          <Text><b>Lý do hủy:</b> {reason}</Text>
          <Text><b>Thời gian yêu cầu:</b> {time}</Text>
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

export default AdminCancelRequestEmail; 