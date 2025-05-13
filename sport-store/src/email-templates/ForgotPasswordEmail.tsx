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
  Code,
  Link,
  Hr,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import * as React from 'react';

interface ForgotPasswordEmailProps {
  otp: string;
  name?: string;
}

const ForgotPasswordEmail: React.FC<ForgotPasswordEmailProps> = ({
  otp,
  name = 'Khách hàng',
}) => {
  return (
    <Html>
      <Head />
      <Preview>Mã OTP đặt lại mật khẩu tại Sport Store</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-10 max-w-[600px] rounded-lg bg-white p-8 shadow-lg">
            <Section className="text-center">
              <Img
                src="https://sport-store.vercel.app/Logo_vju.png"
                width="160"
                height="auto"
                alt="Sport Store Logo"
                className="mx-auto mb-6"
              />
              <Heading className="text-2xl font-bold text-gray-900">
                Yêu cầu đặt lại mật khẩu
              </Heading>
              <Text className="text-gray-600">
                Xin chào <span className="font-semibold">{name}</span>,
              </Text>
              <Text className="mt-2 text-gray-600">
                Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã OTP dưới đây để hoàn tất quá trình đặt lại mật khẩu.
              </Text>
            </Section>

            <Section className="mt-8 text-center">
              <Code className="rounded-lg bg-gray-100 px-8 py-4 text-center text-xl font-bold tracking-widest text-gray-800">
                {otp}
              </Code>
              <Text className="mt-4 text-sm text-gray-600">
                Mã này sẽ hết hạn sau 10 phút.
              </Text>
            </Section>

            <Section className="mt-8 rounded-lg bg-red-50 p-4">
              <Text className="text-sm text-red-700">
                <strong>Cảnh báo bảo mật:</strong> Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này và xem xét việc đổi mật khẩu tài khoản của bạn ngay lập tức.
              </Text>
            </Section>

            <Section className="mt-8 text-center">
              <Text className="text-sm text-gray-600">
                Nếu bạn cần hỗ trợ, hãy liên hệ với chúng tôi qua email: <Link href="mailto:support@sportstore.com" className="text-blue-600 underline">support@sportstore.com</Link>
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

export default ForgotPasswordEmail; 