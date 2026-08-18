'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Minus, Plus, Heart, Share2 } from 'lucide-react'
import { useCartStore } from '@/store/cart.store'
import type { Product } from '@/types'

interface ProductDetailClientProps {
  product: Product & { owner?: { name: string; email: string } | null }
  category?: { label: string }
  isAvailable: boolean
  reviews?: any[]
  rating?: number
  reviewCount?: number
}

export default function ProductDetailClient({ product, category, isAvailable, reviews = [], rating = 0, reviewCount = 0 }: ProductDetailClientProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleQuantity = (delta: number) => {
    setQuantity(prev => {
      const newQuantity = prev + delta;
      if (delta > 0) {
        return Math.min(newQuantity, product.stock || 999);
      } else {
        return Math.max(newQuantity, 1);
      }
    });
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image || '',
      quantity,
      stock: product.stock,
    })
  }

  const handleWishlist = () => {
    if (typeof window === 'undefined') return
    setIsWishlisted(!isWishlisted)
    const saved = localStorage.getItem('acelora-wishlist') || '[]'
    const wishlist = JSON.parse(saved)
    if (!isWishlisted) {
      localStorage.setItem('acelora-wishlist', JSON.stringify([...wishlist, product.id]))
    } else {
      localStorage.setItem('acelora-wishlist', JSON.stringify(wishlist.filter((id: string) => id !== product.id)))
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (typeof window === 'undefined') return
    setIsSubmitting(true)
    try {
      const userId = localStorage.getItem('acelora-user-id')
      if (!userId) {
        alert('Silakan login terlebih dahulu untuk memberikan ulasan')
        return
      }
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId: product.id, rating: newRating, comment: newComment }),
      })
      const data = await res.json()
      if (data.success) {
        setNewComment('')
        setNewRating(5)
        alert('Ulasan berhasil dikirim!')
        window.location.reload()
      } else {
        alert(data.error || 'Gagal mengirim ulasan')
      }
    } catch (err) {
      alert('Terjadi kesalahan saat mengirim ulasan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const handleShare = async () => {
    if (!currentUrl) return
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url: currentUrl })
      } catch {
        await navigator.clipboard.writeText(currentUrl)
      }
    } else {
      await navigator.clipboard.writeText(currentUrl)
    }
  }

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('acelora-wishlist') || '[]'
    const wishlist = JSON.parse(saved)
    setIsWishlisted(wishlist.includes(product.id))
  }, [product.id])

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Image Gallery */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="aspect-square relative rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800">
          {product.image && (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
              priority
              className="object-cover"
            />
          )}
        </div>

        {/* Thumbnails */}
        {product.images && product.images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500"
              >
                <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Wishlist & Share Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleWishlist}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              isWishlisted
                ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
            {isWishlisted ? 'Disukai' : 'Tambah ke Wishlist'}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Bagikan"
          >
            <Share2 size={18} />
            Bagikan
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div>
        <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
          {product.origin} • {category?.label || product.category}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {product.name}
        </h1>

        <p className="text-2xl font-bold text-primary-600 mb-4">
          Rp {product.price.toLocaleString('id-ID')}
        </p>

        <p className="text-gray-600 dark:text-gray-300 mb-6">{product.description}</p>

      {/* Reviews Section */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Ulasan & Penilaian</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold">{rating.toFixed(1)}</span>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`text-lg ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
              ))}
            </div>
            <span className="text-sm text-gray-500">({reviewCount} ulasan)</span>
          </div>
          {reviews && reviews.length > 0 && (
            <div className="space-y-3 mt-4">
              {reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{review.user?.name || 'Pengguna'}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                      ))}
                    </div>
                  </div>
                  {review.comment && <p className="text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>}
                </div>
              ))}
            </div>
          )}
          {reviews.length === 0 && (
            <p className="text-sm text-gray-500">Belum ada ulasan untuk produk ini.</p>
          )}
        </div>
      </div>

      {/* Add Review Form */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tulis Ulasan</h4>
        <form onSubmit={handleSubmitReview} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating</label>
            <select 
              value={newRating}
              onChange={(e) => setNewRating(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="5">5 ★</option>
              <option value="4">4 ★</option>
              <option value="3">3 ★</option>
              <option value="2">2 ★</option>
              <option value="1">1 ★</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Komentar</label>
            <textarea 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white h-20 resize-none" 
              placeholder="Bagikan pengalaman Anda..." 
              required
            ></textarea>
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
          </button>
        </form>
      </div>

      {/* Stock & Legality */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {isAvailable ? `✅ Tersedia (${product.stock} tersisa)` : 'Habis!'}
          </span>
          {product.legality && (
            <span className="text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-2 py-1 rounded-full">
              {product.legality}
            </span>
          )}
        </div>

        {/* Quantity Selector */}
        {isAvailable && (
          <>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Jumlah:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantity(-1)}
                  className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantity(1)}
                  className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
                  disabled={quantity >= product.stock}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl text-white font-semibold bg-primary-500 hover:bg-primary-600 transition-colors"
            >
              <ShoppingCart size={20} /> Tambah ke Keranjang
            </button>
          </>
        )}

        {/* Out of Stock Button */}
        {!isAvailable && (
          <button className="w-full cursor-not-allowed px-6 py-3 rounded-xl bg-gray-300 text-gray-600 font-semibold">
            Habis
          </button>
        )}
      </div>
    </div>
  )
}

export function RelatedProducts({ product, products }: { product: Product; products: Product[] }) {
  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Produk Terkait
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="group rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 hover:shadow-lg transition-all"
          >
            <div className="aspect-square relative bg-gray-50 dark:bg-gray-800">
              {p.image && (
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              )}
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                {p.name}
              </h4>
              <p className="text-primary-600 font-bold mt-1">
                Rp {p.price.toLocaleString('id-ID')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}