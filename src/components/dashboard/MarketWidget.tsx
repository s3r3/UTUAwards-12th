'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, BarChart3, RefreshCw } from 'lucide-react'

interface CommodityPrice {
  id: string
  name: string
  emoji: string
  price: number
  unit: string
  change: number
  changePercent: number
}

export default function MarketWidget() {
  const [prices, setPrices] = useState<CommodityPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/market-prices')
        const json = await res.json()
        if (json.success) {
          setPrices(json.data.map((d: any) => ({
            id: d.id, name: d.name, emoji: d.emoji,
            price: d.price, unit: d.unit, change: d.change, changePercent: d.changePercent,
          })).slice(0, 4))
        }
      } catch (e) { setError(true) }
      finally { setLoading(false) }
    })()
  }, [])

  if (loading) return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="animate-pulse space-y-3">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />)}
      </div>
    </div>
  )

  if (error) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 text-sm">
          <BarChart3 size={16} className="text-primary-500" /> Harga Pasar
        </h3>
        <RefreshCw size={12} className="text-gray-400" />
      </div>
      <div className="space-y-2">
        {prices.map((p) => (
          <div key={p.id} className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-lg">{p.emoji}</span>
              <div>
                <p className="text-xs font-medium text-gray-900 dark:text-white">{p.name}</p>
                <p className="text-[10px] text-gray-400">{p.unit}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">${p.price.toFixed(2)}</p>
              <span className={`text-[10px] flex items-center gap-0.5 ${p.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {p.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {p.changePercent.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
