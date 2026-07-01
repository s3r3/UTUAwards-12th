# Metuah Hub — Agro-Maritim Aceh Ecosystem

> Platform digital ekosistem agro-maritim Aceh untuk The 12th UTU Awards 2026

Metuah Hub menghubungkan UMKM, petani, nelayan, eksportir, dan mitra internasional dalam satu ekosistem terintegrasi — dari sertifikasi halal, HACCP, kemasan ekspor, hingga koneksi ke buyer global.

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Animation | Framer Motion v12, GSAP |
| Smooth Scroll | Lenis |
| State | Zustand |
| Auth | NextAuth v5 (Auth.js) |
| Database | PostgreSQL (Supabase / local) |
| ORM | Prisma v6 |
| Validation | Zod + React Hook Form |
| Data Fetching | TanStack Query |
| Icons | Lucide React |

## Struktur Folder

```
src/
├── animations/     # Framer Motion + GSAP utilities
├── app/            # Next.js App Router pages & API
├── components/     # UI, layout, & section components
├── constants/      # Menu, products, config
├── contexts/       # Auth context (SessionProvider)
├── hooks/          # useAuth, useScroll, useProducts
├── lib/            # Prisma client, utils
├── locales/        # id.json, en.json
├── navigation/     # Route constants
├── services/       # Auth, product, partner services
├── store/          # Zustand stores (auth, product, ui)
├── types/          # TypeScript types
└── utils/          # Validation, helpers
```

## Fitur

### Landing Page
- **Hero** — Parallax, animated counters, floating blobs
- **Dashboard Preview** — Live stats with sparklines
- **Product Catalog** — Search, filter, categories, detail modal
- **Mentoring** — Timeline cards, CTA
- **International Partners** — Partner grid
- **Workflow** — Producer → Metuah Hub → Certification → Global Market
- **Financial** — Cost/revenue metrics, revenue streams
- **Team** — Team member cards

### Dashboard (User)
- Overview — Stats, recent products, mentoring progress
- My Products — CRUD table
- Mentoring — Progress tracking
- Partners — Partner list
- Settings — Profile & theme toggle
- Profile — User info

### Dashboard (Admin)
- Admin Panel — Stats overview, product approval
- Manage Products — Approve/reject products
- Manage Users — User list

### API
- `GET/POST /api/products` — List & create products
- `GET/PUT /api/products/[id]` — Get & update product
- `GET/POST /api/partners` — List & create partners
- `GET/POST /api/mentoring` — List & create mentoring
- `POST /api/auth/register` — Register user
- `GET/POST /api/auth/[...nextauth]` — NextAuth v5

## Memulai

### Prasyarat

- Node.js 18+
- PostgreSQL (local) atau Supabase account
- npm / yarn

### 1. Clone & Install

```bash
git clone <repo-url>
cd meutuah
npm install --legacy-peer-deps
```

### 2. Environment Variables

Salin `.env.example` ke `.env` dan isi:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/meutuah?schema=public"
NEXTAUTH_SECRET="generate-random-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Metuah Hub"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database

```bash
# Push schema to database
npx prisma db push

# Seed with sample data
npx tsx prisma/seed.ts
```

Akun default:
- Admin: `admin@metuahhub.id` / `admin123`
- User: `user@metuahhub.id` / `user123`

### 4. Development

```bash
npm run dev
# Open http://localhost:3000
```

### 5. Build

```bash
npm run build
npm start
```

## Deployment (Vercel + Supabase)

### Supabase

1. Buat project di [supabase.com](https://supabase.com)
2. Dapatkan connection string (`DATABASE_URL`) dari Settings → Database
3. Jalankan `npx prisma db push` untuk migrasi
4. Jalankan `npx tsx prisma/seed.ts` untuk seed data

### Vercel

1. Push repo ke GitHub/GitLab
2. Import di [vercel.com](https://vercel.com)
3. Set environment variables:
   - `DATABASE_URL` — Supabase connection string
   - `NEXTAUTH_SECRET` — Generate dengan `openssl rand -base64 32`
   - `NEXTAUTH_URL` — URL deployment Vercel
4. Deploy

## Lisensi

Metuah Hub — The 12th UTU Awards 2026
