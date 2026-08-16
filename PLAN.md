# Acelora — Competition Implementation Plan
**Target: Kompetisi Desain Toko Online 2025**

---

## 🎯 Competition Criteria Mapping

| Judging Aspect | Weight | Our Strategy |
|----------------|--------|--------------|
| **Desain Antarmuka (UI)** | 25% | Design system, visual hierarchy, micro-interactions, dark mode |
| **Pengalaman Pengguna (UX)** | 25% | Flow efficiency, accessibility, responsive, error handling |
| **Kreativitas & Inovasi** | 20% | Parallax hero, traceability, 3D globe, smart recommendations |
| **Implementasi Teknis** | 20% | Next.js 16 App Router, RSC, TS strict, performance, testing |
| **Kelengkapan Fitur** | 10% | Full e-commerce cycle: browse → cart → checkout → orders |

---

## 📅 Phase 1: Foundation & Polish (Week 1) — *Must Have*

### 1.1 SEO & Metadata Excellence
- [ ] `generateStaticParams` + `generateMetadata` untuk `/products/[id]`
- [ ] Dynamic OG images dengan `@vercel/og` untuk produk
- [ ] `sitemap.ts` + `robots.ts` otomatis
- [ ] JSON-LD structured data (Product, Breadcrumb, Organization)

### 1.2 Performance Optimization
- [ ] Next/Image: AVIF/WebP, proper sizes, priority hero image
- [ ] Font optimization: `next/font` dengan `display: swap`, preload
- [ ] Code splitting: dynamic imports untuk heavy components (Globe, Charts)
- [ ] Bundle analysis: `@next/bundle-analyzer`

### 1.3 Accessibility (WCAG 2.1 AA)
- [ ] Semantic HTML audit (landmarks, headings hierarchy)
- [ ] Focus visible states semua interactive elements
- [ ] ARIA labels untuk icon-only buttons
- [ ] Color contrast verification (text 4.5:1, UI 3:1)
- [ ] Skip to main content link
- [ ] Reduced motion: disable parallax/animations properly

---

## 📅 Phase 2: Core UX Features (Week 1-2) — *High Impact*

### 2.1 Product Discovery Enhancement
- [ ] **Faceted filters**: Price range slider, weight, origin, certification badges
- [ ] **Sort options**: Terbaru, Termurah, Termahal, Terlaris, Rating
- [ ] **URL sync**: Filter/sort/search di URL (shareable, browser back works)
- [ ] **Infinite scroll** dengan IntersectionObserver + React Query
- [ ] **Empty states** yang helpful (illustration + CTA)

### 2.2 Product Detail — *Showcase Page*
- [ ] **Image gallery**: Thumbnail strip, zoom on hover, keyboard nav
- [ ] **Variant selector**: Weight/Size dengan price update real-time
- [ ] **Stock indicator**: "Sisa 3 — Pesan cepat!" urgency
- [ ] **Traceability card**: Asal, petani/nelayan, sertifikasi (UI ready, data model exists)
- [ ] **Reviews & Ratings**: Display + submit (auth required)
- [ ] **Related products**: "Customers also viewed" (collaborative filtering sederhana)
- [ ] **Share button**: Web Share API + fallback copy link

### 2.3 Cart & Checkout Polish
- [ ] **Persistent cart**: localStorage → sync ke server saat login
- [ ] **Mini cart drawer**: Slide-in dari kanan (Navbar cart icon)
- [ ] **Quantity stepper**: Keyboard accessible, max = stock
- [ ] **Guest checkout**: Email-only, create account optional after
- [ ] **Address autocomplete**: Google Places / Nominatim integration
- [ ] **Payment method**: Midtrans Snap (sudah ada) + visual feedback
- [ ] **Order confirmation**: Email template + printable invoice

### 2.4 Wishlist / Save for Later
- [ ] Heart icon di ProductCard & ProductDetail
- [ ] Wishlist page: grid, move to cart, remove, share
- [ ] Persist di localStorage + sync ke DB saat login
- [ ] Email reminder: "Barang wishlist Anda diskto 10%"

---

## 📅 Phase 3: Innovation & Differentiation (Week 2-3) — *Winning Edge*

### 3.1 Traceability Storytelling (Unique to Acelora)
```tsx
// Komponen baru: src/components/product/TraceabilityTimeline.tsx
// Data: Product.origin, Product.legality[], Seller profile
// Visual: Vertical timeline dengan icons, foto ladang/kapal, sertifikasi
// Interaktif: Click sertifikasi → modal detail (Halal, SNI, Organic)
```

### 3.2 3D Product Viewer (Three.js)
```tsx
// src/components/product/Product3DViewer.tsx
// GLTF/USDZ models untuk kopi, rempah, kemasan
// Fallback: 360° image sequence (spritesheet)
// AR Quick Look support untuk iOS Safari
```

### 3.3 Export Routes Globe (react-globe.gl)
```tsx
// src/components/sections/ExportGlobe.tsx
// Data: Order.address.country → aggregate → arc lines dari Aceh
// Visual: Animated arcs, pulse dots, country hover tooltip
// Story: "Dari Aceh ke Dunia" — compelling untuk juri
```

### 3.4 Smart Recommendations
```typescript
// Simple collaborative filtering:
// "Users who bought X also bought Y"
// Based on OrderItem co-occurrence matrix
// Update nightly via cron / server action
```

---

## 📅 Phase 4: Admin & Seller Features (Week 2) — *Completeness*

