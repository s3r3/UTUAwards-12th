'use client'

import { motion } from 'framer-motion'
import { Coffee, Wheat as WheatIcon, Banana, Fish } from 'lucide-react'
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

        {/* Harvest Calendar mini-section */}
        <div className="mt-16">
          <h3 className="font-serif text-xl text-stone-900 dark:text-white mb-6">{t.landing.harvestTitle}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { season: t.landing.harvestMonths1, Icon: Coffee, product: t.landing.harvestProduct1, color: 'bg-amber-50 dark:bg-amber-900/20' },
              { season: t.landing.harvestMonths2, Icon: WheatIcon, product: t.landing.harvestProduct2, color: 'bg-emerald-50 dark:bg-emerald-900/20' },
              { season: t.landing.harvestMonths3, Icon: Banana, product: t.landing.harvestProduct3, color: 'bg-yellow-50 dark:bg-yellow-900/20' },
              { season: t.landing.harvestMonths4, Icon: Fish, product: t.landing.harvestProduct4, color: 'bg-sky-50 dark:bg-sky-900/20' },
            ].map((item) => (
              <div key={item.season} className={`rounded-2xl border border-gray-200 dark:border-gray-700 ${item.color} p-4 text-center transition hover:scale-105`}>
                <item.Icon className="h-8 w-8 mx-auto mb-2 text-stone-700 dark:text-gray-300" />
                <div className="text-xs font-semibold uppercase tracking-widest text-stone-500 dark:text-gray-400">{item.season}</div>
                <div className="mt-1 font-serif text-sm font-bold text-stone-900 dark:text-white">{item.product}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
