"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { Product } from "@/types/product";
import { getCategoryById } from "@/services/categoryService";
import { cartService } from "@/services/cartService";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined || amount === null) return "0đ";
  return amount.toLocaleString("vi-VN") + "đ";
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { name, categoryId, originalPrice, salePrice, description, mainImage, stock, sku, colors, sizes } = product;
  const [categoryName, setCategoryName] = useState<string>("Đang tải...");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        if (categoryId) {
          const response = await getCategoryById(categoryId);
          if (response.success) {
            setCategoryName(response.data.name);
          } else {
            setCategoryName("Không xác định");
          }
        } else {
          setCategoryName("Không xác định");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin category:", error);
        setCategoryName("Không xác định");
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn chặn việc chuyển hướng
    
    if (stock === 0) {
      toast.error("Sản phẩm đã hết hàng!");
      return;
    }

    try {
      // Lấy giá trị mặc định
      const defaultColor = colors && colors.length > 0 ? colors[0] : "";
      const defaultSize = sizes && sizes.length > 0 ? sizes[0] : "";
      
      const cartData = {
        sku,
        color: defaultColor,
        size: defaultSize,
        quantity: 1
      };

      const response = await cartService.addToCart(cartData);
      
      if (response.success) {
        toast.success("Đã thêm sản phẩm vào giỏ hàng!");
      } else {
        // Kiểm tra nếu lỗi liên quan đến token
        if (response.message && response.message.includes('Phiên đăng nhập đã hết hạn')) {
          toast.error(response.message);
          // Không chuyển hướng ngay lập tức, để người dùng có thể thử lại
          return;
        }
        toast.error(response.message || "Có lỗi xảy ra khi thêm vào giỏ hàng!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng!");
    }
  };

  // Xử lý hình ảnh mặc định
  const imageUrl = mainImage || "/default-image.png";

  // Tính phần trăm giảm giá
  const discountPercentage = salePrice > 0 
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;

  return (
    <Link href={`/user/products/details/${sku}`} className="block">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 group h-[400px] flex flex-col relative">
        {/* Badge giảm giá */}
        {salePrice > 0 && (
          <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discountPercentage}%
          </div>
        )}

        {/* Badge hết hàng */}
        {stock === 0 && (
          <div className="absolute top-3 right-3 z-10 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-full">
            Hết hàng
          </div>
        )}

        {/* Container ảnh */}
        <div className="relative h-[180px] overflow-hidden">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority
          />
          {/* Overlay khi hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
          
          {/* Nút yêu thích */}
          <button className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-50">
            <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
          </button>
        </div>

        {/* Container thông tin */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Category */}
          <div className="mb-1">
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              {categoryName}
            </span>
          </div>

          {/* Tên sản phẩm */}
          <h3 className="text-base font-bold text-gray-800 mb-1 line-clamp-1 group-hover:text-purple-600 transition-colors">
            {name}
          </h3>

          {/* Mô tả */}
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>

          {/* Giá và nút mua */}
          <div className="flex justify-between items-center mt-auto">
            <div className="flex items-center">
              {salePrice > 0 ? (
                <>
                  <span className="text-base font-bold text-red-500 mr-2">
                    {formatCurrency(salePrice)}
                  </span>
                  <span className="text-sm line-through text-gray-400">
                    {formatCurrency(originalPrice)}
                  </span>
                </>
              ) : (
                <span className="text-base font-bold text-gray-800">
                  {formatCurrency(originalPrice)}
                </span>
              )}
            </div>
            <button 
              onClick={handleAddToCart}
              className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 ${
                stock === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
              }`}
              disabled={stock === 0}
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;