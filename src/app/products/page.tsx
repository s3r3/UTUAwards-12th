'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Search } from 'lucide-react'
import { useCartStore } from '@/store/cart.store'
import { useTranslations } from '@/lib/i18n'
import type { Product } from '@/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore((s) => s.addItem)
  const t = useTranslations()

  useEffect(() => {
    const params = new URLSearchParams()
    if (category !== 'all') params.set('category', category)
    if (search) params.set('search', search)
    fetch(`/api/products?${params}`).then(r => r.json()).then(d => { if (d.success) setProducts(d.data) }).finally(() => setLoading(false))
  }, [category, search])

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input className="w-full pl-10 pr-4 py-2.5 rounded-xl border" placeholder={t.products.searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="px-4 py-2.5 rounded-xl border" value={category} onChange={e => setCategory(e.target.value)}>
          {Object.entries(t.products.categories).map(([key, label]) => (
            <option key={key} value={key === 'all' ? 'all' : key.toUpperCase()}>{label}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="grid grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="animate-pulse rounded-2xl bg-gray-100 h-72" />)}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 py-20">{t.products.notFound}</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="group rounded-2xl border dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900 hover:shadow-lg">
              <Link href={`/products/${product.id}`}>
                <div className="aspect-square relative bg-gray-50">
                  {product.image && <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform" />}
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/products/${product.id}`}><h3 className="font-semibold truncate">{product.name}</h3></Link>
                <p className="text-xs text-gray-500 mb-2">{product.origin}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary-600">Rp {product.price.toLocaleString('id-ID')}</span>
                  {product.stock > 0 ? (
                    <button onClick={() => addItem({ productId: product.id, name: product.name, price: product.price, image: product.image || '', quantity: 1, stock: product.stock })}
                      className="p-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600"><ShoppingCart size={18} /></button>
                  ) : <span className="text-xs text-red-500 font-medium">{t.products.outOfStock}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
