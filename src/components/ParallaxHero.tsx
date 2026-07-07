'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ShoppingBag, Sparkles } from 'lucide-react'

export default function ParallaxHero() {
  const bgRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let rafId: number
    let lastScrollY = 0

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const onScroll = () => {
      lastScrollY = window.scrollY
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const y = lastScrollY
        if (bgRef.current) {
          bgRef.current.style.transform = `translateY(${y * 0.35}px)`
          bgRef.current.style.opacity = `${Math.max(0, 1 - y / 600)}`
        }
        if (textRef.current) {
          textRef.current.style.transform = `translateY(${y * 0.15}px)`
          textRef.current.style.opacity = `${Math.max(0, 1 - y / 500)}`
        }
        if (ctaRef.current) {
          ctaRef.current.style.transform = `translateY(${y * 0.1}px)`
          ctaRef.current.style.opacity = `${Math.max(0, 1 - y / 400)}`
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gray-950">
      {/* Parallax background layer */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{
          background: 'linear-gradient(135deg, #0a1628 0%, #14532d 30%, #0ea5e9 70%, #0a1628 100%)',
        }}
      >
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary-500/20 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-ocean-500/20 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-400/10 blur-[150px]" />

        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div ref={textRef} className="will-change-transform">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 text-xs font-medium mb-6">
            <Sparkles size={12} className="text-primary-400" />
            Premium Agro-Maritime Marketplace
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-white via-primary-200 to-ocean-200 bg-clip-text text-transparent">
              Acelora
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/70 font-light mb-3 max-w-2xl mx-auto">
            Produk Agro-Maritim Premium dari Aceh
          </p>
          <p className="text-sm sm:text-base text-white/40 max-w-xl mx-auto mb-10">
            Belanja langsung dari petani, nelayan, dan UMKM Aceh. Autentik, berkualitas global.
          </p>
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="will-change-transform flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-white text-primary-800 font-semibold text-base hover:bg-primary-50 hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl shadow-black/20"
          >
            <ShoppingBag size={20} />
            Belanja Sekarang
          </Link>
          <Link
            href="/products?category=COFFEE"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/15 text-white/80 font-medium text-base hover:bg-white/10 hover:border-white/30 transition-all duration-300"
          >
            Kopi Gayo →
          </Link>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 dark:from-gray-950 to-transparent pointer-events-none" />
    </section>
  )
}
