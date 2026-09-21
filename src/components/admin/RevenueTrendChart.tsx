'use client'

import { useState, useMemo } from 'react'
import { TrendingUp, Calendar } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

// Stable dummy revenue data for demo (last 7 days)
const DUMMY_REVENUE_DATA = [
  { day: 'Mon', date: '2026-09-14', value: 1250000 },
  { day: 'Tue', date: '2026-09-15', value: 1480000 },
  { day: 'Wed', date: '2026-09-16', value: 1320000 },
  { day: 'Thu', date: '2026-09-17', value: 1750000 },
  { day: 'Fri', date: '2026-09-18', value: 1620000 },
  { day: 'Sat', date: '2026-09-19', value: 2100000 },
  { day: 'Sun', date: '2026-09-20', value: 1950000 },
]

interface RevenueTrendChartProps {
  data?: typeof DUMMY_REVENUE_DATA
  loading?: boolean
}

const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `Rp ${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 2)} jt`
  }
  if (value >= 1000) {
    return `Rp ${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)} rb`
  }
  return `Rp ${value.toLocaleString()}`
}

const formatTooltipDate = (dateStr: string): string => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function RevenueTrendChart({ data, loading = false }: RevenueTrendChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const t = useTranslations()

  const chartData = data || DUMMY_REVENUE_DATA
  const maxValue = useMemo(() => Math.max(...chartData.map(d => d.value)), [chartData])
  const minValue = useMemo(() => Math.min(...chartData.map(d => d.value)), [chartData])
  const totalRevenue = useMemo(() => chartData.reduce((sum, d) => sum + d.value, 0), [chartData])

  const padding = { top: 20, right: 20, bottom: 40, left: 60 }
  const chartWidth = 600
  const chartHeight = 240
  const plotWidth = chartWidth - padding.left - padding.right
  const plotHeight = chartHeight - padding.top - padding.bottom

  const yTicks = 5
  const yTickValues = Array.from({ length: yTicks }, (_, i) => {
    const v = maxValue - (i / (yTicks - 1)) * (maxValue - minValue)
    return v
  })

  const span = Math.max(chartData.length - 1, 1)
  const points = chartData.map((point, i) => {
    const x = padding.left + (i / span) * plotWidth
    const y = padding.top + ((maxValue - point.value) / (maxValue - minValue || 1)) * plotHeight
    return { ...point, x, y }
  })

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-2 text-emerald-600 dark:text-emerald-400">
            <TrendingUp size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t.dashboard.revenueTrendTitle}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.dashboard.revenueTrendSubtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg">
          <Calendar size={14} />
          {t.dashboard.revenueTrendLast7Days}
        </div>
      </div>

      {/* Summary Metric */}
      <div className="mb-6">
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {formatCurrency(totalRevenue)}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t.dashboard.revenueTrendComparison}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[240px]">
          <div className="text-gray-400 dark:text-gray-500">{t.dashboard.loadingChartData}</div>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[240px]">
          <div className="text-gray-400 dark:text-gray-500">{t.dashboard.noRevenueData}</div>
        </div>
      ) : (
        <div className="relative w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-auto"
            role="img"
            aria-label={t.dashboard.revenueTrendTitle}
          >
            {/* Grid lines and Y-axis labels */}
            {yTickValues.map((value, i) => {
              const y = padding.top + (i / (yTicks - 1)) * plotHeight
              return (
                <g key={`grid-${i}`}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={chartWidth - padding.right}
                    y2={y}
                    className="stroke-gray-200 dark:stroke-gray-800"
                    strokeWidth={1}
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-gray-500 dark:fill-gray-400"
                    fontSize={11}
                  >
                    {formatCurrency(value)}
                  </text>
                </g>
              )
            })}

            {/* X-axis labels */}
            {points.map((point, i) => (
              <text
                key={`x-label-${point.date}`}
                x={point.x}
                y={chartHeight - padding.bottom + 18}
                textAnchor="middle"
                className="fill-gray-500 dark:fill-gray-400"
                fontSize={11}
              >
                {point.day}
              </text>
            ))}

            {/* Chart area background */}
            <rect
              x={padding.left}
              y={padding.top}
              width={plotWidth}
              height={plotHeight}
              className="fill-transparent"
            />

            {/* Grid axis lines */}
            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={padding.top + plotHeight}
              className="stroke-gray-200 dark:stroke-gray-800"
              strokeWidth={1}
            />
            <line
              x1={padding.left}
              y1={padding.top + plotHeight}
              x2={padding.left + plotWidth}
              y2={padding.top + plotHeight}
              className="stroke-gray-200 dark:stroke-gray-800"
              strokeWidth={1}
            />

            {/* Tooltip for hovered point */}
            {hoverIndex !== null && (
              <foreignObject
                x={points[hoverIndex].x - 80}
                y={points[hoverIndex].y - 55}
                width={160}
                height={48}
              >
                <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg p-2 shadow-lg text-center">
                  <div className="text-xs font-medium">
                    {formatTooltipDate(points[hoverIndex].date)}
                  </div>
                  <div className="text-sm font-bold">
                    {formatCurrency(points[hoverIndex].value)}
                  </div>
                </div>
              </foreignObject>
            )}

            {/* Area fill under the line */}
            <defs>
              <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="1" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <path
              d={`
                M${points[0].x} ${padding.top + plotHeight}
                L${points[0].x} ${points[0].y}
                ${points.slice(1).map(p => `L${p.x} ${p.y}`).join(' ')}
                L${points[points.length - 1].x} ${padding.top + plotHeight}
                Z
              `}
              fill="url(#revenue-fill)"
            />

            {/* Main line */}
            <path
              d={linePath}
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-emerald-600 dark:text-emerald-400"
            />

            {/* Data points */}
            {points.map((point, i) => (
              <g key={`point-${point.date}`}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={hoverIndex === i ? 5 : 3.5}
                  fill="currentColor"
                  className={`text-emerald-600 dark:text-emerald-400 transition-all ${
                    hoverIndex === i ? 'text-emerald-500 dark:text-emerald-300 r-1' : ''
                  }`}
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                />
              </g>
            ))}
          </svg>
        </div>
      )}
    </div>
  )
}
