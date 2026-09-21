'use client'

import { useState } from 'react'
import { useTranslations } from '@/lib/i18n'
import { formatRupiah } from '@/data/adminDemo'

const initial = [
  { id: '#PAY-001', partner: 'Kopi Gayo Mandiri', amount: 24500000, status: 'Paid', date: '18 Sep' },
  { id: '#PAY-002', partner: 'Bahari Sejahtera', amount: 18200000, status: 'Pending', date: '15 Sep' },
  { id: '#PAY-003', partner: 'Nilam Aceh Selatan', amount: 9600000, status: 'Pending', date: '12 Sep' },
]

export default function AdminPayoutsPage() {
  const t = useTranslations()
  const [payouts, setPayouts] = useState(initial)

  const pay = (id: string) => setPayouts((p) => p.map((x) => (x.id === id ? { ...x, status: 'Paid' } : x)))

  return (
    <div className="space-y-3">
      {payouts.map((p) => (
        <div key={p.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-xs text-gray-500 dark:text-gray-400">{p.id} · {p.date}</p>
            <p className="text-sm font-semibold text-gray-950 dark:text-white">{p.partner} · {formatRupiah(p.amount)}</p>
          </div>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}>{p.status}</span>
          {p.status !== 'Paid' && <button onClick={() => pay(p.id)} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">{t.admin.pay}</button>}
        </div>
      ))}
      <p className="text-xs text-gray-400 dark:text-gray-500">{t.admin.payoutNote}</p>
    </div>
  )
}
