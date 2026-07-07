# Acelora E-Commerce Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Acelora startup landing page into full e-commerce with Stripe payment

**Architecture:** Products stay in PostgreSQL. Cart in Zustand (client). Orders created server-side on checkout. Stripe Checkout Sessions for PCI-compliant payments. Webhook updates order status async.

**Tech Stack:** Next.js 16 App Router, Prisma 7 + PostgreSQL, Stripe Checkout Sessions, Zustand, next-auth v5

## Global Constraints
- Products stored in DB only (no Stripe catalog sync)
- Prices in IDR cents (Int)
- All payment via Stripe Checkout Sessions (redirect)
- Cart MUST persist in Zustand (no server cart)
- "use client" only where interactivity needed
- Must delete all startup Mentoring/Partner references
- Stripe webhook secret required for production

---

### Task 1: Schema + Dependencies + Seed

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `prisma/seed.ts`
- Modify: `package.json`
- Modify: `.env`
- Modify: `src/types/index.ts`

- [ ] **Step 1: Add `stripe` dependency**

```bash
npm install stripe
```

- [ ] **Step 2: Update .env with Stripe keys**

Append to `.env`:
```
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXXXXX
```

- [ ] **Step 3: Rewrite prisma/schema.prisma**

Remove Mentoring, Partner models. Add Order, OrderItem, Address, OrderStatus. Add price/stock/weight/images to Product.

```prisma
// Prisma Schema for Acelora — E-Commerce
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String?
  image     String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  products  Product[]
  orders    Order[]
  addresses Address[]
  accounts  Account[]
  sessions  Session[]

  @@map("users")
}

enum Role {
  USER
  ADMIN
  PARTNER
}

model Product {
  id          String          @id @default(cuid())
  name        String
  category    ProductCategory
  description String
  image       String?
  images      String[]
  origin      String
  price       Int             @default(0)
  compareAt   Int?
  stock       Int             @default(0)
  weight      Float?
  status      ProductStatus   @default(PENDING)
  legality    String?
  ownerId     String
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  owner      User        @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  orderItems OrderItem[]

  @@map("products")
}

enum ProductCategory {
  COFFEE
  PATCHOULI
  SEAFOOD
  SPICES
  PROCESSED
}

enum ProductStatus {
  PENDING
  REVIEW
  VERIFIED
  APPROVED
  REJECTED
}

model Order {
  id              String      @id @default(cuid())
  userId          String
  status          OrderStatus @default(PENDING)
  total           Int
  shippingCost    Int         @default(0)
  addressId       String
  stripeSessionId String?     @unique
  stripePaymentId String?
  paidAt          DateTime?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  user    User       @relation(fields: [userId], references: [id])
  items   OrderItem[]
  address Address    @relation(fields: [addressId], references: [id])

  @@map("orders")
}

enum OrderStatus {
  PENDING
  PAID
  PROCESSING
  SHIPPING
  DELIVERED
  CANCELLED
}

model OrderItem {
  id        String @id @default(cuid())
  orderId   String
  productId String
  quantity  Int
  price     Int

  order   Order   @relation(fields: [orderId], references: [id])
  product Product @relation(fields: [productId], references: [id])

  @@map("order_items")
}

model Address {
  id         String  @id @default(cuid())
  userId     String
  label      String?
  name       String
  phone      String
  street     String
  city       String
  province   String
  postalCode String
  isDefault  Boolean @default(false)

  user   User    @relation(fields: [userId], references: [id])
  orders Order[]

  @@map("addresses")
}

// NextAuth Models
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}
```

```
- [ ] **Step 4: Replace types/index.ts**

```typescript
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
  ownerId: string;
  createdAt: Date;
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

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
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
```

- [ ] **Step 5: Replace prisma/seed.ts**

Remove Mentoring/Partner seeds. Add prices, stock, weight to products. Add sample addresses.

```typescript
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter })

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 12)
  const userPassword = await bcrypt.hash("user123", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@acelora.id" },
    update: {},
    create: { name: "Admin Acelora", email: "admin@acelora.id", password: adminPassword, role: "ADMIN" },
  })

  const user = await prisma.user.upsert({
    where: { email: "user@acelora.id" },
    update: {},
    create: { name: "User Acelora", email: "user@acelora.id", password: userPassword, role: "USER" },
  })

  const products = [
    { name: "Kopi Arabika Gayo Specialty", category: "COFFEE" as const, description: "Kopi Arabika single-origin dari ketinggian 1.200–1.600 mdpl di Gayo, Aceh Tengah. Proses natural & washed dengan profil rasa cokelat, karamel, floral.", origin: "Aceh Tengah", price: 85000, stock: 50, weight: 250, image: "/images/kopi_arabica.png" },
    { name: "Minyak Nilam Aceh Grade A", category: "PATCHOULI" as const, description: "Minyak nilam murni distilasi uap dari Aceh Selatan. Kadar PA ≥ 32%.", origin: "Aceh Selatan", price: 250000, stock: 20, weight: 100, image: "/images/PatchouliOil.png" },
    { name: "Udang Vannamei Segar Aceh", category: "SEAFOOD" as const, description: "Udang Vannamei segar dari tambak pesisir Aceh Timur. Tanpa antibiotik, size 80/100.", origin: "Aceh Timur", price: 45000, stock: 100, weight: 500, image: "/images/VannameiShrimp.png" },
    { name: "Lada Hitam Aceh Premium", category: "SPICES" as const, description: "Lada hitam premium dari Aceh Jaya dengan aroma tajam dan kadar oleoresin tinggi.", origin: "Aceh Jaya", price: 35000, stock: 75, weight: 200, image: "/images/ladahitamAceh.png" },
    { name: "Kopi Gayo Robusta Green Bean", category: "COFFEE" as const, description: "Kopi Robusta full-body dari Gayo Lues. Cocok untuk espresso blend.", origin: "Gayo Lues", price: 55000, stock: 60, weight: 500, image: "/images/cofferobusta.png" },
    { name: "Dodol Aceh Premium", category: "PROCESSED" as const, description: "Dodol tradisional Aceh dari gula aren, santan dan ketan. Varian original.", origin: "Banda Aceh", price: 25000, stock: 40, weight: 350, image: "/images/ikantongkolasap.png" },
    { name: "Kayu Manis Aceh", category: "SPICES" as const, description: "Kayu manis asli Aceh dengan aroma manis khas. Grade ekspor.", origin: "Aceh Barat", price: 28000, stock: 80, weight: 200, image: "/images/Cinnamon.png" },
    { name: "Kepiting Ranjungan Segar", category: "SEAFOOD" as const, description: "Kepiting ranjungan segar dari perairan Aceh. Ukuran jumbo.", origin: "Aceh Barat Daya", price: 65000, stock: 30, weight: 1000, image: "/images/kepitingranjungan.png" },
  ]

  for (const p of products) {
    const id = `seed-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}`
    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      await prisma.product.create({
        data: { id, ...p, images: [p.image], ownerId: user.id, status: "APPROVED" },
      })
    }
  }

  // Sample addresses
  const addresses = [
    { userId: user.id, label: "Rumah", name: "User Acelora", phone: "081234567890", street: "Jl. Teuku Nyak Arief No. 1", city: "Banda Aceh", province: "Aceh", postalCode: "23111", isDefault: true },
    { userId: admin.id, label: "Kantor", name: "Admin Acelora", phone: "081234567891", street: "Jl. Sultan Iskandar Muda No. 45", city: "Banda Aceh", province: "Aceh", postalCode: "23241", isDefault: true },
  ]

  for (const a of addresses) {
    await prisma.address.create({ data: a })
  }

  console.log("Seed completed")
  console.log("Admin: admin@acelora.id / admin123")
  console.log("User: user@acelora.id / user123")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
