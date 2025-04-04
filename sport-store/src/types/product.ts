export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  originalPrice: number;
  salePrice: number;
  stock: number;
  category: string;
  isActive: boolean;
  mainImage: string;
  subImages: string[];
  colors: string[];
  sizes: string[];
  sku: string;
  tags: string[];
  soldCount: number;
  viewCount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  discountPercentage: number;
  isOutOfStock: boolean;
  isLowStock: boolean;
  ratings: {
    average: number;
    count: number;
  };
}

export interface ProductQueryParams {
  keyword?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}

export interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface SingleProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface ProductFormData {
  name: string;
  description: string;
  brand: string;
  originalPrice: number;
  salePrice: number;
  stock: number;
  categoryId: string;
  mainImage: string | null;
  subImages: string[];
  colors: string[];
  sizes: string[];
  tags: string[];
  isActive: boolean;
}

export interface ProductFormErrors {
  name?: string;
  description?: string;
  brand?: string;
  originalPrice?: string;
  salePrice?: string;
  stock?: string;
  categoryId?: string;
  mainImage?: string;
  subImages?: string;
  colors?: string;
  sizes?: string;
  tags?: string;
}

export interface Category {
  _id: string;
  categoryId: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface ProductFormState {
  data: ProductFormData;
  errors: ProductFormErrors;
  isLoading: boolean;
  isSubmitting: boolean;
  categories: Category[];
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string;
} 