'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

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
      <div className="mb-4 flex justify-center text-4xl">{icon}</div>
      <div className="mb-2 text-4xl font-bold text-gray-900 dark:text-gray-100">
        <CountUp value={value} suffix={suffix} />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
    </motion.div>
  )
}

export default function StatsCounter() {
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
          <span className="inline-block rounded-full border border-emerald-900/20 bg-emerald-900/5 dark:border-emerald-700/30 dark:bg-emerald-950/20 px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-900 dark:text-emerald-300">
            Trusted by the Best
          </span>
          <h2 className="mt-6 font-serif text-4xl md:text-5xl font-bold text-emerald-950 dark:text-emerald-200">
            By the Numbers
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard value={500} label="Local Partners" suffix="" icon={<span className="text-4xl">🧑‍🌾</span>} accent="emerald" />
          <StatCard value={50} label="Premium Products" suffix="+" icon={<span className="text-4xl">📦</span>} accent="ocean" />
          <StatCard value={98} label="Customer Satisfaction" suffix="%" icon={<span className="text-4xl">⭐</span>} accent="emerald" />
          <StatCard value={24} label="Delivery Time" suffix="h" icon={<span className="text-4xl">🚚</span>} accent="ocean" />
        </div>
      </div>
    </section>
  )
}
