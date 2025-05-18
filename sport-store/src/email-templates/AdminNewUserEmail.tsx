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
        <Section style={{ textAlign: 'center' }}>
          <Heading>Người dùng mới đăng ký</Heading>
          <Text>Tên: <b>{userName}</b></Text>
          <Text>Email: <b>{email}</b></Text>
          <Text>Thời gian đăng ký: {time}</Text>
        </Section>
        <Hr />
        <Section>
          <Text style={{ fontSize: 12, color: '#888' }}>Vui lòng kiểm tra và xác thực tài khoản nếu cần.</Text>
          <Text style={{ fontSize: 12, color: '#888' }}>Mọi thắc mắc liên hệ: support@sportstore.com</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default AdminNewUserEmail; 