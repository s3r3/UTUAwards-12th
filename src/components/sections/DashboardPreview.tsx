'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Package, FileCheck, BookOpen, Globe, TrendingUp, Activity } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

const getStats = (t: ReturnType<typeof useTranslations>) => [
  {
    label: t.dashboardPreview.statProducts,
    value: 500,
    suffix: '+',
    icon: Package,
    gradient: 'from-[#22c55e] to-[#16a34a]',
    glow: 'shadow-[0_0_30px_rgba(34,197,94,0.3)]',
    iconBg: 'bg-[#22c55e]/20',
    iconColor: 'text-[#22c55e]',
    chartColor: '#22c55e',
  },
  {
    label: t.dashboardPreview.statReview,
    value: 45,
    suffix: '',
    icon: FileCheck,
    gradient: 'from-yellow-500 to-orange-500',
    glow: 'shadow-[0_0_30px_rgba(234,179,8,0.3)]',
    iconBg: 'bg-yellow-500/20',
    iconColor: 'text-yellow-400',
    chartColor: '#eab308',
  },
  {
    label: t.dashboardPreview.statActive,
    value: 15,
    suffix: '',
    icon: BookOpen,
    gradient: 'from-[#0ea5e9] to-[#0284c7]',
    glow: 'shadow-[0_0_30px_rgba(14,165,233,0.3)]',
    iconBg: 'bg-[#0ea5e9]/20',
    iconColor: 'text-[#0ea5e9]',
    chartColor: '#0ea5e9',
  },
  {
    label: 'Negara Mitra',
    value: 25,
    suffix: '',
    icon: Globe,
    gradient: 'from-purple-500 to-violet-600',
    glow: 'shadow-[0_0_30px_rgba(168,85,247,0.3)]',
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-400',
    chartColor: '#a855f7',
  },
]

// Sparkline data for each card
const sparklineData = [
  [40, 55, 48, 62, 70, 65, 80, 90, 85, 100],
  [20, 35, 30, 25, 40, 38, 42, 45, 43, 45],
  [8, 9, 10, 11, 10, 12, 13, 14, 14, 15],
  [15, 17, 18, 19, 20, 21, 22, 23, 24, 25],
]

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 80
  const h = 32
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(' ')

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="opacity-60">
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}

function AnimatedCounter({
  value,
  suffix,
  isVisible,
}: {
  value: number
  suffix: string
  isVisible: boolean
}) {
  const [count, setCount] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return
    hasAnimated.current = true

    const duration = 1800
    const steps = 60
    let current = 0
    let frame = 0

    const timer = setInterval(() => {
      frame++
      // Ease-out: faster at start, slower at end
      const progress = frame / steps
      const eased = 1 - Math.pow(1 - progress, 3)
      current = Math.floor(eased * value)
      if (frame >= steps) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(current)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isVisible, value])

  return (
    <span>
      {count}
      {suffix}
    </span>
  )
}

// Animated background chart lines
function BackgroundChart() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
      preserveAspectRatio="none"
    >
      {[0.2, 0.4, 0.6, 0.8].map((y, i) => (
        <motion.line
          key={i}
          x1="0"
          y1={`${y * 100}%`}
          x2="100%"
          y2={`${y * 100}%`}
          stroke="#22c55e"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: i * 0.2 }}
        />
      ))}
      {/* Zigzag trend line */}
      <motion.polyline
        fill="none"
        stroke="#0ea5e9"
        strokeWidth="2"
        points="0,80% 15%,60% 30%,70% 45%,40% 60%,55% 75%,30% 100%,45%"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
    </svg>
  )
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export default function DashboardPreview() {
  const t = useTranslations()
  const stats = getStats(t)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section
      ref={sectionRef}
      className="relative py-24 bg-white dark:bg-gray-950 overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#22c55e]/8 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#0ea5e9]/8 blur-3xl" />
        <BackgroundChart />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Live indicator */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e] text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]" />
            </span>
            Live Dashboard
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Dashboard{' '}
            <span className="bg-gradient-to-r from-[#22c55e] to-[#0ea5e9] bg-clip-text text-transparent">
              Ringkasan
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Pantau perkembangan ekosistem agro-maritim Aceh secara real-time
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`relative group rounded-2xl p-6 overflow-hidden cursor-default
                bg-white dark:bg-gray-900/80
                border border-gray-100 dark:border-gray-800
                hover:border-transparent
                backdrop-blur-md
                shadow-lg hover:shadow-xl
                transition-[border,box-shadow] duration-300
                ${stat.glow} hover:${stat.glow}
              `}
            >
              {/* Gradient border on hover via pseudo-like div */}
              <div
                className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                style={{
                  background: `linear-gradient(135deg, transparent, transparent)`,
                  padding: '1px',
                }}
              />
              <div
                className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none bg-gradient-to-br ${stat.gradient}`}
              />

              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                  <stat.icon size={20} className={stat.iconColor} />
                </div>
                <div className="flex items-center gap-1 text-xs text-[#22c55e] font-medium">
                  <TrendingUp size={12} />
                  <span>+12%</span>
                </div>
              </div>

              {/* Counter */}
              <div className="text-4xl font-black text-gray-900 dark:text-white mb-1 tabular-nums">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} isVisible={isInView} />
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">{stat.label}</div>

              {/* Sparkline */}
              <div className="flex items-end justify-between">
                <Sparkline data={sparklineData[index]} color={stat.chartColor} />
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Activity size={10} />
                  <span>7d</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          className="mt-10 flex items-center justify-center gap-6 text-sm text-gray-400 dark:text-gray-600"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
            Data diperbarui setiap hari
          </span>
          <span className="hidden md:flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0ea5e9]" />
            Sumber: platform Acelora
          </span>
        </motion.div>
      </div>
    </section>
  )
}
