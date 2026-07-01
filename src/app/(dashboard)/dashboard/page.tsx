'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Package, FileCheck, BookOpen, Globe, TrendingUp, ArrowUpRight, Plus, ShoppingBag, BarChart3, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { StatsSkeleton } from '@/components/ui/Skeleton'
import { ScrollReveal, StaggerContainer, StaggerItem, HoverCard } from '@/components/AnimatedPage'
import MarketWidget from '@/components/dashboard/MarketWidget'

interface Product {
  id: string
  name: string
  status: string
  createdAt: string
}

const statusStyle = (s: string) =>
  s === 'APPROVED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
  s === 'REVIEW' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
  'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'

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
    { label: 'Total Produk', value: products.length, icon: Package, color: 'from-primary-500 to-emerald-500', change: `${products.length}` },
    { label: 'Sedang Review', value: products.filter(p => p.status === 'REVIEW' || p.status === 'PENDING').length, icon: FileCheck, color: 'from-yellow-500 to-orange-500', change: '-' },
    { label: 'Program Aktif', value: 0, icon: BookOpen, color: 'from-ocean-500 to-blue-500', change: '0' },
    { label: 'Mitra Terhubung', value: 0, icon: Globe, color: 'from-purple-500 to-pink-500', change: '0' },
  ]

  return (
    <div className="space-y-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 text-xs text-primary-600 dark:text-primary-400 mb-1"
          >
            <Sparkles size={12} />
            <span>Dashboard</span>
          </motion.div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Selamat Datang{', '}
            <span className="bg-gradient-to-r from-primary-500 to-ocean-500 bg-clip-text text-transparent">Metuah Hub</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Kelola produk dan pantau perkembangan ekosistem Anda</p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link href="/dashboard/products">
            <Button className="gap-2 shadow-lg shadow-primary-500/20"><Plus size={16} /> Tambah Produk</Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Stats cards with stagger */}
      {loading ? <StatsSkeleton /> : (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s, i) => (
            <StaggerItem key={i}>
              <HoverCard>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="group relative bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 dark:border-gray-800/60 shadow-sm hover:shadow-xl hover:border-transparent transition-all duration-300 overflow-hidden"
                >
                  {/* Gradient hover background */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(135deg, ${s.color.includes('primary') ? 'rgba(34,197,94,0.03)' : 'rgba(14,165,233,0.03)'} 0%, transparent 100%)` }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        className={`p-2.5 rounded-xl bg-gradient-to-br ${s.color} text-white shadow-lg`}
                      >
                        <s.icon size={20} />
                      </motion.div>
                      <motion.span
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="text-xs font-medium flex items-center gap-1 text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full"
                      >
                        <ArrowUpRight size={12} /> {s.change}
                      </motion.span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums">{s.value}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
                  </div>
                </motion.div>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Products + Mentoring */}
        <div className="lg:col-span-2 space-y-6">
          {/* Produk Terbaru */}
          <ScrollReveal>
            <motion.div
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 dark:border-gray-800/60 shadow-sm"
            >
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-sm"
              >
                <Package size={18} className="text-primary-500" /> Produk Terbaru
                {products.length > 0 && (
                  <span className="text-[10px] font-normal text-gray-400 ml-1">({products.length} total)</span>
                )}
              </motion.h2>

              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-14 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-10"
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center mx-auto mb-3"
                  >
                    <Package size={28} className="text-gray-400" />
                  </motion.div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Belum ada produk</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">Daftarkan produk agro-maritim pertama Anda</p>
                  <Link href="/dashboard/products">
                    <Button size="sm" className="gap-1.5 shadow-md"><Plus size={14} /> Tambah Produk</Button>
                  </Link>
                </motion.div>
              ) : (
                <StaggerContainer className="space-y-2">
                  {products.slice(0, 5).map((p, i) => (
                    <StaggerItem key={p.id}>
                      <Link href={`/products/${p.id}`}>
                        <motion.div
                          whileHover={{ x: 3, backgroundColor: 'rgba(34,197,94,0.03)' }}
                          className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-primary-500/20"
                        >
                          <div className="flex items-center gap-3">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs shadow-sm"
                            >
                              {p.name[0]}
                            </motion.div>
                            <div>
                              <p className="font-medium text-sm text-gray-900 dark:text-white">{p.name}</p>
                              <p className="text-[10px] text-gray-400">{new Date(p.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                            </div>
                          </div>
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${statusStyle(p.status)}`}
                          >
                            {p.status}
                          </motion.span>
                        </motion.div>
                      </Link>
                    </StaggerItem>
                  ))}
                  {products.length > 5 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="pt-1"
                    >
                      <Link href="/dashboard/products" className="block text-center text-xs text-primary-600 dark:text-primary-400 hover:underline py-2">
                        Lihat semua {products.length} produk →
                      </Link>
                    </motion.div>
                  )}
                </StaggerContainer>
              )}
            </motion.div>
          </ScrollReveal>

          {/* Mentoring */}
          <ScrollReveal delay={0.1}>
            <motion.div
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 dark:border-gray-800/60 shadow-sm"
            >
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-sm">
                <BookOpen size={18} className="text-ocean-500" /> Program Mentoring
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['Sertifikasi Halal', 'HACCP', 'Export Packaging', 'Supply Chain'].map((name, i) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    whileHover={{ y: -2, borderColor: 'rgba(34,197,94,0.3)' }}
                    className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700/50 cursor-default"
                  >
                    <p className="text-xs font-medium text-gray-900 dark:text-white">{name}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${[65, 30, 10, 0][i]}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-ocean-500"
                        />
                      </div>
                      <span className="text-[10px] font-medium text-gray-400">{['65%', '30%', '10%', 'Mulai'][i]}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link href="/mentoring">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Lihat semua program →
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <ScrollReveal delay={0.15}>
            <MarketWidget />
          </ScrollReveal>

          {/* Premium CTA card */}
          <ScrollReveal delay={0.2}>
            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-primary-600 via-primary-500 to-ocean-500 text-white shadow-xl"
            >
              <motion.div
                className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              />
              <div className="relative z-10">
                <BarChart3 size={24} className="mb-3 opacity-90" />
                <h3 className="font-bold text-lg mb-1">Pantau Harga Pasar</h3>
                <p className="text-sm text-white/80 mb-4">Ikuti pergerakan harga komoditas agro-maritim Aceh di pasar global secara real-time.</p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="text-sm font-semibold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-colors backdrop-blur-sm border border-white/20"
                >
                  Lihat Detail ↗
                </motion.button>
              </div>
            </motion.div>
          </ScrollReveal>

          {/* Quick tips */}
          <ScrollReveal delay={0.25}>
            <motion.div
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 dark:border-gray-800/60 shadow-sm"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-2">
                <Sparkles size={15} className="text-yellow-500" /> Tips Cepat
              </h3>
              <div className="space-y-2.5">
                {[
                  { emoji: '📸', text: 'Tambah foto produk untuk meningkatkan daya tarik' },
                  { emoji: '📋', text: 'Lengkapi legalitas produk untuk akses pasar ekspor' },
                  { emoji: '🎓', text: 'Ikuti mentoring sertifikasi Halal & HACCP' },
                ].map((tip, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-400"
                  >
                    <span className="text-sm">{tip.emoji}</span>
                    <span>{tip.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  )
}
