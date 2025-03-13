// src/app/admin/orders/add/page.tsx
"use client";

import { useState } from "react";
import CustomerInfo from "@/components/Orders/CustomerInfo";
import OrderPreview from "@/components/Orders/OrderPreview";
import OrderProducts from "@/components/Orders/OrderProducts";
import OrderActions from "@/components/Orders/OrderActions";
import { PaymentMethodProvider } from "@/app/context/PaymentMethodContext";

export default function AddOrderPage() {
  const [formKey, setFormKey] = useState(0);

  const handleResetForm = () => {
    setFormKey(prev => prev + 1);
  };

  return (
    <PaymentMethodProvider>
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">THÊM ĐƠN HÀNG</h1>
          <OrderActions onResetForm={handleResetForm} />
        </div>

        {/* Nội dung */}
        <div className="flex gap-6 mt-6 items-start">
          {/* Cột trái */}
          <div className="w-1/2 flex flex-col gap-6">
            {/* Thêm tiền tố unique cho key */}
            <CustomerInfo key={`customer-${formKey}`} /> 
            <OrderPreview key={`preview-${formKey}`} />
          </div>

          {/* Cột phải */}
          <OrderProducts key={`products-${formKey}`} />
        </div>
      </div>
    </PaymentMethodProvider>
  );
}