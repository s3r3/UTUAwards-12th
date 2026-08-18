'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Package, ArrowLeft } from 'lucide-react'
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

export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const t = useTranslations()

  useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setOrders(d.data)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>{t.common.loading}</div>

  if (orders.length === 0)
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <Package size={48} className="text-gray-300" />
        <p className="text-gray-600 dark:text-gray-400">{t.orders.noOrders}</p>
        <Link
          href="/products"
          className="px-4 py-2 rounded-lg bg-gray-950 dark:bg-white text-white dark:text-gray-900 text-sm uppercase tracking-widest hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          {t.cart.continueShopping}
        </Link>
      </div>
    )

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {t.orders.title}
      </h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const status = statusColors[order.status] || statusColors.PENDING
          const mainItem = order.items[0]

          return (
            <Link
              key={order.id}
              href={`/dashboard/orders/${order.id}`}
              className="flex items-center gap-4 p-4 rounded-lg border border-black/10 hover:border-black/40 bg-white dark:bg-gray-900 transition-colors"
            >
              {/* Thumbnail */}
              <div className="w-16 h-16 relative bg-stone-100 dark:bg-gray-800 rounded overflow-hidden flex-shrink-0">
                {mainItem?.product?.image ? (
                  <Image
                    src={mainItem.product.image}
                    alt={mainItem.product.name || 'Product'}
                    fill
                    unoptimized
                    className="object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300">
                    <Package size={20} />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="font-serif text-base font-semibold text-gray-900 dark:text-white truncate">
                  {mainItem?.product?.name || order.id.slice(0, 8)}
                </p>
                <p className="text-xs text-gray-500 font-mono tracking-wider mt-1">
                  #{order.id.slice(0, 8)} · {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>

              {/* Status + Total */}
              <div className="text-right flex-shrink-0">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest border ${status.bg} ${status.text} ${status.border}`}
                >
                  {t.orders.statuses[order.status as keyof typeof t.orders.statuses] || order.status}
                </span>
                <p className="font-semibold text-gray-900 dark:text-white mt-1">
                  Rp {order.total.toLocaleString('id-ID')}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
