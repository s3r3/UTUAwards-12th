'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from '@/lib/i18n'

interface AdminOrder {
  id: string
  status: string
  total: number
  createdAt: string
  user: { name: string; email: string }
  items: any[]
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const t = useTranslations()

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(d => { if (d.success) setOrders(d.data) })
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    const d = await res.json()
    if (d.success) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    }
  }

  if (loading) return <div>{t.common.loading}</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t.dashboard.adminOrders}</h1>
      <div className="overflow-x-auto rounded-2xl border dark:border-gray-700 bg-white dark:bg-gray-900">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="text-left p-3 font-medium">Order</th>
              <th className="text-left p-3 font-medium">Customer</th>
              <th className="text-left p-3 font-medium">Items</th>
              <th className="text-left p-3 font-medium">Total</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-t dark:border-gray-800">
                <td className="p-3 font-mono text-xs">#{order.id.slice(0, 8)}</td>
                <td className="p-3">{order.user?.name || order.id.slice(0, 6)}</td>
                <td className="p-3">{order.items.length}</td>
                <td className="p-3">Rp {order.total.toLocaleString('id-ID')}</td>
                <td className="p-3">
                  <select
                    value={order.status}
                    onChange={e => updateStatus(order.id, e.target.value)}
                    className="text-xs p-1 border rounded bg-transparent"
                  >
                    {['PENDING', 'PAID', 'PROCESSING', 'SHIPPING', 'DELIVERED', 'CANCELLED'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="p-3 text-gray-500 text-xs">{new Date(order.createdAt).toLocaleDateString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
