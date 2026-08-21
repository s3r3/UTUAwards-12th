'use client'

import { getBestSellers, type BestSellerProduct } from '@/lib/products'
import type { Translations } from '@/lib/i18n/en'
import Image from 'next/image'
import { useTranslations } from '@/lib/i18n'

interface ProductCardProps {
  product: BestSellerProduct
  comingSoon?: boolean
  addToCartLabel: string
  comingSoonLabel: string
  labels: { name: string; variant: string; weight: string }
}

function ProductCard({ product, comingSoon = false, addToCartLabel, comingSoonLabel, labels }: ProductCardProps) {
  return (
    <div className="w-full overflow-hidden border border-black/20 bg-white/80 shadow-none dark:border-white/15 dark:bg-gray-950/80">
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-amber-100 via-stone-100 to-emerald-50 dark:from-emerald-950 dark:via-slate-900 dark:to-cyan-950">
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
            className={`block w-full px-4 py-3 text-center text-sm uppercase tracking-[0.28em] transition-colors ${
              comingSoon
                ? 'bg-transparent text-gray-900 hover:bg-black/5 dark:text-gray-100 dark:hover:bg-white/10'
                : 'bg-primary-600 text-white hover:bg-primary-700 dark:bg-ocean-600 dark:hover:bg-ocean-500'
            }`}
          >
            {comingSoon ? comingSoonLabel : addToCartLabel}
          </button>
        </div>
      </div>
    </div>
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
      </div>
    </section>
  )
}