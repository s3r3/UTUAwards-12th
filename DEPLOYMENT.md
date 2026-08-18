# Acelora — Deployment Guide

## 1. Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+
- PostgreSQL 15+ (local or Supabase)
- Vercel account (for production)

## 2. Setup Development

```bash
# 1. Clone repo
cd /home/xyconix11x/Ayid/xyconix11x/webdev/Lomba/meutuah

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Configure environment
cp .env.example .env
# Edit DATABASE_URL, NEXTAUTH_SECRET, etc.

# 4. Database setup
npx prisma db push
npx tsx prisma/seed.mjs

# 5. Run dev server
npm run dev
# → http://localhost:3000
```

## 3. Production Deployment

### 3.1 Vercel (Recommended)

1. Push code to GitHub
2. Import project to [vercel.com](https://vercel.com)
3. Set environment variables:
   - `DATABASE_URL` (Supabase connection string)
   - `NEXTAUTH_SECRET` (random 32+ chars)
   - `NEXTAUTH_URL` (production domain)
4. Deploy

### 3.2 Manual Deployment

```bash
# 1. Build
npm run build

# 2. Start
npm run start

# 3. Reverse proxy (Nginx example)
server {
  listen 80;
  server_name acelora.id;

  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

## 4. Database Setup

### 4.1 Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Copy connection string to `DATABASE_URL`
3. Run migrations:
   ```bash
   npx prisma db push
   npx tsx prisma/seed.mjs
   ```

### 4.2 Local PostgreSQL

```bash
# Create database
createdb acelora

# Set connection string in .env
DATABASE_URL="postgresql://user:pass@localhost:5432/acelora"
```

## 5. Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/acelora` |
| `NEXTAUTH_SECRET` | NextAuth encryption key | `random32chars` |
| `NEXTAUTH_URL` | Domain for auth callbacks | `https://acelora.id` |
| `STRIPE_SECRET_KEY` | Stripe API key | `sk_test_...` |
| `MIDTRANS_SERVER_KEY` | Midtrans API key | `SB-Mid-server-...` |

## 6. Monitoring & Maintenance

- **Logs**: Vercel dashboard or `npm run logs`
- **Performance**: Lighthouse CI (run via `npm run lighthouse`)
- **Backups**: Supabase backups or `pg_dump`

## 7. Troubleshooting

### 7.1 Common Issues

| Issue | Solution |
|-------|----------|
| `DATABASE_URL` not set | Verify `.env` file exists and is valid |
| Build errors | Run `npm run build` with `DATABASE_URL` set |
| Hydration errors | Wrap dynamic components in Suspense |
| Missing migrations | Run `npx prisma migrate dev` |

### 7.2 Debugging Commands

```bash
# Check database connection
npx prisma studio

# Run Lighthouse audit
npm run lighthouse

# Run tests
npm run test
```

## 8. CI/CD Pipeline

```yaml
# Example GitHub Actions workflow
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - run: npm run lighthouse
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```
