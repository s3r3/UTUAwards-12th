'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import type { Order } from '@/types'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const t = useTranslations()

  useEffect(() => {
    fetch('/api/orders').then(r => r.json()).then(d => { if (d.success) setOrders(d.data) }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center">{t.common.loading}</div>

  if (orders.length === 0) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
      <Package size={64} className="text-gray-300" />
      <h2 className="text-xl font-semibold">{t.orders.noOrders}</h2>
      <p className="text-gray-500">{t.orders.noOrdersDesc}</p>
      <Link href="/products" className="px-6 py-2.5 rounded-xl bg-primary-500 text-white font-medium">{t.cart.continueShopping}</Link>
    </div>
  )

  return (
    <div className="min-h-screen pt-24 pb-12 max-w-4xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">{t.orders.title}</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <Link key={order.id} href={`/orders/${order.id}`} className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md">
            <div>
              <p className="font-semibold">#{order.id.slice(0, 8)}</p>
              <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
              <p className="text-sm text-gray-500">{order.items.length} {t.orders.items}</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                order.status === 'DELIVERED' ? 'bg-gray-100 text-gray-800' :
                order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {t.orders.statuses[order.status as keyof typeof t.orders.statuses] || order.status}
              </span>
              <p className="font-bold mt-1">Rp {order.total.toLocaleString('id-ID')}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
