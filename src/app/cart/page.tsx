'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/store/cart.store'
import { useTranslations } from '@/lib/i18n'

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCartStore()
  const t = useTranslations()

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4 px-4">
        <ShoppingBag size={64} className="text-gray-300" />
        <h2 className="text-xl font-semibold">{t.cart.empty}</h2>
        <p className="text-gray-500">{t.cart.emptyHint}</p>
        <Link href="/products" className="px-6 py-2.5 rounded-xl bg-primary-500 text-white font-medium">{t.cart.continueShopping}</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">{t.cart.title} ({totalItems()} {totalItems() > 1 ? t.cart.items : t.cart.item})</h1>
        <div className="grid md:grid-cols-[1fr_300px] gap-8">
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.productId} className="flex gap-4 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 shrink-0">
                  {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.productId}`} className="font-semibold truncate block hover:text-primary-600">{item.name}</Link>
                  <p className="text-primary-600 font-bold mt-1">Rp {item.price.toLocaleString('id-ID')}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-1 hover:bg-gray-100"><Minus size={16} /></button>
                      <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-1 hover:bg-gray-100"><Plus size={16} /></button>
                    </div>
                    <button onClick={() => removeItem(item.productId)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="h-fit p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-24">
            <h3 className="font-semibold mb-4">{t.cart.summary}</h3>
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>{t.cart.total}</span>
              <span>Rp {subtotal().toLocaleString('id-ID')}</span>
            </div>
            <Link href="/checkout" className="mt-6 w-full flex items-center justify-center px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600">
              {t.cart.checkout}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
