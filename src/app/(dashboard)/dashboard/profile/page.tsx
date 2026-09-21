'use client'

import { useEffect, useState } from 'react'
import { Calendar, Mail, Shield, User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from '@/lib/i18n'

export default function ProfilePage() {
  const t = useTranslations()
  const { data: session } = useSession()
  const [stats, setStats] = useState<{ total: number; delivered: number } | null>(null)

  useEffect(() => {
    fetch('/api/dashboard-data')
      .then(r => r.json())
      .then(d => {
        if (d.success) setStats({ total: d.data.stats.total, delivered: d.data.stats.delivered })
      })
      .catch(() => {})
  }, [])

  const name = session?.user?.name || t.member.memberFallback
  const email = session?.user?.email || 'member@acelora.id'
  const role = session?.user?.role || 'USER'

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-emerald-600 text-2xl font-bold text-white">{name.charAt(0).toUpperCase()}</div>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-gray-950 dark:text-white">{name}</h2>
            <p className="truncate text-sm text-gray-500 dark:text-gray-400">{email}</p>
            <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">{role}</span>
          </div>
        </div>
        <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <p className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2.5 text-gray-600 dark:bg-gray-800/60 dark:text-gray-400"><User size={16} className="shrink-0 text-gray-400" /> <span className="truncate">{name}</span></p>
          <p className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2.5 text-gray-600 dark:bg-gray-800/60 dark:text-gray-400"><Mail size={16} className="shrink-0 text-gray-400" /> <span className="truncate">{email}</span></p>
          <p className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2.5 text-gray-600 dark:bg-gray-800/60 dark:text-gray-400"><Shield size={16} className="shrink-0 text-gray-400" /> {role}</p>
          <p className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2.5 text-gray-600 dark:bg-gray-800/60 dark:text-gray-400"><Calendar size={16} className="shrink-0 text-gray-400" /> {t.member.joined} {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-3xl font-bold text-gray-950 dark:text-white">{stats.total}</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.member.totalOrdersStat}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-3xl font-bold text-gray-950 dark:text-white">{stats.delivered}</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.member.completedOrdersStat}</p>
          </div>
        </div>
      )}
    </div>
  )
}
