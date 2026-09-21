'use client'

import { useState } from 'react'
import { useUIStore } from '@/store/ui.store'
import { useTranslations } from '@/lib/i18n'

export default function AdminSettingsPage() {
  const t = useTranslations()
  const { theme, setTheme } = useUIStore()
  const [platformFee, setPlatformFee] = useState('5')
  const [supportEmail, setSupportEmail] = useState('support@acelora.id')
  const [saved, setSaved] = useState(false)

  const save = () => {
    localStorage.setItem('acelora-admin-settings', JSON.stringify({ platformFee, supportEmail }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-lg space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="font-semibold text-gray-950 dark:text-white">{t.admin.platformSettings}</h2>
        <div className="mt-4 space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-gray-700 dark:text-gray-300">{t.admin.platformFee}</span>
            <input value={platformFee} onChange={(e) => setPlatformFee(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-gray-950 outline-none focus:border-emerald-500 dark:border-gray-700 dark:text-white" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-gray-700 dark:text-gray-300">{t.admin.supportEmail}</span>
            <input value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-gray-950 outline-none focus:border-emerald-500 dark:border-gray-700 dark:text-white" />
          </label>
          <button onClick={save} className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700">
            {saved ? t.admin.savedExcl : t.admin.save}
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="font-semibold text-gray-950 dark:text-white">{t.admin.appearance}</h2>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`mt-3 relative h-6 w-12 rounded-full transition-colors ${theme === 'dark' ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`}
          aria-label={t.member.darkMode}
        >
          <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'}`} />
        </button>
      </div>
    </div>
  )
}
