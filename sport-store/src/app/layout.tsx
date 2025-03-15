import type { Metadata } from "next";
import { Toaster } from "@/Components/UI/toaster";
import { AuthProvider } from "@/app/context0/AuthContext";
import { CustomerProvider } from "@/app/context0/CustomerContext";
import { CartProvider } from "@/app/context0/CartContext"; // Import CartProvider
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sport Store - Mua sắm đồ thể thao",
  description: "Cửa hàng bán đồ thể thao chính hãng, chất lượng.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html suppressHydrationWarning lang="vi">
      <body className="font-sans antialiased">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <AuthProvider>
            <CustomerProvider>
              <CartProvider>
                <Toaster />
                {children}
              </CartProvider>
            </CustomerProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}