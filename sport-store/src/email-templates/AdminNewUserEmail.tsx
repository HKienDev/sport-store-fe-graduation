import { Html, Head, Preview, Body, Container, Section, Heading, Text, Hr } from '@react-email/components';
import * as React from 'react';

interface AdminNewUserEmailProps {
  userName: string;
  email: string;
  time: string;
}

const AdminNewUserEmail: React.FC<AdminNewUserEmailProps> = ({ userName, email, time }) => (
  <Html>
    <Head />
    <Preview>Người dùng mới đăng ký: {userName}</Preview>
    <Body style={{ background: '#f9f9f9', fontFamily: 'Arial, sans-serif' }}>
      <Container style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 8, padding: 24 }}>
        <Section style={{ background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)', borderRadius: 12, padding: '24px 0 12px 0', marginBottom: 24, textAlign: 'center' }}>
          <img src="https://sport-store.vercel.app/vju-logo-main.png" width="140" alt="Sport Store Logo" style={{ display: 'block', margin: '0 auto 8px auto' }} />
          <Heading style={{ color: '#fff', fontWeight: 700, fontSize: 22, margin: 0 }}>Người dùng mới đăng ký</Heading>
        </Section>
        <Section style={{ border: '2px solid #2563eb', borderRadius: 10, boxShadow: '0 2px 8px 0 #2563eb22', background: '#f3f4f6', padding: 20, textAlign: 'center' }}>
          <Text>Tên: <Text style={{ fontWeight: 'bold', display: 'inline' }}>{userName}</Text></Text>
          <Text>Email: <Text style={{ fontWeight: 'bold', display: 'inline' }}>{email}</Text></Text>
          <Text>Thời gian đăng ký: {time}</Text>
        </Section>
        <Hr style={{ borderTop: '1.5px solid #e5e7eb', margin: '32px 0 16px 0' }} />
        <Section style={{ textAlign: 'center' }}>
          <Text style={{ fontSize: 12, color: '#888' }}>Vui lòng kiểm tra và xác thực tài khoản nếu cần.</Text>
          <Text style={{ fontSize: 12, color: '#888' }}>Mọi thắc mắc liên hệ: support@sportstore.com</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default AdminNewUserEmail; 