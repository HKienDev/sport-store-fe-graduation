import { Html, Head, Preview, Body, Container, Section, Heading, Text, Hr } from '@react-email/components';
import * as React from 'react';

interface AdminSecurityAlertEmailProps {
  alertType: string;
  time: string;
  description: string;
}

const AdminSecurityAlertEmail: React.FC<AdminSecurityAlertEmailProps> = ({ alertType, time, description }) => (
  <Html>
    <Head />
    <Preview>Cảnh báo bảo mật: {alertType}</Preview>
    <Body style={{ background: '#f9f9f9', fontFamily: 'Arial, sans-serif' }}>
      <Container style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 8, padding: 24 }}>
        <Section style={{ background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)', borderRadius: 12, padding: '24px 0 12px 0', marginBottom: 24, textAlign: 'center' }}>
          <img src="https://sport-store.vercel.app/vju-logo-main.png" width="140" alt="Sport Store Logo" style={{ display: 'block', margin: '0 auto 8px auto' }} />
          <Heading style={{ color: '#fff', fontWeight: 700, fontSize: 22, margin: 0 }}>Cảnh báo bảo mật hệ thống</Heading>
        </Section>
        <Section style={{ border: '2px solid #f59e42', borderRadius: 10, boxShadow: '0 2px 8px 0 #f59e4222', background: '#fff7ed', padding: 20, textAlign: 'center' }}>
          <Text>Loại cảnh báo: <Text style={{ fontWeight: 'bold', display: 'inline' }}>{alertType}</Text></Text>
          <Text>Thời gian: {time}</Text>
          <Text><Text style={{ fontWeight: 'bold', display: 'inline' }}>Mô tả:</Text> {description}</Text>
        </Section>
        <Hr style={{ borderTop: '1.5px solid #e5e7eb', margin: '32px 0 16px 0' }} />
        <Section style={{ textAlign: 'center' }}>
          <Text style={{ fontSize: 12, color: '#888' }}>Vui lòng kiểm tra hệ thống và xử lý kịp thời.</Text>
          <Text style={{ fontSize: 12, color: '#888' }}>Mọi thắc mắc liên hệ: support@sportstore.com</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default AdminSecurityAlertEmail; 