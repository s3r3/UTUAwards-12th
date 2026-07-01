/**
 * Product catalogue constants for Metuah Hub
 * Covers Aceh agro-maritime commodities
 */

import type { ProductCategory, ProductStatus } from '@/types'

// ─── Category Definitions ────────────────────────────────────────────────────

export interface CategoryMeta {
  value: ProductCategory
  label: string
  labelEn: string
  emoji: string
  color: string
  bgColor: string
  description: string
  descriptionEn: string
  icon: string
}

export const PRODUCT_CATEGORIES: CategoryMeta[] = [
  {
    value: 'COFFEE',
    label: 'Kopi Gayo',
    labelEn: 'Gayo Coffee',
    emoji: '☕',
    color: '#92400e',
    bgColor: '#fef3c7',
    description: 'Kopi Arabika & Robusta premium dari dataran tinggi Gayo, Aceh Tengah',
    descriptionEn: 'Premium Arabica & Robusta coffee from the Gayo Highlands, Central Aceh',
    icon: 'Coffee',
  },
  {
    value: 'PATCHOULI',
    label: 'Nilam',
    labelEn: 'Patchouli',
    emoji: '🌿',
    color: '#166534',
    bgColor: '#f0fdf4',
    description: 'Minyak atsiri nilam kualitas ekspor — komponen utama parfum dunia',
    descriptionEn: 'Export-grade patchouli essential oil — a key ingredient in world-class perfumes',
    icon: 'Leaf',
  },
  {
    value: 'SEAFOOD',
    label: 'Seafood',
    labelEn: 'Seafood',
    emoji: '🦐',
    color: '#075985',
    bgColor: '#f0f9ff',
    description: 'Udang, ikan, cumi & kepiting segar dari perairan Selat Malaka dan Samudera Hindia',
    descriptionEn: 'Fresh shrimp, fish, squid & crab from the Malacca Strait and Indian Ocean',
    icon: 'Fish',
  },
  {
    value: 'SPICES',
    label: 'Rempah',
    labelEn: 'Spices',
    emoji: '🌶️',
    color: '#9f1239',
    bgColor: '#fff1f2',
    description: 'Lada, cengkeh, kayu manis & kunyit asli Aceh dengan aroma khas',
    descriptionEn: 'Acehnese pepper, cloves, cinnamon & turmeric with distinctive aroma',
    icon: 'Flame',
  },
  {
    value: 'PROCESSED',
    label: 'Produk Olahan',
    labelEn: 'Processed Products',
    emoji: '🏭',
    color: '#6d28d9',
    bgColor: '#f5f3ff',
    description: 'Produk olahan UMKM Aceh siap ekspor: kopi kemasan, kerupuk, dodol, dan lainnya',
    descriptionEn: 'Acehnese SME export-ready processed goods: packaged coffee, crackers, dodol, etc.',
    icon: 'Package',
  },
]

// ─── Status Definitions ──────────────────────────────────────────────────────

export interface StatusMeta {
  value: ProductStatus
  label: string
  labelEn: string
  color: string
  bgColor: string
  borderColor: string
  description: string
}

export const PRODUCT_STATUSES: StatusMeta[] = [
  {
    value: 'PENDING',
    label: 'Menunggu',
    labelEn: 'Pending',
    color: '#92400e',
    bgColor: '#fef3c7',
    borderColor: '#fbbf24',
    description: 'Produk menunggu proses review awal',
  },
  {
    value: 'REVIEW',
    label: 'Ditinjau',
    labelEn: 'Under Review',
    color: '#1d4ed8',
    bgColor: '#eff6ff',
    borderColor: '#60a5fa',
    description: 'Produk sedang dalam proses review oleh tim',
  },
  {
    value: 'VERIFIED',
    label: 'Terverifikasi',
    labelEn: 'Verified',
    color: '#0369a1',
    bgColor: '#f0f9ff',
    borderColor: '#0ea5e9',
    description: 'Produk telah diverifikasi keaslian & kualitasnya',
  },
  {
    value: 'APPROVED',
    label: 'Disetujui',
    labelEn: 'Approved',
    color: '#15803d',
    bgColor: '#f0fdf4',
    borderColor: '#22c55e',
    description: 'Produk disetujui dan siap tayang di platform',
  },
  {
    value: 'REJECTED',
    label: 'Ditolak',
    labelEn: 'Rejected',
    color: '#be123c',
    bgColor: '#fff1f2',
    borderColor: '#fb7185',
    description: 'Produk ditolak — silakan tinjau catatan reviewer',
  },
]

