export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: 'USER' | 'ADMIN' | 'PARTNER';
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  image?: string;
  images: string[];
  origin: string;
  price: number;
  compareAt?: number;
  stock: number;
  weight?: number;
  status: ProductStatus;
  legality?: string;
  packageDesign?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt?: Date;
  rating?: number;
  reviewCount?: number;
  reviews?: Review[];
}

export type ProductCategory = 'COFFEE' | 'PATCHOULI' | 'SEAFOOD' | 'SPICES' | 'PROCESSED';
export type ProductStatus = 'PENDING' | 'REVIEW' | 'VERIFIED' | 'APPROVED' | 'REJECTED';

export interface Address {
  id: string;
  userId: string;
  label?: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  product?: Product;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  total: number;
  shippingCost: number;
  addressId: string;
  stripeSessionId?: string;
  stripePaymentId?: string;
  paidAt?: string;
  createdAt: string;
  items: OrderItem[];
  address: Address;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
