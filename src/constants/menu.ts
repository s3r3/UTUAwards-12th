/**
 * Navigation menu constants for Metuah Hub
 */

export interface MenuItem {
  id: string
  label: string
  labelEn: string
  href: string
  description?: string
  descriptionEn?: string
  /** Sub-menu items */
  children?: MenuItem[]
  /** Show badge */
  badge?: string
  /** Icon name (lucide-react) */
  icon?: string
  /** Only visible when authenticated */
  authRequired?: boolean
  /** Only visible for admin */
  adminOnly?: boolean
  /** Open in new tab */
  external?: boolean
}

// ─── Main Navigation ─────────────────────────────────────────────────────────

export const MAIN_MENU: MenuItem[] = [
  {
    id: 'home',
    label: 'Beranda',
    labelEn: 'Home',
    href: '/',
    icon: 'Home',
  },
  {
    id: 'products',
    label: 'Produk',
    labelEn: 'Products',
    href: '/products',
    description: 'Jelajahi produk agro-maritim unggulan Aceh',
    descriptionEn: 'Explore Acehnese premium agro-maritime products',
    icon: 'Package',
    children: [
      {
        id: 'products-coffee',
        label: 'Kopi Gayo',
        labelEn: 'Gayo Coffee',
        href: '/products?category=COFFEE',
        description: 'Arabika & Robusta premium dataran tinggi Gayo',
        descriptionEn: 'Premium Arabica & Robusta from Gayo Highlands',
        icon: 'Coffee',
      },
      {
        id: 'products-patchouli',
        label: 'Nilam',
        labelEn: 'Patchouli',
        href: '/products?category=PATCHOULI',
        description: 'Minyak nilam ekspor kualitas terbaik',
        descriptionEn: 'Top-grade export patchouli oil',
        icon: 'Leaf',
      },
      {
        id: 'products-seafood',
        label: 'Seafood',
        labelEn: 'Seafood',
        href: '/products?category=SEAFOOD',
        description: 'Hasil tangkap laut Aceh yang segar',
        descriptionEn: 'Fresh catch from Acehnese waters',
        icon: 'Fish',
      },
      {
        id: 'products-spices',
        label: 'Rempah',
        labelEn: 'Spices',
        href: '/products?category=SPICES',
        description: 'Rempah-rempah autentik Nusantara',
        descriptionEn: 'Authentic Nusantara spices',
        icon: 'Spice',
      },
      {
        id: 'products-processed',
        label: 'Produk Olahan',
        labelEn: 'Processed Products',
        href: '/products?category=PROCESSED',
        description: 'UMKM produk olahan siap ekspor',
        descriptionEn: 'SME export-ready processed goods',
        icon: 'Factory',
      },
    ],
  },
  {
    id: 'mentoring',
    label: 'Mentoring',
    labelEn: 'Mentoring',
    href: '/mentoring',
    description: 'Program pendampingan sertifikasi & ekspor',
    descriptionEn: 'Certification & export mentoring programs',
    icon: 'GraduationCap',
    children: [
      {
        id: 'mentoring-halal',
        label: 'Sertifikasi Halal',
        labelEn: 'Halal Certification',
        href: '/mentoring?type=HALAL_CERTIFICATION',
        icon: 'BadgeCheck',
      },
      {
        id: 'mentoring-haccp',
        label: 'HACCP',
        labelEn: 'HACCP',
        href: '/mentoring?type=HACCP',
        icon: 'ShieldCheck',
      },
      {
        id: 'mentoring-packaging',
        label: 'Kemasan Ekspor',
        labelEn: 'Export Packaging',
        href: '/mentoring?type=EXPORT_PACKAGING',
        icon: 'Box',
      },
      {
        id: 'mentoring-supply',
        label: 'Rantai Pasok',
        labelEn: 'Supply Chain',
        href: '/mentoring?type=SUPPLY_CHAIN_TRAINING',
        icon: 'Link',
      },
    ],
  },
  {
    id: 'partners',
    label: 'Mitra',
    labelEn: 'Partners',
    href: '/partners',
    description: 'Jaringan mitra internasional kami',
    descriptionEn: 'Our international partner network',
    icon: 'Globe',
  },
  {
    id: 'business',
    label: 'Bisnis',
    labelEn: 'Business',
    href: '/business',
    description: 'Model bisnis & peluang investasi',
    descriptionEn: 'Business model & investment opportunities',
    icon: 'TrendingUp',
  },
  {
    id: 'team',
    label: 'Tim',
    labelEn: 'Team',
    href: '/team',
    description: 'Kenali tim di balik Metuah Hub',
    descriptionEn: 'Meet the team behind Metuah Hub',
    icon: 'Users',
  },
  {
    id: 'about',
    label: 'Tentang',
    labelEn: 'About',
    href: '/about',
    description: 'Visi misi dan perjalanan kami',
    descriptionEn: 'Our vision, mission, and journey',
    icon: 'Info',
  },
  {
    id: 'contact',
    label: 'Kontak',
    labelEn: 'Contact',
    href: '/contact',
    icon: 'Mail',
  },
]

