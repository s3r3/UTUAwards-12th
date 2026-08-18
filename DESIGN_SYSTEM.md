# Acelora — Design System

Sistem desain Acelora dibangun di atas **Tailwind CSS 3** dengan token warna semantik (`primary`, `ocean`, `surface`) dan dukungan dark mode via class `dark` di `<html>`.

---

## 1. Warna

| Token | Light | Dark | Penggunaan |
|-------|-------|------|------------|
| `primary` | `#16a34a` (green-600) | `#22c55e` (green-500) | CTA, link, badge, accent |
| `primary-50/100` | `#f0fdf4` | `#052e16` | Background badge/soft |
| `ocean` | `#0ea5e9` (sky-500) | `#38bdf8` | Export globe, secondary accent |
| `bg` | `#ffffff` | `#0a0a0a` (gray-950) | Page background |
| `surface` | `white` / `gray-50` | `gray-900` | Card, drawer, modal |
| `border` | `gray-200` | `gray-800` | Divider, outline |
| `text` | `gray-900` | `gray-100` | Primary text |
| `text-muted` | `gray-500` | `gray-400` | Secondary text |

Semua warna diakses via class `bg-primary-500`, `text-primary-600`, `dark:bg-gray-900`, dst. Jangan hardcode hex di komponen.

## 2. Tipografi

- **Font**: Inter (body) + Plus Jakarta Sans (display) via `next/font`, `display: swap`.
- **Scale**: `text-xs` (12) · `text-sm` (14) · `text-base` (16) · `text-lg` (18) · `text-xl` (20) · `text-2xl` (24) · `text-3xl` (30) · `text-4xl` (36).
- **Heading**: `font-bold`, `tracking-tight` untuk hero.
- **Label kecil**: `text-xs font-semibold uppercase tracking-wider`.

## 3. Spacing & Layout

- Container: `max-w-6xl mx-auto px-4`.
- Section vertical: `py-20` (desktop) / `py-12` (mobile).
- Grid produk: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`.
- Radius: `rounded-xl` (input/button), `rounded-2xl` (card), `rounded-full` (badge/pill).

## 4. Komponen Primer

| Komponen | Lokasi | Catatan |
|----------|--------|---------|
| Button (primary) | inline class | `bg-primary-500 hover:bg-primary-600 text-white rounded-xl px-4 py-2.5` |
| Card | inline | `rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900` |
| ProductCard | `ProductsClient` | `aspect-square` image, hover scale, stock badge |
| Modal/Drawer | `MiniCart` | slide-in dari kanan, `fixed inset-0` + backdrop |
| Badge | inline | `px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-600` |
| Input | `ProductsClient` | `rounded-xl border bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500` |
| Skeleton | inline | `animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800 h-72` |

## 5. Icons

- **Lucide React** untuk icon UI (ShoppingCart, Search, X, Heart, Share2, ArrowLeft).
- **react-icons** untuk icon kategori/brand.
- Icon-only button wajib punya `aria-label`.

## 6. Animasi

- **Framer Motion**: stagger reveal, fade, scale pada section & card.
- **GSAP**: organic blob float, parallax hero.
- **Lenis**: smooth scroll global.
- **react-globe.gl**: Export Globe (arc animasi, pulse markers).
- Semua animasi **honor `prefers-reduced-motion`** — nonaktifkan transform/opacity saat reduced motion.

## 7. Dark Mode

- Toggle via `useUIStore.setTheme()` → `document.documentElement.classList.toggle('dark')`.
- Semua komponen dual-class: `bg-white dark:bg-gray-900 text-gray-900 dark:text-white`.
- Transition halus: `transition-colors duration-300` di `<body>`.

## 8. Responsive

| Breakpoint | Layout |
|------------|--------|
| `< 640` (mobile) | 2 kolom produk, single column detail, drawer full-width |
| `768` (tablet) | 3 kolom produk, 2 kolom detail |
| `1024` (desktop) | 4 kolom produk, 2 kolom detail |
| `1440+` | max-w-6xl centered |

## 9. Aksesibilitas

- Semantic HTML: `<main>`, `<section>`, `<nav>`, heading hierarchy.
- Focus visible: `focus:outline-none focus:ring-2 focus:ring-primary-500`.
- Skip-to-content (jika ada).
- Kontras: text `gray-500` hanya untuk muted, bukan body.
- Gambar wajib `alt`.
- Reduced motion respected.
