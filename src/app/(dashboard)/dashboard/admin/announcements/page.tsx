'use client'

import { useState } from 'react'
import { Bell, Plus } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

export default function AdminAnnouncementsPage() {
  const t = useTranslations()
  const [items, setItems] = useState([
    { id: 'a1', title: 'Maintenance terjadwal', body: 'Sistem payout offline Minggu 02.00–04.00 WIB.', date: 'Hari ini' },
    { id: 'a2', title: 'Kebijakan retur baru', body: 'Batas retur B2B menjadi 7 hari sejak terima.', date: 'Kemarin' },
  ])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const add = () => {
    if (!title.trim() || !body.trim()) return
    setItems((p) => [{ id: `a${Date.now()}`, title: title.trim(), body: body.trim(), date: t.admin.justNow }, ...p])
    setTitle('')
    setBody('')
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <p className="mb-3 text-sm font-semibold text-gray-950 dark:text-white">{t.admin.createAnnouncement}</p>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t.admin.titlePlaceholder} className="mb-2 w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-950 outline-none focus:border-emerald-500 dark:border-gray-700 dark:text-white" />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder={t.admin.bodyPlaceholder} rows={3} className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-950 outline-none focus:border-emerald-500 dark:border-gray-700 dark:text-white" />
        <button onClick={add} className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"><Plus size={15} /> {t.admin.publish}</button>
      </div>
      <div className="space-y-3">
        {items.map((a) => (
          <div key={a.id} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <p className="flex items-center gap-2 text-sm font-semibold text-gray-950 dark:text-white"><Bell size={14} /> {a.title}</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{a.body}</p>
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">{a.date}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