// ─── Sample / Seed Products ──────────────────────────────────────────────────

export interface SampleProduct {
  id: string
  name: string
  nameEn: string
  category: ProductCategory
  description: string
  descriptionEn: string
  origin: string
  originEn: string
  status: ProductStatus
  tags: string[]
  certifications: string[]
  exportDestinations: string[]
  priceRangeUSD?: string
  annualProductionTon?: number
  image?: string
}

export const SAMPLE_PRODUCTS: SampleProduct[] = [
  {
    id: 'prod-001',
    name: 'Kopi Arabika Gayo Specialty',
    nameEn: 'Gayo Specialty Arabica Coffee',
    category: 'COFFEE',
    description:
      'Kopi Arabika single-origin dari ketinggian 1.200–1.600 mdpl di Gayo, Aceh Tengah. Proses natural & washed dengan profil rasa: cokelat, karamel, floral, dan fruity yang khas.',
    descriptionEn:
      'Single-origin Arabica coffee grown at 1,200–1,600 masl in Gayo, Central Aceh. Natural & washed process with a flavor profile of chocolate, caramel, floral, and fruity notes.',
    origin: 'Aceh Tengah, Aceh',
    originEn: 'Central Aceh, Aceh',
    status: 'APPROVED',
    tags: ['specialty', 'single-origin', 'arabika', 'organik'],
    certifications: ['Organic UTZ', 'Fair Trade', 'Rainforest Alliance'],
    exportDestinations: ['USA', 'Japan', 'Germany', 'South Korea', 'Australia'],
    priceRangeUSD: '$8–$15/kg (green bean)',
    annualProductionTon: 4500,
    image: '/images/products/kopi-gayo.jpg',
  },
  {
    id: 'prod-002',
    name: 'Minyak Nilam Aceh Grade A',
    nameEn: 'Aceh Grade A Patchouli Oil',
    category: 'PATCHOULI',
    description:
      'Minyak nilam murni (Pogostemon cablin) distilasi uap dari Aceh Selatan & Aceh Barat Daya. Kadar PA (Patchouli Alcohol) ≥ 32%, berwarna kuning jernih dengan aroma earthy-woody yang khas.',
    descriptionEn:
      'Pure patchouli oil (Pogostemon cablin) steam-distilled from South Aceh & Southwest Aceh. PA (Patchouli Alcohol) ≥ 32%, clear yellow color with a characteristic earthy-woody aroma.',
    origin: 'Aceh Selatan & Aceh Barat Daya, Aceh',
    originEn: 'South Aceh & Southwest Aceh, Aceh',
    status: 'APPROVED',
    tags: ['essential-oil', 'nilam', 'fragrance', 'organik'],
    certifications: ['ISO 4731', 'IFRA Compliant', 'Halal MUI'],
    exportDestinations: ['France', 'USA', 'India', 'UK', 'Netherlands'],
    priceRangeUSD: '$40–$55/kg',
    annualProductionTon: 1200,
    image: '/images/products/nilam.jpg',
  },
  {
    id: 'prod-003',
    name: 'Udang Vannamei Segar Aceh',
    nameEn: 'Fresh Aceh Vannamei Shrimp',
    category: 'SEAFOOD',
    description:
      'Udang Vannamei (Litopenaeus vannamei) segar dari tambak rakyat pesisir Aceh Timur. Dibesarkan tanpa antibiotik, panen harian, tersedia size 60/70–100/up dengan kemasan vacuum fresh.',
    descriptionEn:
      'Fresh Vannamei shrimp (Litopenaeus vannamei) from community ponds along the East Aceh coast. Antibiotic-free, daily harvest, available in sizes 60/70–100/up with fresh vacuum packaging.',
    origin: 'Aceh Timur, Aceh',
    originEn: 'East Aceh, Aceh',
    status: 'VERIFIED',
    tags: ['seafood', 'udang', 'vannamei', 'segar', 'antibiotik-free'],
    certifications: ['HACCP', 'BPOM', 'Halal MUI'],
    exportDestinations: ['Japan', 'China', 'USA', 'UAE', 'Saudi Arabia'],
    priceRangeUSD: '$5–$12/kg',
    annualProductionTon: 800,
    image: '/images/products/udang.jpg',
  },
  {
    id: 'prod-004',
    name: 'Lada Hitam Aceh',
    nameEn: 'Aceh Black Pepper',
    category: 'SPICES',
    description:
      'Lada hitam (Piper nigrum) premium dari Aceh Jaya dengan aroma tajam dan tingkat kepedasan tinggi. Kadar oleoresin superior — khas untuk bumbu masakan dan farmasi.',
    descriptionEn:
      'Premium black pepper (Piper nigrum) from Aceh Jaya with sharp aroma and high pungency. Superior oleoresin content — ideal for culinary and pharmaceutical use.',
    origin: 'Aceh Jaya, Aceh',
    originEn: 'Aceh Jaya, Aceh',
    status: 'APPROVED',
    tags: ['rempah', 'lada', 'spice', 'premium'],
    certifications: ['ISO 959', 'Halal MUI', 'BPOM'],
    exportDestinations: ['India', 'USA', 'Germany', 'Singapore', 'Netherlands'],
    priceRangeUSD: '$3–$6/kg',
    annualProductionTon: 320,
    image: '/images/products/lada.jpg',
  },
  {
    id: 'prod-005',
    name: 'Kopi Gayo Robusta Green Bean',
    nameEn: 'Gayo Robusta Green Bean Coffee',
    category: 'COFFEE',
    description:
      'Kopi Robusta biji hijau dari kawasan Gayo Lues dengan body penuh dan kadar kafein tinggi. Cocok untuk espresso blend dan pasar retail modern.',
    descriptionEn:
      'Full-body green Robusta beans from Gayo Lues region with high caffeine content. Perfect for espresso blends and modern retail markets.',
    origin: 'Gayo Lues, Aceh',
    originEn: 'Gayo Lues, Aceh',
    status: 'APPROVED',
    tags: ['robusta', 'green-bean', 'espresso', 'bulk'],
    certifications: ['SCAA Grade', 'Halal MUI'],
    exportDestinations: ['Vietnam', 'Germany', 'Italy', 'Malaysia'],
    priceRangeUSD: '$2–$4/kg',
    annualProductionTon: 2800,
    image: '/images/products/robusta.jpg',
  },
  {
    id: 'prod-006',
    name: 'Dodol Aceh Premium',
    nameEn: 'Premium Acehnese Dodol',
    category: 'PROCESSED',
    description:
      'Dodol tradisional Aceh dengan bahan baku gula aren, santan kelapa, dan ketan Aceh. Tersedia dalam varian original, pandan, dan kopi Gayo. Kemasan premium siap ekspor.',
    descriptionEn:
      'Traditional Acehnese dodol made with palm sugar, coconut milk, and Acehnese sticky rice. Available in original, pandan, and Gayo coffee variants. Premium export-ready packaging.',
    origin: 'Banda Aceh & Pidie, Aceh',
    originEn: 'Banda Aceh & Pidie, Aceh',
    status: 'REVIEW',
    tags: ['olahan', 'dodol', 'traditional', 'gift'],
    certifications: ['BPOM MD', 'Halal MUI', 'IRT'],
    exportDestinations: ['Malaysia', 'Singapore', 'Saudi Arabia', 'Netherlands (diaspora)'],
    priceRangeUSD: '$8–$20/box',
    image: '/images/products/dodol.jpg',
  },
]

// ─── Filter Options ──────────────────────────────────────────────────────────

export const CATEGORY_FILTER_OPTIONS = [
  { value: 'all', label: 'Semua Kategori', labelEn: 'All Categories' },
  ...PRODUCT_CATEGORIES.map((c) => ({
    value: c.value,
    label: c.label,
    labelEn: c.labelEn,
  })),
]

export const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'Semua Status', labelEn: 'All Statuses' },
  ...PRODUCT_STATUSES.map((s) => ({
    value: s.value,
    label: s.label,
    labelEn: s.labelEn,
  })),
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getCategoryMeta(category: ProductCategory): CategoryMeta | undefined {
  return PRODUCT_CATEGORIES.find((c) => c.value === category)
}

export function getStatusMeta(status: ProductStatus): StatusMeta | undefined {
  return PRODUCT_STATUSES.find((s) => s.value === status)
}
