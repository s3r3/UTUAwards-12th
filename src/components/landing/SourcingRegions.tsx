'use client'

import { motion } from 'framer-motion'

export default function SourcingRegions() {
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
          SOURCED DIRECTLY FROM OUR PARTNER COMMUNITIES
        </motion.p>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delayChildren: 0.2, staggerChildren: 0.2 }}
        >
          {/* ACEH HIGHLANDS — Land — green */}
          <div className="flex flex-col items-center">
            <h3 className="font-serif text-2xl md:text-3xl text-emerald-900 dark:text-emerald-300">ACEH HIGHLANDS</h3>
            <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400">Organic Farms</p>
          </div>
          {/* MALACCA STRAIT — Sea — blue */}
          <div className="flex flex-col items-center border border-ocean-900 dark:border-ocean-400 p-4 rounded">
            <h3 className="font-serif text-2xl md:text-3xl text-ocean-900 dark:text-ocean-300">MALACCA STRAIT</h3>
            <p className="mt-2 text-sm text-ocean-700 dark:text-ocean-400">Coastal Fisheries</p>
          </div>
          {/* INDIAN OCEAN — Sea — blue */}
          <div className="flex flex-col items-center">
            <h3 className="font-serif text-2xl md:text-3xl text-ocean-900 dark:text-ocean-300">INDIAN OCEAN</h3>
            <p className="mt-2 text-sm text-ocean-700 dark:text-ocean-400">Deep Sea Catch</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