```

- [ ] **Step 6: Generate Prisma client + migrate**

```bash
npx prisma generate
npx prisma db push
```

---

### Task 2: Strip All Startup Content

**Files:**
- Delete: `src/app/mentoring/page.tsx`
- Delete: `src/app/partners/page.tsx`
- Delete: `src/app/business/page.tsx`
- Delete: `src/app/team/page.tsx`
- Delete: `src/app/about/page.tsx`
- Delete: `src/app/contact/page.tsx`
- Delete: `src/app/(dashboard)/dashboard/mentoring/page.tsx`
- Delete: `src/app/(dashboard)/dashboard/partners/page.tsx`
- Delete: `src/app/(dashboard)/admin/page.tsx`
- Delete: `src/components/sections/DashboardPreview.tsx`
- Delete: `src/components/sections/Financial.tsx`
- Delete: `src/components/sections/InternationalPartner.tsx`
- Delete: `src/components/sections/MarketPrices.tsx`
- Delete: `src/components/sections/Mentoring.tsx`
- Delete: `src/components/sections/Team.tsx`
- Delete: `src/components/sections/Workflow.tsx`
- Delete: `src/components/sections/WorldGlobe.tsx`
- Delete: `src/components/dashboard/MarketWidget.tsx`
- Delete: `src/components/ChatBot.tsx`
- Delete: `src/components/ChatBotWrapper.tsx`
- Delete: `src/components/DashboardChatBot.tsx`
- Delete: `src/app/api/mentoring/route.ts`
- Delete: `src/app/api/partners/route.ts`
- Delete: `src/app/api/market-prices/route.ts`
- Delete dir: `src/app/api/chat/`

- [ ] **Step 1: Remove all startup pages**

```bash
# Public startup pages
rm -rf src/app/mentoring
rm -rf src/app/partners
rm -rf src/app/business
rm -rf src/app/team
rm -rf src/app/about
rm -rf src/app/contact

# Dashboard startup pages
rm -rf 'src/app/(dashboard)/dashboard/mentoring'
rm -rf 'src/app/(dashboard)/dashboard/partners'
rm -rf 'src/app/(dashboard)/admin'

# API routes
rm -rf src/app/api/mentoring
rm -rf src/app/api/partners
rm -rf src/app/api/market-prices
rm -rf src/app/api/

# Components
rm -f src/components/sections/DashboardPreview.tsx
rm -f src/components/sections/Financial.tsx
rm -f src/components/sections/InternationalPartner.tsx
rm -f src/components/sections/MarketPrices.tsx
rm -f src/components/sections/Mentoring.tsx
rm -f src/components/sections/Team.tsx
rm -f src/components/sections/Workflow.tsx
rm -f src/components/sections/WorldGlobe.tsx
rm -f src/components/dashboard/MarketWidget.tsx
rm -f src/components/ChatBot.tsx
rm -f src/components/ChatBotWrapper.tsx
rm -f src/components/DashboardChatBot.tsx

# Services
rm -f src/services/partner.service.ts
```

- [ ] **Step 2: Verify deletions**

```bash
ls src/app/ | sort
ls src/components/sections/
```

---

### Task 3: Config + i18n + Constants + Routes

**Files:**
- Modify: `src/constants/config.ts`
- Modify: `src/constants/menu.ts`
- Modify: `src/constants/products.ts`
- Modify: `src/navigation/routes.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/lib/i18n/en.ts`
- Modify: `src/lib/i18n/id.ts`

- [ ] **Step 1: Update config.ts**

```typescript
export const APP_NAME = 'Acelora'
export const APP_TAGLINE = 'Belanja Produk Agro-Maritim Aceh — Langsung dari UMKM ke Anda'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
export const APP_DESCRIPTION = 'Toko online produk agro-maritim Aceh: kopi Gayo, rempah, seafood, minyak nilam, dan olahan UMKM. Belanja aman dengan pembayaran Stripe.'

export const COMPANY = {
  name: 'Acelora',
  email: 'info@acelora.id',
  phone: '+62 651 123456',
  address: 'Jl. T. Nyak Arief No. 1, Banda Aceh, Aceh 23111, Indonesia',
  competition: 'The 12th UTU Awards 2026',
}

export const NAV_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
]
```

- [ ] **Step 2: Update menu.ts**

Replace entire file:
```typescript
export interface MenuItem {
  id: string
  label: string
  labelEn: string
  href: string
  icon?: string
  badge?: string
  authRequired?: boolean
  adminOnly?: boolean
}

export const MAIN_MENU: MenuItem[] = [
  { id: 'home', label: 'Beranda', labelEn: 'Home', href: '/', icon: 'Home' },
  { id: 'products', label: 'Produk', labelEn: 'Products', href: '/products', icon: 'Package' },
]

export const AUTH_MENU: MenuItem[] = [
  { id: 'login', label: 'Masuk', labelEn: 'Sign In', href: '/login', icon: 'LogIn' },
  { id: 'register', label: 'Daftar', labelEn: 'Register', href: '/register', icon: 'UserPlus' },
]

export const DASHBOARD_MENU: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', labelEn: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard', authRequired: true },
  { id: 'my-orders', label: 'Pesanan Saya', labelEn: 'My Orders', href: '/dashboard/orders', icon: 'ShoppingBag', authRequired: true },
  { id: 'profile', label: 'Profil', labelEn: 'Profile', href: '/dashboard/profile', icon: 'User', authRequired: true },
]

export const ADMIN_MENU: MenuItem[] = [
  { id: 'admin', label: 'Admin Panel', labelEn: 'Admin Panel', href: '/dashboard/admin', icon: 'Shield', adminOnly: true },
  { id: 'admin-products', label: 'Kelola Produk', labelEn: 'Manage Products', href: '/dashboard/admin/products', icon: 'Package', adminOnly: true },
  { id: 'admin-orders', label: 'Kelola Pesanan', labelEn: 'Manage Orders', href: '/dashboard/admin/orders', icon: 'ShoppingBag', adminOnly: true },
  { id: 'admin-users', label: 'Kelola Pengguna', labelEn: 'Manage Users', href: '/dashboard/admin/users', icon: 'Users', adminOnly: true },
]
```

- [ ] **Step 3: Update constants/products.ts**

Replace `SampleProduct` to include `price`, `stock`, `weight`:

```typescript
export const SAMPLE_PRODUCTS: SampleProduct[] = [
  {
    id: 'prod-001',
    name: 'Kopi Arabika Gayo Specialty',
    nameEn: 'Gayo Specialty Arabica Coffee',
    category: 'COFFEE',
    description: 'Kopi Arabika single-origin dari ketinggian 1.200–1.600 mdpl...',
    descriptionEn: 'Single-origin Arabica coffee from 1,200–1,600 masl...',
    origin: 'Aceh Tengah, Aceh',
    originEn: 'Central Aceh, Aceh',
    status: 'APPROVED',
    price: 85000,
    stock: 50,
    weight: 250,
    image: '/images/kopi_arabica.png',
  },
  // ... same for all 6 with prices
]
```

Add to SampleProduct:
```typescript
  price: number
  stock: number
  weight?: number
