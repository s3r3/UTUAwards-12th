'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, RefreshCw, Activity, DollarSign, BarChart3 } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

interface CommodityPrice {
  id: string
  name: string
  nameId: string
  emoji: string
  price: number
  unit: string
  change: number
  changePercent: number
  high: number
  low: number
  updatedAt: string
  history: number[]
  source: string
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 80; const h = 28
  const max = Math.max(...data); const min = Math.min(...data); const range = max - min || 1
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  )
}

export default function MarketPrices() {
  const t = useTranslations()
  const [prices, setPrices] = useState<CommodityPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' })

  const fetchPrices = async () => {
    try {
      const res = await fetch('/api/market-prices')
      const json = await res.json()
      if (json.success) {
        setPrices(json.data)
        setLastUpdate(json.updatedAt)
      }
    } catch (e) {
      console.error('Failed to fetch prices', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPrices() }, [])

  const categoryColor = (id: string) => {
    const map: Record<string, string> = {
      coffee: '#22c55e', patchouli: '#0ea5e9', shrimp: '#f59e0b',
      pepper: '#ef4444', robusta: '#16a34a', cinnamon: '#8b5cf6',
    }
    return map[id] || '#22c55e'
  }

  return (
    <section ref={sectionRef} className="relative py-24 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-ocean-500/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-500 text-sm font-medium">
            <BarChart3 size={14} /> Pantauan Pasar
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Harga Pasar{' '}
            <span className="bg-gradient-to-r from-primary-500 to-ocean-500 bg-clip-text text-transparent">
              Komoditas
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Pantau harga pasar internasional komoditas agro-maritim Aceh secara real-time
          </p>
        </motion.div>

        {/* Last update */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Activity size={12} />
            <span>Terakhir diperbarui: {lastUpdate ? new Date(lastUpdate).toLocaleTimeString('id-ID') : '-'}</span>
          </div>
          <button
            onClick={() => { setLoading(true); fetchPrices() }}
            className="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-500 transition-colors"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Perbarui
          </button>
        </div>

        {/* Loading skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-5 animate-pulse border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-1" /><div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" /></div>
                </div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3" />
                <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prices.map((item, i) => {
              const color = categoryColor(item.id)
              const isUp = item.change >= 0
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  whileHover={{ y: -3 }}
                  className="group bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 hover:border-transparent hover:shadow-lg transition-all"
                  style={{
                    boxShadow: isInView ? `0 0 0 1px ${color}15` : undefined,
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: `${color}15` }}>
                        {item.emoji}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">{item.name}</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">{item.nameId}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                      {item.source}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-400">{item.unit}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs mb-3">
                    <span className={`flex items-center gap-0.5 font-medium ${isUp ? 'text-green-600' : 'text-red-500'}`}>
                      {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {isUp ? '+' : ''}{item.change.toFixed(2)} ({isUp ? '+' : ''}{item.changePercent.toFixed(1)}%)
                    </span>
                    <span className="text-gray-400">Range 7d: ${item.low.toFixed(2)} – ${item.high.toFixed(2)}</span>
                  </div>

                  {/* Sparkline with gradient fill */}
                  <div className="relative">
                    <Sparkline data={item.history} color={color} />
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[9px] text-gray-400 dark:text-gray-600 mt-0.5">
                      <span>30 hari</span>
                      <span>{t.marketPrices.today}</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Disclaimer */}
        <motion.p
          className="text-center text-xs text-gray-400 dark:text-gray-600 mt-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          Data harga bersifat indikatif berdasarkan estimasi pasar. Sumber: ICE Futures, FAO, dan data pasar komoditas global.
        </motion.p>
      </div>
    </section>
  )
}
