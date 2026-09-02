'use client'

import { getBestSellers, type BestSellerProduct } from '@/lib/products'
import Image from 'next/image'
import { Leaf, Handshake, Recycle, Factory } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { useCardTilt } from '@/hooks/useCardTilt'
import { motion } from 'framer-motion'

interface ProductCardProps {
  product: BestSellerProduct
  comingSoon?: boolean
  addToCartLabel: string
  comingSoonLabel: string
  labels: { name: string; variant: string; weight: string }
}

function ProductCard({ product, comingSoon = false, addToCartLabel, comingSoonLabel, labels }: ProductCardProps) {
  const { ref, style, shadowStyle } = useCardTilt({ maxTilt: 12, scale: 1.03 })

  return (
    <motion.div
      ref={ref}
      style={style}
      className="w-full overflow-hidden border border-black/20 bg-white/80 shadow-none dark:border-white/15 dark:bg-gray-950/80"
    >
      <div
        className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-amber-100 via-stone-100 to-emerald-50 dark:from-emerald-950 dark:via-slate-900 dark:to-cyan-950"
        style={shadowStyle}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          unoptimized
          className="object-cover"
          priority={false}
        />
      </div>

      <div className="border-t border-black/20 dark:border-white/15">
        <div className="px-4 py-3">
          <h3 className="text-left font-serif text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-gray-100 md:text-base">
            {labels.name}
          </h3>
          <p className="mt-1 text-left text-[11px] uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400">
            {labels.variant}
          </p>
        </div>

        <div className="border-t border-black/20 dark:border-white/15 px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-left text-xs uppercase tracking-[0.18em] text-gray-700 dark:text-gray-300">
              {labels.weight}
            </span>
            <span className="text-right text-xs font-semibold uppercase tracking-[0.18em] text-gray-900 dark:text-gray-100">
              {product.price}
            </span>
          </div>
        </div>

        <div className="border-t border-black/20 dark:border-white/15">
          <button
            className={`block w-full px-2 py-3 text-center text-xs md:text-sm uppercase tracking-widest md:tracking-[0.28em] transition-colors ${
              comingSoon
                ? 'bg-transparent text-gray-900 hover:bg-black/5 dark:text-gray-100 dark:hover:bg-white/10'
                : 'bg-primary-600 text-white hover:bg-primary-700 dark:bg-ocean-600 dark:hover:bg-ocean-500'
            }`}
          >
            {comingSoon ? comingSoonLabel : addToCartLabel}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function BestSellersSection() {
  const t = useTranslations()
  const { farmProduct, seaProduct } = getBestSellers()

  return (
    <section className="bg-[#faf7f2] px-8 py-16 dark:bg-gray-950 md:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3 md:gap-12">
          <div className="w-full">
            <ProductCard product={farmProduct} labels={t.landing.bestSellerFarm} addToCartLabel={t.landing.addToCart} comingSoonLabel={t.landing.comingSoon} />
          </div>

          <div className="flex h-full flex-col items-center justify-center text-center">
            <h2
              className="-rotate-2 text-5xl font-normal leading-none text-primary-700 dark:text-primary-300 md:text-6xl"
              style={{ fontFamily: 'var(--font-script), cursive' }}
            >
              Acelora
            </h2>
            <button className="mt-8 rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-slate-800 dark:bg-ocean-900 dark:hover:bg-ocean-800">
              {t.landing.shopAll}
            </button>
          </div>

          <div className="w-full">
            <ProductCard product={seaProduct} comingSoon labels={t.landing.bestSellerSea} addToCartLabel={t.landing.addToCart} comingSoonLabel={t.landing.comingSoon} />
          </div>
        </div>

        {/* Sustainability badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 border-t border-black/10 pt-8 dark:border-white/10">
          {[
            { Icon: Leaf, label: t.landing.badgeOrganic },
            { Icon: Handshake, label: t.landing.badgeFairTrade },
            { Icon: Recycle, label: t.landing.badgeEcoFriendly },
            { Icon: Factory, label: t.landing.badgeLocal },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-2 text-sm text-stone-600 dark:text-gray-400">
              <b.Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium">{b.label}</span>
            </div>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-10 rounded-2xl border border-primary-200 bg-primary-50/60 p-6 dark:border-primary-800/40 dark:bg-primary-950/20">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
            <div className="flex-1">
              <h3 className="font-serif text-xl font-bold text-primary-800 dark:text-primary-200">{t.landing.newsletterTitle}</h3>
              <p className="mt-1 text-sm text-primary-600 dark:text-primary-400">{t.landing.newsletterDesc}</p>
            </div>
            <div className="flex flex-col w-full gap-2 md:flex-row md:w-auto">
              <input
                type="email"
                placeholder="email@contoh.com"
                className="flex-1 rounded-full border border-primary-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-primary-500 focus:outline-none dark:border-primary-700 dark:bg-gray-900 dark:text-gray-100 md:w-56"
              />
              <button className="rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700">
                {t.landing.addToCart}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}