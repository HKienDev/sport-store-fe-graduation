"use client";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/authContext";
import { CustomerProvider } from "./context/customerContext";
import { CartProvider } from "./context/cartContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CustomerProvider>
        <CartProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                theme: {
                  primary: "#4aed88",
                },
              },
            }}
          />
        </CartProvider>
      </CustomerProvider>
    </AuthProvider>
  );
} 