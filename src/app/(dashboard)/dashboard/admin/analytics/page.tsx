'use client'

import { useEffect, useMemo, useState } from 'react'
import { ShoppingBag, TrendingUp, Wallet } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import RevenueTrendChart from '@/components/admin/RevenueTrendChart'
import AdminMetricCard from '@/components/admin/AdminMetricCard'
import { formatRupiah } from '@/data/adminDemo'

interface Order {
  total: number
  status: string
  createdAt: string
}

const FALLBACK = [
  { day: 'Sen', date: '2026-09-14', value: 2850000 },
  { day: 'Sel', date: '2026-09-15', value: 3150000 },
  { day: 'Rab', date: '2026-09-16', value: 2600000 },
  { day: 'Kam', date: '2026-09-17', value: 4250000 },
  { day: 'Jum', date: '2026-09-18', value: 3850000 },
  { day: 'Sab', date: '2026-09-19', value: 5200000 },
  { day: 'Min', date: '2026-09-20', value: 4950000 },
]

function toKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function AdminAnalyticsPage() {
  const t = useTranslations()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data.length > 0) setOrders(d.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const series = useMemo(() => {
    if (orders.length === 0) return FALLBACK
    const days: { key: string; label: string; iso: string }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      days.push({
        key: toKey(d),
        label: d.toLocaleDateString('id-ID', { weekday: 'short' }),
        iso: d.toISOString(),
      })
    }
    const map = new Map<string, number>()
    for (const o of orders) {
      const k = toKey(new Date(o.createdAt))
      map.set(k, (map.get(k) || 0) + (o.total || 0))
    }
    return days.map((d) => ({ day: d.label, date: d.iso, value: map.get(d.key) || 0 }))
  }, [orders])

  const total = series.reduce((s, d) => s + d.value, 0)
  const avg = orders.length > 0 ? Math.round(total / orders.length) : 0
  const paidCount = orders.filter((o) => ['PAID', 'PROCESSING', 'SHIPPING', 'DELIVERED'].includes(o.status)).length

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <AdminMetricCard label={t.admin.revenue7d} value={loading ? '—' : formatRupiah(total)} icon={Wallet} tone="emerald" hint={orders.length === 0 ? t.admin.demoRevenue : t.admin.revenue7dHint.replace('{count}', String(orders.length))} />
        <AdminMetricCard label={t.admin.avgOrder} value={loading ? '—' : formatRupiah(avg)} icon={TrendingUp} tone="ocean" />
        <AdminMetricCard label={t.admin.paidOrders} value={loading ? '—' : String(paidCount)} icon={ShoppingBag} tone="amber" />
      </div>
      <RevenueTrendChart data={series} loading={loading} />
      {orders.length === 0 && !loading && (
        <p className="text-xs text-gray-400 dark:text-gray-500">{t.admin.analyticsDemoNote}</p>
      )}
    </div>
  )
}
