# Acelora E-Commerce Transformation Design

## Overview
Transform Acelora from an agro-maritime startup landing page into a full e-commerce platform with Stripe payment integration. Keep the same agro-maritime products (coffee, spices, seafood, patchouli, processed goods) but add complete shopping flow.

## Architecture

### Tech Stack
- Next.js 16 (App Router)
- Prisma 7 + PostgreSQL (Supabase)
- Stripe Checkout Sessions (payment)
- Zustand (cart state)
- TailwindCSS (styling)
- next-auth v5 (auth)

### Stripe Integration
- Stripe Checkout Sessions (redirect-based, PCI-compliant)
- Webhook (`/api/webhook/stripe`) for async payment confirmation
- Products stored in DB, not synced to Stripe catalog (dynamic pricing)

## Database Schema Changes

### Modified: Product
```prisma
model Product {
  // existing... (id, name, category, description, origin, status, ownerId)
  price      Int      @default(0)     // in IDR cents (Rp)
  compareAt  Int?                      // original price for discount display
  stock      Int      @default(0)
  weight     Float?                     // in grams, for shipping calc
  images     String[]                  // array of image URLs
}
```

### New: Order
```prisma
model Order {
  id              String   @id @default(cuid())
  userId          String
  status          OrderStatus  @default(PENDING)
  total           Int          // total in IDR cents
  shippingCost    Int          @default(0)
  addressId       String
  stripeSessionId String?     @unique
  stripePaymentId String?
  paidAt          DateTime?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  user    User       @relation(fields: [userId], references: [id])
  items   OrderItem[]
  address Address    @relation(fields: [addressId], references: [id])
  
  @@map("orders")
}

model OrderItem {
  id        String @id @default(cuid())
  orderId   String
  productId String
  quantity  Int
  price     Int    // snapshot price at purchase

  order   Order   @relation(fields: [orderId], references: [id])
  product Product @relation(fields: [productId], references: [id])

  @@map("order_items")
}

enum OrderStatus {
  PENDING
  PAID
  PROCESSING
  SHIPPING
  DELIVERED
  CANCELLED
}
```

### New: Address
```prisma
model Address {
  id         String  @id @default(cuid())
  userId     String
  label      String?  // "Home", "Office"
  name       String
  phone      String
  street     String
  city       String
  province   String
  postalCode String
  isDefault  Boolean  @default(false)

  user   User    @relation(fields: [userId], references: [id])
  orders Order[]

  @@map("addresses")
}
```

### Removed Models
- `Mentoring` + `MentoringType` + `MentoringStatus` — startup content, not needed
- `Partner` + `PartnerCategory` — startup content, not needed

### Modified: User
Add `addresses` relation (already exists via implicit relation — just add `address Address[]` field).

## Pages

### Stripped Pages (remove content or redirect)
- `/mentoring` → removed
- `/partners` → removed
- `/business` → removed
- `/team` → removed
- `/about` → removed
- `/contact` → removed
- Dashboard: mentoring tab removed, partners tab removed
- Admin: partners tab removed
- All startup sections from homepage (DashboardPreview, MarketPrices, Mentoring, InternationalPartner, Workflow, Financial, Team, WorldGlobe) → removed

### Modified Pages
- `/` — e-commerce homepage: hero banner → featured products → categories → CTA
- `/products` — add price, stock, add-to-cart button
- `/products/[id]` — full detail with price slider, quantity selector, add to cart
- Dashboard → My Orders instead of startup metrics
- Admin → Manage Orders tab

### New Pages
- `/cart` — cart items, quantity adjust, subtotal, checkout button
- `/checkout` — address form, order summary, pay with Stripe
- `/checkout/success` — order confirmation
- `/orders` — user order history
- `/orders/[id]` — single order detail + status tracking

## API Routes

### New
| Route | Method | Description |
|-------|--------|-------------|
| `/api/orders` | GET | List user orders |
| `/api/orders` | POST | Create order → create Stripe session → return URL |
| `/api/orders/[id]` | GET | Order detail |
| `/api/orders/[id]` | PATCH | Update status (admin only) |
| `/api/addresses` | GET | List user addresses |
| `/api/addresses` | POST | Create address |
| `/api/addresses/[id]` | PATCH | Update address |
| `/api/addresses/[id]` | DELETE | Delete address |
| `/api/webhook/stripe` | POST | Stripe webhook endpoint |

### Modified
- `GET /api/products` — include price, stock, images, `inStock` flag
- `POST /api/products` — accept price, stock, weight

## Payment Flow (Stripe Checkout)

```
1. User adds items to cart (Zustand store)
2. User goes to /cart → reviews items → clicks Checkout
3. /checkout → fill shipping address
4. Click "Pay" → POST /api/orders
   a. Create Order (status PENDING) + OrderItems in DB
   b. Create Stripe Checkout Session (line_items from cart)
   c. Return sessionUrl
   d. Redirect user to Stripe
5. User pays on Stripe hosted page
6. Stripe sends webhook checkout.session.completed → /api/webhook/stripe
   a. Lookup order by stripeSessionId
   b. Update status → PAID, save stripePaymentId, set paidAt
   c. Decrement product stock
7. User returns to /checkout/success?session_id=xxx
   a. Verify session → show confirmation + order summary
```

## Cart (Zustand Store)
```typescript
interface CartItem {
  productId: string
  name: string
  price: number    // cents
  image: string
  quantity: number
  stock: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, qty: number) => void
  clearCart: () => void
  totalItems: () => number
  subtotal: () => number
}
```

