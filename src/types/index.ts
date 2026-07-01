// Type definitions for Metuah Hub

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
  origin: string;
  status: ProductStatus;
  legality?: string;
  ownerId: string;
  createdAt: Date;
}

export type ProductCategory = 'COFFEE' | 'PATCHOULI' | 'SEAFOOD' | 'SPICES' | 'PROCESSED';

export type ProductStatus = 'PENDING' | 'REVIEW' | 'VERIFIED' | 'APPROVED' | 'REJECTED';

export interface Mentoring {
  id: string;
  type: MentoringType;
  status: MentoringStatus;
  productId: string;
  createdAt: Date;
}

export type MentoringType = 'HALAL_CERTIFICATION' | 'HACCP' | 'EXPORT_PACKAGING' | 'SUPPLY_CHAIN_TRAINING';

export type MentoringStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface Partner {
  id: string;
  company: string;
  country: string;
  location: string;
  category: PartnerCategory;
  createdAt: Date;
}

export type PartnerCategory = 'ASIA' | 'EUROPE' | 'MIDDLE_EAST' | 'AMERICA' | 'AFRICA';

export interface DashboardStats {
  totalProducts: number;
  reviewProducts: number;
  activePrograms: number;
  partnerCountries: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
