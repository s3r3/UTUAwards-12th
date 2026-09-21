'use client'

import { useEffect, useState } from 'react'
import { Layers } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

const KNOWN = ['COFFEE', 'PATCHOULI', 'SEAFOOD', 'SPICES', 'PROCESSED']

export default function AdminCategoriesPage() {
  const t = useTranslations()
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(d => {
        const map: Record<string, number> = {}
        if (d.success) {
          for (const p of d.data as { category: string }[]) map[p.category] = (map[p.category] || 0) + 1
        }
        setCounts(map)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {KNOWN.map((c) => (
        <div key={c} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <Layers size={20} className="mb-3 text-emerald-600 dark:text-emerald-400" />
          <p className="font-semibold text-gray-950 dark:text-white">{c}</p>
          <p className="mt-1 text-3xl font-bold text-gray-950 dark:text-white">{loading ? '—' : counts[c] || 0}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t.admin.registeredProducts}</p>
        </div>
      ))}
    </div>
  )
}
