'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, Users, Search, CheckCircle, XCircle, Clock, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { useAuthStore } from '@/store/auth.store'

type Product = {
  id: string
  name: string
  category: string
  status: string
  createdAt: string
  owner: { id: string; name: string; email: string }
}

const statusBadge: Record<string, string> = {
  APPROVED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  REVIEW: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  PENDING: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  VERIFIED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const getCategoryLabel = (cat: string, t: ReturnType<typeof useTranslations>) => {
  const map: Record<string, string> = {
    COFFEE: t.products.categories.coffee,
    PATCHOULI: t.products.categories.patchouli,
    SEAFOOD: t.products.categories.seafood,
    SPICES: t.products.categories.spices,
    PROCESSED: t.products.categories.processed,
  }
  return map[cat] || cat
}

export default function AdminDashboardPage() {
  const { user } = useAuthStore()
  const t = useTranslations()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/products')
        const json = await res.json()
        if (json.success) setProducts(json.data)
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    })()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    setActionLoading(id)
    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      setProducts((prev) => prev.map((p) => p.id === id ? { ...p, status } : p))
    } catch (e) { console.error(e) }
    finally { setActionLoading(null) }
  }

  const totalProducts = products.length
  const pendingCount = products.filter((p) => p.status === 'PENDING').length
  const reviewCount = products.filter((p) => p.status === 'REVIEW').length
  const approvedCount = products.filter((p) => p.status === 'APPROVED').length
  const rejectedCount = products.filter((p) => p.status === 'REJECTED').length
  const uniqueOwners = new Set(products.map((p) => p.owner?.id)).size

  const pendingProducts = products
    .filter((p) => (p.status === 'PENDING' || p.status === 'REVIEW') && p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const recentProducts = products
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const stats = [
    { label: 'Total Produk', value: totalProducts, icon: Package, color: 'from-primary-500 to-emerald-500', change: `${approvedCount} disetujui` },
    { label: 'Menunggu Review', value: pendingCount + reviewCount, icon: Clock, color: 'from-yellow-500 to-orange-500', change: `${pendingCount} pending, ${reviewCount} review` },
    { label: 'Produsen', value: uniqueOwners, icon: Users, color: 'from-ocean-500 to-blue-500', change: 'terdaftar' },
    { label: 'Ditolak', value: rejectedCount, icon: AlertTriangle, color: 'from-red-500 to-rose-500', change: 'perlu perhatian' },
  ]

  if (user?.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertTriangle size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Akses Ditolak</h2>
          <p className="text-sm text-gray-500 mt-1">Halaman ini hanya untuk admin</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-primary-600 dark:text-primary-400 mb-1">
            <Sparkles size={12} /> Panel Admin
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard <span className="bg-gradient-to-r from-primary-500 to-ocean-500 bg-clip-text text-transparent">Admin</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Kelola & pantau seluruh aktivitas platform</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white dark:bg-gray-800/80 rounded-2xl p-5 border border-gray-100 dark:border-gray-800/60 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${s.color} text-white shadow-lg`}>
                <s.icon size={20} />
              </div>
              <TrendingUp size={16} className="text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{loading ? '-' : s.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
            <div className="text-[10px] text-gray-400 mt-1">{s.change}</div>
          </motion.div>
        ))}
      </div>

      {/* Pending Products */}
      <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-6 border border-gray-100 dark:border-gray-800/60 shadow-sm">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock size={20} className="text-yellow-500" />
            Menunggu Review
            {pendingProducts.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-medium">
                {pendingProducts.length}
              </span>
            )}
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text" placeholder="Cari produk..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Memuat...</div>
        ) : pendingProducts.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle size={40} className="mx-auto text-green-300 mb-3" />
            <p className="text-gray-500 font-medium">Semua produk sudah direview</p>
            <p className="text-xs text-gray-400 mt-1">Tidak ada produk yang menunggu persetujuan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-3 font-medium">Produk</th>
                  <th className="pb-3 font-medium">Produsen</th>
                  <th className="pb-3 font-medium">Kategori</th>
                  <th className="pb-3 font-medium">Tanggal</th>
                  <th className="pb-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {pendingProducts.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 font-medium text-gray-900 dark:text-white">{p.name}</td>
                    <td className="py-3 text-gray-600 dark:text-gray-400">{p.owner?.name || '-'}</td>
                    <td className="py-3">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {getCategoryLabel(p.category, t)}
                      </span>
                    </td>
                    <td className="py-3 text-gray-600 dark:text-gray-400 text-xs">
                      {new Date(p.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => updateStatus(p.id, 'APPROVED')}
                          disabled={actionLoading === p.id}
                          className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors disabled:opacity-40"
                          title="Setujui"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => updateStatus(p.id, 'REJECTED')}
                          disabled={actionLoading === p.id}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-40"
                          title="Tolak"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-6 border border-gray-100 dark:border-gray-800/60 shadow-sm">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <Package size={18} className="text-primary-500" />
            Produk Terbaru
          </h2>
          {loading ? (
            <div className="text-center py-8 text-gray-400">Memuat...</div>
          ) : (
            <div className="space-y-3">
              {recentProducts.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{p.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{p.owner?.name || '-'}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ml-3 ${statusBadge[p.status] || statusBadge.PENDING}`}>
                    {p.status}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Overview by Status */}
        <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-6 border border-gray-100 dark:border-gray-800/60 shadow-sm">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-ocean-500" />
            Status Produk
          </h2>
          {loading ? (
            <div className="text-center py-8 text-gray-400">Memuat...</div>
          ) : (
            <div className="space-y-4">
              {[
                { label: 'Disetujui', count: approvedCount, color: 'bg-green-500', pct: totalProducts ? Math.round(approvedCount / totalProducts * 100) : 0 },
                { label: 'Review', count: reviewCount, color: 'bg-yellow-500', pct: totalProducts ? Math.round(reviewCount / totalProducts * 100) : 0 },
                { label: 'Pending', count: pendingCount, color: 'bg-gray-400', pct: totalProducts ? Math.round(pendingCount / totalProducts * 100) : 0 },
                { label: 'Ditolak', count: rejectedCount, color: 'bg-red-500', pct: totalProducts ? Math.round(rejectedCount / totalProducts * 100) : 0 },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{s.label}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{s.count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.pct}%` }}
                      className={`h-full rounded-full ${s.color}`}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">{s.pct}% dari total</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
