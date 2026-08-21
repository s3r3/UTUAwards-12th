'use client'

import { useTranslations } from '@/lib/i18n'

export default function AboutPreviewSection() {
  const t = useTranslations()
  return (
    <section className="border-y border-black/20 bg-[#faf7f2] dark:border-white/15 dark:bg-gray-950">
      <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-black/20 dark:md:divide-white/15">
        <div className="p-8 md:p-12">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl">
            <img
              src="/images/landing4.jpg"
              alt="Fresh vegetables and seafood on wooden cutting board"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-8 text-center md:p-16">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-emerald-800 dark:text-emerald-400">
            {t.landing.fromLandSea}
          </p>

          <h2
            className="mt-6 mb-6 text-4xl font-bold text-gray-900 dark:text-gray-100 md:text-5xl"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            {t.landing.uncompromisingFreshness || 'UNCOMPROMISING FRESHNESS'}
          </h2>

          <p className="max-w-md text-base leading-relaxed text-gray-700 dark:text-gray-300">
            {t.landing.aboutDesc}
          </p>

          <button className="mt-8 rounded-full border-2 border-gray-900 px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-900 transition-colors hover:bg-gray-900 hover:text-white dark:border-gray-100 dark:text-gray-100 dark:hover:bg-gray-100 dark:hover:text-gray-900">
            {t.common.learnMore || 'Learn More'}
          </button>
        </div>
      </div>
    </section>
  )
}