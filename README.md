<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="/logo/logo-light.svg">
    <img alt="Acelora" src="/logo/logo-dark.svg" width="220">
  </picture>
</p>

<h1 align="center">Acelora</h1>
<h3 align="center">Agro-Maritim Aceh Ecosystem</h3>

<p align="center">
  <a href="https://acelora.id"><img src="https://img.shields.io/badge/web-acelora.id-22c55e?style=flat-square" alt="Website"></a>
  <img src="https://img.shields.io/badge/Next.js-16.2.9-000?style=flat-square&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Prisma-7.8-2d3748?style=flat-square&logo=prisma" alt="Prisma">
  <img src="https://img.shields.io/badge/PostgreSQL-4169e1?style=flat-square&logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Tailwind-3.4-06b6d4?style=flat-square&logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/Framer%20Motion-12-0055ff?style=flat-square&logo=framer" alt="Framer Motion">
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License">
</p>

<p align="center">
  Platform digital ekosistem agro-maritim Aceh yang menghubungkan UMKM, petani, nelayan, eksportir,<br>
  dan mitra internasional dalam satu ekosistem terintegrasi.
</p>

<p align="center">
  <sub>🏆 The 12th UTU Awards 2026</sub>
</p>

<br>

## ✨ Fitur

<details open>
<summary><b>Landing Page</b></summary>

| Bagian | Highlights |
|--------|------------|
| **Hero** | Parallax multi-layer, floating blobs, animated counters, gradient text |
| **Dashboard Preview** | Live stats, sparkline charts, real-time visual |
| **Market Prices** | dynamic pricing trends |
| **Product Catalog** | Search, filter, kategori, modal detail |
| **Mentoring** | Timeline interaktif, CTA |
| **International Partner** | Partner grid, 3D globe interaktif (Three.js) |
| **Workflow** | Producer → Metuah Hub → Certification → Global Market |
| **Financial** | Cost/revenue metrics, aliran pendapatan |
| **Team** | Kartu anggota tim |
</details>

<details>
<summary><b>Dashboard</b></summary>

- **Overview** — Statistik, produk terbaru, progress mentoring
- **My Products** — CRUD table produk
- **Mentoring** — Tracking progress
- **Partners** — Daftar mitra
- **Settings** — Profil & toggle tema
- **Admin Panel** — Approve produk, manage users
</details>

<details>
<summary><b>Animasi & Interaksi</b></summary>

- Parallax scroll multi-layer (Framer Motion)
- Organic blob float (GSAP)
- Stagger reveal, fade, scale transitions
- Smooth scroll (Lenis)
- 3D interactive globe (react-globe.gl)
- Floating particles
- Responsive di semua perangkat
- Menghormati preferensi <code>prefers-reduced-motion</code>
</details>

<br>

## 🛠️ Tech Stack

<div align="center">

| Layer | Teknologi |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v3 |
| **Animations** | Framer Motion v12, GSAP v3, Lenis |
| **3D** | Three.js, react-globe.gl |
| **State** | Zustand |
| **Auth** | NextAuth v5 (Auth.js) |
| **Database** | PostgreSQL (Supabase / local) |
| **ORM** | Prisma v7 |
| **Validation** | Zod + React Hook Form |
| **Data Fetching** | TanStack React Query |
| **Icons** | Lucide React |
| **Linting** | ESLint 9 |

</div>

<br>

## 📁 Struktur

```
src/
├── animations/       # Framer Motion + GSAP utilities
├── app/              # Next.js App Router pages & API routes
├── components/
│   ├── layout/       # Navbar, Footer, Sidebar
│   ├── sections/     # Hero, DashboardPreview, Workflow, Team …
│   └── ui/           # Button, Card, Input, Modal, Skeleton
├── constants/        # Menu, produk, config
├── contexts/         # SessionProvider
├── hooks/            # useAuth, custom hooks
├── lib/              # Prisma client, GSAP registry, i18n
├── locales/          # id.json, en.json
├── navigation/       # Route definitions
├── services/         # Auth, produk, partner services
├── store/            # Zustand stores
├── types/            # TypeScript definitions
└── utils/            # Validation, helpers
```

<br>

## 🚀 Mulai Cepat

```bash
# 1. Install
npm install --legacy-peer-deps

# 2. Set environment variables
cp .env.example .env
# isi DATABASE_URL, NEXTAUTH_SECRET, etc.

# 3. Setup database
npx prisma db push
npx tsx prisma/seed.ts

# 4. Development
npm run dev
# → http://localhost:3000
```

> **Akun default:** — Admin: `admin@metuahhub.id` / `admin123` — User: `user@metuahhub.id` / `user123`

<br>

## 🌐 Environment

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/meutuah"
NEXTAUTH_SECRET="openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

<br>

## 📦 Deploy

### Database (Supabase)

1. Buat project di [supabase.com](https://supabase.com)
2. Copy connection string ke `DATABASE_URL`
3. `npx prisma db push && npx tsx prisma/seed.ts`

### App (Vercel)

1. Push ke GitHub, import di [vercel.com](https://vercel.com)
2. Set env vars: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
3. Deploy ✨

<br>

## 📄 Lisensi

MIT — Acelora · The 12th UTU Awards 2026
