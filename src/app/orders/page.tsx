'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from '@/lib/i18n'
import type { Order } from '@/types'

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  PAID: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
  PROCESSING: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
  SHIPPING: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
  DELIVERED: { bg: 'bg-gray-50 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-700' },
  CANCELLED: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800' },
  PENDING: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const t = useTranslations()

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(d => { if (d.success) setOrders(d.data) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center">{t.common.loading}</div>

  if (orders.length === 0) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold">{t.orders.noOrders}</h2>
      <p className="text-gray-500">{t.orders.noOrdersDesc}</p>
      <Link href="/products" className="px-6 py-2.5 rounded-xl bg-black text-white font-medium text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors">
        {t.cart.continueShopping}
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen pt-28 pb-16 bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-serif text-4xl font-bold text-gray-900 dark:text-white mb-2">My Orders</h1>
          <p className="text-sm text-gray-500 font-mono tracking-wider">[{orders.length} {t.orders.items.toLowerCase()}]</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map(order => {
            const status = statusColors[order.status] || statusColors.PENDING
            const mainItem = order.items[0]
            const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0)
            const itemName = mainItem?.product?.name || order.id.slice(0, 8)
            const image = mainItem?.product?.image

            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="group block border border-black/10 hover:border-black/40 bg-white dark:bg-gray-900 transition-colors"
              >
                <div className="flex items-stretch">
                  {/* Thumbnail */}
                  <div className="w-24 h-24 relative bg-stone-100 dark:bg-gray-800 flex-shrink-0">
                    {image ? (
                      <Image src={image} alt={itemName} fill unoptimized className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-serif text-base font-semibold text-gray-900 dark:text-white leading-snug line-clamp-1">{itemName}</h3>
                        <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest border ${status.bg} ${status.text} ${status.border}`}>
                          {t.orders.statuses[order.status as keyof typeof t.orders.statuses] || order.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-mono tracking-wider">#{order.id.slice(0, 8)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-[11px] text-gray-500 font-mono tracking-wider">
                        {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} · {itemCount} {t.orders.items}
                      </p>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">Rp {order.total.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
