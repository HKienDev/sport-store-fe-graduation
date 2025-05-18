import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Link,
  Hr,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import * as React from 'react';

interface ProfileUpdateEmailProps {
  name?: string;
  time?: string;
  changes?: { field: string; value: string }[];
}

const ProfileUpdateEmail: React.FC<ProfileUpdateEmailProps> = ({
  name = 'Khách hàng',
  time = new Date().toLocaleString('vi-VN'),
  changes = []
}) => {
  return (
    <Html>
      <Head />
      <Preview>Thông tin tài khoản của bạn đã được cập nhật</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-10 max-w-[600px] rounded-lg bg-white p-8 shadow-lg">
            <Section style={{ background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)', borderRadius: 12, padding: '24px 0 12px 0', marginBottom: 24 }}>
              <Img
                src="https://sport-store.vercel.app/vju-logo-main.png"
                width="160"
                height="auto"
                alt="Sport Store Logo"
                className="mx-auto mb-2"
              />
              <Heading style={{ color: '#fff', fontWeight: 700, fontSize: 26, margin: 0 }}>Thông tin tài khoản đã được cập nhật</Heading>
            </Section>
            <Section className="text-center">
              <Text className="text-gray-600">
                Xin chào <Text style={{ fontWeight: 'bold', display: 'inline' }}>{name}</Text>,
              </Text>
              <Text className="mt-2 text-gray-600">
                Thông tin tài khoản của bạn tại Sport Store đã được cập nhật thành công vào lúc {time}.
              </Text>
            </Section>

            {changes.length > 0 ? (
              <Section className="mt-8" style={{ border: '2px solid #2563eb', borderRadius: 10, boxShadow: '0 2px 8px 0 #2563eb22', background: '#f3f4f6', padding: 20 }}>
                <Heading style={{ color: '#2563eb', fontWeight: 600, fontSize: 18, marginBottom: 12 }}>Thông tin đã cập nhật</Heading>
                {changes.map((change, index) => (
                  <Section key={index} style={{ background: index % 2 === 0 ? '#f9fafb' : '#fff', padding: 0 }}>
                    <Text style={{ fontWeight: 'bold', display: 'inline', marginRight: 8 }}>{change.field}:</Text>
                    <Text style={{ display: 'inline' }}>{change.value}</Text>
                  </Section>
                ))}
              </Section>
            ) : (
              <Section className="mt-8 rounded-lg bg-green-50 p-6" style={{ border: '2px solid #22c55e', boxShadow: '0 2px 8px 0 #22c55e22' }}>
                <Text className="text-center text-green-700">
                  <Text style={{ fontWeight: 'bold', display: 'inline' }}>Cập nhật thông tin thành công!</Text>
                </Text>
              </Section>
            )}

            <Section className="mt-8 rounded-lg bg-yellow-50 p-4">
              <Text className="text-sm text-yellow-700">
                <Text style={{ fontWeight: 'bold', display: 'inline' }}>Lưu ý bảo mật:</Text> Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ ngay với chúng tôi.
              </Text>
            </Section>

            <Section className="mt-8 text-center">
              <Link 
                href="https://sport-store.vercel.app/user/profile" 
                style={{
                  display: 'inline-block',
                  borderRadius: 8,
                  background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
                  padding: '14px 36px',
                  fontWeight: 600,
                  fontSize: 16,
                  color: '#fff',
                  boxShadow: '0 2px 8px 0 #2563eb22',
                  textDecoration: 'none',
                  margin: '0 auto'
                }}
              >
                Xem tài khoản của tôi
              </Link>
              <Text className="mt-6 text-sm text-gray-600">
                Cần hỗ trợ? Hãy liên hệ với chúng tôi qua email: <Link href="mailto:support@sportstore.com" className="text-blue-600 underline">support@sportstore.com</Link>
              </Text>
            </Section>

            <Hr style={{ borderTop: '1.5px solid #e5e7eb', margin: '32px 0 16px 0' }} />

            <Section className="text-center">
              <Text className="text-xs text-gray-500">
                © 2025 Sport Store. Tất cả các quyền được bảo lưu.
              </Text>
              <Text className="mt-1 text-xs text-gray-500">
                Địa chỉ: 97 Đường Võ Văn Tần, Phường 6, Quận 3, Thành phố Hồ Chí Minh
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ProfileUpdateEmail; 