'use client'

import { TrendingUp, DollarSign, Target, Calendar } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

const getMetrics = (t: ReturnType<typeof useTranslations>) => [
  {
    label: 'Total Cost',
    value: 'Rp 140 Juta',
    description: 'Investasi awal pengembangan platform',
    icon: DollarSign,
    color: 'text-red-500',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
  },
  {
    label: 'Revenue Projection',
    value: 'Rp 500 Juta/tahun',
    description: 'Proyeksi pendapatan tahun pertama',
    icon: TrendingUp,
    color: 'text-green-500',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
  },
  {
    label: 'Break Even',
    value: 'Bulan ke-10',
    description: 'Target titik impas investasi',
    icon: Target,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
  },
  {
    label: 'ROI Target',
    value: '257%',
    description: 'Target return on investment',
    icon: Calendar,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
  },
]

const getRevenueStreams = (t: ReturnType<typeof useTranslations>) => [
  { name: 'Komisi 3%', description: 'Dari setiap transaksi yang terjadi di platform', percentage: 40 },
  { name: 'Premium Listing', description: 'Fitur unggulan untuk produk di halaman utama', percentage: 25 },
  { name: 'B2B Consultation', description: 'Layanan konsultasi bisnis untuk mitra', percentage: 20 },
  { name: 'Government Partnership', description: t.financial.govDesc, percentage: 15 },
]

export default function Financial() {
  const t = useTranslations()
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Model Bisnis & Proyeksi Keuangan
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Strategi monetisasi berkelanjutan untuk pertumbuhan ekosistem agro-maritim Aceh
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {getMetrics(t).map((metric, index) => (
            <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
              <div className={`w-12 h-12 rounded-xl ${metric.bgColor} flex items-center justify-center ${metric.color} mb-4`}>
                <metric.icon size={24} />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{metric.label}</div>
              <div className={`text-2xl font-bold ${metric.color} mb-2`}>{metric.value}</div>
              <p className="text-xs text-gray-500 dark:text-gray-500">{metric.description}</p>
            </div>
          ))}
        </div>

        {/* Revenue Streams */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Sumber Pendapatan
          </h3>
          <div className="space-y-4">
            {getRevenueStreams(t).map((stream, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{stream.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stream.description}</p>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-lg font-bold text-primary-600 dark:text-primary-400">{stream.percentage}%</div>
                  <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-2">
                    <div 
                      className="h-full gradient-primary rounded-full" 
                      style={{ width: `${stream.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
