'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { Users, Store, TrendingUp, Building, Wheat, Fish, Factory, Award, Truck, Briefcase } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/landing/Footer'
import PartnerHero from '@/components/menjadi-mitra/PartnerHero'
import { useTranslations } from '@/lib/i18n'

export default function MenjadiMitraPage() {
  const t = useTranslations()
  const p = t.landing.partnerPage
  const containerRef = useRef(null)

  const whyItems = [
    { icon: Users, title: p.whyReach, desc: p.whyReachDesc },
    { icon: Store, title: p.whyManage, desc: p.whyManageDesc },
    { icon: TrendingUp, title: p.whyGrow, desc: p.whyGrowDesc },
    { icon: Building, title: p.whyEcosystem, desc: p.whyEcosystemDesc },
  ]

  const whoItems = [
    { label: p.whoFarmer, icon: Wheat },
    { label: p.whoFisher, icon: Fish },
    { label: p.whoProducer, icon: Factory },
    { label: p.whoProcessor, icon: Building },
    { label: p.whoUmkm, icon: Award },
    { label: p.whoSupplier, icon: Truck },
    { label: p.whoDistributor, icon: Briefcase },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Navbar />
      <PartnerHero t={p} />

      {/* Why Section */}
      <section className="py-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr,2fr] gap-12">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-serif text-4xl font-bold leading-tight text-gray-950 dark:text-white">{p.whyTitle}</motion.h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {whyItems.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-primary-200 dark:hover:border-primary-800 bg-white dark:bg-gray-900 transition-colors">
                <div className="text-primary-600 mb-4"><item.icon size={24}/></div>
                <h4 className="font-bold mb-2 text-gray-950 dark:text-white">{item.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Section */}
      <section className="py-20 bg-primary-900 text-white px-6 md:px-16 text-center overflow-hidden">
        <h2 className="font-serif text-4xl font-bold mb-12">{p.whoTitle}</h2>
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {whoItems.map((item, i) => (
            <span key={i} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm cursor-default">
              <item.icon size={16} /> {item.label}
            </span>
          ))}
        </div>
      </section>

      {/* How To Apply */}
      <section className="py-20 px-6 md:px-16 max-w-4xl mx-auto">
        <h2 className="font-serif text-4xl font-bold text-center mb-16 text-gray-950 dark:text-white">{p.howTitle}</h2>
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-6 mb-8 group">
            <div className="font-mono text-2xl font-bold text-primary-600 group-hover:text-primary-800 transition-colors">0{i}</div>
            <div>
              <h4 className="font-bold text-lg mb-1 text-gray-950 dark:text-white">{p[`partnerStep${i}` as keyof typeof p]}</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{p[`partnerStep${i}Desc` as keyof typeof p]}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600 text-white text-center px-6">
        <motion.div whileHover={{ scale: 1.02 }}>
          <h2 className="font-serif text-4xl font-bold mb-4">{p.ctaTitle}</h2>
          <p className="mb-8 opacity-90">{p.ctaSubtitle}</p>
          <Link href="/menjadi-mitra/daftar" className="bg-white text-primary-900 px-8 py-3 rounded-full font-semibold inline-block transition-transform hover:scale-105">
            {p.ctaButton}
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
