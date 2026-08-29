'use client'

import { Region } from '@/data/regions'
import Link from 'next/link'
import { MapPin, Leaf, Anchor } from 'lucide-react'
import WeatherWidget from '@/components/map/WeatherWidget'
import { useI18NStore, useTranslations } from '@/lib/i18n'

interface RegionCardProps {
  region: Region | null
}

export default function RegionCard({ region }: RegionCardProps) {
  const t = useTranslations()
  const lang = useI18NStore((s) => s.lang)
  const isEn = lang === 'en'

  if (!region) {
    return (
      <div className="flex h-full items-center justify-center rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 p-8">
        <div className="text-center">
          <MapPin className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">
            {t.landing.mapPickRegion}
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            {t.landing.mapPickRegionDesc}
          </p>
        </div>
      </div>
    )
  }

  const isFishing = region.type === 'fishing'
  const typeLabel = isFishing ? t.landing.mapZoneFishing : t.landing.mapZoneFarming
  const accentClass = isFishing
    ? 'from-ocean-500 to-ocean-700'
    : 'from-emerald-500 to-emerald-700'

  const regionName = isEn ? region.nameEn : region.name
  const regionDesc = isEn ? region.description.en : region.description.id
  const regionSeason = isEn ? region.season.en : region.season.id

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl h-full flex flex-col">
      <div className={`relative bg-gradient-to-br ${accentClass} p-6 text-white`}>
        {isFishing ? <Anchor className="h-10 w-10 mb-3" /> : <Leaf className="h-10 w-10 mb-3" />}
        <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
          {typeLabel}
        </span>
      </div>

      <div className="p-6 space-y-4 flex-1 flex flex-col">
        <div>
          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-gray-100">
            {regionName}
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <MapPin size={14} />
            {region.village}, {region.district}
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3">
          <WeatherWidget lat={region.lat} lng={region.lng} />
        </div>

        <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 p-3">
          <span className="text-xs font-medium text-amber-800 dark:text-amber-300 flex items-center gap-1">
            <Leaf size={12} />
            {regionSeason}
          </span>
        </div>

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {t.landing.mapFeatured}
          </h3>
          <div className="flex flex-wrap gap-2">
            {region.products.map((product) => (
              <span
                key={product.id}
                className="rounded-full bg-primary-100/50 dark:bg-primary-900/30 px-3 py-1.5 text-xs font-medium text-primary-800 dark:text-primary-300"
              >
                {isEn ? product.en : product.id}
              </span>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {regionDesc}
        </p>

        <Link
          href={`/products?region=${region.id}`}
          className="mt-auto rounded-full bg-gradient-to-r from-primary-500 to-ocean-500 px-6 py-3 text-center text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg"
        >
          {t.landing.mapViewProducts} {regionName.split(' ')[0]}
        </Link>
      </div>
    </div>
  )
}
