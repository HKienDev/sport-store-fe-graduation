"use client";

import { useCustomer } from "@/app/context/CustomerContext";
import { useCart } from "@/app/context/CartContext";

export default function OrderPreview() {
  const { customer } = useCustomer();
  const { cartItems } = useCart();

  const getFullAddress = () => {
    // Kiểm tra các giá trị cần thiết có tồn tại không
    if (!customer.province || !customer.district || !customer.ward || !customer.address) {
      return "Chưa nhập đủ địa chỉ";
    }

    return `${customer.address}, ${customer.ward.name}, ${customer.district.name}, ${customer.province.name}`;
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">XEM TRƯỚC</h2>

      {/* Thông tin khách hàng */}
      <div className="mb-4">
        <h3 className="font-semibold">Thông tin khách hàng</h3>
        <p>{customer.name || "Chưa nhập tên"}</p>
        <p>{customer.phone || "Chưa nhập số điện thoại"}</p>
        <p>{getFullAddress()}</p>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="mb-4">
        <h3 className="font-semibold">Sản phẩm đơn hàng</h3>
        <table className="w-full border-collapse border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 p-2 text-left">ID</th>
              <th className="border border-gray-200 p-2 text-left">Tên sản phẩm</th>
              <th className="border border-gray-200 p-2 text-right">Đơn giá</th>
              <th className="border border-gray-200 p-2 text-center">Số lượng</th>
              <th className="border border-gray-200 p-2 text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <tr key={item.id} className="border border-gray-200">
                  <td className="border border-gray-200 p-2">#{item.id}</td>
                  <td className="border border-gray-200 p-2 text-blue-600 underline cursor-pointer">
                    {item.name}
                  </td>
                  <td className="border border-gray-200 p-2 text-right font-semibold">
                    {item.price.toLocaleString()} VND
                  </td>
                  <td className="border border-gray-200 p-2 text-center">{item.quantity}</td>
                  <td className="border border-gray-200 p-2 text-right font-semibold">
                    {(item.price * item.quantity).toLocaleString()} VND
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  Chưa có sản phẩm nào trong giỏ hàng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Tổng tiền */}
      <div className="text-right font-semibold text-lg">
        Tổng tiền: {getTotalPrice().toLocaleString()} VND
      </div>
    </div>
  );
}