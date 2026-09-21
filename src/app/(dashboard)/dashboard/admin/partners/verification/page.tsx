'use client'

import { useState } from 'react'
import { ShieldCheck, CheckCircle, XCircle } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { adminFallbackPartners } from '@/data/adminDemo'

export default function AdminPartnerVerificationPage() {
  const t = useTranslations()
  const [partners, setPartners] = useState(adminFallbackPartners)
  const queue = partners.filter((p) => p.status !== 'VERIFIED')

  const decide = (id: string, status: string) => setPartners((p) => p.map((x) => (x.id === id ? { ...x, status } : x)))

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <p className="flex items-center gap-2 text-sm font-medium text-gray-950 dark:text-white"><ShieldCheck size={16} /> {t.admin.verifyTitle}</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.admin.verifySubtitle.replace('{count}', String(queue.length))}</p>
      </div>
      {partners.map((p) => (
        <div key={p.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-950 dark:text-white">{p.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{p.owner} · {p.category} · {p.location} · {p.status}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => decide(p.id, 'VERIFIED')} className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"><CheckCircle size={14} /> {t.admin.verify}</button>
            <button onClick={() => decide(p.id, 'REJECTED')} className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20"><XCircle size={14} /> {t.admin.reject}</button>
          </div>
        </div>
      ))}
    </div>
  )
}