```

- [ ] **Step 4: Update routes.ts**

```typescript
export const publicRoutes = {
  home: '/',
  products: '/products',
} as const

export const authRoutes = {
  login: '/login',
  register: '/register',
} as const

export const dashboardRoutes = {
  index: '/dashboard',
  orders: '/dashboard/orders',
  settings: '/dashboard/settings',
  profile: '/dashboard/profile',
} as const

export const adminRoutes = {
  index: '/dashboard/admin',
  products: '/dashboard/admin/products',
  orders: '/dashboard/admin/orders',
  users: '/dashboard/admin/users',
} as const
```

- [ ] **Step 5: Update sitemap.ts**

```typescript
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ]
}
```

- [ ] **Step 6: Update layout.tsx metadata**

Change description:
```typescript
title: {
  default: 'Acelora – Belanja Produk Agro-Maritim Aceh',
  template: '%s | Acelora',
},
description: 'Toko online produk agro-maritim Aceh. Kopi Gayo, rempah, seafood, dan olahan UMKM dengan pembayaran Stripe.',
keywords: ['Aceh', 'agro-maritim', 'kopi gayo', 'belanja online', 'e-commerce', 'UMKM Aceh', 'Acelora'],
openGraph: {
  title: 'Acelora – Belanja Produk Agro-Maritim Aceh',
  description: 'Toko online produk agro-maritim Aceh...',
}
```

- [ ] **Step 7: Update i18n en.ts**

Strip all startup keys (mentoring, partners, business, team, about, workflow, financial, worldGlobe, marketPrices, dashboardPreview, chatbot). Add e-commerce keys.

Replace the entire file. Key structure:
```typescript
const en = {
  nav: { home: 'Home', products: 'Products', login: 'Login', logout: 'Logout', dashboard: 'Dashboard' },
  hero: {
    title: 'Acelora',
    subtitle: 'Premium Agro-Maritime Products from Aceh',
    desc: 'Shop directly from Acehnese farmers, fishermen, and MSMEs. Authentic products with global quality.',
    cta: 'Shop Now',
  },
  products: {
    title: 'Our', titleHighlight: 'Products',
    addToCart: 'Add to Cart', outOfStock: 'Out of Stock', inStock: 'In Stock',
    searchPlaceholder: 'Search products...',
    categories: { all: 'All', coffee: 'Gayo Coffee', patchouli: 'Patchouli', seafood: 'Seafood', spices: 'Spices', processed: 'Processed' },
    notFound: 'Product not found', stock: 'Stock', origin: 'Origin', price: 'Price',
    weight: 'Weight', quantity: 'Quantity', gram: 'gram', kg: 'kg',
  },
  cart: {
    title: 'Shopping Cart', empty: 'Your cart is empty', emptyHint: 'Start shopping now',
    subtotal: 'Subtotal', total: 'Total', checkout: 'Checkout', continueShopping: 'Continue Shopping',
    remove: 'Remove', summary: 'Order Summary', item: 'item', items: 'items',
  },
  checkout: {
    title: 'Checkout', shippingAddress: 'Shipping Address', newAddress: 'New Address',
    pay: 'Pay with Stripe', processing: 'Processing...', orderSummary: 'Order Summary',
    name: 'Full Name', phone: 'Phone', street: 'Street Address', city: 'City',
    province: 'Province', postalCode: 'Postal Code', label: 'Label (optional)',
    labelPlaceholder: 'e.g. Home, Office', saveAddress: 'Save Address',
    payNow: 'Pay Now — Rp {amount}',
  },
  success: {
    title: 'Payment Successful', orderId: 'Order ID', email: 'Email',
    desc: 'Thank you for your purchase! We will process your order soon.',
    viewOrder: 'View Order', continueShopping: 'Continue Shopping',
  },
  orders: {
    title: 'My Orders', noOrders: 'No orders yet', noOrdersDesc: 'Start shopping',
    detail: 'Order Detail', status: 'Status', total: 'Total', date: 'Date',
    items: 'Items', address: 'Shipping Address', shippedTo: 'Shipped to',
    statuses: {
      PENDING: 'Pending Payment', PAID: 'Paid', PROCESSING: 'Processing',
      SHIPPING: 'In Transit', DELIVERED: 'Delivered', CANCELLED: 'Cancelled',
    },
  },
  footer: {
    tagline: 'Shop premium Acehnese agro-maritime products online.',
    products: 'Products', support: 'Links', rights: 'All rights reserved.',
    contact: 'Contact', address: 'Banda Aceh, Indonesia',
  },
  auth: {
    login: 'Login', register: 'Register', email: 'Email', password: 'Password', name: 'Name',
    loginDesc: 'Welcome back', registerDesc: 'Create account',
  },
  dashboard: {
    overviewTitle: 'Dashboard', overviewDesc: 'Manage your orders.',
    myOrders: 'My Orders', recentOrders: 'Recent Orders',
    adminOrders: 'Manage Orders', adminProducts: 'Manage Products',
    adminUsers: 'Manage Users', adminPanel: 'Admin Panel',
    totalOrders: 'Total Orders', pendingOrders: 'Pending', completedOrders: 'Completed',
    orderStatus: 'Status', orderTotal: 'Total', orderDate: 'Date', orderItems: 'Items',
    noOrders: 'No orders yet', noProducts: 'No Products',
    updateStatus: 'Update Status', save: 'Save',
    profile: 'Profile', settings: 'Settings',
  },
  common: {
    loading: 'Loading...', error: 'Something went wrong',
    save: 'Save', cancel: 'Cancel', delete: 'Delete', back: 'Back',
    currency: 'Rp', currencyFormat: 'IDR {amount}',
  },
}
export default en
export type Translations = typeof en
```

- [ ] **Step 8: Update i18n id.ts**

Same structure as en.ts but in Indonesian:
```typescript
const id = {
  nav: { home: 'Beranda', products: 'Produk', login: 'Masuk', logout: 'Keluar', dashboard: 'Dashboard' },
  hero: {
    title: 'Acelora',
    subtitle: 'Produk Agro-Maritim Premium dari Aceh',
    desc: 'Belanja langsung dari petani, nelayan, dan UMKM Aceh. Produk autentik dengan kualitas global.',
    cta: 'Belanja Sekarang',
  },
  products: {
    title: 'Produk', titleHighlight: 'Kami',
    addToCart: 'Tambah ke Keranjang', outOfStock: 'Stok Habis', inStock: 'Tersedia',
    searchPlaceholder: 'Cari produk...',
    categories: { all: 'Semua', coffee: 'Kopi Gayo', patchouli: 'Nilam', seafood: 'Seafood', spices: 'Rempah', processed: 'Olahan' },
    notFound: 'Produk tidak ditemukan', stock: 'Stok', origin: 'Asal', price: 'Harga',
    weight: 'Berat', quantity: 'Jumlah', gram: 'gram', kg: 'kg',
  },
  cart: {
    title: 'Keranjang Belanja', empty: 'Keranjang kosong', emptyHint: 'Mulai belanja sekarang',
    subtotal: 'Subtotal', total: 'Total', checkout: 'Checkout', continueShopping: 'Lanjut Belanja',
    remove: 'Hapus', summary: 'Ringkasan Pesanan', item: 'item', items: 'item',
  },
  checkout: {
    title: 'Checkout', shippingAddress: 'Alamat Pengiriman', newAddress: 'Alamat Baru',
    pay: 'Bayar dengan Stripe', processing: 'Memproses...', orderSummary: 'Ringkasan Pesanan',
    name: 'Nama Lengkap', phone: 'Telepon', street: 'Alamat Jalan', city: 'Kota',
    province: 'Provinsi', postalCode: 'Kode Pos', label: 'Label (opsional)',
    labelPlaceholder: 'Contoh: Rumah, Kantor', saveAddress: 'Simpan Alamat',
    payNow: 'Bayar Sekarang — Rp {amount}',
  },
  success: {
    title: 'Pembayaran Berhasil', orderId: 'ID Pesanan', email: 'Email',
    desc: 'Terima kasih! Pesanan Anda akan segera diproses.',
    viewOrder: 'Lihat Pesanan', continueShopping: 'Lanjut Belanja',
  },
  orders: {
    title: 'Pesanan Saya', noOrders: 'Belum ada pesanan', noOrdersDesc: 'Mulai belanja',
    detail: 'Detail Pesanan', status: 'Status', total: 'Total', date: 'Tanggal',
    items: 'Produk', address: 'Alamat Pengiriman', shippedTo: 'Dikirim ke',
    statuses: {
      PENDING: 'Menunggu Pembayaran', PAID: 'Dibayar', PROCESSING: 'Diproses',
      SHIPPING: 'Dikirim', DELIVERED: 'Selesai', CANCELLED: 'Dibatalkan',
    },
  },
  footer: {
    tagline: 'Belanja produk agro-maritim premium Aceh secara online.',
    products: 'Produk', support: 'Tautan', rights: 'Hak cipta dilindungi.',
    contact: 'Kontak', address: 'Banda Aceh, Indonesia',
  },
  auth: {
    login: 'Masuk', register: 'Daftar', email: 'Email', password: 'Kata Sandi', name: 'Nama',
    loginDesc: 'Selamat datang kembali', registerDesc: 'Buat akun baru',
  },
  dashboard: {
    overviewTitle: 'Dashboard', overviewDesc: 'Kelola pesanan Anda.',
    myOrders: 'Pesanan Saya', recentOrders: 'Pesanan Terbaru',
    adminOrders: 'Kelola Pesanan', adminProducts: 'Kelola Produk',
    adminUsers: 'Kelola Pengguna', adminPanel: 'Panel Admin',
    totalOrders: 'Total Pesanan', pendingOrders: 'Menunggu', completedOrders: 'Selesai',
    orderStatus: 'Status', orderTotal: 'Total', orderDate: 'Tanggal', orderItems: 'Item',
    noOrders: 'Belum ada pesanan', noProducts: 'Belum ada produk',
    updateStatus: 'Update Status', save: 'Simpan',
    profile: 'Profil', settings: 'Pengaturan',
  },
  common: {
    loading: 'Memuat...', error: 'Terjadi kesalahan',
    save: 'Simpan', cancel: 'Batal', delete: 'Hapus', back: 'Kembali',
    currency: 'Rp', currencyFormat: 'Rp {amount}',
  },
}
export default id
export type Translations = typeof id
```

---

### Task 4: Cart Store + Stripe Lib

**Files:**
- Create: `src/store/cart.store.ts`
- Create: `src/lib/stripe.ts`

- [ ] **Step 1: Create cart.store.ts**

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  stock: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  subtotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: Math.min(i.quantity + (item.quantity || 1), i.stock) }
                  : i
              ),
            }
          }
          return { items: [...state.items, { ...item, quantity: item.quantity || 1 }] }
        })
      },
      removeItem: (productId) => {
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) }))
      },
      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity: Math.min(quantity, i.stock) } : i
          ),
        }))
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: 'acelora-cart' }
  )
)
```

