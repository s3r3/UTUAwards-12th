# Acelora — Improvement Plan for Competition

> Target: 5 judging criteria
> - Orisinalitas & Kreativitas
> - Relevansi Pertanian & Kelautan
> - Tata Letak & Tipografi
> - Desain Antarmuka Web
> - Fungsionalitas

---

## Phase 1: Cleanup + Critical Fixes

### 1.1 Remove 3D Globe
- Uninstall `react-globe.gl`, `three`, `@types/three`
- Remove any globe-related code from landing page
- Remove unused assets

### 1.2 Fix staggerChildren Bug
- `SourcingRegions.tsx` — add variants pattern or remove staggerChildren
- `CategoryChoiceSection.tsx` — same fix
- Root cause: `staggerChildren` without `variants` = dead code

### 1.3 Unified Spacing Scale
- All landing sections use `py-24 px-6 md:px-12`
- `BestSellersSection` currently uses `py-16 px-8 md:px-16` → align

### 1.4 Loading Skeletons
- Add `Skeleton` variants: CardSkeleton, ImageSkeleton, TextSkeleton
- Apply to product sections and map page

---

## Phase 2: Landing Page Enhancements + WOW Factors

### 2.1 Stats Counter Section
- "500+ Local Partners | 50+ Products | 98% Satisfaction | 24h Delivery"
- Framer Motion count-up animation
- Position: Between BrandBanner and ProductShowcase

### 2.2 Scroll Story: "From Ocean to Table"
- GSAP ScrollTrigger-driven parallax story
- 4-5 layers: ocean waves → fisherman → product floating → kitchen/table
- Position: Between ParallaxImage and ProductShowcase
- Data: SVG waves (inline), silhouette (Unsplash/SVG), storyset.com

### 2.3 3D Product Card Tilt
- Mouse-driven perspective tilt
- Shadow follows tilt direction
- Vanilla JS + CSS transform
- Apply: BestSellersSection, ProductShowcase

### 2.4 Aceh Cultural Pattern Overlay
- SVG pattern inspired by Acehnese motifs (kawung/ukiran)
- Animated draw-on-scroll
- Apply as subtle background to BrandBanner or SourcingRegions

### 2.5 Sound Toggle
- Ambient ocean/farm sounds
- Speaker icon in navbar
- ON/OFF toggle
- Audio source: freesound.org or Web Audio API

### 2.6 Harvest Calendar Mini-Section
- Visual calendar: current season products
- "Bulan ini: Kakao, Cengkeh, Ikan Tuna"

### 2.7 Newsletter CTA Banner
- Full-width banner before Footer
- "Dapatkan update musiman"
- Email input + submit

### 2.8 Sustainability Badges
- "Carbon neutral shipping"
- "100% locally sourced"
- "Supporting 500+ local families"

### 2.9 SourcingRegions v2
- Visual cards with background images
- Icons: Sprout (highlands), Anchor (Malacca), Waves (Indian Ocean)
- Hover reveal: products from region
- Partner village names

### 2.10 Button Press Effect
- `active:scale-95` on all CTAs

### 2.11 Scroll Progress Indicator
- Fixed bar at top of page
- Gradient: primary → ocean

---

## Phase 3: New Page — Regional Showcase Map (`/map`)

### Layout
```
┌──────────────────────────────────────────────┐
│  Header: "Jelajahi Sumber Kami"              │
├────────────────┬─────────────────────────────┤
│                │  Region Info Card            │
│  LEAFLET MAP   │  - Weather Widget           │
│  - Markers     │  - Products from region    │
│  - Fishing     │  - News feed                │
│  - Ag zones    │  - Partner badge            │
│                │                              │
└────────────────┴─────────────────────────────┘
```

### Features
- Leaflet map (already in deps)
- Click markers → region info card
- Weather widget (Open-Meteo API — free, no key)
- Mock regional data
- News feed per region (mock articles)
- Partner badge with village name

### Files to Create
- `src/app/map/page.tsx`
- `src/components/map/RegionalMap.tsx`
- `src/components/map/RegionCard.tsx`
- `src/components/map/WeatherWidget.tsx`
- `src/components/map/RegionNews.tsx`
- `src/data/regions.ts`

### Data Sources
- Weather: https://api.open-meteo.com/ (free, no key)
- Map tiles: OpenStreetMap
- Regional data: mock in `regions.ts`

---

## Phase 4: Product Page Enhancements

### 4.1 Quick View Modal
- Click product card → modal preview
- No page navigation

### 4.2 Cart Fly Animation
- Item animates to cart icon on add

### 4.3 Stock Urgency Badge
- "Hanya X lagi!" if stock < 10

### 4.4 Related Products
- Based on region/season

---

## Phase 5: Chat Widget Polish

### 5.1 Typing Indicator
- Animated dots: "Ara sedang mengetik..."

### 5.2 Quick Reply Suggestions
- Suggested prompts

---

## Data Sources

| Data | Source |
|------|--------|
| Ambient sounds | https://freesound.org/ |
| Acehnese pattern SVG | Create or aceh.go.id |
| Unsplash images | https://unsplash.com/ |
| Weather | https://api.open-meteo.com/ |
| Regional data | Mock in `data/regions.ts` |
| News articles | Mock data |
| Illustrations | https://storyset.com/ |
| Public APIs | https://github.com/public-apis/public-apis |

---

## Implementation Order

```
Task #7 — Phase 1: Cleanup + Critical Fixes
  ├── 1.1 Remove 3D globe
  ├── 1.2 Fix staggerChildren bug
  ├── 1.3 Unified spacing
  └── 1.4 Loading skeletons

Task #8 — Phase 2: Quick Wins + WOW Factors
  ├── 2.1 Stats counter
  ├── 2.2 Scroll story
  ├── 2.3 3D card tilt
  ├── 2.4 Cultural pattern
  ├── 2.5 Sound toggle
  ├── 2.6 Harvest calendar
  ├── 2.7 Newsletter CTA
  ├── 2.8 Sustainability badges
  ├── 2.9 SourcingRegions v2
  ├── 2.10 Button press effect
  └── 2.11 Scroll progress indicator

Task #9 — Phase 3: Map Page
  ├── 3.1 Create map page structure
  ├── 3.2 RegionalMap component
  ├── 3.3 Weather widget
  ├── 3.4 RegionCard
  ├── 3.5 RegionNews
  └── 3.6 Regional data

Task #10 — Phase 4 + 5: Polish
  ├── 4.1 Quick view modal
  ├── 4.2 Cart fly animation
  ├── 4.3 Stock urgency
  ├── 4.4 Related products
  ├── 5.1 Typing indicator
  └── 5.2 Quick replies
```

---

## Notes
- All animations respect `prefers-reduced-motion`
- Dark mode support for all new components
- Mobile-first responsive design
- Performance: lazy load images, optimize animations
