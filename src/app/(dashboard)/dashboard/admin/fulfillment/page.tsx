'use client'

import { useEffect, useState } from 'react'
import { Truck } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { adminFallbackOrders, formatRupiah } from '@/data/adminDemo'

interface Order {
  id: string
  status: string
  total: number
  user?: { name: string }
  items?: { quantity: number }[]
  createdAt: string
}

export default function AdminFulfillmentPage() {
  const t = useTranslations()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data.length > 0) setOrders(d.data)
        else setOrders(adminFallbackOrders)
      })
      .catch(() => setOrders(adminFallbackOrders))
      .finally(() => setLoading(false))
  }, [])

  const queue = orders.filter((o) => ['PAID', 'PROCESSING', 'SHIPPING'].includes(o.status))

  const advance = async (id: string, next: string) => {
    if (id.startsWith('cm_demo')) {
      setOrders((p) => p.map((o) => (o.id === id ? { ...o, status: next } : o)))
      return
    }
    const res = await fetch(`/api/orders/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }) })
    const d = await res.json()
    if (d.success) setOrders((p) => p.map((o) => (o.id === id ? { ...o, status: next } : o)))
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <p className="flex items-center gap-2 text-sm font-medium text-gray-950 dark:text-white"><Truck size={16} /> {t.admin.fulfillQueue}</p>
        <p className="mt-1 text-3xl font-bold text-gray-950 dark:text-white">{loading ? '—' : queue.length} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{t.admin.fulfillOrdersSuffix}</span></p>
      </div>

      <div className="space-y-3">
        {queue.map((o) => (
          <div key={o.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs text-gray-500 dark:text-gray-400">#{o.id.slice(0, 8)}</p>
              <p className="text-sm font-semibold text-gray-950 dark:text-white">{o.user?.name || 'Customer'} · {formatRupiah(o.total)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t.admin.status}: {o.status}</p>
            </div>
            <div className="flex gap-2">
              {o.status === 'PAID' && <button onClick={() => advance(o.id, 'PROCESSING')} className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">{t.admin.process}</button>}
              {o.status === 'PROCESSING' && <button onClick={() => advance(o.id, 'SHIPPING')} className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-700">{t.admin.ship}</button>}
              {o.status === 'SHIPPING' && <button onClick={() => advance(o.id, 'DELIVERED')} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">{t.admin.complete}</button>}
            </div>
          </div>
        ))}
        {!loading && queue.length === 0 && <p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">{t.admin.fulfillEmpty}</p>}
      </div>
    </div>
  )
}
