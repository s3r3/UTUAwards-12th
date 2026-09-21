'use client'

import { useState } from 'react'
import { Megaphone, Plus } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

interface Campaign {
  id: string
  name: string
  target: string
  status: string
}

export default function AdminCampaignsPage() {
  const t = useTranslations()
  const [items, setItems] = useState<Campaign[]>([
    { id: 'c1', name: 'Panen Raya Gayo', target: 'Semua pembeli', status: 'Aktif' },
    { id: 'c2', name: 'Diskon Nilam 10%', target: 'B2B Jawa', status: 'Draft' },
  ])
  const [name, setName] = useState('')

  const add = () => {
    if (!name.trim()) return
    setItems((p) => [...p, { id: `c${Date.now()}`, name: name.trim(), target: 'Semua pembeli', status: 'Draft' }])
    setName('')
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={name} onChange={(e) => setName(e.target.value)} placeholder={t.admin.newCampaignPlaceholder}
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-950 outline-none focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
        />
        <button onClick={add} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"><Plus size={15} /> {t.admin.create}</button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((c) => (
          <div key={c.id} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <Megaphone size={18} className="mb-3 text-emerald-600 dark:text-emerald-400" />
            <p className="font-semibold text-gray-950 dark:text-white">{c.name}</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{c.target} · {c.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
