'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { regions, getRegionById } from '@/data/regions'
import RegionCard from '@/components/map/RegionCard'
import RegionNews from '@/components/map/RegionNews'
import { useI18NStore, useTranslations } from '@/lib/i18n'
import { Anchor, Sprout, Newspaper, Map as MapIcon } from 'lucide-react'

const RegionalMap = dynamic(() => import('@/components/map/RegionalMap'), { ssr: false })

export default function MapPage() {
  const t = useTranslations()
  const lang = useI18NStore((s) => s.lang)
  const isEn = lang === 'en'
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)
  const selectedRegion = selectedRegionId ? getRegionById(selectedRegionId) ?? null : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-ocean-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-ocean-950/20">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 backdrop-blur-md dark:bg-gray-950/80 mt-20">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-col items-center sm:flex-row sm:justify-between">
            <div className="text-center sm:text-left min-w-0 mb-4 sm:mb-0">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                {t.landing.mapPageTitle}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t.landing.mapPageSubtitle}
              </p>
            </div>
            <div className="flex flex-nowrap justify-center sm:justify-end gap-2 mt-4 sm:mt-0">
              <span className="flex-shrink-0 rounded-full bg-ocean-100 dark:bg-ocean-900/40 px-3 py-1.5 text-xs font-medium text-ocean-700 dark:text-ocean-300">
                {regions.filter((r) => r.type === 'fishing').length} {t.landing.mapZoneFishing}
              </span>
              <span className="flex-shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                {regions.filter((r) => r.type === 'agriculture').length} {t.landing.mapZoneFarming}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 relative z-0">
            <RegionalMap onRegionSelect={setSelectedRegionId} />
          </div>

          <div className="space-y-6">
            <RegionCard region={selectedRegion} />

            <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-xl">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                <Newspaper size={18} /> {t.landing.mapNewsTitle}
              </h3>
              {selectedRegion ? (
                <RegionNews news={selectedRegion.news} />
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t.landing.mapSelectRegionForNews}
                </p>
              )}
            </div>

            {!selectedRegion && (
              <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-xl">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  <MapIcon size={18} /> {t.landing.mapAllRegions}
                </h3>
                <div className="space-y-3">
                  {regions.map((region) => {
                    const Icon = region.type === 'fishing' ? Anchor : Sprout
                    const regionName = isEn ? region.nameEn : region.name
                    return (
                      <button
                        key={region.id}
                        onClick={() => setSelectedRegionId(region.id)}
                        className="w-full flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-left transition-all hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50/50 dark:hover:bg-primary-950/20"
                      >
                        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${region.type === 'fishing' ? 'bg-ocean-100 dark:bg-ocean-900/40' : 'bg-emerald-100 dark:bg-emerald-900/40'}`}>
                          <Icon className={`h-5 w-5 ${region.type === 'fishing' ? 'text-ocean-600 dark:text-ocean-300' : 'text-emerald-600 dark:text-emerald-300'}`} />
                        </span>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {regionName}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {region.village}
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-2 py-1 text-[11px] font-medium ${
                            region.type === 'fishing'
                              ? 'bg-ocean-100 text-ocean-700 dark:bg-ocean-900/40 dark:text-ocean-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          }`}
                        >
                          {region.type === 'fishing' ? t.landing.mapZoneFishing : t.landing.mapZoneFarming}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