// ─── Auth Menu ───────────────────────────────────────────────────────────────

export const AUTH_MENU: MenuItem[] = [
  {
    id: 'login',
    label: 'Masuk',
    labelEn: 'Sign In',
    href: '/login',
    icon: 'LogIn',
  },
  {
    id: 'register',
    label: 'Daftar',
    labelEn: 'Register',
    href: '/register',
    icon: 'UserPlus',
  },
]

// ─── Dashboard Menu ──────────────────────────────────────────────────────────

export const DASHBOARD_MENU: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    labelEn: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard',
    authRequired: true,
  },
  {
    id: 'my-products',
    label: 'Produk Saya',
    labelEn: 'My Products',
    href: '/dashboard/products',
    icon: 'Package',
    authRequired: true,
  },
  {
    id: 'my-mentoring',
    label: 'Program Mentoring',
    labelEn: 'Mentoring Programs',
    href: '/dashboard/mentoring',
    icon: 'GraduationCap',
    authRequired: true,
  },
  {
    id: 'profile',
    label: 'Profil',
    labelEn: 'Profile',
    href: '/dashboard/profile',
    icon: 'User',
    authRequired: true,
  },
]

// ─── Admin Menu ──────────────────────────────────────────────────────────────

export const ADMIN_MENU: MenuItem[] = [
  {
    id: 'admin',
    label: 'Admin Panel',
    labelEn: 'Admin Panel',
    href: '/admin',
    icon: 'Shield',
    adminOnly: true,
  },
  {
    id: 'admin-products',
    label: 'Kelola Produk',
    labelEn: 'Manage Products',
    href: '/admin/products',
    icon: 'Package',
    adminOnly: true,
  },
  {
    id: 'admin-users',
    label: 'Kelola Pengguna',
    labelEn: 'Manage Users',
    href: '/admin/users',
    icon: 'Users',
    adminOnly: true,
  },
  {
    id: 'admin-partners',
    label: 'Kelola Mitra',
    labelEn: 'Manage Partners',
    href: '/admin/partners',
    icon: 'Globe',
    adminOnly: true,
  },
]

// ─── Footer Menu ─────────────────────────────────────────────────────────────

export const FOOTER_MENU = {
  platform: {
    title: 'Platform',
    titleEn: 'Platform',
    items: MAIN_MENU.slice(0, 5),
  },
  resources: {
    title: 'Sumber Daya',
    titleEn: 'Resources',
    items: [
      { id: 'docs', label: 'Dokumentasi', labelEn: 'Documentation', href: '/docs', icon: 'FileText' },
      { id: 'blog', label: 'Blog', labelEn: 'Blog', href: '/blog', icon: 'Rss' },
      { id: 'faq', label: 'FAQ', labelEn: 'FAQ', href: '/faq', icon: 'HelpCircle' },
    ] as MenuItem[],
  },
  company: {
    title: 'Perusahaan',
    titleEn: 'Company',
    items: [
      { id: 'about-footer', label: 'Tentang Kami', labelEn: 'About Us', href: '/about', icon: 'Info' },
      { id: 'team-footer', label: 'Tim', labelEn: 'Team', href: '/team', icon: 'Users' },
      { id: 'contact-footer', label: 'Kontak', labelEn: 'Contact', href: '/contact', icon: 'Mail' },
    ] as MenuItem[],
  },
}
