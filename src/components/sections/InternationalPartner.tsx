'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Building2, MapPin, Globe } from 'lucide-react'
import WorldGlobe from './WorldGlobe'

const partners = [
  { id: 1, company: 'PT. Global Trade Asia', country: 'Malaysia', location: 'Kuala Lumpur', category: 'ASIA' },
  { id: 2, company: 'European Foods Ltd', country: 'Belanda', location: 'Amsterdam', category: 'EUROPE' },
  { id: 3, company: 'Middle East Trading Co', country: 'UAE', location: 'Dubai', category: 'MIDDLE_EAST' },
  { id: 4, company: 'American Natural Goods', country: 'USA', location: 'New York', category: 'AMERICA' },
  { id: 5, company: 'Tokyo Fresh Imports', country: 'Jepang', location: 'Tokyo', category: 'ASIA' },
  { id: 6, company: 'Sydney Seafood Pty', country: 'Australia', location: 'Sydney', category: 'ASIA' },
]

const regions = [
  { name: 'Asia', count: 15, color: 'bg-green-500', desc: 'Jepang, Malaysia, Singapura, China' },
  { name: 'Europe', count: 5, color: 'bg-blue-500', desc: 'Belanda, Prancis, Jerman' },
  { name: 'Middle East', count: 3, color: 'bg-yellow-500', desc: 'UAE, Saudi Arabia, Qatar' },
  { name: 'America', count: 2, color: 'bg-purple-500', desc: 'USA, Kanada' },
]

export default function InternationalPartner() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' })

  return (
    <section ref={sectionRef} className="relative py-24 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-ocean-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 rounded-full bg-primary-500/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-500 text-sm font-medium">
            <Globe size={14} />
            Jaringan Global
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Mitra <span className="bg-gradient-to-r from-primary-500 to-ocean-500 bg-clip-text text-transparent">Internasional</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Produk UMKM Aceh telah menembus pasar di berbagai benua melalui jaringan mitra global kami
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* 3D Globe */}
          <motion.div
            className="lg:col-span-3 bg-gray-50 dark:bg-gray-900 rounded-3xl overflow-hidden shadow-inner border border-gray-100 dark:border-gray-800"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <WorldGlobe />
          </motion.div>

          {/* Partner Info Panel */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Region Stats */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Globe size={18} className="text-primary-500" /> Distribusi Global
              </h3>
              <div className="space-y-3">
                {regions.map((region, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors cursor-default"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${region.color}`} />
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white text-sm">{region.name}</span>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500">{region.desc}</p>
                      </div>
                    </div>
                    <span className="text-primary-600 dark:text-primary-400 font-bold">{region.count}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 text-center">
                <div className="text-2xl font-bold text-primary-500">25+</div>
                <div className="text-xs text-gray-500 mt-1">Negara Tujuan</div>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 text-center">
                <div className="text-2xl font-bold text-ocean-500">50+</div>
                <div className="text-xs text-gray-500 mt-1">Buyer Aktif</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Partner Cards */}
        <motion.div
          className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {partners.map((partner) => (
            <motion.div
              key={partner.id}
              whileHover={{ y: -3, scale: 1.01 }}
              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary-500/30 hover:shadow-lg transition-all cursor-default"
            >
              <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center text-white shrink-0">
                <Building2 size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">{partner.company}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                  <MapPin size={11} /> {partner.location}, {partner.country}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