- [ ] **Step 2: Create lib/stripe.ts**

```typescript
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24-acacia',
  typescript: true,
})
```

---

### Task 5: API Routes — Address, Orders, Products Update, Stripe Webhook

**Files:**
- Create: `src/app/api/addresses/route.ts`
- Create: `src/app/api/addresses/[id]/route.ts`
- Create: `src/app/api/orders/route.ts`
- Create: `src/app/api/orders/[id]/route.ts`
- Create: `src/app/api/webhook/stripe/route.ts`
- Modify: `src/app/api/products/route.ts`
- Modify: `src/app/api/products/[id]/route.ts`
- Delete: `src/services/product.service.ts`
- Modify: `src/store/product.store.ts`

- [ ] **Step 1: Create api/addresses/route.ts**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const addresses = await prisma.address.findMany({ where: { userId: session.user.id }, orderBy: { isDefault: 'desc' } })
  return NextResponse.json({ success: true, data: addresses })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const { name, phone, street, city, province, postalCode, label, isDefault } = body
  if (!name || !phone || !street || !city || !province || !postalCode) {
    return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
  }
  if (isDefault) {
    await prisma.address.updateMany({ where: { userId: session.user.id }, data: { isDefault: false } })
  }
  const address = await prisma.address.create({ data: { userId: session.user.id, name, phone, street, city, province, postalCode, label, isDefault: isDefault || false } })
  return NextResponse.json({ success: true, data: address })
}
```

- [ ] **Step 2: Create api/addresses/[id]/route.ts**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const address = await prisma.address.findFirst({ where: { id: params.id, userId: session.user.id } })
  if (!address) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  if (body.isDefault) {
    await prisma.address.updateMany({ where: { userId: session.user.id }, data: { isDefault: false } })
  }
  const updated = await prisma.address.update({ where: { id: params.id }, data: body })
  return NextResponse.json({ success: true, data: updated })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const address = await prisma.address.findFirst({ where: { id: params.id, userId: session.user.id } })
  if (!address) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  await prisma.address.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
```

