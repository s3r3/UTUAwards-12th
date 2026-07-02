import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import en from './en'
import id from './id'
import type { Translations } from './en'

export type Lang = 'en' | 'id'
const translations: Record<Lang, Translations> = { en, id }

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

export function t(lang: Lang): Translations {
  return translations[lang]
}