## Navigation Changes

### Navbar
- Removed: Mentoring, Partners, Business, Team, About, Contact
- Added: Cart icon with badge (count)
- Kept: Products (now main nav), Home, Language switcher, Theme toggle, Login/Profile

### Dashboard Sidebar
- Removed: My Mentoring, Partners
- Added: My Orders (ganti ikon)
- Admin: Added Manage Orders

## Component Changes (what to strip)

### Delete entire files:
- `src/components/sections/DashboardPreview.tsx`
- `src/components/sections/Financial.tsx`
- `src/components/sections/InternationalPartner.tsx`
- `src/components/sections/MarketPrices.tsx`
- `src/components/sections/Mentoring.tsx`
- `src/components/sections/Team.tsx`
- `src/components/sections/Workflow.tsx`
- `src/components/sections/WorldGlobe.tsx`
- `src/components/dashboard/MarketWidget.tsx`
- `src/components/ChatBot.tsx`
- `src/components/ChatBotWrapper.tsx`
- `src/components/DashboardChatBot.tsx`

### Modify:
- `src/components/sections/Hero.tsx` → simplify to e-commerce hero banner
- `src/components/sections/ProductCatalog.tsx` → add price, add-to-cart
- `src/components/layout/Navbar.tsx` → simplify menu, add cart icon
- `src/components/layout/Sidebar.tsx` → update dashboard menu

### New components:
- `src/components/cart/CartItem.tsx` — single cart line item
- `src/components/cart/CartSummary.tsx` — subtotal/total display
- `src/components/checkout/AddressForm.tsx` — shipping address form
- `src/components/checkout/PaymentButton.tsx` → Stripe redirect button
- `src/components/orders/OrderCard.tsx` — order list card

## Environment Variables
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Seed Data Update
- Add `price`, `stock`, `weight` to seed products
- Remove Mentoring and Partner seeds
- Add sample Indonesian addresses for test users

## Constants / i18n Changes
- Remove i18n keys for: mentoring, partners, business, team, about sections, workflow, financial, market prices
- Add i18n keys for: cart, checkout, orders, shipping
- Update constants/menu.ts to remove startup menu items
- Update constants/products.ts to include price/stock metadata

## Files to Update (full list)
1. `prisma/schema.prisma` — add Order, OrderItem, Address; add fields to Product; remove Mentoring, Partner
2. `prisma/seed.ts` — update seed data
3. `src/types/index.ts` — add Order, OrderItem, Address, CartItem types
4. `src/constants/config.ts` — update APP_DESCRIPTION, NAV_ITEMS
5. `src/constants/menu.ts` — remove startup menus
6. `src/constants/products.ts` — update category/sample product interfaces
7. `src/navigation/routes.ts` — add new routes
8. `src/app/layout.tsx` — update metadata
9. `src/app/page.tsx` — new homepage
10. `src/app/sitemap.ts` — update
11. `src/app/(auth)/login/page.tsx` — minor UI updates if needed
12. `src/app/(dashboard)/layout.tsx` — update sidebar
13. `src/app/(dashboard)/dashboard/page.tsx` — order overview
14. `src/app/(dashboard)/dashboard/mentoring/page.tsx` → delete
15. `src/app/(dashboard)/dashboard/partners/page.tsx` → delete
16. `src/app/(dashboard)/dashboard/orders/page.tsx` → new
17. `src/app/(dashboard)/dashboard/orders/[id]/page.tsx` → new
18. `src/app/(dashboard)/dashboard/admin/page.tsx` — update
19. `src/app/(dashboard)/dashboard/admin/orders/page.tsx` → new
20. `src/app/(dashboard)/admin/page.tsx` → delete or redirect
21. `src/app/api/products/route.ts` — update
22. `src/app/api/products/[id]/route.ts` — update
23. `src/app/api/orders/route.ts` → new
24. `src/app/api/orders/[id]/route.ts` → new
25. `src/app/api/addresses/route.ts` → new
26. `src/app/api/addresses/[id]/route.ts` → new
27. `src/app/api/webhook/stripe/route.ts` → new
28. `src/app/api/partners/route.ts` → delete
29. `src/app/api/mentoring/route.ts` → delete
30. `src/app/api/market-prices/route.ts` → delete
31. `src/app/api/chat/` → delete
32. `src/app/(auth)/register/page.tsx` — keep, minor updates (add address?)
33. `src/app/products/page.tsx` — update
34. `src/app/products/[id]/page.tsx` — update
35. `src/app/cart/page.tsx` → new
36. `src/app/checkout/page.tsx` → new
37. `src/app/checkout/success/page.tsx` → new
38. `src/app/orders/page.tsx` → new
39. `src/app/orders/[id]/page.tsx` → new
40. `src/components/layout/Navbar.tsx` — update
41. `src/components/layout/Footer.tsx` — update (remove dead links)
42. `src/components/layout/Sidebar.tsx` — update
43. `src/components/sections/Hero.tsx` — simplify
44. `src/components/sections/ProductCatalog.tsx` — update
45. `src/store/product.store.ts` — update (add price/stock)
46. `src/store/cart.store.ts` → new (Zustand cart store)
47. `src/services/product.service.ts` — update
48. `src/lib/i18n/en.ts` — update keys
49. `src/lib/i18n/id.ts` — update keys
50. Delete ~10 component files (DahsboardPreview, Financial, etc.)
51. `next.config.ts` — no changes needed (already has remote images)
52. `package.json` — add `stripe` dependency
