'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Minus, Plus, Heart, Share2, ChevronUp, ChevronDown, UserCircle2, Star } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCartStore } from '@/store/cart.store'
import type { Product } from '@/types'

interface ProductDetailClientProps {
  product: Product & { owner?: { name: string; email: string } | null }
  category?: { label: string }
  isAvailable: boolean
  reviews?: { id: string; rating: number; comment: string | null; user: { name: string | null } | null }[]
  rating?: number
  reviewCount?: number
}

const ACCORDION_DATA = [
  {
    title: 'ORIGIN & SOURCING',
    content:
      'Sourced directly from the fertile volcanic highlands of Central Aceh. Our farmers use traditional, pesticide-free cultivation methods passed down through generations.',
  },
  {
    title: 'QUALITY & PROCESSING',
    content:
      'Cold-pressed to extract the highest grade of essential oils, preserving its deep, earthy, and musky aroma. 100% pure without additives.',
  },
  {
    title: 'SHIPPING & STORAGE',
    content:
      'Stored in amber glass bottles to prevent UV degradation. Ships within 24 hours via cold-chain or secure packaging depending on the product type.',
  },
  {
    title: 'FAQ',
    content:
      'Q: Is this food grade?\nA: Please refer to the specific variant label, as some oils are for aromatherapy only.',
  },
]

export default function ProductDetailClient({ product, category, isAvailable, reviews = [], rating = 0, reviewCount = 0 }: ProductDetailClientProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>(null)

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

  useEffect(() => {
    let cancelled = false
    setTimeout(() => {
      const saved = localStorage.getItem('acelora-wishlist') || '[]'
      const wishlist = JSON.parse(saved)
      if (!cancelled) setIsWishlisted(wishlist.includes(product.id))
    })
    return () => { cancelled = true }
  }, [product.id])

  return (
    <div className="grid md:grid-cols-2 gap-10">
      {/* Image Gallery — sticky left */}
      <div className="md:sticky md:top-24 h-fit">
        <div className="relative aspect-square bg-stone-100">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 55vw"
              priority
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-stone-400">
              <span className="text-xs">No Image</span>
            </div>
          )}
        </div>

        {product.images && product.images.length > 0 && (
          <div className="mt-2 flex gap-2 overflow-x-auto">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                className="aspect-square w-20 flex-shrink-0 overflow-hidden border border-black/10 hover:border-black"
              >
                <img src={img} alt={`${product.name} ${idx + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={handleWishlist}
            className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
              isWishlisted
                ? 'text-red-600'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
            {isWishlisted ? 'Saved' : 'Save'}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
            aria-label="Bagikan"
          >
            <Share2 size={18} />
            Share
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="py-4">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-stone-500">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">•</span>
          <Link href="/products" className="hover:underline">Farm Produce</Link>
          <span className="mx-2">•</span>
          <span className="text-stone-900">{product.name}</span>
        </nav>

        <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 leading-tight mb-4">
          {product.name}
        </h1>

        <p className="text-3xl font-bold text-red-800 mb-6">
          Rp {product.price.toLocaleString('id-ID')}
        </p>

        {/* Add to Cart — full width emerald */}
        <div className="mb-6">
          <button
            onClick={handleAddToCart}
            className="w-full bg-emerald-950 px-6 py-4 text-white text-sm font-semibold uppercase tracking-widest hover:bg-emerald-800 transition-colors flex items-center justify-center gap-3"
          >
            <ShoppingCart size={18} />
            {isAvailable ? `ADD TO CART | Rp ${product.price.toLocaleString('id-ID')}` : 'OUT OF STOCK'}
          </button>

          {/* Stock */}
          <p className="mt-2 text-xs text-stone-500">
            {isAvailable ? `In stock (${product.stock} available)` : 'Out of stock'}
          </p>
        </div>

        {/* Quantity Selector */}
        {isAvailable && (
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm uppercase tracking-widest text-stone-500">Quantity</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantity(-1)}
                className="h-9 w-9 flex items-center justify-center border border-black/15 hover:bg-stone-100 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button
                onClick={() => handleQuantity(1)}
                className="h-9 w-9 flex items-center justify-center border border-black/15 hover:bg-stone-100 transition-colors"
                disabled={quantity >= product.stock}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Description */}
        <p className="text-sm leading-relaxed text-stone-600 mb-8">
          {product.description || 'A premium product sourced with care from our partner communities.'}
        </p>

        {/* Accordion */}
        <div className="border-b border-black/10">
          {ACCORDION_DATA.map((item) => {
            const isOpen = openSection === item.title
            return (
              <div key={item.title} className="border-t border-black/10">
                <button
                  onClick={() => setOpenSection(isOpen ? null : item.title)}
                  className="flex w-full items-center justify-between py-5 text-left"
                >
                  <span className="text-xs font-bold uppercase tracking-wide text-stone-900">
                    {item.title}
                  </span>
                  {isOpen ? (
                    <Minus size={16} className="text-stone-500" />
                  ) : (
                    <Plus size={16} className="text-stone-500" />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-sm leading-relaxed whitespace-pre-line text-stone-600">
                        {item.content}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* Reviews */}
        <div className="mt-10 pt-10 border-t border-black/10">
          <h3 className="text-lg font-bold text-stone-900 mb-6">ULASAN PELANGGAN</h3>
          
          {/* Add Review Form */}
          <div className="mb-8 p-6 bg-stone-50 border border-black/10">
            <h4 className="text-sm font-semibold text-stone-900 mb-4 uppercase tracking-widest">Tulis Ulasan Anda</h4>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <select
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                className="w-full px-3 py-2 border border-black/15 bg-white text-stone-900 text-sm"
              >
                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} ★</option>)}
              </select>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-3 py-2 border border-black/15 bg-white text-stone-900 h-24 resize-none text-sm"
                placeholder="Bagikan pengalaman Anda..."
                required
              ></textarea>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-stone-900 text-white text-sm uppercase tracking-widest hover:bg-stone-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
              </button>
            </form>
          </div>

          {/* List Reviews */}
          <div className="space-y-6">
            {reviews.length > 0 ? reviews.map((review) => (
              <div key={review.id} className="border-b border-black/10 pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <UserCircle2 className="w-8 h-8 text-stone-400" />
                  <div>
                    <span className="text-sm font-medium text-stone-900">{review.user?.name || 'Anonim'}</span>
                    <div className="flex text-yellow-400 text-xs">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} fill={i < review.rating ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-stone-600">{review.comment}</p>
              </div>
            )) : <p className="text-sm text-stone-500">Belum ada ulasan.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export function RelatedProducts({ product, products }: { product: Product; products: Product[] }) {
  return (
    <div className="mt-12">
      <h3 className="font-serif text-xl text-stone-900 mb-6">
        You May Also Like
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="group"
          >
            <div className="relative aspect-square bg-stone-100 overflow-hidden">
              {p.image && (
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              )}
            </div>
            <div className="p-3">
              <h4 className="font-serif text-sm text-stone-900 truncate">
                {p.name}
              </h4>
              <p className="text-red-800 text-xs mt-1">
                Rp {p.price.toLocaleString('id-ID')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
