'use client'

import { ScrollText } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

const logs = [
  { id: 'l1', actor: 'admin@acelora.id', action: 'UPDATE_ORDER', target: '#ACL-10293 → PROCESSING', time: '10:24' },
  { id: 'l2', actor: 'admin@acelora.id', action: 'APPROVE_PRODUCT', target: 'Kopi Arabika Gayo', time: '09:12' },
  { id: 'l3', actor: 'system', action: 'PAYOUT_CREATED', target: '#PAY-002 · Rp 18.200.000', time: 'Kemarin' },
]

export default function AdminAuditLogPage() {
  const t = useTranslations()
  return (
    <div className="space-y-3">
      {logs.map((l) => (
        <div key={l.id} className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="rounded-lg bg-gray-100 p-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400"><ScrollText size={16} /></div>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-xs font-semibold text-gray-950 dark:text-white">{l.action}</p>
            <p className="mt-0.5 truncate text-sm text-gray-500 dark:text-gray-400">{l.target} · {l.actor}</p>
          </div>
          <p className="shrink-0 text-xs text-gray-400 dark:text-gray-500">{l.time}</p>
        </div>
      ))}
      <p className="text-xs text-gray-400 dark:text-gray-500">{t.admin.auditNote}</p>
    </div>
  )
}