### 4.1 Admin Dashboard Polish
- [ ] **Analytics overview**: Revenue chart (Recharts), conversion funnel
- [ ] **Product approval queue**: Image preview, one-click approve/reject
- [ ] **User management**: Role toggle, suspend, export CSV
- [ ] **Order management**: Status workflow, print shipping label

### 4.2 Seller Dashboard (PARTNER role)
- [ ] **My Products**: CRUD dengan drag-drop image upload
- [ ] **Sales analytics**: Revenue, units, top products
- [ ] **Order fulfillment**: Update status → SIAP KIRIM → DIKIRIM
- [ ] **Payout summary**: Pendapatan, fee platform, saldo tarik

---

## 📅 Phase 5: Quality Assurance (Week 3) — *No Regression*

### 5.1 Testing
```bash
# Unit tests (Vitest + Testing Library)
npm i -D vitest @testing-library/react @testing-library/user-event jsdom
# Test: store actions, validation schemas, utility functions, hooks

# E2E tests (Playwright)
npm i -D @playwright/test
# Critical paths:
# 1. Guest → browse → cart → checkout (guest) → order success
# 2. Login → add address → checkout → payment → order detail
# 3. Admin login → approve product → verify on frontend
# 4. Responsive: mobile, tablet, desktop viewports
```

### 5.2 Lighthouse Audit (Target > 90 all categories)
- [ ] Performance: < 2.5s LCP, < 100ms INP, < 0.1 CLS
- [ ] Accessibility: 100
- [ ] Best Practices: 100
- [ ] SEO: 100

### 5.3 Cross-browser & Device Testing
- [ ] Chrome, Firefox, Safari, Edge (latest 2 versions)
- [ ] iOS Safari (iPhone 14/15), Chrome Android
- [ ] Tablet: iPad, Android tablet

---

## 📅 Phase 6: Documentation & Presentation (Week 3) — *Judge Ready*

### 6.1 Technical Documentation
- [ ] `ARCHITECTURE.md`: System design, data flow, decisions
- [ ] `DESIGN_SYSTEM.md`: Colors, spacing, components, tokens
- [ ] `API_DOCS.md`: Endpoints, request/response examples
- [ ] `DEPLOYMENT.md`: Vercel, Supabase, env vars, troubleshooting

### 6.2 Competition Presentation Assets
- [ ] **Demo video** (2-3 min): Walkthrough fitur utama + innovations
- [ ] **Slide deck** (10 slides): Problem → Solution → Tech → Innovation → Impact
- [ ] **Live demo URL** di Vercel (production build)
- [ ] **GitHub repo** clean: commits meaningful, no secrets, README updated

---

## 🎯 Priority Matrix (MoSCoW)

| Must Have (Week 1) | Should Have (Week 2) | Could Have (Week 2-3) | Won't This Round |
|--------------------|----------------------|----------------------|------------------|
| Static gen product pages | Faceted filters | 3D Product Viewer | Multi-vendor marketplace |
| SEO metadata + JSON-LD | Wishlist | Export Globe | Real-time chat |
| Accessibility audit | Reviews/Ratings | Smart Recs | Loyalty points |
| Performance optimization | Guest checkout | AR Quick Look | Subscription |
| Cart persistence | Address autocomplete | Seller dashboard | Multi-currency |
| Mini cart drawer | Order invoice PDF | Admin analytics | PWA install prompt |

---

## 🛠️ Technical Debt to Fix

```typescript
// 1. Replace raw fetch di ProductsPage dengan React Query
// 2. Add proper error boundaries per section
// 3. Zod schemas untuk semua API inputs
// 4. Rate limiting pada API routes (Upstash/Redis)
// 5. Centralized toast system (Sonner)
// 6. Loading skeletons match actual layout
// 7. Remove console.log production
// 8. Optimize ParallaxHero: use Lenis scroll value, not raw scroll event
```

---

## 📦 Dependencies to Add

```json
{
  "dependencies": {
    "@vercel/og": "^0.6.0",           // Dynamic OG images
    "sonner": "^1.5.0",               // Toast notifications
    "recharts": "^2.12.0",            // Admin charts
    "date-fns": "^3.6.0",             // Date formatting
    "zod": "^3.22.0"                  // Already have
  },
  "devDependencies": {
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "@playwright/test": "^1.45.0",
    "@next/bundle-analyzer": "^14.0.0"
  }
}
```

---

## ✅ Definition of Done per Feature

- [ ] TypeScript strict: no `any`, no `@ts-ignore`
- [ ] Responsive: 375, 768, 1024, 1440 breakpoints tested
- [ ] Dark mode: works, no flash, persists
- [ ] Accessibility: keyboard navigable, screen reader tested
- [ ] Reduced motion: animations disabled via media query
- [ ] Error states: user-friendly, retry action
- [ ] Loading states: skeleton matches content
- [ ] Tests: unit + e2e for critical path
- [ ] Lighthouse: > 90 all categories
- [ ] Documentation: README + code comments

---

## 🚀 Start Next Session

**Immediate next steps (priority order):**

1. **Static Generation + SEO** untuk product pages — *foundation untuk performance & SEO score*
2. **Faceted Filters + URL Sync** — *core UX untuk product discovery*
3. **Reviews & Ratings** — *trust signal, competition expectation*
4. **Wishlist** — *standard e-commerce feature*
5. **Traceability Timeline UI** — *differentiation, storytelling*
6. **3D Globe Export Routes** — *visual wow factor*
7. **Testing + Lighthouse Audit** — *quality gate*

---

*Plan ini living document — update saat progress.*