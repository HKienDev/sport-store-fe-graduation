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

interface VerificationEmailProps {
  otp: string;
  name?: string;
}

const VerificationEmail: React.FC<VerificationEmailProps> = ({
  otp,
  name = 'Khách hàng',
}) => {
  return (
    <Html>
      <Head />
      <Preview>Mã OTP xác thực tài khoản của bạn tại Sport Store</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-10 max-w-[600px] rounded-lg bg-white p-8 shadow-lg">
            <Section className="text-center">
              <Img
                src="https://sport-store.vercel.app/vju-logo-main.png"
                width="160"
                height="auto"
                alt="Sport Store Logo"
                className="mx-auto mb-6"
              />
              <Heading className="text-2xl font-bold text-gray-900">
                Xác thực tài khoản
              </Heading>
              <Text className="text-gray-600">
                Xin chào <Text style={{ fontWeight: 'bold', display: 'inline' }}>{name}</Text>,
              </Text>
              <Text className="mt-2 text-gray-600">
                Cảm ơn bạn đã đăng ký tài khoản tại Sport Store. Vui lòng sử dụng mã OTP dưới đây để xác thực tài khoản của bạn.
              </Text>
            </Section>

            <Section className="mt-8 text-center">
              <Section style={{
                borderRadius: '8px',
                background: '#f3f4f6',
                padding: '16px 0',
                fontSize: '24px',
                fontWeight: 'bold',
                letterSpacing: '4px',
                display: 'inline-block',
                width: 'auto',
                margin: '0 auto'
              }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', letterSpacing: 4 }}>{otp}</Text>
              </Section>
              <Text className="mt-4 text-sm text-gray-600">
                Mã này sẽ hết hạn sau 10 phút.
              </Text>
            </Section>

            <Section className="mt-8 rounded-lg bg-yellow-50 p-4">
              <Text className="text-sm text-yellow-700">
                <Text style={{ fontWeight: 'bold', display: 'inline' }}>Lưu ý:</Text> Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi nếu bạn có bất kỳ thắc mắc nào.
              </Text>
            </Section>

            <Section className="mt-8 text-center">
              <Text className="text-sm text-gray-600">
                Cần hỗ trợ? Hãy liên hệ với chúng tôi qua email: <Link href="mailto:support@sportstore.com" className="text-blue-600 underline">support@sportstore.com</Link>
              </Text>
            </Section>

            <Hr className="my-8 border-gray-200" />

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

export default VerificationEmail; 