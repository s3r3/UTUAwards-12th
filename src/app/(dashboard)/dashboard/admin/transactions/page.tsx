'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from '@/lib/i18n'
import { adminFallbackOrders, formatRupiah } from '@/data/adminDemo'

interface Order {
  id: string
  status: string
  total: number
  createdAt: string
  user?: { name: string }
}

export default function AdminTransactionsPage() {
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

  const revenue = orders.reduce((s, o) => s + (o.total || 0), 0)

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm text-gray-500 dark:text-gray-400">{t.admin.totalTransactionValue}</p>
        <p className="mt-1 text-3xl font-bold text-gray-950 dark:text-white">{loading ? '—' : formatRupiah(revenue)}</p>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{t.admin.recordedTransactions.replace('{count}', String(orders.length))}</p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <th className="px-4 py-3 font-medium">{t.admin.orderId}</th>
              <th className="px-4 py-3 font-medium">{t.admin.customer}</th>
              <th className="px-4 py-3 font-medium">{t.admin.total}</th>
              <th className="px-4 py-3 font-medium">{t.admin.status}</th>
              <th className="px-4 py-3 font-medium">{t.admin.date}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">#{o.id.slice(0, 8)}</td>
                <td className="px-4 py-3 text-gray-950 dark:text-white">{o.user?.name || '—'}</td>
                <td className="px-4 py-3 font-medium text-gray-950 dark:text-white">{formatRupiah(o.total)}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{o.status}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{new Date(o.createdAt).toLocaleDateString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
