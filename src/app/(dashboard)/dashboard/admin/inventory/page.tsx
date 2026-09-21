'use client'

import { useEffect, useState } from 'react'
import { Warehouse } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { adminFallbackProducts } from '@/data/adminDemo'

interface Product {
  id: string
  name: string
  stock?: number
  price?: number
  status: string
  owner?: { name: string } | null
}

export default function AdminInventoryPage() {
  const t = useTranslations()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data.length > 0) setProducts(d.data)
        else setProducts(adminFallbackProducts.map((p, i) => ({ id: p.id, name: p.name, stock: [420, 8, 0][i] || 0, price: 100000, status: p.status, owner: p.owner })))
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  const low = products.filter((p) => (p.stock || 0) <= 10)
  const out = products.filter((p) => (p.stock || 0) === 0)

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: t.admin.totalSku, value: loading ? '—' : String(products.length) },
          { label: t.admin.lowStock, value: loading ? '—' : String(low.length) },
          { label: t.admin.outOfStock, value: loading ? '—' : String(out.length) },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <Warehouse size={20} className="mb-3 text-emerald-600 dark:text-emerald-400" />
            <p className="text-3xl font-bold text-gray-950 dark:text-white">{s.value}</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <th className="px-4 py-3 font-medium">{t.admin.product}</th>
              <th className="px-4 py-3 font-medium">{t.admin.owner}</th>
              <th className="px-4 py-3 font-medium">{t.admin.stock}</th>
              <th className="px-4 py-3 font-medium">{t.admin.status}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium text-gray-950 dark:text-white">{p.name}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{p.owner?.name || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${(p.stock || 0) === 0 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : (p.stock || 0) <= 10 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'}`}>
                    {p.stock ?? '—'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500">{t.admin.inventorySourceNote}</p>
    </div>
  )
}
