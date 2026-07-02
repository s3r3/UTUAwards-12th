'use client'

import { useState } from 'react'
import { useUIStore } from '@/store/ui.store'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useTranslations } from '@/lib/i18n'

export default function SettingsPage() {
  const t = useTranslations()
  const { theme, setTheme } = useUIStore()
  const [name, setName] = useState('User Metuah')
  const [email, setEmail] = useState('user@metuahhub.id')

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t.dashboard.settings}</h1>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm space-y-6 max-w-lg">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t.dashboard.profileSection}</h3>
          <div className="space-y-4">
            <Input id="name" label="Nama" value={name} onChange={(e) => setName(e.target.value)} />
            <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button>{t.dashboard.save}</Button>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t.dashboard.display}</h3>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">{t.dashboard.darkMode}</span>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`relative w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-primary-500' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
