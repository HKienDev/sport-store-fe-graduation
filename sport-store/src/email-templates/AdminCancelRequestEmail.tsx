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
        <Section style={{ background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)', borderRadius: 12, padding: '24px 0 12px 0', marginBottom: 24, textAlign: 'center' }}>
          <img src="https://sport-store.vercel.app/vju-logo-main.png" width="140" alt="Sport Store Logo" style={{ display: 'block', margin: '0 auto 8px auto' }} />
          <Heading style={{ color: '#fff', fontWeight: 700, fontSize: 22, margin: 0 }}>Yêu cầu hủy đơn hàng</Heading>
        </Section>
        <Section style={{ border: '2px solid #ef4444', borderRadius: 10, boxShadow: '0 2px 8px 0 #ef444422', background: '#fef2f2', padding: 20, textAlign: 'center' }}>
          <Text>Khách hàng <Text style={{ fontWeight: 'bold', display: 'inline' }}>{customerName}</Text> vừa gửi yêu cầu hủy đơn hàng.</Text>
          <Text><Text style={{ fontWeight: 'bold', display: 'inline' }}>Mã đơn hàng:</Text> {orderId}</Text>
          <Text><Text style={{ fontWeight: 'bold', display: 'inline' }}>Lý do hủy:</Text> {reason}</Text>
          <Text><Text style={{ fontWeight: 'bold', display: 'inline' }}>Thời gian yêu cầu:</Text> {time}</Text>
        </Section>
        <Hr style={{ borderTop: '1.5px solid #e5e7eb', margin: '32px 0 16px 0' }} />
        <Section style={{ textAlign: 'center' }}>
          <Text style={{ fontSize: 12, color: '#888' }}>Vui lòng kiểm tra và xử lý trên hệ thống quản trị.</Text>
          <Text style={{ fontSize: 12, color: '#888' }}>Mọi thắc mắc liên hệ: support@sportstore.com</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default AdminCancelRequestEmail; 