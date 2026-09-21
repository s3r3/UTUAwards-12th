'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from '@/lib/i18n'
import { adminFallbackOrders, formatRupiah } from '@/data/adminDemo'

interface Buyer {
  name: string
  orders: number
  revenue: number
}

export default function AdminBuyersPage() {
  const t = useTranslations()
  const [buyers, setBuyers] = useState<Buyer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(d => {
        const list = (d.success && d.data.length > 0 ? d.data : adminFallbackOrders) as { user?: { name: string }; total: number }[]
        const map = new Map<string, Buyer>()
        for (const o of list) {
          const name = o.user?.name || 'Customer'
          const cur = map.get(name) || { name, orders: 0, revenue: 0 }
          cur.orders += 1
          cur.revenue += o.total || 0
          map.set(name, cur)
        }
        setBuyers([...map.values()].sort((a, b) => b.revenue - a.revenue))
      })
      .catch(() => setBuyers([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="h-32 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <th className="px-4 py-3 font-medium">{t.admin.buyer}</th>
            <th className="px-4 py-3 font-medium">{t.admin.ordersCol}</th>
            <th className="px-4 py-3 font-medium">{t.admin.revenue}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {buyers.map((b) => (
            <tr key={b.name}>
              <td className="px-4 py-3 font-medium text-gray-950 dark:text-white">{b.name}</td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{b.orders}</td>
              <td className="px-4 py-3 font-semibold text-gray-950 dark:text-white">{formatRupiah(b.revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
