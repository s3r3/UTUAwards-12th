export const APP_NAME = 'Metuah Hub'
export const APP_TAGLINE = 'Mentransformasi Komoditas Agro-Maritim Aceh Menjadi Pemain Utama Rantai Pasok Global'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
export const APP_DESCRIPTION = 'Platform digital ekosistem agro-maritim Aceh yang menghubungkan UMKM, petani, nelayan, eksportir, dan mitra internasional dalam satu ekosistem terintegrasi.'

export const COMPANY = {
  name: 'Metuah Hub',
  email: 'info@metuahhub.id',
  phone: '+62 651 123456',
  address: 'Jl. T. Nyak Arief No. 1, Banda Aceh, Aceh 23111, Indonesia',
  competition: 'The 12th UTU Awards 2026',
}

export const NAV_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Products', href: '/products' },
  { name: 'Mentoring', href: '/mentoring' },
  { name: 'Partners', href: '/partners' },
  { name: 'Business', href: '/business' },
  { name: 'Team', href: '/team' },
  { name: 'Contact', href: '/contact' },
]

export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  PARTNER: 'PARTNER',
} as const
