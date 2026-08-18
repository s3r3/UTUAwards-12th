# Acelora — Architecture

**Acelora** adalah platform e-commerce agro-maritim Aceh: ekosistem yang menghubungkan UMKM, petani, nelayan, eksportir, dan mitra internasional.

**Stack**: Next.js 16 (App Router) · React 19 · TypeScript 5 · Prisma 7 · PostgreSQL (Supabase) · Tailwind CSS 3 · Zustand · NextAuth v5 · TanStack React Query.

---

## 1. Arsitektur Tingkat Tinggi

```
┌────────────────────────────────────────────────────────────┐
│                        Browser (Client)                    │
│  React 19 — RSC + Client Components                        │
│  Zustand (cart, UI, i18n) · React Query · Framer Motion    │
└──────────────────────────────┬─────────────────────────────┘
                               │ HTTP / JSON
┌──────────────────────────────▼─────────────────────────────┐
│                   Next.js 16 App Router                    │
│  Server Components (SSG/ISR/SSR)                           │
│  Route Handlers (API) /api/*                               │
│  generateStaticParams · generateMetadata · sitemap/robots  │
└──────────────────────────────┬─────────────────────────────┘
                               │ Prisma Client
┌──────────────────────────────▼─────────────────────────────┐
│                  PostgreSQL (Supabase)                     │
│  users · products · reviews · orders · addresses · auth    │
└────────────────────────────────────────────────────────────┘
```

## 2. Pendekatan Rendering

| Route | Strategy | Keterangan |
|-------|----------|------------|
| `/` (home) | SSR + DB fallback | `dbReachable()` 5s TCP check → fallback data statis jika DB down |
| `/products` | `force-dynamic` | Wrapper server + `<Suspense>` (useSearchParams) |
| `/products/[id]` | SSG (`generateStaticParams`) | Produk APPROVED di-pre-render + dynamic OG image |
| `/wishlist` | Client + localStorage | Tidak butuh DB |
| `/api/*` | Route Handlers | JSON, validasi manual |

**Fallback DB** (`src/lib/prisma.ts`, `dbReachable()`): jika koneksi Supabase tidak terjangkau dalam 5 detik, halaman memakai data sampel dari `src/constants/products.ts` — demo tetap jalan tanpa DB.

## 3. Model Data (Prisma)

```
User (USER/ADMIN/PARTNER) 1──∞ Product 1──∞ Review
  │                       1──∞ Order 1──∞ OrderItem ∞──1 Product
  │                       1──∞ Address ∞──1 Order
  └── 1──∞ Account / Session (NextAuth)
```

- **Product**: kategori enum (COFFEE/PATCHOULI/SEAFOOD/SPICES/PROCESSED), status enum (PENDING/REVIEW/VERIFIED/APPROVED/REJECTED), harga Int (IDR), stock, weight, images `String[]`.
- **Review**: rating 1–5, comment opsional, relasi user + product.
- **Order**: status workflow PENDING → PAID → PROCESSING → SHIPPING → DELIVERED / CANCELLED.

## 4. State Management

| Store | Lokasi | Persist |
|-------|--------|---------|
| Cart | `src/store/cart.store.ts` | localStorage `acelora-cart` |
| UI (theme, modal) | `src/store/ui.store.ts` | localStorage `ui-storage` |
| i18n lang | `src/lib/i18n` (zustand) | localStorage `i18n-lang` |

Server-side rendering menghindari akses langsung ke `localStorage` — semua akses di-guard `typeof window !== 'undefined'`.

## 5. Data Flow Utama

**Browse → Cart → Checkout**
1. `/products` fetch `/api/products` (filter: category, search, min/max price, sort, pagination `_page`/`_limit`).
2. Product detail: SSG page fetch produk + reviews via Prisma `Promise.all`.
3. Add to cart → Zustand store → MiniCart drawer.
4. Checkout → `/api/orders` (Stripe/Midtrans) → Order + OrderItem.

**Reviews**
- `GET /api/reviews?productId=...` → list + pagination.
- `POST /api/reviews` → validasi rating 1–5, cek user & produk ada.
- Detail page: reviews di-fetch server-side, `avgRating` dihitung, ditampilkan di `ProductDetailClient`.

## 6. SEO & Metadata

- `generateStaticParams` + `generateMetadata` di `/products/[id]`.
- Dynamic OG image: `src/app/api/products/[id]/og/route.tsx`.
- `sitemap.ts`, `robots.ts`, JSON-LD (Product, Breadcrumb, Organization).
- Next/Image AVIF/WebP + `sizes` + `priority`; font `display: swap`.

## 7. Keputusan Teknis Penting

| Keputusan | Alasan |
|-----------|--------|
| Turbopack, tanpa webpack config | Build error lama; `turbopack.root` menggantikan |
| `useSearchParams` dibungkus Suspense | Hydration/build error |
| Prisma type casts (`as any`) | Ketidakcocokan tipe enum Prisma — tech debt, jangan dihindari permanen |
| Fallback data statis | Demo tetap jalan saat DB down; production harus DB aktif |
| Zustand bukan Redux | Bundle kecil, persist mudah, sudah terpasang |
| react-globe.gl untuk Export Globe | Visual "wow factor", Three.js di baliknya, lazy load |

## 8. Tech Debt / Roadmap

- [ ] Zod schemas untuk semua input API
- [ ] Rate limiting (Upstash/Redis)
- [ ] Replace raw `fetch` dengan React Query di ProductsPage
- [ ] Error boundaries per section
- [ ] Centralized toast (Sonner)
- [ ] Hapus `console.log` production
- [ ] Tipe `any` di Prisma enum casts
- [ ] Playwright E2E critical path
- [ ] Lighthouse CI di pipeline
