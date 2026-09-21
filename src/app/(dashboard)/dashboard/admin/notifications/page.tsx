'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { adminFallbackNotifications } from '@/data/adminDemo'

export default function AdminNotificationsPage() {
  const t = useTranslations()
  const [items, setItems] = useState(adminFallbackNotifications)
  const [tab, setTab] = useState<'all' | 'unread'>('all')

  const filtered = tab === 'all' ? items : items.filter((n) => n.unread)

  return (
    <div className="space-y-4">
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800">
        <button onClick={() => setTab('all')} className={`pb-3 text-sm font-medium ${tab === 'all' ? 'border-b-2 border-emerald-600 text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>{t.admin.all} ({items.length})</button>
        <button onClick={() => setTab('unread')} className={`pb-3 text-sm font-medium ${tab === 'unread' ? 'border-b-2 border-emerald-600 text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>{t.admin.unread} ({items.filter((n) => n.unread).length})</button>
      </div>
      <div className="space-y-3">
        {filtered.map((n) => (
          <div key={n.id} className={`flex items-start gap-4 rounded-xl border p-4 ${n.unread ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-900/10' : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'}`}>
            <div className="rounded-full bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300"><Bell size={16} /></div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-950 dark:text-white">{n.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{n.desc}</p>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{n.date}</p>
            </div>
            <button onClick={() => setItems((p) => p.map((x) => (x.id === n.id ? { ...x, unread: !x.unread } : x)))} className="shrink-0 text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400">
              {n.unread ? t.member.markRead : t.member.markUnread}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
