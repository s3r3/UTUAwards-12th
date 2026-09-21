'use client'

import { useEffect, useState } from 'react'
import { Search, UserX } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { adminFallbackUsers } from '@/data/adminDemo'

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  products: number
  orders?: number
  createdAt?: string
}

export default function AdminUsersPage() {
  const t = useTranslations()
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data.length > 0) setUsers(d.data)
        else setUsers(adminFallbackUsers)
      })
      .catch(() => setUsers(adminFallbackUsers))
      .finally(() => setLoading(false))
  }, [])

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text" placeholder={t.admin.searchUser} value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-950 outline-none focus:border-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{loading ? t.common.loading : t.admin.usersCount.replace('{count}', String(filtered.length))}</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <th className="px-4 py-3 font-medium">{t.admin.name}</th>
              <th className="px-4 py-3 font-medium">{t.admin.email}</th>
              <th className="px-4 py-3 font-medium">{t.admin.role}</th>
              <th className="px-4 py-3 font-medium">{t.admin.products}</th>
              <th className="px-4 py-3 text-right font-medium">{t.admin.action}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3 font-medium text-gray-950 dark:text-white">{u.name}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : u.role === 'PARTNER' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{u.products}</td>
                <td className="px-4 py-3 text-right"><button className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" aria-label={t.admin.deactivate}><UserX size={17} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
