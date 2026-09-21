'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from '@/lib/i18n'
import { adminFallbackOrders, formatRupiah } from '@/data/adminDemo'

export default function AdminPaymentsPage() {
  const t = useTranslations()
  const [orders, setOrders] = useState<{ id: string; status: string; total: number }[]>([])

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data.length > 0) setOrders(d.data)
        else setOrders(adminFallbackOrders)
      })
      .catch(() => setOrders(adminFallbackOrders))
  }, [])

  const paid = orders.filter((o) => ['PAID', 'PROCESSING', 'SHIPPING', 'DELIVERED'].includes(o.status))
  const pending = orders.filter((o) => o.status === 'PENDING')

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm text-gray-500 dark:text-gray-400">{t.admin.incomingPayments}</p>
        <p className="mt-1 text-3xl font-bold text-emerald-600 dark:text-emerald-400">{formatRupiah(paid.reduce((s, o) => s + o.total, 0))}</p>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{t.admin.paidOrdersCount.replace('{count}', String(paid.length))}</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm text-gray-500 dark:text-gray-400">{t.admin.pendingPayments}</p>
        <p className="mt-1 text-3xl font-bold text-amber-600 dark:text-amber-400">{formatRupiah(pending.reduce((s, o) => s + o.total, 0))}</p>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{t.admin.pendingOrdersCount.replace('{count}', String(pending.length))}</p>
      </div>
    </div>
  )
}
