'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ShoppingCart, Minus, Plus, Heart } from 'lucide-react'
import { useCartStore } from '@/store/cart.store'
import type { Product } from '@/types'

interface ProductDetailClientProps {
  product: Product & { owner?: { name: string; email: string } | null }
  category?: { label: string }
  isAvailable: boolean
}

export default function ProductDetailClient({ product, category, isAvailable }: ProductDetailClientProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

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
    setIsWishlisted(!isWishlisted)
    // Save to localStorage for persistence
    const saved = localStorage.getItem('acelora-wishlist') || '[]'
    const wishlist = JSON.parse(saved)
    if (!isWishlisted) {
      localStorage.setItem('acelora-wishlist', JSON.stringify([...wishlist, product.id]))
    } else {
      localStorage.setItem('acelora-wishlist', JSON.stringify(wishlist.filter((id: string) => id !== product.id)))
    }
  }

  // Load wishlist from localStorage on mount
  useState(() => {
    const saved = localStorage.getItem('acelora-wishlist') || '[]'
    const wishlist = JSON.parse(saved)
    setIsWishlisted(wishlist.includes(product.id))
  })

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

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            isWishlisted
              ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
          {isWishlisted ? 'Simpan ke Wishlist' : 'Tambah ke Wishlist'}
        </button>
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