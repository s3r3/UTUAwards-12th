'use client'

import { useTranslations } from '@/lib/i18n'
import { adminFallbackPartners, formatRupiah } from '@/data/adminDemo'

export default function AdminPartnerPerformancePage() {
  const t = useTranslations()
  const sorted = [...adminFallbackPartners].sort((a, b) => b.revenue - a.revenue)
  const max = Math.max(...sorted.map((p) => p.revenue))

  return (
    <div className="space-y-3">
      {sorted.map((p) => (
        <div key={p.id} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-950 dark:text-white">{p.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{p.orders} {t.admin.ordersUnit} · {p.location}</p>
            </div>
            <p className="text-sm font-bold text-gray-950 dark:text-white">{formatRupiah(p.revenue)}</p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.round((p.revenue / max) * 100)}%` }} />
          </div>
        </div>
      ))}
      <p className="text-xs text-gray-400 dark:text-gray-500">{t.admin.performanceNote}</p>
    </div>
  )
}