- [ ] **Step 3: Create api/orders/route.ts**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status')
  const where: any = { userId: session.user.id }
  if (status) where.status = status
  const orders = await prisma.order.findMany({
    where,
    include: { items: { include: { product: true } }, address: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ success: true, data: orders })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  
  const body = await request.json()
  const { items, addressId } = body
  
  if (!items?.length || !addressId) {
    return NextResponse.json({ success: false, error: 'Missing items or address' }, { status: 400 })
  }

  // Validate products and get latest prices
  const productIds = items.map((i: any) => i.productId)
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } })
  const productMap = new Map(products.map(p => [p.id, p]))

  for (const item of items) {
    const product = productMap.get(item.productId)
    if (!product) return NextResponse.json({ success: false, error: `Product ${item.productId} not found` }, { status: 400 })
    if (product.stock < item.quantity) return NextResponse.json({ success: false, error: `${product.name} insufficient stock` }, { status: 400 })
  }

  const address = await prisma.address.findFirst({ where: { id: addressId, userId: session.user.id } })
  if (!address) return NextResponse.json({ success: false, error: 'Address not found' }, { status: 404 })

  // Calculate total
  const total = items.reduce((sum: number, i: any) => {
    const product = productMap.get(i.productId)!
    return sum + product.price * i.quantity
  }, 0)

  // Create order
  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      total,
      addressId,
      items: {
        create: items.map((i: any) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: productMap.get(i.productId)!.price,
        })),
      },
    },
    include: { items: { include: { product: true } } },
  })

  // Create Stripe Checkout Session
  const stripeSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: items.map((i: any) => {
      const product = productMap.get(i.productId)!
      return {
        price_data: {
          currency: 'idr',
          product_data: { name: product.name },
          unit_amount: product.price,
        },
        quantity: i.quantity,
      }
    }),
    metadata: { orderId: order.id },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
  })

  // Save session ID
  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: stripeSession.id },
  })

  return NextResponse.json({ success: true, data: { orderId: order.id, url: stripeSession.url } })
}
```

- [ ] **Step 4: Create api/orders/[id]/route.ts**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const order = await prisma.order.findFirst({
    where: { id: params.id },
    include: { items: { include: { product: true } }, address: true },
  })
  if (!order || (order.userId !== session.user.id && session.user.role !== 'ADMIN')) {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true, data: order })
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const { status } = body
  if (!status) return NextResponse.json({ success: false, error: 'Status required' }, { status: 400 })
  const order = await prisma.order.update({ where: { id: params.id }, data: { status } })
  return NextResponse.json({ success: true, data: order })
}
```

- [ ] **Step 5: Create api/webhook/stripe/route.ts**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!
  
  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const orderId = session.metadata?.orderId
    if (!orderId) return NextResponse.json({ error: 'No orderId' }, { status: 400 })

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    })
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PAID',
        stripePaymentId: session.payment_intent as string,
        paidAt: new Date(),
      },
    })

    // Decrement stock
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    }
  }

  return NextResponse.json({ received: true })
}
```

- [ ] **Step 6: Update api/products/route.ts**

Add `price`, `stock`, `weight`, `images` to response. Add `inStock` computed flag.

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: Prisma.ProductWhereInput = {}
    if (category) where.category = category as any
    if (status) where.status = status as any
    else where.status = 'APPROVED'
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const products = await prisma.product.findMany({
      where,
      include: { owner: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    })

    const data = products.map(p => ({
      ...p,
      inStock: p.stock > 0,
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { auth } = await import('@/lib/auth')
  const session = await auth()
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const { name, category, description, image, images, origin, price, stock, weight, legality } = body
    const product = await prisma.product.create({
      data: { name, category, description, image, images: images || [], origin, price, stock, weight, legality, ownerId: session.user.id, status: 'APPROVED' },
    })
    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create' }, { status: 500 })
  }
}
```

- [ ] **Step 7: Update api/products/[id]/route.ts**

