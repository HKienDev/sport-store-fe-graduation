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
        <Section style={{ textAlign: 'center' }}>
          <Heading>Cảnh báo bảo mật hệ thống</Heading>
          <Text>Loại cảnh báo: <Text style={{ fontWeight: 'bold', display: 'inline' }}>{alertType}</Text></Text>
          <Text>Thời gian: {time}</Text>
        </Section>
        <Section>
          <Text><Text style={{ fontWeight: 'bold', display: 'inline' }}>Mô tả:</Text> {description}</Text>
        </Section>
        <Hr />
        <Section>
          <Text style={{ fontSize: 12, color: '#888' }}>Vui lòng kiểm tra hệ thống và xử lý kịp thời.</Text>
          <Text style={{ fontSize: 12, color: '#888' }}>Mọi thắc mắc liên hệ: support@sportstore.com</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default AdminSecurityAlertEmail; 