'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ShoppingCart, Search, Heart, ArrowRight, ChevronDown } from 'lucide-react'
import { useCartStore } from '@/store/cart.store'
import { useUIStore } from '@/store/ui.store'
import { useTranslations } from '@/lib/i18n'
import type { Product, CartItem } from '@/types'
import { PRODUCT_CATEGORIES } from '@/constants/products'
import { motion, AnimatePresence } from 'framer-motion'

interface ProductResponse {
  success: boolean
  data: Product[]
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    hasNextPage: boolean
  }
}

export default function ProductsClient() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [page, setPage] = useState(1)

  const addItem = useCartStore((s) => s.addItem)
  const t = useTranslations()
  const theme = useUIStore((s) => s.theme)
  const isDark = theme === 'dark'

  const categoryParam = searchParams.get('category') || 'all'
  const searchParam = searchParams.get('search') || ''
  const sortParam = searchParams.get('sort') || 'newest'

  const categories = [
    { value: 'all', label: 'All' },
    ...PRODUCT_CATEGORIES.map((cat) => ({ value: cat.value, label: cat.label })),
  ]

  const sortOptions = [
    { value: 'newest', label: 'Featured' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
  ]

  const fetchData = useCallback(async (pageNum: number = 1) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams(searchParams.toString())
      params.set('_page', String(pageNum))
      params.set('_limit', '12')
      const res = await fetch(`/api/products?${params.toString()}`)
      const json: ProductResponse = await res.json()
      if (!json.success) throw new Error(json.error || 'Gagal memuat produk')
      setProducts(pageNum === 1 ? json.data : (prev) => [...prev, ...json.data])
      setHasNextPage(json.pagination?.hasNextPage ?? false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error')
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  useEffect(() => {
    let cancelled = false
    setTimeout(() => {
      if (!cancelled) {
        setPage(1)
        fetchData(1)
      }
    })
    return () => { cancelled = true }
  }, [fetchData])

  const updateParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all' || value === 'newest') params.delete(key)
    else params.set(key, value)
    params.delete('_page')
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [searchParams, pathname, router])

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950 text-stone-200' : 'bg-white text-stone-900'}`}>
      {/* Top Filter Bar — added top margin to prevent navbar overlap */}
      <div className={`mt-20 border-b py-4 px-6 md:px-12 flex items-center justify-between ${isDark ? 'bg-gray-950 border-white/10' : 'bg-white border-black/10'}`}>
        <span className={`font-serif text-sm ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>Showing {products.length} products</span>
        <div className="flex items-center gap-8">
            <div className="relative group">
                <button className={`flex items-center gap-1 text-sm tracking-widest uppercase ${isDark ? 'text-white' : 'text-stone-900'}`}>
                    Category <ChevronDown size={14} />
                </button>
                <div className={`absolute top-full right-0 z-[100] hidden w-56 border p-2 shadow-lg group-hover:block ${isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-black/10'}`}>
                    {categories.map(c => <button key={c.value} onClick={() => updateParam('category', c.value)} className={`block w-full px-3 py-2 text-left text-sm transition-colors ${isDark ? 'text-stone-100 hover:bg-white/5' : 'text-stone-800 hover:bg-stone-100'}`}>{c.label}</button>)}
                </div>
            </div>
            <div className="relative group">
                <button className={`flex items-center gap-1 text-sm tracking-widest uppercase ${isDark ? 'text-white' : 'text-stone-900'}`}>
                    Sort <ChevronDown size={14} />
                </button>
                 <div className={`absolute top-full right-0 z-[100] hidden w-56 border p-2 shadow-lg group-hover:block ${isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-black/10'}`}>
                    {sortOptions.map(o => <button key={o.value} onClick={() => updateParam('sort', o.value)} className={`block w-full px-3 py-2 text-left text-sm transition-colors ${isDark ? 'text-stone-100 hover:bg-white/5' : 'text-stone-800 hover:bg-stone-100'}`}>{o.label}</button>)}
                </div>
            </div>
            <input
                className={`w-40 border-b bg-transparent pb-1 text-sm outline-none transition-colors placeholder:tracking-wider focus:w-48 ${isDark ? 'border-white/30 text-white placeholder:text-stone-500 focus:border-white' : 'border-black text-stone-900 placeholder:text-stone-400 focus:border-black'}`}
                placeholder="Search..."
                onKeyDown={(e) => {
                    if (e.key === 'Enter') updateParam('search', e.currentTarget.value)
                }}
            />
        </div>
      </div>

      {/* Grid */}
      <motion.div
        layout
        className="px-6 md:px-12 py-12 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-12"
      >
        <AnimatePresence>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} addItem={addItem} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

function ProductCard({ product, addItem }: { product: Product; addItem: (item: CartItem) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link href={`/products/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-stone-100 mb-4">
        <Image
          src={product.image || ''}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <Heart className="absolute top-4 right-4 text-stone-900 hover:fill-stone-900 transition-colors" size={20} />
      </Link>

      <div className="mb-4">
        <h3 className="font-serif text-lg ">{product.name}</h3>
        <p className="text-xs tracking-wider">Rp {product.price.toLocaleString('id-ID')}</p>
      </div>

      <button
        onClick={() => addItem({ ...product, productId: product.id, quantity: 1 })}
        className="w-full bg-emerald-950 text-white py-3 text-[10px] tracking-widest uppercase hover:bg-emerald-800 transition-colors"
      >
        ADD TO CART
      </button>
    </motion.div>
  )
}
