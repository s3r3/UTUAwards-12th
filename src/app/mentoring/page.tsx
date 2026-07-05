'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, Shield, Package, Truck, CheckCircle2, Clock, FileText, Star, ArrowRight, X, BookOpen } from 'lucide-react'
import { useTranslations } from "@/lib/i18n"
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'

interface Course {
  id: string
  step: string
  title: string
  description: string
  longDesc: string
  icon: React.ComponentType<{ size?: number }>
  gradient: string
  duration: string
  price: string
  modules: string[]
  outcomes: string[]
  mentor: string
  level: string
}

const getCourses = (t: ReturnType<typeof useTranslations>): Course[] => [
  {
    id: 'halal',
    step: '01',
    title: t.mentoring.program1,
    description: t.mentoring.program1desc,
    longDesc: t.mentoring.program1detail,
    icon: Award,
    gradient: 'from-green-500 to-emerald-600',
    duration: t.mentoring.program1duration,
    price: t.mentoring.program1price,
    modules: [t.mentoring.program1 + ' ' + t.mentoring.program1desc],
    outcomes: [t.mentoring.program1],
    mentor: 'Dr. Ahmad Fauzan, M.Si',
    level: t.mentoring.program1,
  },
  {
    id: 'haccp',
    step: '02',
    title: t.mentoring.program2,
    description: t.mentoring.program2desc,
    longDesc: t.mentoring.program2detail,
    icon: Shield,
    gradient: 'from-blue-500 to-blue-600',
    duration: t.mentoring.program2duration,
    price: t.mentoring.program2price,
    modules: [t.mentoring.program2 + ' ' + t.mentoring.program2desc],
    outcomes: [t.mentoring.program2],
    mentor: 'Ir. Dewi Kartika, M.Sc',
    level: t.mentoring.program2,
  },
  {
    id: 'packaging',
    step: '03',
    title: t.mentoring.program3,
    description: t.mentoring.program3desc,
    longDesc: t.mentoring.program3detail,
    icon: Package,
    gradient: 'from-purple-500 to-violet-600',
    duration: t.mentoring.program3duration,
    price: t.mentoring.program3price,
    modules: [t.mentoring.program3 + ' ' + t.mentoring.program3desc],
    outcomes: [t.mentoring.program3],
    mentor: 'Siti Nurhaliza, S.Ds',
    level: t.mentoring.program3,
  },
  {
    id: 'supply-chain',
    step: '04',
    title: 'Supply Chain Training',
    description: 'Comprehensive integrated supply chain management training for operational efficiency.',
    longDesc: 'An end-to-end supply chain management training program covering inventory management, logistics, distribution, and real-time tracking for cost and time efficiency.',
    icon: Truck,
    gradient: 'from-orange-500 to-amber-600',
    duration: '1-2 Months',
    price: 'Rp 2 Million',
    modules: ['Inventory management', 'Logistics & distribution', 'Real-time tracking'],
    outcomes: ['Cost efficiency', 'Time efficiency', 'Integrated supply chain'],
    mentor: 'Rudi Hermawan, S.T',
    level: 'Intermediate',
  },
]

export default function MentoringPage() {
  const t = useTranslations()
  const [selected, setSelected] = useState<Course | null>(null)

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-500 text-sm font-medium">
              <BookOpen size={14} /> {t.mentoring.programTitle}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t.mentoring.improveTitle} <span className="bg-gradient-to-r from-primary-500 to-ocean-500 bg-clip-text text-transparent">{t.mentoring.title}</span> {t.products.title}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              {t.mentoring.programDesc}
            </p>
          </motion.div>

          {/* Course Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getCourses(t).map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelected(course)}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:border-transparent shadow-sm hover:shadow-xl transition-all cursor-pointer"
                style={{
                  boxShadow: selected?.id === course.id ? `0 0 30px rgba(34,197,94,0.15)` : undefined,
                  borderColor: selected?.id === course.id ? 'var(--primary-500)' : undefined,
                }}
              >
                <div className="flex items-start gap-4">
                  <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${course.gradient} flex items-center justify-center shadow-lg shrink-0`}>
                    <course.icon size={24} className="text-white" />
                    <div className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white border-2 border-white dark:border-gray-800 ${course.gradient.split(' ')[0]}`}>
                      {course.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-white">{course.title}</h3>
                      <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-50 dark:bg-gray-700 px-2.5 py-1 rounded-full">
                        <Clock size={11} /> {course.duration}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-primary-500">{course.price}</span>
                      <span className="flex items-center gap-1 text-xs text-primary-600 group-hover:gap-2 transition-all">
                        {t.mentoring.detailProgram} <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header gradient */}
              <div className={`bg-gradient-to-br ${selected.gradient} p-8 relative`}>
                <button onClick={() => setSelected(null)} className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors">
                  <X size={18} />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                    <selected.icon size={32} className="text-white" />
                  </div>
                  <div className="text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{selected.level}</span>
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{selected.duration}</span>
                    </div>
                    <h2 className="text-2xl font-bold">{selected.title}</h2>
                    <p className="text-white/80 text-sm mt-1">{selected.price}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{selected.longDesc}</p>

                {/* {t.mentoring.mentor} */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm">M</div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.mentoring.mentor}</p>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">{selected.mentor}</p>
                  </div>
                </div>

                {/* Modules */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <FileText size={16} className="text-primary-500" /> {t.mentoring.modules}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selected.modules.map((m, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle2 size={14} className="text-primary-500 shrink-0" /> {m}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outcomes */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Star size={16} className="text-yellow-500" /> {t.mentoring.outcomes}
                  </h3>
                  <div className="space-y-2">
                    {selected.outcomes.map((o, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" /> {o}
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full gap-2" size="lg">
                  {t.mentoring.detailProgram} <ArrowRight size={16} />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  )
}
