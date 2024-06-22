export interface Product {
  _id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  brand: string;
  inStock: number;
  rating: number;
  numReviews: number;
  discount: number;
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
  role: "admin" | "customer";
  createdAt?: string;
  updatedAt?: string;
  profile_picture_url?: string;
}

export interface Review {
  _id: number;
  userId: number;
  productId: number;
  name: string;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  name: string;
  qty: number;
  image: string;
  price: number;
  product: string; // Assuming the product is referenced by its ObjectId in string format
}

// Define the ShippingAddress interface
export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

// Define the PaymentResult interface
export interface PaymentResult {
  id: string; // Payment ID from payment gateway
  status: string;
  update_time: string;
  email_address: string;
}

// Define the Order interface
export interface Order {
  _id?: string; // Optional, since MongoDB will generate this
  user: string; // Reference to the user who placed the order (user ID in string format)
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentResult?: PaymentResult; // Optional, may not be present initially
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date; // Optional, may not be set initially
  isDelivered: boolean;
  deliveredAt?: Date; // Optional, may not be set initially
  createdAt?: Date; // Automatically created by Mongoose
  updatedAt?: Date; // Automatically created by Mongoose
}

export interface PaymentDetails {
  method: "credit_card" | "paypal" | "stripe";
  status: "paid" | "unpaid";
}

export interface ShippingDetails {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  method: "standard" | "express";
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

export interface CartItem {
  product: string | string[];
  name: string;
  image: string;
  price: number;
  countInStock: number;
  qty: number;
}

export interface Cart {
  cartItems: CartItem[];
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
}