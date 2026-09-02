'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Clock, CheckCircle, Package, ArrowRight } from 'lucide-react'
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

  if (loading) return <div className="p-6">Loading...</div>

  const pending = orders.filter(o => o.status === 'PENDING' || o.status === 'PAID').length
  const completed = orders.filter(o => o.status === 'DELIVERED').length

  return (
    <div className="space-y-8 overflow-x-hidden">
      <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">
        {t.dashboard.overviewTitle}
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: t.dashboard.totalOrders, value: orders.length, icon: ShoppingBag, color: 'text-gray-900 dark:text-white' },
          { label: t.dashboard.pendingOrders, value: pending, icon: Clock, color: 'text-amber-600' },
          { label: t.dashboard.completedOrders, value: completed, icon: CheckCircle, color: 'text-emerald-600' },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-lg border border-black/10 bg-white dark:bg-gray-900">
            <stat.icon size={24} className={`mb-4 ${stat.color}`} />
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
            <p className="text-xs uppercase tracking-widest text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      {orders.length > 0 && (
        <section className="border border-black/10 bg-white dark:bg-gray-900">
          <div className="px-6 py-4 border-b border-black/10 flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-gray-900 dark:text-white">
              {t.dashboard.recentOrders}
            </h2>
            <Link href="/dashboard/orders" className="text-xs uppercase tracking-widest text-gray-500 hover:text-black flex items-center gap-1">
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-black/5">
            {orders.slice(0, 5).map(order => (
              <Link key={order.id} href={`/dashboard/orders/${order.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-stone-50 dark:hover:bg-gray-800 transition-colors">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.items[0]?.product?.name || `Order #${order.id.slice(0, 8)}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 font-mono">{new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">Rp {order.total.toLocaleString('id-ID')}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
