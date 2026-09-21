'use client'

import { useTranslations } from '@/lib/i18n'
import { adminFallbackPartners, formatRupiah } from '@/data/adminDemo'

export default function AdminPartnerApplicationsPage() {
  const t = useTranslations()
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <th className="px-4 py-3 font-medium">{t.admin.buyer}</th>
            <th className="px-4 py-3 font-medium">{t.admin.category}</th>
            <th className="px-4 py-3 font-medium">{t.admin.location}</th>
            <th className="px-4 py-3 font-medium">{t.admin.status}</th>
            <th className="px-4 py-3 font-medium">{t.admin.revenue}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {adminFallbackPartners.map((p) => (
            <tr key={p.id}>
              <td className="px-4 py-3 font-medium text-gray-950 dark:text-white">{p.name}<span className="block text-xs font-normal text-gray-500 dark:text-gray-400">{p.owner}</span></td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{p.category}</td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{p.location}</td>
              <td className="px-4 py-3"><span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">{p.status}</span></td>
              <td className="px-4 py-3 text-gray-950 dark:text-white">{formatRupiah(p.revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
