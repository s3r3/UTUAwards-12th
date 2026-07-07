import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ShoppingBag, ArrowRight, Coffee, Leaf, Fish, Flame, Factory, Package as Pkg } from 'lucide-react'
import Image from 'next/image'

const categoryIcons: Record<string, any> = { COFFEE: Coffee, PATCHOULI: Leaf, SEAFOOD: Fish, SPICES: Flame, PROCESSED: Factory }

async function getData() {
  const products = await prisma.product.findMany({ where: { status: 'APPROVED', stock: { gt: 0 } }, orderBy: { createdAt: 'desc' }, take: 4 })
  const cats = await prisma.product.groupBy({ by: ['category'], _count: true, where: { status: 'APPROVED' } })
  return { products: JSON.parse(JSON.stringify(products)), categories: cats.map(c => ({ category: c.category, count: c._count })) }
}

export default async function HomePage() {
  const { products, categories } = await getData()

  return (
    <main>
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-ocean-900 overflow-hidden">
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">Acelora</h1>
          <p className="text-xl md:text-2xl text-primary-100 mb-3">Premium Agro-Maritime Products from Aceh</p>
          <p className="text-base text-primary-200/80 mb-8 max-w-xl mx-auto">Shop directly from Acehnese farmers, fishermen, and MSMEs.</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-primary-800 font-semibold text-lg hover:bg-primary-50 shadow-xl">
            <ShoppingBag size={20} /> Shop Now
          </Link>
        </div>
      </section>

      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map(({ category, count }) => {
            const Icon = categoryIcons[category] || Pkg
            return (
              <Link key={category} href={`/products?category=${category}`} className="flex flex-col items-center p-6 rounded-2xl border dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md hover:border-primary-300 transition-all group">
                <Icon size={32} className="text-primary-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium capitalize">{category.toLowerCase()}</span>
                <span className="text-xs text-gray-500">{count} products</span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link href="/products" className="text-primary-600 font-medium flex items-center gap-1">View All <ArrowRight size={16} /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product: any) => (
              <Link key={product.id} href={`/products/${product.id}`} className="group rounded-2xl border dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900 hover:shadow-lg">
                <div className="aspect-square relative bg-gray-50">
                  {product.image && <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform" />}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                  <p className="text-lg font-bold text-primary-600 mt-1">Rp {product.price.toLocaleString('id-ID')}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 text-center bg-gradient-to-r from-primary-600 to-ocean-600 text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to explore premium Acehnese products?</h2>
        <p className="text-primary-100 mb-8 max-w-lg mx-auto">Connect directly with local producers and enjoy authentic flavors from Aceh.</p>
        <Link href="/products" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-primary-700 font-semibold hover:bg-primary-50 shadow-xl">
          Browse All Products <ArrowRight size={20} />
        </Link>
      </section>
    </main>
  )
}
