'use client';

import { AuthProvider } from "@/context/authContext";
import { CartProvider } from "@/context/cartContext";
import { CustomerProvider } from "@/context/customerContext";
import { PaymentMethodProvider } from "@/context/paymentMethodContext";
import { ShippingMethodProvider } from "@/context/shippingMethodContext";
import { PromoProvider } from "@/context/promoContext";
import { Toaster } from "@/components/ui/toast";

interface ClientLayoutProps {
  children: React.ReactNode;
  // fontClass: string; // Xóa nếu không dùng
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <CustomerProvider>
          <PaymentMethodProvider>
            <ShippingMethodProvider>
              <PromoProvider>
                {children}
                <Toaster />
              </PromoProvider>
            </ShippingMethodProvider>
          </PaymentMethodProvider>
        </CustomerProvider>
      </CartProvider>
    </AuthProvider>
  );
} 