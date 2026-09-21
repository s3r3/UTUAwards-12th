'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { adminFallbackProducts } from '@/data/adminDemo'

interface Product {
  id: string
  name: string
  category: string
  status: string
  owner?: { name: string; email: string } | null
}

const demoQueue = () =>
  adminFallbackProducts
    .filter((p) => ['PENDING', 'REVIEW', 'Pending Approval'].includes(p.status))
    .map((p) => ({ id: p.id, name: p.name, category: p.category, status: p.status, owner: p.owner }))

export default function AdminProductApprovalPage() {
  const t = useTranslations()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    fetch('/api/products?status=PENDING')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data.length > 0) setProducts(d.data)
        else setProducts(demoQueue())
      })
      .catch(() => setProducts(demoQueue()))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const decide = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    if (id.startsWith('p_demo')) {
      setProducts((p) => p.filter((x) => x.id !== id))
      return
    }
    const res = await fetch(`/api/products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    const d = await res.json().catch(() => null)
    if (d?.success) setProducts((p) => p.filter((x) => x.id !== id))
  }

  if (loading) return <div className="space-y-3">{[0, 1].map((i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />)}</div>

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500 dark:text-gray-400">{t.admin.pendingReviewCount.replace('{count}', String(products.length))}</p>
      {products.map((p) => (
        <div key={p.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-950 dark:text-white">{p.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{p.category} · {p.owner?.name || p.owner?.email || t.admin.noOwner} · {p.status}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => decide(p.id, 'APPROVED')} className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"><CheckCircle size={14} /> {t.admin.approve}</button>
            <button onClick={() => decide(p.id, 'REJECTED')} className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20"><XCircle size={14} /> {t.admin.reject}</button>
          </div>
        </div>
      ))}
      {products.length === 0 && <p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">{t.admin.noPending}</p>}
    </div>
  )
}
