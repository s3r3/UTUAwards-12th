import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ShoppingBag, ArrowRight, Coffee, Leaf, Fish, Flame, Factory, Package as Pkg } from 'lucide-react'
import Image from 'next/image'
import ParallaxHero from '@/components/ParallaxHero'

const categoryIcons: Record<string, any> = { COFFEE: Coffee, PATCHOULI: Leaf, SEAFOOD: Fish, SPICES: Flame, PROCESSED: Factory }

async function getData() {
  const [products, cats] = await Promise.all([
    prisma.product.findMany({ where: { status: 'APPROVED', stock: { gt: 0 } }, orderBy: { createdAt: 'desc' }, take: 4 }),
    prisma.product.groupBy({ by: ['category'], _count: true, where: { status: 'APPROVED' } }),
  ])
  return { products: JSON.parse(JSON.stringify(products)), categories: cats.map(c => ({ category: c.category, count: c._count })) }
}

export default async function HomePage() {
  const { products, categories } = await getData()

  return (
    <main>
      <ParallaxHero />

      {/* Categories */}
      <section className="py-20 px-4 max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 mb-3">Kategori</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Jelajahi Koleksi</h2>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">Produk agro-maritim premium langsung dari Aceh</p>
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
                <span className="text-xs text-gray-400 mt-1">{count} produk</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 bg-gray-50/80 dark:bg-gray-900/40 relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-ocean-50 dark:bg-ocean-900/20 text-ocean-600 dark:text-ocean-400 mb-3">Produk Unggulan</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
              Lihat Semua <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {products.map((product: any) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 hover:shadow-xl hover:shadow-primary-500/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-[4/3] relative bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  {product.image && (
                    <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4">
                  <div className="text-[10px] font-medium text-primary-600 uppercase tracking-wider mb-1">{product.origin}</div>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate">{product.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-primary-600">Rp {product.price.toLocaleString('id-ID')}</span>
                    {product.stock <= 0 && <span className="text-[10px] text-red-500 font-medium">Habis</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold">
              Lihat Semua <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-500 to-ocean-600" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0L60 30L30 60L0 30Z\' fill=\'%23ffffff\' fill-opacity=\'0.1\'/%3E%3C/svg%3E")', backgroundSize: '30px 30px' }} />
        <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Siap Menjelajah Produk Premium Aceh?</h2>
          <p className="text-primary-100/90 mb-8 max-w-lg mx-auto">Terhubung langsung dengan produsen lokal dan nikmati cita rasa autentik dari jantung Aceh.</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-primary-700 font-semibold hover:bg-primary-50 hover:scale-105 transition-all duration-300 shadow-xl shadow-black/10">
            <ShoppingBag size={20} /> Belanja Sekarang <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </main>
  )
}
