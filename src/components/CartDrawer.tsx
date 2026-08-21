'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { useCartStore } from '@/store/cart.store'
import { useUIStore } from '@/store/ui.store'

export interface UpsellProduct {
  id: string
  name: string
  price: number
  image: string
  category: string
  origin: string
}

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  upsellLand: UpsellProduct | null
  upsellSea: UpsellProduct | null
}

const MONO_FONT = '"DM Mono", "Fira Code", "Courier New", monospace'

export default function CartDrawer({ isOpen, onClose, upsellLand, upsellSea }: CartDrawerProps) {
  const router = useRouter()
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCartStore()
  const { theme } = useUIStore()
  const isDark = theme === 'dark'

  const bgClass = isDark ? 'bg-gray-950' : 'bg-[#faf7f2]'
  const textClass = isDark ? 'text-gray-100' : 'text-gray-900'
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-600'
  const borderClass = isDark ? 'border-gray-800' : 'border-gray-300/50'

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Slide-out Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className={`fixed top-0 right-0 z-[51] flex h-screen w-full max-w-md flex-col border-l ${borderClass} ${bgClass} ${textClass}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-5 pb-4">
              <div>
                <h2
                  className="text-3xl font-extralight"
                  style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                >
                  Your Cart
                </h2>
                <div
                  className="-mt-1 text-[9px] uppercase tracking-[0.2em]"
                  style={{ fontFamily: MONO_FONT, color: isDark ? '#9ca3af' : '#6b7280' }}
                >
                  [{items.length === 0 ? 'EMPTY' : totalItems() + ' items'}]
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 hover:bg-gray-200/60 dark:hover:bg-gray-700/60"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="py-10 text-center text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                  Your cart is empty
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.productId} className={`flex items-center gap-3 pb-3 border-b ${borderClass}`}>
                      <div className={`h-16 w-16 overflow-hidden rounded-lg relative flex-shrink-0`}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className={`text-xs ${textMuted}`}>
                          Rp {item.price.toLocaleString('id-ID')}
                        </p>
                        <div className="mt-1 flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="h-5 w-5 rounded text-sm"
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="text-xs">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="h-5 w-5 rounded text-sm"
                            disabled={item.quantity >= item.stock}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-xs text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upsell bar */}
            <div className={`border-y ${borderClass} px-6 py-3 text-center text-xs ${textMuted}`}>
              <span style={{ fontFamily: MONO_FONT }}>DISCOVER ACELORA SPECIALTIES</span>
            </div>

            {/* Upsell grid - land left, sea right */}
            <div className="grid grid-cols-2 divide-x divide-gray-300/50 dark:divide-gray-700/50">
              {[upsellLand, upsellSea].map((product, idx) => (
                <div
                  key={product?.id || `placeholder-${idx}`}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  {product ? (
                    <>
                      <div className={`mb-4 aspect-square w-28 overflow-hidden rounded-xl border-2 ${isDark ? 'border-white' : 'border-black'} relative`}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <h3
                        className="mb-2 text-center text-xs font-semibold text-gray-900 dark:text-gray-100"
                      >
                        {product.name}
                      </h3>
                      <p className={`mb-2 text-[10px] ${textMuted}`}>
                        {product.category === 'SEAFOOD' ? 'Laut' : 'Darat'} • Rp {product.price.toLocaleString('id-ID')} / kg
                      </p>
                      <button className="rounded-full bg-primary-600 px-5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white hover:bg-primary-700">
                        Add to Cart
                      </button>
                    </>
                  ) : (
                    <>
                      <div className={`mb-4 flex h-28 w-28 items-center justify-center rounded-xl border-2 ${isDark ? 'border-white' : 'border-black'} border-dashed ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                        <span className={`text-[10px] ${textMuted}`}>No product</span>
                      </div>
                      <button className="rounded-full border border-gray-500 px-4 py-1 text-[10px] font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        SEDEKAPAN DATANG!
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className={`border-t ${borderClass} p-6`}>
                <div className="flex justify-between text-sm">
                  <span className={textMuted}>Subtotal</span>
                  <span className="font-medium">
                    Rp {subtotal().toLocaleString('id-ID')}
                  </span>
                </div>
                <button
                  onClick={() => {
                    onClose()
                    router.push('/checkout')
                  }}
                  className={`mt-3 w-full rounded-full py-3 text-sm font-medium transition-colors ${
                    isDark
                      ? 'bg-white text-gray-900 hover:bg-gray-100'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  Proceed to checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}