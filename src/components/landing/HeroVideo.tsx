'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

// Placeholder video — replace with a hosted farm/ocean mp4 in production.
const VIDEO_SRC = 'https://cdn.coverr.co/videos/coverr-green-farm-field-7345/1080p.mp4'

export default function HeroVideo() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  // Darken the video overlay as the user scrolls → logo + navbar fade into view
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 0.9])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 0.4], [0, 60])

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 -z-10">
        <video
          className="h-full w-full object-cover scale-105"
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
        />
        {/* Scroll-linked dim overlay */}
        <motion.div
          className="absolute inset-0 bg-gray-950"
          style={{ opacity: overlayOpacity }}
        />
        {/* Static green→blue tint for premium feel */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/40 via-ocean-800/20 to-transparent" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex h-full items-center justify-center text-center px-4"
        style={{ opacity: contentOpacity, y: textY }}
      >
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-4 text-base font-medium uppercase tracking-[0.3em] text-white/80"
          >
            From Our Land &amp; Sea
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="font-serif-display text-5xl md:text-7xl font-semibold text-white leading-tight drop-shadow-lg"
          >
            Freshness,
            <span className="block bg-gradient-to-r from-emerald-300 to-sky-300 bg-clip-text text-transparent">Harvested to Perfection</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="mx-auto mt-6 max-w-xl text-lg text-white/85"
          >
            Premium farm produce &amp; seafood, sourced directly from Aceh&apos;s fertile land and pristine waters.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-primary-800 shadow-xl shadow-black/20 transition-all hover:scale-[1.03] hover:bg-emerald-50"
            >
              Explore Our Products
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/products?category=SEAFOOD"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/10"
            >
              Taste the Ocean
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        style={{ opacity: contentOpacity }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/60"
        >
          <div className="mx-auto mt-2 w-1 h-3 rounded-full bg-white/60" />
        </motion.div>
      </motion.div>
    </section>
  )
}