'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { motion, useInView } from 'framer-motion'
import gsap from 'gsap'

// ─── Types ──────────────────────────────────────────────────────────────────


// ─── Data ────────────────────────────────────────────────────────────────────


// ─── Particle config ─────────────────────────────────────────────────────────

const PARTICLES = Array.from({ length: 28 }, (_, i) => {
  const phi = (i * 1.618) % 1
  return {
    id: i,
    x: ((i * 137.5 * phi) % 100 + 100) % 100,
    y: ((i * 89.3) % 100 + 100) % 100,
    size: ((i * 3.7) % 4) + 2,
    duration: ((i * 2.3) % 12) + 8,
    delay: ((i * 1.1) % 5),
    opacity: ((i * 0.7) % 0.4) + 0.1,
    color: i % 2 === 0 ? "var(--primary-400)" : "var(--ocean-400)",
  }
})

// ─── Animated counter ────────────────────────────────────────────────────────


// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function Hero() {
  const t = useTranslations()
  // Refs for GSAP blobs
  const blobGreenRef = useRef<HTMLDivElement>(null)
  const blobBlueRef = useRef<HTMLDivElement>(null)
  const blobAccentRef = useRef<HTMLDivElement>(null)

  // InView for counter animation
  const statsRef = useRef<HTMLDivElement>(null)
  useInView(statsRef, { once: true, margin: '-80px' })

  // GSAP parallax on blobs — slow organic float with random offset
  useEffect(() => {
    if (!blobGreenRef.current || !blobBlueRef.current || !blobAccentRef.current)
      return

    const ctx = gsap.context(() => {
      gsap.to(blobGreenRef.current, {
        y: -60,
        x: 30,
        scale: 1.08,
        duration: 9,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
      gsap.to(blobBlueRef.current, {
        y: 50,
        x: -40,
        scale: 1.12,
        duration: 11,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1.5,
      })
      gsap.to(blobAccentRef.current, {
        y: -35,
        x: 20,
        scale: 0.95,
        duration: 7,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 0.8,
      })
    })

    return () => ctx.revert()
  }, [])

  // ── Animation variants ───────────────────────────────────────────────────

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.13, delayChildren: 0.2 },
    },
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
  }

  const fadeIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-gray-950">

      {/* ── Animated gradient background ──────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(34,197,94,0.18) 0%, transparent 70%), ' +
            'radial-gradient(ellipse 60% 50% at 85% 80%, rgba(14,165,233,0.14) 0%, transparent 70%), ' +
            'radial-gradient(ellipse 50% 40% at 10% 90%, rgba(34,197,94,0.10) 0%, transparent 70%)',
        }}
      />

      {/* ── GSAP blobs ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          ref={blobGreenRef}
          className="absolute"
          style={{
            top: '8%',
            left: '-5%',
            width: '480px',
            height: '480px',
            borderRadius: '60% 40% 55% 45% / 45% 55% 45% 55%',
            background:
              'radial-gradient(circle, rgba(34,197,94,0.22) 0%, rgba(34,197,94,0.05) 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          ref={blobBlueRef}
          className="absolute"
          style={{
            bottom: '10%',
            right: '-8%',
            width: '560px',
            height: '560px',
            borderRadius: '45% 55% 40% 60% / 55% 45% 55% 45%',
            background:
              'radial-gradient(circle, rgba(14,165,233,0.20) 0%, rgba(14,165,233,0.04) 70%)',
            filter: 'blur(50px)',
          }}
        />
        <div
          ref={blobAccentRef}
          className="absolute"
          style={{
            top: '45%',
            left: '35%',
            width: '320px',
            height: '320px',
            borderRadius: '50% 50% 50% 50% / 60% 40% 60% 40%',
            background:
              'radial-gradient(circle, rgba(74,222,128,0.15) 0%, rgba(56,189,248,0.08) 70%)',
            filter: 'blur(35px)',
          }}
        />
      </div>

      {/* ── Floating particles ──────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              opacity: p.opacity,
            }}
            animate={{
              y: [0, -30, 0, 20, 0],
              x: [0, 15, -10, 5, 0],
              opacity: [p.opacity, p.opacity * 1.8, p.opacity * 0.6, p.opacity * 1.4, p.opacity],
              scale: [1, 1.3, 0.8, 1.1, 1],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* ── Main content ───────────────────────────────────────────── */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center">

          {/* Badge */}
          <motion.div variants={fadeIn} className="inline-block mb-8">
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg"
              style={{
                background: 'rgba(34,197,94,0.12)',
                border: '1px solid rgba(34,197,94,0.3)',
                color: 'var(--primary-700)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {/* Pulse dot */}
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: 'var(--primary-500)' }}
                />
                <span
                  className="relative inline-flex rounded-full h-2.5 w-2.5"
                  style={{ backgroundColor: 'var(--primary-500)' }}
                />
              </span>
              <Zap size={14} style={{ color: 'var(--primary-600)' }} />
              <span className="dark:text-primary-300">{t.hero.subtitle}</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight"
            style={{ fontFamily: 'var(--font-plus-jakarta), var(--font-inter), sans-serif' }}
          >
            {t.hero.title2}
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, var(--primary-600) 0%, var(--ocean-500) 50%, var(--primary-500) 100%)',
                backgroundSize: '200% auto',
                animation: 'gradientShift 5s linear infinite',
              }}
            >
              {t.hero.title3}
            </span>
            <br />
            <span className="text-3xl md:text-5xl lg:text-6xl text-gray-700 dark:text-gray-200">
              {t.hero.tag}
            </span>
            <br />
            <span className="text-3xl md:text-5xl lg:text-6xl text-gray-700 dark:text-gray-200">
              {t.hero.title4}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            {t.hero.desc}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Link href="/products">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold text-base shadow-xl cursor-pointer select-none"
                style={{
                  background:
                    'linear-gradient(135deg, var(--primary-500) 0%, var(--ocean-500) 100%)',
                  boxShadow: '0 8px 30px rgba(34,197,94,0.35)',
                }}
              >
                {t.hero.cta}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </motion.div>
            </Link>

            <Link href="/register">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base cursor-pointer select-none transition-colors duration-200"
                style={{
                  border: '2px solid var(--primary-500)',
                  color: 'var(--primary-600)',
                  background: 'rgba(34,197,94,0.04)',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: 'var(--primary-500)' }}
                />
                {t.hero.cta2}
              </motion.div>
            </Link>
          </motion.div>

          
        </div>
      </motion.div>


{/* ── Scroll indicator ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-xs text-gray-400 dark:text-gray-600 font-medium tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border-2 border-gray-300 dark:border-gray-700 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-gray-400 dark:bg-gray-600" />
        </motion.div>
      </motion.div>

      {/* ── Wave SVG divider ────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-10">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
          style={{ display: 'block' }}
        >
          <path
            d="M0 60 C240 100 480 20 720 60 C960 100 1200 20 1440 60 L1440 100 L0 100 Z"
            fill="currentColor"
            className="text-white dark:text-gray-950"
          />
        </svg>
      </div>

      {/* Gradient shift keyframes */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </section>
  )
}
  