# i18n Coverage Audit: Acelora Landing Page

## i18n Source Files

**src/lib/i18n/id.ts** — Indonesian translations with keys: nav, hero, products, cart, checkout, success, orders, footer, auth, dashboard, common

**src/lib/i18n/en.ts** — English translations with identical key structure + `Translations` type export

**Usage pattern**: Components should import `useTranslation` from `next-i18next` (or similar) and call `t('key')`. None of the landing components currently use this.

---

## Component-by-Component Audit

| Component | Hardcoded Strings Count | i18n'd Count | Mixed-Language? | Verdict |
|---|---|---|---|---|
| **TopLifestyleBanner** | 1 (alt: "People gathering for a meal") | 0 | No (single-language alt) | FAIL |
| **HeroVideo** | 5 ("From Our Land & Sea", "Harvested to Perfection", "Premium farm produce & seafood...", "Explore Our Products", "Taste the Ocean") | 0 | Yes — references "Aceh" (Indonesian region) in English text | FAIL |
| **BestSellersSection** | 3+ ("Acelora", "SHOP ALL", "COMING SOON!") | 0 | No (all English, data-driven product fields) | FAIL |
| **AboutPreviewSection** | 4 ("FROM LAND TO TABLE", "UNCOMPROMISING FRESHNESS", body paragraph, "Learn More") | 0 | No (all English) | FAIL |
| **BrandBanner** | 7 ("Our Promise", "From Land & Sea, to Your Table", body pillar texts, "Organic Land"/"Pristine Sea"/"Local First") | 0 | Yes — "Aceh's" appears in VALUE pillar texts (Indonesian region in English) | FAIL |
| **CategoryChoiceSection** | 6+ ("Land or Sea", "Not sure which is best...", "FRESH FROM THE FARM", "WILD CAUGHT SEAFOOD", 2 alt texts) | 0 | Yes — "Aceh's highlands", "Strait of Malacca", "Indian Ocean" in English text | FAIL |
| **SourcingRegions** | 7 ("SOURCED DIRECTLY FROM...", "ACEH HIGHLANDS", "MALACCA STRAIT", "INDIAN OCEAN", "Organic Farms", "Coastal Fisheries", "Deep Sea Catch") | 0 | Yes — all region names are Indonesian places displayed in English | FAIL |
| **ProductShowcase** | 6+ ("Our Collection", "Two Worlds, One Table", body, "Organic & Pesticide-Free", "Cold-Chain Fresh", "Discover") | 0 | No (all English) | FAIL |
| **BottomLifestyleBanner** | 1 (alt: "People relaxing with food") | 0 | No | FAIL |
| **Footer** | 11 (testimonial quote, author, mission text, "LET'S TALK FRESH:", email, INSTAGRAM, placeholder, "ACELORA © 2026", "PRIVACY POLICY", "TERMS OF SERVICE", "SITE BY KANASA") | 0 | No | FAIL |

**Summary**: 0 of 10 components have i18n'd strings. All FAIL.

---

## Font Consistency Observation

No component has bilingual text, so there is no "font varies between languages in the same component" scenario. Current font classes per component:

- **TopLifestyleBanner**: `font-serif-display` (h1), `text-base font-medium uppercase` (p)
- **HeroVideo**: `font-serif-display` (h1), `text-base font-light` (p)
- **BestSellersSection**: `font-serif text-sm font-bold uppercase tracking-widest` (product name), price/variant in `text-xs uppercase`
- **AboutPreviewSection**: `font-playfair, Georgia, serif` (h2), `text-base leading-relaxed` (p), `font-serif text-sm font-medium uppercase tracking-[0.3em]` (tag)
- **BrandBanner**: `font-serif text-4xl md:text-5xl lg:text-6xl` (h2), `text-lg text-teal-50/80 font-light leading-relaxed` (p), `text-xl font-serif font-semibold text-white tracking-wide` (h3)
- **CategoryChoiceSection**: `font-serif text-xl font-bold tracking-wider` (h3), `font-serif text-4xl md:text-5xl font-bold tracking-tight` (h2), `text-base leading-relaxed text-stone-600 font-light` (p)
- **SourcingRegions**: `font-serif text-2xl md:text-3xl text-emerald-900` (h3), `text-sm text-emerald-700` (p)
- **ProductShowcase**: `font-serif text-4xl md:text-5xl font-bold tracking-tight` (h2), badge in `inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium`, h3 in `font-serif text-3xl font-semibold text-white tracking-wide`, p in `text-sm text-stone-200 leading-relaxed`
- **Footer**: `font-serif text-3xl font-bold tracking-tight` (h1), `font-mono text-sm leading-relaxed` (p), `text-xs tracking-widest uppercase` (tags/links)

All font classes are component-internal and consistent within each component. No language-based font switching exists because no component uses i18n.

---

## Priority Fix List

1. **Add i18n to all landing components** — import `useTranslation` / `t()` and wrap every user-visible string with `t('key')`
2. **Populate id.ts/en.ts with landing-page keys** — map all 50+ hardcoded strings from the audit into both translation files (nav, hero, products, cart, checkout, success, orders, footer, auth, common keys already partially exist; add landing-specific keys)
3. **Replace hardcoded strings in components** — `TopLifestyleBanner` (alt), `HeroVideo` (5 strings), `BrandBanner` (7 strings incl. VALUE pillars), `SourcingRegions` (7 region names), `Footer` (11 strings)
4. **Fix mixed-language content** — e.g. HeroVideo's "Aceh" in English text, BrandBanner's "Aceh's volcanic highlands" in VALUE pillars, CategoryChoiceSection's Indonesian place names, SourcingRegions' all-Indonesian-region display
5. **Standardize font classes across language variants** — ensure `font-serif`, `font-script`, `font-mono` classes are consistent when both id and en render in the same component (ponytail: add language-aware font class logic if needed, upgrade path: detect `navigator.language` and apply `.id`/`.en` font variants)