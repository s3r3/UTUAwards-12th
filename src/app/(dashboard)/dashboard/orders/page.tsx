'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import type { Order } from '@/types'

export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const t = useTranslations()

  useEffect(() => {
    fetch('/api/orders').then(r => r.json()).then(d => { if (d.success) setOrders(d.data) }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div>{t.common.loading}</div>
  if (orders.length === 0) return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <Package size={48} className="text-gray-300" />
      <p>{t.orders.noOrders}</p>
      <Link href="/products" className="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm">{t.cart.continueShopping}</Link>
    </div>
  )

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t.orders.title}</h1>
      <div className="rounded-2xl border dark:border-gray-700 overflow-hidden">
        {orders.map(order => (
          <Link key={order.id} href={`/dashboard/orders/${order.id}`} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <div>
              <p className="font-medium">#{order.id.slice(0, 8)}</p>
              <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">Rp {order.total.toLocaleString('id-ID')}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
              }`}>{t.orders.statuses[order.status as keyof typeof t.orders.statuses] || order.status}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
