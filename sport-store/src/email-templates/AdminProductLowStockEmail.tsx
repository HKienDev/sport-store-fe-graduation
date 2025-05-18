import { Html, Head, Preview, Body, Container, Section, Heading, Text, Hr } from '@react-email/components';
import * as React from 'react';

interface AdminProductLowStockEmailProps {
  productName: string;
  productId: string;
  quantity: number;
  time: string;
}

const AdminProductLowStockEmail: React.FC<AdminProductLowStockEmailProps> = ({ productName, productId, quantity, time }) => (
  <Html>
    <Head />
    <Preview>Cảnh báo sản phẩm sắp hết: {productName}</Preview>
    <Body style={{ background: '#f9f9f9', fontFamily: 'Arial, sans-serif' }}>
      <Container style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 8, padding: 24 }}>
        <Section style={{ textAlign: 'center' }}>
          <Heading>Cảnh báo sản phẩm sắp hết hàng</Heading>
          <Text>Sản phẩm: <Text style={{ fontWeight: 'bold', display: 'inline' }}>{productName}</Text> (Mã: {productId})</Text>
          <Text>Số lượng còn lại: <Text style={{ fontWeight: 'bold', display: 'inline' }}>{quantity}</Text></Text>
          <Text>Thời gian cảnh báo: {time}</Text>
        </Section>
        <Hr />
        <Section>
          <Text style={{ fontSize: 12, color: '#888' }}>Vui lòng kiểm tra kho và nhập thêm hàng nếu cần.</Text>
          <Text style={{ fontSize: 12, color: '#888' }}>Mọi thắc mắc liên hệ: support@sportstore.com</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default AdminProductLowStockEmail; 