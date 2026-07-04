'use client'

import { useRef } from 'react'
import { useTranslations } from "@/lib/i18n"
import { motion, useInView } from 'framer-motion'
import { Award, Shield, Package, Truck, ArrowRight, CheckCircle2, Calendar } from 'lucide-react'

const getPrograms = (t: ReturnType<typeof useTranslations>) => [
  {
    step: '01',
    title: t.mentoring.program1,
    description: t.mentoring.program1desc,
    icon: Award,
    gradient: 'from-[#22c55e] to-emerald-600',
    glow: 'shadow-[0_4px_32px_rgba(34,197,94,0.20)]',
    badgeColor: 'bg-[#22c55e]',
    features: [t.mentoring.program1 + ' ' + t.mentoring.program1desc],
    duration: t.mentoring.program1duration,
  },
  {
    step: '02',
    title: t.mentoring.program2,
    description: t.mentoring.program2desc,
    icon: Shield,
    gradient: 'from-[#0ea5e9] to-blue-600',
    glow: 'shadow-[0_4px_32px_rgba(14,165,233,0.20)]',
    badgeColor: 'bg-[#0ea5e9]',
    features: [t.mentoring.program2 + ' ' + t.mentoring.program2desc],
    duration: t.mentoring.program2duration,
  },
  {
    step: '03',
    title: t.mentoring.program3,
    description: t.mentoring.program3desc,
    icon: Package,
    gradient: 'from-purple-500 to-violet-600',
    glow: 'shadow-[0_4px_32px_rgba(168,85,247,0.20)]',
    badgeColor: 'bg-purple-500',
    features: [t.mentoring.program3 + ' ' + t.mentoring.program3desc],
    duration: t.mentoring.program3duration,
  },
  {
    step: '04',
    title: 'Supply Chain Training',
    description: 'Comprehensive integrated supply chain management training for operational efficiency.',
    icon: Truck,
    gradient: 'from-orange-500 to-amber-600',
    glow: 'shadow-[0_4px_32px_rgba(249,115,22,0.20)]',
    badgeColor: 'bg-orange-500',
    features: ['Modern inventory management', 'Logistics optimization', 'Real-time tracking'],
    duration: '1 Month',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const cardVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export default function Mentoring() {
  const t = useTranslations()
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' })

  return (
    <section
      ref={sectionRef}
      className="relative py-24 bg-white dark:bg-gray-950 overflow-hidden"
    >
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#22c55e]/6 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-[#0ea5e9]/6 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e] text-sm font-medium">
            <Award size={14} />
            Program Mentoring
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Tingkatkan{' '}
            <span className="bg-gradient-to-r from-[#22c55e] to-[#0ea5e9] bg-clip-text text-transparent">
              Kualitas Produk
            </span>{' '}
            Anda
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Program pendampingan profesional step-by-step untuk menembus pasar global
          </p>
        </motion.div>

        {/* Timeline + Cards */}
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Vertical timeline line (desktop) */}
          <div className="hidden lg:block absolute left-[2.75rem] top-8 bottom-8 w-px bg-gradient-to-b from-[#22c55e] via-[#0ea5e9] to-orange-500 opacity-30" />

          <div className="space-y-6">
            {getPrograms(t).map((program, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="relative"
              >
                <div
                  className={`group flex items-start gap-6 p-6 rounded-2xl bg-white dark:bg-gray-900
                    border border-gray-100 dark:border-gray-800
                    hover:border-transparent dark:hover:border-transparent
                    ${program.glow}
                    hover:${program.glow}
                    transition-all duration-300 cursor-default
                  `}
                  style={{ transition: 'box-shadow 0.3s, transform 0.3s, border-color 0.3s' }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
                  }}
                >
                  {/* Hover gradient overlay */}
                  <div
                    className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br ${program.gradient} pointer-events-none`}
                  />

                  {/* Step badge + icon */}
                  <div className="relative flex-shrink-0 z-10">
                    {/* Step number ring */}
                    <div
                      className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${program.gradient} flex items-center justify-center shadow-lg`}
                    >
                      <program.icon size={24} className="text-white" />
                      {/* Step badge */}
                      <div
                        className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${program.badgeColor} flex items-center justify-center text-[10px] font-black text-white border-2 border-white dark:border-gray-900 shadow-sm`}
                      >
                        {program.step}
                      </div>
                    </div>
                    {/* Timeline dot connector */}
                    {index < getPrograms(t).length - 1 && (
                      <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-full mt-2 flex-col items-center gap-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className={`w-1 h-1 rounded-full bg-gradient-to-b ${program.gradient} opacity-40`}
                            style={{ marginTop: i * 4 }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 relative z-10">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {program.title}
                      </h3>
                      <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 px-2.5 py-1 rounded-full">
                        <Calendar size={11} />
                        {program.duration}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                      {program.description}
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {program.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                          <CheckCircle2 size={14} className="text-[#22c55e] flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Registration CTA */}
        <motion.div
          className="mt-14 relative overflow-hidden rounded-3xl p-8 md:p-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          {/* CTA gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#22c55e] to-[#0ea5e9] opacity-90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent)]" />

          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Siap Tingkatkan Produk Anda ke Pasar Global?
            </h3>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Daftarkan produk Anda sekarang dan dapatkan konsultasi awal gratis dengan tim ahli Acelora
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-[#22c55e] font-bold hover:bg-gray-50 transition-colors shadow-xl"
              >
                Daftar Sekarang
                <ArrowRight size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-white/15 text-white font-semibold hover:bg-white/25 transition-colors border border-white/30 backdrop-blur-sm"
              >
                Pelajari Lebih Lanjut
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
