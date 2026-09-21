import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import en from './en'
import id from './id'
import type { Translations } from './en'

export type Lang = 'en' | 'id'

// Deep-merge `en` (base) with the locale override. `id.ts` is incomplete — it
// lacks entire sections (e.g. `partnerDashboard`) — so a shallow merge would
// drop `en`'s values for any section `id` partially defines. Recursing keeps
// every missing key backed by English instead of throwing
// `can't access property "X", t.Y is undefined`.
function deepMerge<T extends Record<string, any>>(base: T, override: Partial<T>): T {
  const out = { ...base } as Record<string, any>
  for (const k in override) {
    const v = (override as any)[k]
    out[k] =
      v && typeof v === 'object' && !Array.isArray(v) && k in base
        ? deepMerge((base as any)[k], v)
        : v
  }
  return out as T
}

const translations: Record<Lang, Translations> = { en, id: deepMerge(en, id) }

interface I18NState {
  lang: Lang
  setLang: (lang: Lang) => void
}

export const useI18NStore = create<I18NState>()(
  persist(
    (set) => ({
      lang: 'id',
      setLang: (lang) => set({ lang }),
    }),
    { name: 'i18n-lang' }
  )
)

export function useTranslations() {
  const lang = useI18NStore((s) => s.lang)
  return translations[lang]
}

// Translate seed product fields (id-based) for the active language.
export function useSeedProduct(id?: string | null) {
  const t = useTranslations()
  if (!id) return null
  return (t.landing.productSeedNames as Record<string, { name: string; desc: string; origin: string; quality?: string; shipping?: string; faq?: string }>)[id] ?? null
}

export function t(lang: Lang): Translations {
  return translations[lang]
}

export function getServerTranslations(lang?: Lang): Translations {
  return translations[lang && lang in translations ? lang : 'id']
}
