import { NextResponse } from 'next/server';
import { sendEmailFromTemplate, sendAdminEmailFromTemplate } from '@/lib/email';
import { NewOrderEmail } from '@/components/emails/NewOrderEmail';
import AdminNewOrderEmail from '@/email-templates/AdminNewOrderEmail';

interface OrderEmailProps {
  order: {
    shortId: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    subtotal: number;
    directDiscount: number;
    couponDiscount: number;
    shippingFee: number;
    totalPrice: number;
    shippingAddress: {
      fullName: string;
      phone: string;
      address: {
        street: string;
        ward: { name: string };
        district: { name: string };
        province: { name: string };
      };
    };
    createdAt: string;
  };
}

export async function POST(request: Request) {
  try {
    const orderData = await request.json();

    console.log('Gửi email user...');
    await sendEmailFromTemplate({
      to: orderData.shippingAddress.email,
      subject: `Xác nhận đơn hàng #${orderData.shortId}`,
      template: NewOrderEmail,
      templateProps: orderData as OrderEmailProps["order"]
    });

    console.log('Gửi email admin...');
    await sendAdminEmailFromTemplate({
      subject: `Có đơn hàng mới #${orderData.shortId}`,
      template: AdminNewOrderEmail,
      templateProps: {
        shortId: orderData.shortId,
        createdAt: orderData.createdAt,
        shippingAddress: orderData.shippingAddress,
        items: orderData.items,
        totalPrice: orderData.totalPrice,
        paymentMethod: orderData.paymentMethod,
        paymentStatus: orderData.paymentStatus,
      }
    });

    console.log('Đã gọi xong 2 hàm gửi email');

    return NextResponse.json({ 
      success: true, 
      message: "Đơn hàng đã được tạo và email xác nhận đã được gửi" 
    });
  } catch (error) {
    console.error("Lỗi khi xử lý đơn hàng:", error);
    return NextResponse.json(
      { success: false, message: "Có lỗi xảy ra khi xử lý đơn hàng" },
      { status: 500 }
    );
  }
} 