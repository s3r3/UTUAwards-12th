import type { ProductCategory } from '@/types'

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
}

export function truncate(text: string, length: number): string {
  return text.length > length ? text.slice(0, length) + '...' : text
}

export function getCategoryEmoji(category: ProductCategory): string {
  const map: Record<ProductCategory, string> = {
    COFFEE: '☕',
    PATCHOULI: '🌿',
    SEAFOOD: '🦐',
    SPICES: '🌶️',
    PROCESSED: '🏭',
  }
  return map[category] || '📦'
}

export function getCategoryLabel(category: ProductCategory): string {
  const map: Record<ProductCategory, string> = {
    COFFEE: 'Kopi Gayo',
    PATCHOULI: 'Nilam Aceh',
    SEAFOOD: 'Seafood',
    SPICES: 'Rempah',
    PROCESSED: 'Produk Olahan',
  }
  return map[category] || category
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    PENDING: 'Menunggu',
    REVIEW: 'Ditinjau',
    VERIFIED: 'Terverifikasi',
    APPROVED: 'Disetujui',
    REJECTED: 'Ditolak',
    ACTIVE: 'Aktif',
    COMPLETED: 'Selesai',
    CANCELLED: 'Dibatalkan',
  }
  return map[status] || status
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    REVIEW: 'bg-blue-100 text-blue-700',
    VERIFIED: 'bg-cyan-100 text-cyan-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    ACTIVE: 'bg-green-100 text-green-700',
    COMPLETED: 'bg-gray-100 text-gray-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}
