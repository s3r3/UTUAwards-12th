'use client'

import { useTranslations } from "@/lib/i18n"
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { TrendingUp, DollarSign, BarChart3, PieChart, Users, Rocket, Target, Zap } from 'lucide-react'

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
          <div className="space-y-4">
            {revenueStreams.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{s.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{s.desc}</p>
                </div>
                <div className="ml-4 text-right min-w-[120px]">
                  <div className="text-lg font-bold text-primary-600 dark:text-primary-400">{s.pct}%</div>
                  <div className="w-28 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-2">
                    <div className="h-full gradient-primary rounded-full" style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              </div>
            ))}
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
