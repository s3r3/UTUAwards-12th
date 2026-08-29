'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Waves, Ship, Wheat, Home as HomeIcon, MapPin } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

const STEPS = [
  { Icon: Waves, titleKey: 'scrollStep1', descKey: 'scrollStep1Desc' },
  { Icon: Ship, titleKey: 'scrollStep2', descKey: 'scrollStep2Desc' },
  { Icon: Wheat, titleKey: 'scrollStep3', descKey: 'scrollStep3Desc' },
  { Icon: HomeIcon, titleKey: 'scrollStep4', descKey: 'scrollStep4Desc' },
]

export default function ScrollStory() {
  const t = useTranslations()
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    refs.current.forEach((el) => {
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(refs.current.indexOf(el)) },
        { threshold: 0.6 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <section className="bg-stone-50 dark:bg-gray-950 py-24 px-6 md:px-12">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-serif text-3xl md:text-4xl text-center text-stone-900 dark:text-white mb-16">
          {t.landing.scrollTitle}
        </h2>
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700 -translate-x-1/2" />
          <div
            className="absolute left-4 md:left-1/2 top-0 w-px bg-gradient-to-b from-ocean-500 to-primary-500 -translate-x-1/2 transition-all duration-500"
            style={{ height: `${((active + 1) / STEPS.length) * 100}%` }}
          />
          {STEPS.map((step, i) => (
            <div
              key={step.titleKey}
              ref={(el) => { refs.current[i] = el }}
              className={`relative flex flex-col items-center gap-6 mb-16 md:flex-row ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
            >
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                <motion.div
                  animate={{ scale: active >= i ? 1.3 : 1, backgroundColor: active >= i ? '#0ea5e9' : '#d6d3d1' }}
                  transition={{ duration: 0.4 }}
                  className="h-4 w-4 rounded-full border-4 border-white dark:border-gray-900 shadow"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
                className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}
              >
                <div className="inline-flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm">
                  <step.Icon className="h-8 w-8 text-ocean-600 dark:text-ocean-400" />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">
                      {String(t.landing[step.titleKey as keyof typeof t.landing] ?? step.titleKey)}
                    </h3>
                    <p className="mt-1 text-sm text-stone-600 dark:text-gray-400">
                      {String(t.landing[step.descKey as keyof typeof t.landing] ?? step.descKey)}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
