import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function PartnerHero({ t }: { t: any }) {
  return (
    <section className="relative min-h-[600px] flex items-center bg-primary-900 text-white py-20 px-6 md:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-300 mb-4">{t.eyebrow}</p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-6">{t.heroTitle}</h1>
          <p className="text-lg md:text-xl text-primary-100/80 mb-8 leading-relaxed font-light">{t.heroSub}</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/menjadi-mitra/daftar" className="inline-flex items-center gap-2 bg-white text-primary-900 px-8 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-colors">
              {t.primaryCta} <ArrowRight size={16} />
            </Link>
            <Link href="#cara-kerja" className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors">
              {t.secondaryCta}
            </Link>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="grid grid-cols-2 gap-4">
          {[
            { value: '500+', label: t.heroStatPartners },
            { value: '1,000+', label: t.heroStatProducts },
            { value: '8', label: t.heroStatRegions },
            { value: 'B2B', label: t.heroStatMarket },
          ].map((stat, i) => (
            <div key={i} className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-primary-100">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
