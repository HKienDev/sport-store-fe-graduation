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
  Row,
  Column,
  Link,
  Hr,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import * as React from 'react';

interface NewOrderEmailProduct {
  name: string;
  price: string; // đã format
  image: string;
  quantity: number;
}

interface NewOrderEmailProps {
  shortId: string;
  fullName: string;
  createdAt: string; // đã format
  deliveryDate: string; // đã format
  items: NewOrderEmailProduct[];
  subtotal: string;
  directDiscount: string;
  couponDiscount: string;
  shippingFee: string;
  totalPrice: string;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: string;
}

const NewOrderEmail: React.FC<NewOrderEmailProps> = ({
  shortId,
  fullName,
  createdAt,
  deliveryDate,
  items,
  subtotal,
  directDiscount,
  couponDiscount,
  shippingFee,
  totalPrice,
  shippingAddress,
  paymentMethod,
  paymentStatus,
}) => {
  return (
    <Html>
      <Head />
      <Preview>Xác nhận đơn hàng #{shortId} từ Sport Store</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-10 max-w-[650px] rounded-lg bg-white p-8 shadow-lg">
            <Section className="text-center">
              <Img
                src="https://sport-store.vercel.app/vju-logo-main.png"
                width="160"
                height="auto"
                alt="Sport Store Logo"
                className="mx-auto mb-7"
              />
              <Heading className="text-2xl font-bold text-gray-900">
                Xin chào {fullName}!
              </Heading>
              <Text className="text-gray-600">
                Cảm ơn bạn đã đặt hàng tại{' '}
                <span className="font-semibold text-blue-600">Sport Store</span>
              </Text>
              <Text className="mt-2 text-sm text-gray-500">
                Chúng tôi đã nhận được đơn hàng của bạn và đang xử lý.
              </Text>
            </Section>

            <Section className="mt-8 rounded-lg bg-blue-50 p-4">
              <Row>
                <Column>
                  <Text className="text-xs uppercase text-blue-600">
                    Mã đơn hàng
                  </Text>
                  <Text className="text-lg font-semibold text-blue-800">
                    #{shortId}
                  </Text>
                </Column>
                <Column>
                  <Text className="text-xs uppercase text-blue-600">
                    Ngày đặt hàng
                  </Text>
                  <Text className="text-lg font-medium text-blue-800">
                    {createdAt}
                  </Text>
                </Column>
                <Column>
                  <Text className="text-xs uppercase text-blue-600">
                    Dự kiến giao
                  </Text>
                  <Text className="text-lg font-medium text-blue-800">
                    {deliveryDate}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr style={hr} />

            <Section className="mt-8">
              <Heading className="mb-6 border-l-4 border-blue-500 pl-3 text-lg font-bold text-gray-900">
                Chi tiết đơn hàng
              </Heading>
              <Section>
                <Row>
                  <Column><Text style={{fontWeight: 'bold', textTransform: 'uppercase', color: '#666'}}>Sản phẩm</Text></Column>
                  <Column><Text style={{fontWeight: 'bold', textTransform: 'uppercase', color: '#666', textAlign: 'center'}}>Số lượng</Text></Column>
                  <Column><Text style={{fontWeight: 'bold', textTransform: 'uppercase', color: '#666', textAlign: 'right'}}>Thành tiền</Text></Column>
                </Row>
                {items.map((item, index) => (
                  <Row key={index}>
                    <Column>
                      <Img src={item.image} alt={item.name} width="60" height="60" style={{borderRadius: 8, background: '#f3f4f6'}} />
                      <Text style={{fontWeight: 'bold', color: '#222'}}>{item.name}</Text>
                      <Text style={{fontSize: 12, color: '#888'}}>{item.price} / sản phẩm</Text>
                    </Column>
                    <Column>
                      <Text style={{textAlign: 'center', fontWeight: 500}}>{item.quantity}</Text>
                    </Column>
                    <Column>
                      <Text style={{textAlign: 'right', fontWeight: 'bold'}}>{item.price}</Text>
                    </Column>
                  </Row>
                ))}
              </Section>
            </Section>

            <Section className="mt-8 rounded-lg bg-gray-50 p-5">
              <Row>
                <Column>
                  <Text className="text-sm text-gray-600">Tổng tiền hàng:</Text>
                </Column>
                <Column align="right">
                  <Text className="text-sm font-medium text-gray-900">
                    {subtotal}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text className="text-sm text-gray-600">Giảm giá trực tiếp:</Text>
                </Column>
                <Column align="right">
                  <Text className="text-sm font-medium text-red-600">
                    -{directDiscount}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text className="text-sm text-gray-600">Mã giảm giá:</Text>
                </Column>
                <Column align="right">
                  <Text className="text-sm font-medium text-red-600">
                    -{couponDiscount}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text className="text-sm text-gray-600">Phí vận chuyển:</Text>
                </Column>
                <Column align="right">
                  <Text className="text-sm font-medium text-gray-900">
                    {shippingFee}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text className="text-base font-bold text-gray-900">Tổng thanh toán:</Text>
                </Column>
                <Column align="right">
                  <Text className="text-lg font-bold text-blue-600">
                    {totalPrice}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr style={hr} />

            <Section className="mt-8">
              <Heading className="mb-4 text-lg font-semibold text-gray-900">
                Thông tin giao hàng
              </Heading>
              <Text className="text-gray-700">
                {shippingAddress}
              </Text>
            </Section>

            <Section className="mt-8">
              <Heading className="mb-4 text-lg font-semibold text-gray-900">
                Phương thức thanh toán
              </Heading>
              <Text className="text-gray-700">
                {paymentMethod}
              </Text>
              <Text className="text-gray-700">
                Trạng thái: {paymentStatus}
              </Text>
            </Section>

            <Section className="mt-8 text-center">
              <Link
                href={`https://sport-store.vercel.app/orders/${shortId}`}
                className="inline-block rounded-full bg-blue-600 px-8 py-3 text-white shadow-lg transition-colors hover:bg-blue-700"
              >
                Xem chi tiết đơn hàng
              </Link>
            </Section>

            <Section className="mt-8 rounded-lg bg-gray-50 p-6 text-center">
              <Heading className="mb-4 text-lg font-semibold text-gray-900">
                Hỗ trợ khách hàng
              </Heading>
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <svg
                      className="h-4 w-4 text-blue-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <Link
                    href="mailto:support@sportstore.com"
                    className="text-blue-500"
                  >
                    support@sportstore.com
                  </Link>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <svg
                      className="h-4 w-4 text-blue-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 5.5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5.5z" />
                    </svg>
                  </div>
                  <Link href="tel:0362195258" className="text-blue-500">
                    0362195258
                  </Link>
                </div>
              </div>
            </Section>

            <Section className="mt-8 text-center">
              <Text className="text-sm text-gray-500">
                © 2025 Sport Store. Tất cả các quyền được bảo lưu.
              </Text>
              <Text className="mt-1 text-xs text-gray-500">
                Email này được gửi tự động, vui lòng không trả lời.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default NewOrderEmail;

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

export type { NewOrderEmailProps }; 