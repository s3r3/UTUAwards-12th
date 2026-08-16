'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X, ShoppingCart, Trash2, Minus, Plus, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cart.store'
import { motion, AnimatePresence } from 'framer-motion'

export default function MiniCart() {
  const [open, setOpen] = useState(false)
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCartStore()

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="relative p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Shopping cart"
      >
        <ShoppingCart size={18} />
        {totalItems() > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-primary-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-gray-950">
            {totalItems() > 99 ? '99+' : totalItems()}
          </span>
        )}
      </button>
    )
  }

  return (
    <div
      className="absolute top-16 right-0 w-80 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
        <h3 className="font-semibold text-gray-900 dark:text-white">Keranjang ({totalItems()} item)</h3>
        <button
          onClick={() => setOpen(false)}
          className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
      </div>

      <AnimatePresence>
        {items.length === 0 ? (
          <div className="p-6 text-center">
            <ShoppingCart size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">Keranjang kosong</p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {items.map((item) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 1, height: 'auto' }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 p-3 border-b border-gray-100 dark:border-gray-800"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">Rp {item.price.toLocaleString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="p-1 rounded text-gray-400 hover:text-gray-600"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-xs font-medium w-5 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="p-1 rounded text-gray-400 hover:text-gray-600"
                    disabled={item.quantity >= item.stock}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="p-1 rounded text-red-400 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {items.length > 0 && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal:</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              Rp {subtotal().toLocaleString('id-ID')}
            </span>
          </div>
          <Link
            href="/checkout"
            className="block w-full text-center py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors"
            onClick={() => setOpen(false)}
          >
            <div className="flex items-center justify-center gap-2">
              Lanjut ke Pembayaran
              <ArrowRight size={16} />
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}