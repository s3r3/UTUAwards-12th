'use client'

import { Search, CheckCircle, XCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslations } from '@/lib/i18n'

type Product = {
  id: string
  name: string
  owner: { id: string; name: string; email: string } | null
  category: string
  date: string
  status: string
}

export default function AdminProductsPage() {
  const t = useTranslations()
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    let cancelled = false
    async function loadProducts() {
      try {
        const res = await fetch('/api/products')
        const json = await res.json()
        if (json.success && !cancelled) setProducts(json.data)
      } catch (e) {
        console.error(e)
      }
    }
    loadProducts()
    return () => { cancelled = true }
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t.dashboard.adminProducts}</h1>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Cari..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 font-medium">{t.dashboard.product}</th>
                <th className="pb-3 font-medium">{t.dashboard.owner}</th>
                <th className="pb-3 font-medium">{t.dashboard.category}</th>
                <th className="pb-3 font-medium">{t.dashboard.date}</th>
                <th className="pb-3 font-medium text-right">{t.dashboard.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())).map((p) => (
                <tr key={p.id}>
                  <td className="py-3 font-medium text-gray-900 dark:text-white">{p.name}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">{p.owner?.name || p.owner?.email || "-"}</td>
                  <td className="py-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">{p.date}</td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 rounded-lg text-green-600 hover:bg-green-50">
                        <CheckCircle size={18} />
                      </button>
                      <button className="p-1.5 rounded-lg text-red-600 hover:bg-red-50">
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
