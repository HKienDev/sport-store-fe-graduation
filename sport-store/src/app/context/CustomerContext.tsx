"use client";

import { createContext, useContext, useState, useCallback } from "react";

// Định nghĩa kiểu Location rõ ràng
export interface Location {
  code: string;
  name: string;
}

// Đảm bảo kiểu dữ liệu chính xác cho thông tin khách hàng
export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  province: Location | null;
  district: Location | null;
  ward: Location | null;
}

type CustomerValue = string | Location | null;

interface CustomerContextType {
  customer: CustomerInfo;
  updateCustomer: (field: keyof CustomerInfo, value: CustomerValue) => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: "",
    phone: "",
    address: "",
    province: null,
    district: null,
    ward: null,
  });

  const updateCustomer = useCallback((field: keyof CustomerInfo, value: CustomerValue) => {
    setCustomer((prev) => {
      let updatedCustomer = { ...prev, [field]: value };
  
      if (field === "province") {
        updatedCustomer = { ...updatedCustomer, district: null, ward: null };
      }
  
      if (field === "district") {
        updatedCustomer = { ...updatedCustomer, ward: null };
      }
  
      console.log("🔄 updateCustomer:", updatedCustomer); // Debug log
      return updatedCustomer;
    });
  }, []);

  return (
    <CustomerContext.Provider value={{ customer, updateCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomer must be used within a CustomerProvider");
  }
  return context;
}