export const publicRoutes = {
  home: '/',
  about: '/about',
  products: '/products',
  mentoring: '/mentoring',
  partners: '/partners',
  business: '/business',
  team: '/team',
  contact: '/contact',
} as const

export const authRoutes = {
  login: '/login',
  register: '/register',
} as const

export const dashboardRoutes = {
  index: '/dashboard',
  products: '/dashboard/products',
  mentoring: '/dashboard/mentoring',
  partners: '/dashboard/partners',
  settings: '/dashboard/settings',
} as const

export const adminRoutes = {
  index: '/dashboard/admin',
  products: '/dashboard/admin/products',
  users: '/dashboard/admin/users',
  partners: '/dashboard/admin/partners',
} as const

export type PublicRoute = keyof typeof publicRoutes
export type AuthRoute = keyof typeof authRoutes
export type DashboardRoute = keyof typeof dashboardRoutes
