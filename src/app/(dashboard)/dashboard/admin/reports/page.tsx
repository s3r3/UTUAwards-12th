'use client'

import { useEffect, useState } from 'react'
import { FileText, Download } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { formatRupiah } from '@/data/adminDemo'

export default function AdminReportsPage() {
  const t = useTranslations()
  const [summary, setSummary] = useState({ orders: 0, revenue: 0, users: 0, products: 0 })

  useEffect(() => {
    Promise.allSettled([
      fetch('/api/orders').then(r => r.json()),
      fetch('/api/products').then(r => r.json()),
      fetch('/api/users').then(r => r.json()),
    ]).then(([o, p, u]) => {
      const orders = o.status === 'fulfilled' && o.value.success ? o.value.data : []
      const products = p.status === 'fulfilled' && p.value.success ? p.value.data : []
      const users = u.status === 'fulfilled' && u.value.success ? u.value.data : []
      setSummary({
        orders: orders.length,
        revenue: (orders as { total: number }[]).reduce((s, x) => s + (x.total || 0), 0),
        users: users.length,
        products: products.length,
      })
    })
  }, [])

  const download = () => {
    const csv = `metrik,nilai\norders,${summary.orders}\nrevenue,${summary.revenue}\nusers,${summary.users}\nproducts,${summary.products}\n`
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'acelora-admin-report.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: t.admin.ordersMetric, value: String(summary.orders) },
          { label: t.admin.revenueMetric, value: formatRupiah(summary.revenue) },
          { label: t.admin.usersMetric, value: String(summary.users) },
          { label: t.admin.productsMetric, value: String(summary.products) },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <FileText size={18} className="mb-3 text-emerald-600 dark:text-emerald-400" />
            <p className="text-xl font-bold text-gray-950 dark:text-white">{s.value}</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>
      <button onClick={download} className="flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200">
        <Download size={15} /> {t.admin.downloadCsv}
      </button>
    </div>
  )
}
