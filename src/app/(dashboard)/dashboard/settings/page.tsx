'use client'

import { useEffect, useState } from 'react'
import { Bell, Globe, Moon, ShieldAlert, ShoppingBag, Trash2 } from 'lucide-react'
import { useUIStore } from '@/store/ui.store'
import { useI18NStore, useTranslations } from '@/lib/i18n'

interface Prefs {
  orderUpdates: boolean
  promos: boolean
  newsletter: boolean
  language: 'id' | 'en'
  stockAlerts: boolean
}

const DEFAULT_PREFS: Prefs = {
  orderUpdates: true,
  promos: true,
  newsletter: false,
  language: 'id',
  stockAlerts: false,
}

function Toggle({ checked, onChange, label, desc }: { checked: boolean; onChange: (v: boolean) => void; label: string; desc?: string }) {
  return (
    <button onClick={() => onChange(!checked)} className="flex w-full items-center justify-between gap-4 rounded-xl px-1 py-2.5 text-left">
      <span>
        <span className="block text-sm font-medium text-gray-900 dark:text-white">{label}</span>
        {desc && <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">{desc}</span>}
      </span>
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
      </span>
    </button>
  )
}

export default function SettingsPage() {
  const t = useTranslations()
  const { theme, setTheme } = useUIStore()
  const lang = useI18NStore((s) => s.lang)
  const setLang = useI18NStore((s) => s.setLang)
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS)
  const [saved, setSaved] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('acelora-user-prefs')
      if (raw) setPrefs({ ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<Prefs>) })
    } catch { /* abaikan */ }
  }, [])

  const set = <K extends keyof Prefs>(key: K, value: Prefs[K]) => {
    setPrefs((p) => {
      const next = { ...p, [key]: value }
      localStorage.setItem('acelora-user-prefs', JSON.stringify(next))
      return next
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="max-w-2xl space-y-4">
      {saved && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-300">
          {t.member.settingsSaved}
        </p>
      )}

      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="flex items-center gap-2 font-semibold text-gray-950 dark:text-white"><Bell size={17} /> {t.member.notifTitle}</h2>
        <div className="mt-2 divide-y divide-gray-100 dark:divide-gray-800">
          <Toggle checked={prefs.orderUpdates} onChange={(v) => set('orderUpdates', v)} label={t.member.orderUpdates} desc={t.member.orderUpdatesDesc} />
          <Toggle checked={prefs.promos} onChange={(v) => set('promos', v)} label={t.member.promos} desc={t.member.promosDesc} />
          <Toggle checked={prefs.stockAlerts} onChange={(v) => set('stockAlerts', v)} label={t.member.stockBack} desc={t.member.stockBackDesc} />
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="flex items-center gap-2 font-semibold text-gray-950 dark:text-white"><ShoppingBag size={17} /> {t.member.shopPrefTitle}</h2>
        <div className="mt-2 divide-y divide-gray-100 dark:divide-gray-800">
          <Toggle checked={prefs.newsletter} onChange={(v) => set('newsletter', v)} label={t.member.newsletter} desc={t.member.newsletterDesc} />
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="flex items-center gap-2 font-semibold text-gray-950 dark:text-white"><Globe size={17} /> {t.member.langTitle}</h2>
        <div className="mt-4 flex gap-2">
          {(['id', 'en'] as const).map((l) => (
            <button
              key={l}
              onClick={() => { setLang(l); set('language', l) }}
              className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${lang === l ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300' : 'border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'}`}
            >
              {l === 'id' ? t.member.langId : t.member.langEn}
            </button>
          ))}
        </div>
        <div className="mt-2">
          <Toggle checked={theme === 'dark'} onChange={(v) => setTheme(v ? 'dark' : 'light')} label={t.member.darkMode} desc={t.member.darkModeDesc} />
        </div>
        <p className="mt-1 flex items-center gap-2 px-1 text-xs text-gray-400 dark:text-gray-500"><Moon size={13} /> {t.member.followSystem}</p>
      </section>

      <section className="rounded-xl border border-red-200 bg-white p-5 dark:border-red-900/50 dark:bg-gray-900">
        <h2 className="flex items-center gap-2 font-semibold text-red-600 dark:text-red-400"><ShieldAlert size={17} /> {t.member.dangerZone}</h2>
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20"
          >
            <Trash2 size={15} /> {t.member.deleteAccount}
          </button>
        ) : (
          <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm dark:bg-red-900/10">
            <p className="font-medium text-red-700 dark:text-red-300">{t.member.deleteConfirmTitle}</p>
            <p className="mt-1 text-xs text-red-500 dark:text-red-400">{t.member.deleteConfirmDesc}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => setConfirmDelete(false)} className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">{t.member.cancel}</button>
              <button onClick={() => setConfirmDelete(false)} className="rounded-lg bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700">{t.member.deleteConfirmYes}</button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
