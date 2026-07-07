'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Clock, CheckCircle, Package } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import type { Order } from '@/types'

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const t = useTranslations()

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(d => { if (d.success) setOrders(d.data) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-6">{t.common.loading}</div>

  const pending = orders.filter(o => o.status === 'PENDING' || o.status === 'PAID').length
  const completed = orders.filter(o => o.status === 'DELIVERED').length

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.dashboard.overviewTitle}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <ShoppingBag size={20} className="text-primary-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{orders.length}</p>
          <p className="text-sm text-gray-500">{t.dashboard.totalOrders}</p>
        </div>
        <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <Clock size={20} className="text-yellow-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{pending}</p>
          <p className="text-sm text-gray-500">{t.dashboard.pendingOrders}</p>
        </div>
        <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <CheckCircle size={20} className="text-green-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{completed}</p>
          <p className="text-sm text-gray-500">{t.dashboard.completedOrders}</p>
        </div>
      </div>

      {orders.length > 0 && (
        <div>
          <h2 className="font-semibold mb-3 text-gray-900 dark:text-white">{t.dashboard.recentOrders}</h2>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {orders.slice(0, 5).map(order => (
              <Link key={order.id} href={`/dashboard/orders/${order.id}`} className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">#{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">Rp {order.total.toLocaleString('id-ID')}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
