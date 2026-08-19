'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Search, Heart, Trash2, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/store/cart.store'
import type { Product } from '@/types'

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<string[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const addItem = useCartStore((s) => s.addItem)

  // Load wishlist IDs from localStorage
  useEffect(() => {
    let cancelled = false
    setTimeout(() => {
      const saved = localStorage.getItem('acelora-wishlist') || '[]'
      const ids = JSON.parse(saved)
      if (!cancelled) setWishlist(ids)
    })
    return () => { cancelled = true }
  }, [])

  // Fetch product details for each wishlist item
  useEffect(() => {
    if (wishlist.length === 0) {
      setTimeout(() => {
        setProducts([])
        setLoading(false)
      })
      return
    }

    const fetchProducts = async () => {
      setTimeout(() => { setLoading(true); setError(null) })
      try {
        const res = await fetch('/api/products')
        const json = await res.json()
        if (!json.success) throw new Error('Gagal memuat produk')
        const allProducts = json.data
        setProducts(allProducts.filter((p: Product) => wishlist.includes(p.id)))
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error tidak diketahui')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [wishlist])

  const removeFromWishlist = (id: string) => {
    const newWishlist = wishlist.filter((item) => item !== id)
    setWishlist(newWishlist)
    localStorage.setItem('acelora-wishlist', JSON.stringify(newWishlist))
  }

  const moveToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image || '',
      quantity: 1,
      stock: product.stock,
    })
    removeFromWishlist(product.id)
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-6xl mx-auto">
      <div className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-4"
        >
          <ArrowLeft size={20} />
          Kembali ke Produk
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Wishlist Saya ({products.length})
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Produk yang Anda sukai akan muncul di sini
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800 h-60" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-500 mb-4">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Wishlist kosong</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Simpan produk ke wishlist untuk melihatnya di sini
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-white font-semibold bg-primary-500 hover:bg-primary-600 transition-colors"
          >
            Jelajahi Produk
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 hover:shadow-lg transition-all"
            >
              <Link href={`/products/${product.id}`} className="block">
                <div className="aspect-square relative bg-gray-50 dark:bg-gray-800">
                  {product.image && (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  )}
                </div>
              </Link>
              <div className="p-4">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate mb-2">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-primary-600 mb-4">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => moveToCart(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 transition-colors"
                  >
                    <ShoppingCart size={16} />
                    Ke Keranjang
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    title="Hapus dari wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}