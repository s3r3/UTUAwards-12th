'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Users, Package, Star, Truck } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

interface StatProps {
  value: number
  label: string
  suffix?: string
  icon: React.ReactNode
  accent: 'emerald' | 'ocean'
}

function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const end = value
    const duration = 2000
    const increment = end / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        start = end
        clearInterval(timer)
      }
      setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, value])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

function StatCard({ value, label, suffix, icon, accent }: StatProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className="group relative overflow-hidden rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 text-center transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-900"
    >
      <div
        className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity ${
          accent === 'emerald' ? 'bg-emerald-400' : 'bg-ocean-400'
        }`}
      />
      <div className="mb-4 flex justify-center">{icon}</div>
      <div className="mb-2 text-4xl font-bold text-gray-900 dark:text-gray-100">
        <CountUp value={value} suffix={suffix} />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
    </motion.div>
  )
}

export default function StatsCounter() {
  const t = useTranslations()
  return (
    <section className="bg-gradient-to-br from-stone-50 via-white to-ocean-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-ocean-950/30 py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-emerald-950 dark:text-emerald-200">
            {t.landing.statsTitle}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard value={500} label={t.landing.statsPartners} suffix="" icon={<Users className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />} accent="emerald" />
          <StatCard value={50} label={t.landing.statsProducts} suffix="+" icon={<Package className="h-8 w-8 text-ocean-600 dark:text-ocean-400" />} accent="ocean" />
          <StatCard value={98} label={t.landing.statsSatisfaction} suffix="%" icon={<Star className="h-8 w-8 text-amber-500 dark:text-amber-400" />} accent="emerald" />
          <StatCard value={24} label={t.landing.statsDelivery} suffix="h" icon={<Truck className="h-8 w-8 text-ocean-600 dark:text-ocean-400" />} accent="ocean" />
        </div>
      </div>
    </section>
  )
}
