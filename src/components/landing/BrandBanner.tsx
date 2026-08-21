'use client'

import { motion } from 'framer-motion'
import { Sprout, Waves, Handshake } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

const VALUES = [
  { icon: Sprout, titleKey: 'organicLandText' },
  { icon: Waves, titleKey: 'pristineSeaText' },
  { icon: Handshake, titleKey: 'localFirstText' },
]

export default function BrandBanner() {
  const t = useTranslations()
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-900 py-24 px-6 md:px-12">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-400/20 via-transparent to-transparent opacity-50 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-block rounded-full border border-teal-200/30 px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-teal-100"
        >
          {t.landing.ourPromise}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight"
        >
          {t.landing.fromLandSea}, <br className="hidden md:block" /> {t.landing.dayToTable}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-teal-50/80 font-light leading-relaxed"
        >
          {t.landing.brandDescription}
        </motion.p>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {VALUES.map((v, i) => {
            const Icon = v.icon
            return (
              <motion.div
                key={v.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group flex flex-col items-center text-center rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md shadow-2xl transition-colors hover:bg-white/10 hover:border-white/20"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-800/50 text-teal-300 shadow-inner group-hover:text-white transition-colors">
                  <Icon strokeWidth={1.5} className="h-8 w-8" />
                </div>
                
                <h3 className="text-xl font-serif font-semibold text-white tracking-wide">
                  {(t.landing[v.titleKey as keyof typeof t.landing] as string) || ''}
                </h3>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}