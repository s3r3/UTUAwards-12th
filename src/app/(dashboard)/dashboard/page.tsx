'use client'

import { useEffect, useState } from 'react'
import { Package, FileCheck, BookOpen, Globe, TrendingUp, ArrowUpRight, Plus, ShoppingBag, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { StatsSkeleton, CardSkeleton } from '@/components/ui/Skeleton'
import MarketWidget from '@/components/dashboard/MarketWidget'

interface Product {
  id: string
  name: string
  status: string
  createdAt: string
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/products')
        const json = await res.json()
        if (json.success) setProducts(json.data)
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    })()
  }, [])

  const stats = [
    { label: 'Total Produk', value: products.length, icon: Package, color: 'bg-primary-500', change: `+${products.length}` },
    { label: 'Sedang Review', value: products.filter(p => p.status === 'REVIEW' || p.status === 'PENDING').length, icon: FileCheck, color: 'bg-yellow-500', change: '-' },
    { label: 'Program Aktif', value: 0, icon: BookOpen, color: 'bg-ocean-500', change: '0' },
    { label: 'Mitra Terhubung', value: 0, icon: Globe, color: 'bg-purple-500', change: '0' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Selamat datang di Metuah Hub</p>
        </div>
        <Link href="/dashboard/products">
          <Button className="gap-2"><Plus size={16} /> Tambah Produk</Button>
        </Link>
      </div>

      {loading ? <StatsSkeleton /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${s.color} text-white`}><s.icon size={20} /></div>
                <span className="text-xs font-medium flex items-center gap-1 text-green-600">
                  <ArrowUpRight size={14} /> {s.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{s.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Products */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Package size={20} className="text-primary-500" /> Produk Terbaru
            </h2>
            {loading ? <CardSkeleton /> : products.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
                  <Package size={24} className="text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Belum ada produk</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Mulai dengan mendaftarkan produk pertama Anda</p>
                <Link href="/dashboard/products"><Button size="sm" className="gap-1.5"><Plus size={14} /> Tambah Produk</Button></Link>
              </div>
            ) : (
              <div className="space-y-3">
                {products.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{p.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(p.createdAt).toLocaleDateString('id-ID')}</p>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      p.status === 'APPROVED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      p.status === 'REVIEW' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>{p.status}</span>
                  </div>
                ))}
                {products.length > 5 && (
                  <Link href="/dashboard/products" className="block text-center text-sm text-primary-600 hover:underline pt-2">
                    Lihat semua ({products.length} produk)
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Mentoring */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-ocean-500" /> Program Mentoring
            </h2>
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
                <BookOpen size={24} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Ikuti program mentoring</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Tingkatkan kualitas produk dengan sertifikasi global</p>
              <Link href="/mentoring"><Button size="sm" variant="outline" className="gap-1.5"><ShoppingBag size={14} /> Lihat Program</Button></Link>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <MarketWidget />
          <div className="bg-gradient-to-br from-primary-500 to-ocean-500 rounded-2xl p-6 text-white">
            <BarChart3 size={24} className="mb-3 opacity-80" />
            <h3 className="font-bold text-lg mb-1">Pantau Harga Pasar</h3>
            <p className="text-sm text-white/80 mb-4">Ikuti pergerakan harga komoditas agro-maritim Aceh di pasar global secara real-time.</p>
            <Link href="/">
              <button className="text-sm font-semibold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-colors">
                Lihat Detail
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
