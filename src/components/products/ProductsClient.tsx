'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ShoppingCart, Search, X } from 'lucide-react'
import { useCartStore } from '@/store/cart.store'
import { useTranslations } from '@/lib/i18n'
import type { Product } from '@/types'
import { PRODUCT_CATEGORIES } from '@/constants/products'

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
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const addItem = useCartStore((s) => s.addItem)
  const t = useTranslations()

  const categoryParam = searchParams.get('category') || 'all'
  const searchParam = searchParams.get('search') || ''
  const sortParam = searchParams.get('sort') || 'newest'

  const categories = [
    { value: 'all', label: 'Semua Kategori' },
    ...PRODUCT_CATEGORIES.map((cat) => ({ value: cat.value, label: cat.label })),
  ]

  const sortOptions = [
    { value: 'newest', label: 'Terbaru' },
    { value: 'price_asc', label: 'Termurah' },
    { value: 'price_desc', label: 'Termahal' },
    { value: 'stock', label: 'Stok Tinggi' },
  ]

  const fetchData = useCallback(async (pageNum: number = 1) => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams(searchParams.toString())
      params.set('_page', String(pageNum))
      params.set('_limit', '12')

      const res = await fetch(`/api/products?${params.toString()}`, { next: { revalidate: 0 } })
      const json: ProductResponse = await res.json()

      if (!json.success) {
        throw new Error(json.error || 'Gagal memuat produk')
      }

      if (pageNum === 1) {
        setProducts(json.data)
      } else {
        setProducts((prev) => [...prev, ...json.data])
      }

      setHasNextPage(json.pagination?.hasNextPage ?? false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error tidak diketahui')
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  const updatePriceRange = useCallback((key: 'minPrice' | 'maxPrice', value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (!value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    params.delete('_page')
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [searchParams, pathname, router])

  const clearPriceRange = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('minPrice')
    params.delete('maxPrice')
    params.delete('_page')
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [searchParams, pathname, router])

  const hasActivePriceFilter = minPrice !== '' || maxPrice !== ''

  useEffect(() => {
    setPage(1)
    setProducts([])
    fetchData(1)
  }, [fetchData])

  useEffect(() => {
    setMinPrice(searchParams.get('minPrice') || '')
    setMaxPrice(searchParams.get('maxPrice') || '')
  }, [searchParams])

  useEffect(() => {
    if (page > 1) {
      fetchData(page)
    }
  }, [page, fetchData])

  useEffect(() => {
    if (!hasNextPage || loading) return

    const observer = new IntersectionObserver(
      (items) => {
        if (items[0].isIntersecting && hasNextPage) {
          setPage((prev) => prev + 1)
        }
      },
      { threshold: 0.1 }
    )

    const target = document.getElementById('sentinel')
    if (target) observer.observe(target)

    return () => observer.disconnect()
  }, [hasNextPage, loading])

  const updateParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all' || value === 'newest' || value === '') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    params.delete('_page')
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [searchParams, pathname, router])

  const clearFilter = useCallback(() => {
    router.replace(pathname, { scroll: false })
  }, [pathname, router])

  const hasActiveFilters = categoryParam !== 'all' || searchParam !== '' || sortParam !== 'newest'

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <section className="mb-8">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder={t.products.searchPlaceholder}
              defaultValue={searchParam}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const target = e.currentTarget as HTMLInputElement
                  const params = new URLSearchParams(searchParams.toString())
                  if (target.value) params.set('search', target.value)
                  else params.delete('search')
                  params.delete('_page')
                  router.replace(`${pathname}?${params.toString()}`, { scroll: false })
                }
              }}
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <select
              value={categoryParam}
              onChange={(e) => updateParam('category', e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
            >
              {categories.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <select
              value={sortParam}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
            >
              {sortOptions.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min Harga"
                  value={minPrice}
                  onChange={(e) => updatePriceRange('minPrice', e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm w-24"
                  min="0"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max Harga"
                  value={maxPrice}
                  onChange={(e) => updatePriceRange('maxPrice', e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm w-24"
                  min="0"
                />
                {(minPrice !== '' || maxPrice !== '') && (
                  <button
                    onClick={clearPriceRange}
                    className="px-2 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    aria-label="Hapus filter harga"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilter}
                className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Hapus semua filter"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </section>

      {error && (
        <div className="text-center py-20">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => fetchData(1)}
            className="px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {!loading && products.length === 0 && !error && (
        <div className="text-center py-20">
          <div className="mb-4">
            <Search size={48} className="mx-auto text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {searchParam ? 'Produk tidak ditemukan' : 'Belum ada produk'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchParam
              ? 'Coba ubah kata kunci pencarian'
              : 'Produk akan ditambahkan segera'}
          </p>
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600">
            Kembali ke Beranda
          </Link>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} addItem={addItem} />
          ))}
        </div>
      )}

      {loading && page === 1 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800 h-72" />
          ))}
        </div>
      )}

      {hasNextPage && !loading && (
        <div id="sentinel" className="h-10 flex justify-center mt-4">
          <div className="w-8 h-8 rounded-full bg-primary-500 animate-pulse" />
        </div>
      )}

      {!hasNextPage && products.length > 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Sudah ditampilkan semua produk
        </div>
      )}
    </div>
  )
}

function ProductCard({ product, addItem }: { product: Product; addItem: (item: any) => void }) {
  const isAvailable = product.stock > 0

  return (
    <Link
      href={`/products/${product.id}`}
      className="group rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 hover:shadow-lg hover:shadow-primary-500/5 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="aspect-square relative bg-gray-50 dark:bg-gray-800 overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300">
            <ShoppingCart size={32} />
          </div>
        )}
        {!isAvailable && (
          <span className="absolute top-2 right-2 text-xs bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-1 rounded-full">
            Habis
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">
          {product.origin}
        </div>
        <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate mb-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-primary-600">
            Rp {product.price.toLocaleString('id-ID')}
          </span>
          {isAvailable && (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                addItem({
                  productId: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image || '',
                  quantity: 1,
                  stock: product.stock,
                })
              }}
              className="p-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600"
              title="Tambah ke keranjang"
            >
              <ShoppingCart size={16} />
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}