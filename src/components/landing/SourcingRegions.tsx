'use client'

import { motion } from 'framer-motion'
import { useTranslations } from '@/lib/i18n'

export default function SourcingRegions() {
  const t = useTranslations()
  return (
    <section className="bg-stone-50 dark:bg-gray-950 py-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-sm uppercase tracking-wider text-emerald-900 dark:text-emerald-300 mb-8"
        >
          {t.landing.sourcedFrom}
        </motion.p>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delayChildren: 0.2, staggerChildren: 0.2 }}
        >
          <div className="flex flex-col items-center">
            <h3 className="font-serif text-2xl md:text-3xl text-emerald-900 dark:text-emerald-300">{t.landing.highlands}</h3>
            <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400">{t.landing.highlandsDesc}</p>
          </div>
          <div className="flex flex-col items-center border border-ocean-900 dark:border-ocean-400 p-4 rounded">
            <h3 className="font-serif text-2xl md:text-3xl text-ocean-900 dark:text-ocean-300">{t.landing.malacca}</h3>
            <p className="mt-2 text-sm text-ocean-700 dark:text-ocean-400">{t.landing.malaccaDesc}</p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="font-serif text-2xl md:text-3xl text-ocean-900 dark:text-ocean-300">{t.landing.indianOcean}</h3>
            <p className="mt-2 text-sm text-ocean-700 dark:text-ocean-400">{t.landing.indianOceanDesc}</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
