import { Html, Head, Preview, Body, Container, Section, Heading, Text, Hr } from '@react-email/components';
import * as React from 'react';

interface AdminPeriodicReportEmailProps {
  reportType: string;
  time: string;
  description: string;
}

const AdminPeriodicReportEmail: React.FC<AdminPeriodicReportEmailProps> = ({ reportType, time, description }) => (
  <Html>
    <Head />
    <Preview>Báo cáo định kỳ: {reportType}</Preview>
    <Body style={{ background: '#f9f9f9', fontFamily: 'Arial, sans-serif' }}>
      <Container style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 8, padding: 24 }}>
        <Section style={{ textAlign: 'center' }}>
          <Heading>Báo cáo định kỳ hệ thống</Heading>
          <Text>Loại báo cáo: <b>{reportType}</b></Text>
          <Text>Thời gian: {time}</Text>
        </Section>
        <Section>
          <Text><b>Mô tả:</b> {description}</Text>
        </Section>
        <Hr />
        <Section>
          <Text style={{ fontSize: 12, color: '#888' }}>Vui lòng kiểm tra chi tiết báo cáo trên hệ thống quản trị.</Text>
          <Text style={{ fontSize: 12, color: '#888' }}>Mọi thắc mắc liên hệ: support@sportstore.com</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default AdminPeriodicReportEmail; 