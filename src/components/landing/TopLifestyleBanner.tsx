'use client'

import { useTranslations } from '@/lib/i18n'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function TopLifestyleBanner() {
  const t = useTranslations()
  return (
    <section className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1504755241915-f736314b92c5?w=1920&q=80"
        alt="People gathering for a meal"
        fill
        sizes="(max-width: 1024px) 100vw, 100vw"
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950/70 via-transparent to-transparent"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center px-4"
        >
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight drop-shadow-lg mb-4">
            {t.landing.fromLandSea}
          </h1>
          <p className="text-lg text-white/90 max-w-lg mx-auto font-light leading-relaxed">
            {t.hero.freshnessDesc}
          </p>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 mt-8 rounded-full bg-white px-8 py-4 font-semibold text-primary-800 shadow-xl shadow-black/20 transition-all hover:scale-[1.03] hover:bg-emerald-50"
          >
            {t.hero.exploreBtn}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}