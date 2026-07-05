'use client'

import { useTranslations } from "@/lib/i18n"
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { TrendingUp, DollarSign, BarChart3, Users, Rocket, Target, Zap } from 'lucide-react'

const revenueStreams = [
  { name: 'Komisi Transaksi', pct: 35, desc: 'Fee per transaksi yang berhasil melalui platform' },
  { name: 'Langganan Premium', pct: 25, desc: 'Biaya berlangganan fitur premium untuk UMKM' },
  { name: 'Mentoring Fee', pct: 20, desc: 'Biaya program mentoring dan sertifikasi' },
  { name: 'Partnership Fee', pct: 15, desc: 'Fee kemitraan dengan buyer internasional' },
  { name: 'Data & Insight', pct: 5, desc: 'Layanan analisis data komoditas' },
]

const projections = [
  { year: 'Tahun 1', revenue: 'Rp 500 Jt', users: '500 UMKM', growth: '+100%' },
  { year: 'Tahun 2', revenue: 'Rp 2 M', users: '2.000 UMKM', growth: '+300%' },
  { year: 'Tahun 3', revenue: 'Rp 8 M', users: '5.000 UMKM', growth: '+300%' },
  { year: 'Tahun 5', revenue: 'Rp 25 M', users: '15.000 UMKM', growth: '+212%' },
]

const advantages = [
  { icon: Target, title: 'First Mover', desc: 'Platform agro-maritim digital pertama yang fokus di ekosistem Aceh.' },
  { icon: Users, title: 'Network Effect', desc: 'Semakin banyak UMKM bergabung, semakin menarik bagi buyer internasional.' },
  { icon: Zap, title: 'Tech-Enabled', desc: 'Teknologi traceability dan digitalisasi end-to-end.' },
  { icon: Rocket, title: 'Scalable', desc: 'Model bisnis dapat direplikasi ke daerah agro-maritim lain di Indonesia.' },
]

export default function BusinessPage() {
  const t = useTranslations()
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-28 pb-20 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t.business.pageTitle} <span className="bg-gradient-to-r from-primary-600 to-ocean-600 bg-clip-text text-transparent">{t.business.pageTitleHighlight}</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t.business.pageDesc}
          </p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
            <DollarSign className="text-primary-500" /> {t.business.revenueTitle}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center">
              <div className="relative w-64 h-64">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background: 'conic-gradient(#22c55e 0% 35%, #0ea5e9 35% 60%, #f59e0b 60% 80%, #8b5cf6 80% 95%, #ef4444 95% 100%)',
                  }}
                />
                <div className="absolute inset-6 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">100%</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Total Revenue</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {revenueStreams.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ["#22c55e", "#0ea5e9", "#f59e0b", "#8b5cf6", "#ef4444"][i] }} />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{s.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{s.desc}</p>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-primary-600 dark:text-primary-400 ml-4">{s.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
            <TrendingUp className="text-primary-500" /> {t.business.growthTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projections.map((p, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg text-center">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">{p.year}</h3>
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">{p.revenue}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{p.users}</div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">{p.growth}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
            <BarChart3 className="text-primary-500" /> {t.business.advantageTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((a, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 text-center hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center text-white mx-auto mb-4">
                  <a.icon size={28} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{a.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
