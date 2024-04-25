export interface Product {
  _id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string[];
  category: string;
  inStock: number;
  variants: ProductVariant[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductVariant {
  variantId: number;
  color: string;
  size: string;
  stock: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string; // Exclude from responses, only for forms
  role: 'admin' | 'customer';
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id: number;
  userId: number;
  products: OrderProduct[];
  paymentDetails: PaymentDetails;
  shippingDetails: ShippingDetails;
  status: 'pending' | 'completed' | 'cancelled';
  totalAmount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderProduct {
  productId: number;
  variantId: number;
  quantity: number;
  price: number;
}

export interface PaymentDetails {
  method: 'credit_card' | 'paypal' | 'stripe';
  status: 'paid' | 'unpaid';
}

export interface ShippingDetails {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  method: 'standard' | 'express';
}

// Types for API responses
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ApiError[];
}

export interface ApiError {
  message: string;
  field?: string;
}

// Types for form data submissions
export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  imageUrl: string[];
  category: string;
  stock: number;
  variants: ProductVariantFormData[];
}

export interface ProductVariantFormData {
  color: string;
  size: string;
  stock: number;
}

export interface ReviewFormData {
  productId: number;
  rating: number;
  comment: string;
}

// Utility types for handling UI states
export interface ModalState {
  isOpen: boolean;
  content: JSX.Element | null;
}

// Extending product type for frontend usage
export interface ProductDetails extends Product {
  relatedProducts: Product[];
}
