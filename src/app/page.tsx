import Link from 'next/link'
import { ShoppingBag, ArrowRight, Coffee, Leaf, Fish, Flame, Factory, Package as Pkg } from 'lucide-react'
import Image from 'next/image'
import ParallaxHero from '@/components/ParallaxHero'
import { getServerTranslations } from '@/lib/i18n'
import { cookies } from 'next/headers'
import ExportGlobe from '@/components/sections/ExportGlobe'

const categoryIcons: Record<string, any> = { COFFEE: Coffee, PATCHOULI: Leaf, SEAFOOD: Fish, SPICES: Flame, PROCESSED: Factory }

const FALLBACK_CATEGORIES = [
  { category: 'COFFEE', count: 12 },
  { category: 'PATCHOULI', count: 8 },
  { category: 'SEAFOOD', count: 15 },
  { category: 'SPICES', count: 5 },
  { category: 'PROCESSED', count: 3 },
]

const FALLBACK_PRODUCTS = [
  {
    id: 'fallback-1',
    name: 'Kopi Arabika Gayo Specialty',
    category: 'COFFEE',
    origin: 'Aceh Tengah',
    image: '/images/kopi_arabica.png',
    price: 120000,
    stock: 5,
  },
  {
    id: 'fallback-2',
    name: 'Minyak Nilam Aceh Grade A',
    category: 'PATCHOULI',
    origin: 'Aceh Selatan',
    image: '/images/PatchouliOil.png',
    price: 450000,
    stock: 3,
  },
  {
    id: 'fallback-3',
    name: 'Udang Vannamei Segar Aceh',
    category: 'SEAFOOD',
    origin: 'Aceh Timur',
    image: '/images/VannameiShrimp.png',
    price: 55000,
    stock: 10,
  },
  {
    id: 'fallback-4',
    name: 'Lada Hitam Aceh Premium',
    category: 'SPICES',
    origin: 'Aceh Jaya',
    image: '/images/ladahitamAceh.png',
    price: 35000,
    stock: 7,
  },
]

// Fast TCP connectivity check (5s timeout) — no Prisma hang if DB down
function dbReachable(): Promise<boolean> {
  const url = process.env.DATABASE_URL || ''
  const match = url.match(/postgres(?:ql)?:\/\/[^:]+:[^@]*@([^:]+):(\d+)/)
  if (!match) return Promise.resolve(false)
  const host = match[1]
  const port = parseInt(match[2], 10)
  return new Promise((resolve) => {
    const net = require('node:net')
    const socket = new net.Socket()
    const timeout = setTimeout(() => { socket.destroy(); resolve(false) }, 5000)
    socket.once('connect', () => { clearTimeout(timeout); socket.destroy(); resolve(true) })
    socket.once('error', () => { clearTimeout(timeout); resolve(false) })
    socket.connect(port, host)
  })
}

async function getData() {
  const reachable = await dbReachable()
  if (!reachable) return { products: FALLBACK_PRODUCTS, categories: FALLBACK_CATEGORIES }

  try {
    const { prisma } = await import('@/lib/prisma')
    const [products, cats] = await Promise.all([
      prisma.product.findMany({ where: { status: 'APPROVED', stock: { gt: 0 } }, orderBy: { createdAt: 'desc' }, take: 4 }),
      prisma.product.groupBy({ by: ['category'], _count: true, where: { status: 'APPROVED' } }),
    ])
    return {
      products: products.map(p => ({ id: p.id, name: p.name, category: p.category, description: p.description, image: p.image, origin: p.origin, price: p.price, stock: p.stock })),
      categories: cats.map(c => ({ category: c.category, count: c._count })),
    }
  } catch {
    return { products: FALLBACK_PRODUCTS, categories: FALLBACK_CATEGORIES }
  }
}

export default async function HomePage() {
  const { products, categories } = await getData()
  const t = getServerTranslations((await cookies()).get('i18n-lang')?.value as any)

  return (
    <main>
      <ParallaxHero />

      {/* Categories */}
      <section className="py-20 px-4 max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 mb-3">{t.hero.category}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{t.hero.exploreTitle}</h2>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">{t.hero.exploreDesc}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map(({ category, count }, i) => {
            const Icon = categoryIcons[category] || Pkg
            return (
              <Link
                key={category}
                href={`/products?category=${category}`}
                className="group flex flex-col items-center p-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300"
              >
                <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={28} />
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{category.toLowerCase()}</span>
                <span className="text-xs text-gray-400 mt-1">{t.hero.productCount.replace('{count}', String(count))}</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Export Globe - New Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-ocean-50 dark:bg-ocean-900/20 text-ocean-600 dark:text-ocean-400 mb-3">Ekspor Global</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Dari Aceh ke Dunia</h2>
          <p className="text-gray-500 mt-2 max-w-lg mx-auto">
            Jelajahi bagaimana produk khas Aceh didistribusikan ke pasar internasional, membawa kualitas dan warisan budaya Aceh ke seluruh dunia.
          </p>
        </div>
        <ExportGlobe />
      </section>

      {/* CTA */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-500 to-ocean-600" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0L60 30L30 60L0 30Z\' fill=\'%23ffffff\' fill-opacity=\'0.1\'/%3E%3C/svg%3E")', backgroundSize: '30px 30px' }} />
        <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t.hero.ctaTitle}</h2>
          <p className="text-primary-100/90 mb-8 max-w-lg mx-auto">{t.hero.ctaDesc}</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-primary-700 font-semibold hover:bg-primary-50 hover:scale-105 transition-all duration-300 shadow-xl shadow-black/10">
            <ShoppingBag size={20} /> {t.hero.cta} <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </main>
  )
}