Add price/stock to update handler.

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { owner: { select: { id: true, name: true } } },
    })
    if (!product) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: { ...product, inStock: product.stock > 0 } })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 })
  }
}
```

- [ ] **Step 8: Update store/product.store.ts**

Add price, stock fields:
```typescript
interface Product {
  id: string; name: string; category: string; description: string
  image?: string; images: string[]; origin: string; status: string
  price: number; stock: number; weight?: number; inStock: boolean
}
```

---

### Task 6: Product Pages with Cart Integration

**Files:**
- Create: `lib/auth.ts` (if missing — next-auth config)
- Modify: `src/app/products/page.tsx`
- Modify: `src/app/products/[id]/page.tsx`

- [ ] **Step 1: Check/create lib/auth.ts**

```typescript
import NextAuth from 'next-auth'
// Adjust based on existing [...nextauth]/route.ts config
export const { handlers: { GET, POST }, auth } = NextAuth(...)
```

If `src/app/api/auth/[...nextauth]/route.ts` already exports `auth`, import from there. Otherwise ensure `lib/auth.ts` re-exports.

Need to check what currently exists:

```bash
head -20 src/app/api/auth/\[...nextauth\]/route.ts
```

- [ ] **Step 2: Rewrite app/products/page.tsx**

Fetch products from API, show with price/stock/add-to-cart button.

```typescript
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Search } from 'lucide-react'
import { useCartStore } from '@/store/cart.store'
import { useTranslations } from '@/lib/i18n'
import type { Product } from '@/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore((s) => s.addItem)
  const t = useTranslations()

  useEffect(() => {
    const params = new URLSearchParams()
    if (category !== 'all') params.set('category', category)
    if (search) params.set('search', search)
    fetch(`/api/products?${params}`)
      .then(r => r.json())
      .then(d => { if (d.success) setProducts(d.data) })
      .finally(() => setLoading(false))
  }, [category, search])

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            placeholder={t.products.searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {Object.entries(t.products.categories).map(([key, label]) => (
            <option key={key} value={key === 'all' ? 'all' : key.toUpperCase()}>{label}</option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800 h-72" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 py-20">{t.products.notFound}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="group rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow">
              <Link href={`/products/${product.id}`}>
                <div className="aspect-square relative bg-gray-50 dark:bg-gray-800">
                  {product.image && (
                    <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  )}
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{product.name}</h3>
                </Link>
                <p className="text-xs text-gray-500 mb-2">{product.origin}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary-600">Rp {product.price.toLocaleString('id-ID')}</span>
                  {product.stock > 0 ? (
                    <button
                      onClick={() => addItem({ productId: product.id, name: product.name, price: product.price, image: product.image || '', quantity: 1, stock: product.stock })}
                      className="p-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  ) : (
                    <span className="text-xs text-red-500 font-medium">{t.products.outOfStock}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Rewrite app/products/[id]/page.tsx**

Full product detail with quantity selector + add to cart + stock info.

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ShoppingCart, Minus, Plus, ArrowLeft, Package, MapPin, Ruler } from 'lucide-react'
import { useCartStore } from '@/store/cart.store'
import { useTranslations } from '@/lib/i18n'
import type { Product } from '@/types'

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((s) => s.addItem)
  const t = useTranslations()

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(d => { if (d.success) setProduct(d.data) })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center">{t.common.loading}</div>
  if (!product) return <div className="min-h-screen pt-24 flex items-center justify-center">{t.products.notFound}</div>

  const handleAddToCart = () => {
    addItem({ productId: product.id, name: product.name, price: product.price, image: product.image || '', quantity, stock: product.stock })
    router.push('/cart')
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-6 hover:text-primary-600">
          <ArrowLeft size={20} /> Back
        </button>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="aspect-square relative rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800">
            {product.image && <Image src={product.image} alt={product.name} fill className="object-cover" />}
          </div>
          {/* Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
            <p className="text-4xl font-bold text-primary-600 mb-4">Rp {product.price.toLocaleString('id-ID')}</p>
            {product.compareAt && (
              <p className="text-lg text-gray-400 line-through mb-4">Rp {product.compareAt.toLocaleString('id-ID')}</p>
            )}
            <p className="text-gray-600 dark:text-gray-400 mb-6">{product.description}</p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin size={16} /> {t.products.origin}: {product.origin}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Package size={16} /> {t.products.stock}: {product.stock > 0 ? `${product.stock} ${t.products.items}` : t.products.outOfStock}
              </div>
              {product.weight && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Ruler size={16} /> {t.products.weight}: {product.weight >= 1000 ? `${product.weight / 1000} ${t.products.kg}` : `${product.weight} ${t.products.gram}`}
                </div>
              )}
            </div>
            {product.stock > 0 && (
              <>
                {/* Quantity */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-medium">{t.products.quantity}:</span>
                  <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"><Minus size={18} /></button>
                    <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"><Plus size={18} /></button>
                  </div>
                </div>
                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl text-white font-semibold bg-primary-500 hover:bg-primary-600 transition-colors"
                >
                  <ShoppingCart size={20} /> {t.products.addToCart}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

### Task 7: Cart + Checkout + Success Pages

**Files:**
- Create: `src/app/cart/page.tsx`
- Create: `src/app/checkout/page.tsx`
- Create: `src/app/checkout/success/page.tsx`

- [ ] **Step 1: Create cart/page.tsx**

```typescript
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/store/cart.store'
import { useTranslations } from '@/lib/i18n'

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCartStore()
  const t = useTranslations()

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4 px-4">
        <ShoppingBag size={64} className="text-gray-300" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t.cart.empty}</h2>
        <p className="text-gray-500">{t.cart.emptyHint}</p>
        <Link href="/products" className="px-6 py-2.5 rounded-xl bg-primary-500 text-white font-medium">{t.cart.continueShopping}</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t.cart.title} ({totalItems()} {totalItems() > 1 ? t.cart.items : t.cart.item})</h1>
        <div className="grid md:grid-cols-[1fr_300px] gap-8">
          {/* Items */}
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.productId} className="flex gap-4 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 shrink-0">
                  {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.productId}`} className="font-semibold text-gray-900 dark:text-white truncate block hover:text-primary-600">{item.name}</Link>
                  <p className="text-primary-600 font-bold mt-1">Rp {item.price.toLocaleString('id-ID')}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800"><Minus size={16} /></button>
                      <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800"><Plus size={16} /></button>
                    </div>
                    <button onClick={() => removeItem(item.productId)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-gray-900 dark:text-white">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Summary */}
          <div className="h-fit p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-24">
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">{t.cart.summary}</h3>
            <div className="flex justify-between mb-2 text-sm text-gray-600 dark:text-gray-400">
              <span>{t.cart.subtotal} ({totalItems()} {t.cart.items})</span>
              <span>Rp {subtotal().toLocaleString('id-ID')}</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2 flex justify-between font-bold text-lg text-gray-900 dark:text-white">
              <span>{t.cart.total}</span>
              <span>Rp {subtotal().toLocaleString('id-ID')}</span>
            </div>
            <Link
              href="/checkout"
              className="mt-6 w-full flex items-center justify-center px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors"
            >
              {t.cart.checkout}
            </Link>
            <Link href="/products" className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-primary-600">
              <ArrowLeft size={16} /> {t.cart.continueShopping}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create checkout/page.tsx**

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart.store'
import { useTranslations } from '@/lib/i18n'
import { ShoppingBag } from 'lucide-react'

interface Address {
  id: string; label?: string; name: string; phone: string; street: string
  city: string; province: string; postalCode: string; isDefault: boolean
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, totalItems, clearCart } = useCartStore()
  const t = useTranslations()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ label: '', name: '', phone: '', street: '', city: '', province: '', postalCode: '' })

  useEffect(() => {
    fetch('/api/addresses').then(r => r.json()).then(d => {
      if (d.success) {
        setAddresses(d.data)
        const def = d.data.find((a: Address) => a.isDefault)
        if (def) setSelectedAddress(def.id)
      }
    })
  }, [])

  // Redirect to cart if empty
  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  const handleSaveAddress = async () => {
    const res = await fetch('/api/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const d = await res.json()
    if (d.success) {
      setAddresses(prev => [...prev, d.data])
      setSelectedAddress(d.data.id)
      setShowForm(false)
      setForm({ label: '', name: '', phone: '', street: '', city: '', province: '', postalCode: '' })
    }
  }

  const handlePay = async () => {
    if (!selectedAddress) { setError('Please select an address'); return }
    setLoading(true)
    setError('')
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: items.map(i => ({ productId: i.productId, quantity: i.quantity })), addressId: selectedAddress }),
    })
    const d = await res.json()
    if (d.success) {
      clearCart()
      window.location.href = d.data.url // redirect to Stripe
    } else {
      setError(d.error || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t.checkout.title}</h1>
        <div className="grid md:grid-cols-[1fr_350px] gap-8">
          {/* Left: Address */}
          <div>
            <h2 className="font-semibold mb-4 text-gray-900 dark:text-white">{t.checkout.shippingAddress}</h2>
            {addresses.length > 0 && (
              <div className="space-y-3 mb-4">
                {addresses.map(addr => (
                  <label key={addr.id} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${selectedAddress === addr.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                    <input type="radio" name="address" value={addr.id} checked={selectedAddress === addr.id} onChange={e => setSelectedAddress(e.target.value)} className="mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{addr.name} {addr.label && <span className="text-xs text-gray-500">({addr.label})</span>}</p>
                      <p className="text-sm text-gray-500">{addr.street}, {addr.city}, {addr.province} {addr.postalCode}</p>
                      <p className="text-sm text-gray-500">{addr.phone}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
            <button onClick={() => setShowForm(!showForm)} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              + {t.checkout.newAddress}
            </button>
            {showForm && (
              <div className="mt-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input className="col-span-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm" placeholder={t.checkout.labelPlaceholder} value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} />
                  <input className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm" placeholder={t.checkout.name} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  <input className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm" placeholder={t.checkout.phone} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  <input className="col-span-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm" placeholder={t.checkout.street} value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} />
                  <input className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm" placeholder={t.checkout.city} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                  <input className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm" placeholder={t.checkout.province} value={form.province} onChange={e => setForm(f => ({ ...f, province: e.target.value }))} />
                  <input className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm" placeholder={t.checkout.postalCode} value={form.postalCode} onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))} />
                </div>
                <button onClick={handleSaveAddress} className="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium">{t.checkout.saveAddress}</button>
              </div>
            )}
          </div>
          {/* Right: Summary + Pay */}
          <div className="h-fit p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-24">
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">{t.checkout.orderSummary}</h3>
            <div className="space-y-2 mb-4">
              {items.map(item => (
                <div key={item.productId} className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span className="truncate">{item.name} x{item.quantity}</span>
                  <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between font-bold text-lg text-gray-900 dark:text-white">
              <span>{t.cart.total}</span>
              <span>Rp {subtotal().toLocaleString('id-ID')}</span>
            </div>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            <button
              onClick={handlePay}
              disabled={loading}
              className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 disabled:opacity-50 transition-colors"
            >
              <ShoppingBag size={20} /> {loading ? t.checkout.processing : t.checkout.pay}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create checkout/success/page.tsx**

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, ShoppingBag } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const t = useTranslations()
  const [orderId, setOrderId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (!sessionId) { setLoading(false); return }
    // Poll for order confirmation via webhook
    const check = async () => {
      const res = await fetch('/api/orders')
      const d = await res.json()
      if (d.success && d.data.length > 0) {
        setOrderId(d.data[0].id)
        setLoading(false)
      } else {
        setTimeout(check, 1000)
      }
    }
    check()
  }, [searchParams])

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {loading ? (
          <div className="animate-pulse">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto mb-4" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto" />
          </div>
        ) : orderId ? (
          <>
            <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.success.title}</h1>
            <p className="text-gray-500 mb-2">{t.success.desc}</p>
            <p className="text-sm text-gray-400 mb-6">{t.success.orderId}: <span className="font-mono">{orderId.slice(0, 8)}...</span></p>
            <div className="flex gap-3 justify-center">
              <Link href={`/orders/${orderId}`} className="px-6 py-2.5 rounded-xl bg-primary-500 text-white font-medium flex items-center gap-2">
                <Package size={18} /> {t.success.viewOrder}
              </Link>
              <Link href="/products" className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                <ShoppingBag size={18} /> {t.success.continueShopping}
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Order not found</h1>
            <p className="text-gray-500 mb-6">Check your orders in the dashboard.</p>
            <Link href="/dashboard/orders" className="px-6 py-2.5 rounded-xl bg-primary-500 text-white font-medium">View Orders</Link>
          </>
        )}
      </div>
    </div>
  )
}
```

---

### Task 8: Orders Pages

**Files:**
- Create: `src/app/orders/page.tsx`
- Create: `src/app/orders/[id]/page.tsx`

- [ ] **Step 1: Create orders/page.tsx**

```typescript
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, ChevronRight } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import type { Order } from '@/types'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const t = useTranslations()

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(d => { if (d.success) setOrders(d.data) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center">{t.common.loading}</div>
  if (orders.length === 0) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
      <Package size={64} className="text-gray-300" />
      <h2 className="text-xl font-semibold">{t.orders.noOrders}</h2>
      <p className="text-gray-500">{t.orders.noOrdersDesc}</p>
      <Link href="/products" className="px-6 py-2.5 rounded-xl bg-primary-500 text-white font-medium">{t.cart.continueShopping}</Link>
    </div>
  )

  return (
    <div className="min-h-screen pt-24 pb-12 max-w-4xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">{t.orders.title}</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <Link key={order.id} href={`/orders/${order.id}`} className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md transition-shadow">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">#{order.id.slice(0, 8)}</p>
              <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
              <p className="text-sm text-gray-500">{order.items.length} {t.orders.items}</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                order.status === 'SHIPPING' ? 'bg-purple-100 text-purple-800' :
                order.status === 'DELIVERED' ? 'bg-gray-100 text-gray-800' :
                order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {t.orders.statuses[order.status as keyof typeof t.orders.statuses] || order.status}
              </span>
              <p className="font-bold mt-1 text-gray-900 dark:text-white">Rp {order.total.toLocaleString('id-ID')}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create orders/[id]/page.tsx**

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Package, MapPin, CreditCard } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import type { Order } from '@/types'

export default function OrderDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const t = useTranslations()

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then(r => r.json())
      .then(d => { if (d.success) setOrder(d.data) })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center">{t.common.loading}</div>
  if (!order) return <div className="min-h-screen pt-24 flex items-center justify-center">Order not found</div>

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 mb-6 hover:text-primary-600">
          <ArrowLeft size={20} /> {t.common.back}
        </button>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.orders.detail}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            order.status === 'PAID' ? 'bg-green-100 text-green-800' :
            order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
            order.status === 'SHIPPING' ? 'bg-purple-100 text-purple-800' :
            order.status === 'DELIVERED' ? 'bg-gray-100 text-gray-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {t.orders.statuses[order.status as keyof typeof t.orders.statuses] || order.status}
          </span>
        </div>
        {/* Items */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 mb-4">
          <h2 className="font-semibold mb-3 text-gray-900 dark:text-white">{t.orders.items} ({order.items.length})</h2>
          <div className="space-y-3">
            {order.items.map(item => (
              <div key={item.id} className="flex gap-3">
                <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 shrink-0">
                  {item.product.image && <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{item.product.name}</p>
                  <p className="text-sm text-gray-500">{item.quantity}x @ Rp {item.price.toLocaleString('id-ID')}</p>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Address */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 mb-4">
          <h2 className="font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white"><MapPin size={18} /> {t.orders.address}</h2>
          <p className="text-gray-700 dark:text-gray-300">{order.address.name}</p>
          <p className="text-sm text-gray-500">{order.address.street}, {order.address.city}, {order.address.province} {order.address.postalCode}</p>
          <p className="text-sm text-gray-500">{order.address.phone}</p>
        </div>
        {/* Total */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
          <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
            <span>{t.orders.total}</span>
            <span>Rp {order.total.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

### Task 9: Dashboard + Admin Orders

**Files:**
- Create: `src/app/(dashboard)/dashboard/orders/page.tsx`
- Create: `src/app/(dashboard)/dashboard/orders/[id]/page.tsx`
- Create: `src/app/(dashboard)/dashboard/admin/page.tsx`
- Create: `src/app/(dashboard)/dashboard/admin/orders/page.tsx`
- Modify: `src/app/(dashboard)/dashboard/page.tsx`
- Modify: `src/app/(dashboard)/layout.tsx`
- Modify: `src/components/layout/Sidebar.tsx`

- [ ] **Step 1: Update Sidebar.tsx**

Replace mentoring/partners with orders in sidebar navigation.

```typescript
// In the dashboard menu section, replace:
const menuItems = [
  { href: '/dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
  { href: '/dashboard/orders', label: t.dashboard.myOrders, icon: ShoppingBag },
  { href: '/dashboard/profile', label: t.dashboard.profile, icon: User },
]
```

- [ ] **Step 2: Update (dashboard)/layout.tsx**

Remove references to mentoring/partners in dashboard layout.

- [ ] **Step 3: Rewrite dashboard/page.tsx**

Show order overview instead of startup stats.

```typescript
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Package, Clock, CheckCircle } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import type { Order } from '@/types'

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const t = useTranslations()

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(d => { if (d.success) setOrders(d.data) })
      .finally(() => setLoading(false))
  }, [])

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    processing: orders.filter(o => o.status === 'PROCESSING' || o.status === 'PAID').length,
    completed: orders.filter(o => o.status === 'DELIVERED').length,
  }

  const recentOrders = orders.slice(0, 5)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t.dashboard.overviewTitle}</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: t.dashboard.totalOrders, value: stats.total, icon: ShoppingBag, color: 'text-blue-600 bg-blue-100' },
          { label: t.dashboard.pendingOrders, value: stats.pending, icon: Clock, color: 'text-yellow-600 bg-yellow-100' },
          { label: 'Processing', value: stats.processing, icon: Package, color: 'text-purple-600 bg-purple-100' },
          { label: t.dashboard.completedOrders, value: stats.completed, icon: CheckCircle, color: 'text-green-600 bg-green-100' },
        ].map(stat => (
          <div key={stat.label} className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className={`inline-flex p-2 rounded-lg ${stat.color} mb-2`}><stat.icon size={20} /></div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {recentOrders.length > 0 && (
        <div>
          <h2 className="font-semibold mb-3 text-gray-900 dark:text-white">{t.dashboard.recentOrders}</h2>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {recentOrders.map(order => (
              <Link key={order.id} href={`/dashboard/orders/${order.id}`} className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">#{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">Rp {order.total.toLocaleString('id-ID')}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>{t.orders.statuses[order.status as keyof typeof t.orders.statuses] || order.status}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Create dashboard/orders/page.tsx**

Same as public orders page but in dashboard layout.

- [ ] **Step 5: Create dashboard/orders/[id]/page.tsx**

Same as public order detail but in dashboard layout.

- [ ] **Step 6: Create dashboard/admin/page.tsx**

```typescript
'use client'

import Link from 'next/link'
import { Package, ShoppingBag, Users, Shield } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

export default function AdminDashboardPage() {
  const t = useTranslations()
  const items = [
    { href: '/dashboard/admin/orders', label: t.dashboard.adminOrders, icon: ShoppingBag, desc: 'View and update order statuses' },
    { href: '/dashboard/admin/products', label: t.dashboard.adminProducts, icon: Package, desc: 'Manage product catalog' },
    { href: '/dashboard/admin/users', label: t.dashboard.adminUsers, icon: Users, desc: 'Manage users' },
  ]
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Shield size={24} /> {t.dashboard.adminPanel}</h1>
      <div className="grid gap-4">
        {items.map(item => (
          <Link key={item.href} href={item.href} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md transition-shadow">
            <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600"><item.icon size={24} /></div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{item.label}</p>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 7: Create dashboard/admin/orders/page.tsx**

```typescript
'use client'

import { useEffect, useState } from 'react'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

// Server component wrapper that checks admin
export default async function AdminOrdersPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/login')
  
  const orders = await prisma.order.findMany({
    include: { user: { select: { name: true, email: true } }, items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return <AdminOrdersClient orders={JSON.parse(JSON.stringify(orders))} />
}
```

---

### Task 10: Homepage + Navbar + sitemap cleanup

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/layout/Navbar.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Delete: `src/components/sections/ProductCatalog.tsx` (integrated into products page)
- Create: `src/app/cart/` (already done in Task 7)

- [ ] **Step 1: Rewrite src/app/page.tsx — New e-commerce homepage**

```typescript
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ShoppingBag, ArrowRight, Coffee, Leaf, Fish, Flame, Factory } from 'lucide-react'
import Image from 'next/image'

const categoryIcons: Record<string, any> = { COFFEE: Coffee, PATCHOULI: Leaf, SEAFOOD: Fish, SPICES: Flame, PROCESSED: Factory }

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { status: 'APPROVED', stock: { gt: 0 } },
    orderBy: { createdAt: 'desc' },
    take: 8,
  })
  return JSON.parse(JSON.stringify(products))
}

async function getCategories() {
  const cats = await prisma.product.groupBy({ by: ['category'], _count: true, where: { status: 'APPROVED' } })
  return cats.map(c => ({ category: c.category, count: c._count }))
}

export default async function HomePage() {
  const [products, categories] = await Promise.all([getFeaturedProducts(), getCategories()])

  return (
    <main>
      {/* Hero Banner */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-ocean-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0L60 30L30 60L0 30Z\' fill=\'%23ffffff\' fill-opacity=\'0.05\'/%3E%3C/svg%3E")', backgroundSize: '60px 60px' }} />
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">Acelora</h1>
          <p className="text-xl md:text-2xl text-primary-100 mb-3">Premium Agro-Maritime Products from Aceh</p>
          <p className="text-base text-primary-200/80 mb-8 max-w-xl mx-auto">Shop directly from Acehnese farmers, fishermen, and MSMEs. Authentic products with global quality.</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-primary-800 font-semibold text-lg hover:bg-primary-50 transition-colors shadow-xl">
            <ShoppingBag size={20} /> Shop Now
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map(({ category, count }) => {
            const Icon = categoryIcons[category] || Package
            return (
              <Link key={category} href={`/products?category=${category}`} className="flex flex-col items-center p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md hover:border-primary-300 transition-all group">
                <Icon size={32} className="text-primary-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{category.toLowerCase()}</span>
                <span className="text-xs text-gray-500">{count} products</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
            <Link href="/products" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.slice(0, 4).map(product => (
              <Link key={product.id} href={`/products/${product.id}`} className="group rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow">
                <div className="aspect-square relative bg-gray-50 dark:bg-gray-800">
                  {product.image && <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate">{product.name}</h3>
                  <p className="text-lg font-bold text-primary-600 mt-1">Rp {product.price.toLocaleString('id-ID')}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center bg-gradient-to-r from-primary-600 to-ocean-600 text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to explore premium Acehnese products?</h2>
        <p className="text-primary-100 mb-8 max-w-lg mx-auto">Connect directly with local producers and enjoy authentic flavors from the heart of Aceh.</p>
        <Link href="/products" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-primary-700 font-semibold hover:bg-primary-50 transition-colors shadow-xl">
          Browse All Products <ArrowRight size={20} />
        </Link>
      </section>
    </main>
  )
}
```

- [ ] **Step 2: Update Navbar.tsx**

Simplify menu (remove startup links, add cart icon with badge):

Modified sections:
- Remove `publicMenu` — replace with `[{ key: 'home', href: '/' }, { key: 'products', href: '/products' }]`
- Add cart icon button next to language switcher with badge from `useCartStore`
- Replace login link with profile dropdown when authenticated

- [ ] **Step 3: Update Footer.tsx**

Remove dead links (mentoring, partners, business, team, about, contact).
Keep: Home, Products, Newsletter, Contact info.

---

### Task 11: Build Verification

- [ ] **Step 1: Check build**

```bash
npm run build
```

- [ ] **Step 2: Fix any TypeScript errors**

```bash
npx tsc --noEmit
```
