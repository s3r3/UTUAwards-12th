'use client'

import { Users, Search, Shield, UserX } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from '@/lib/i18n'

const users = [
  { id: 1, name: 'Ahmad Fauzan', email: 'ahmad@example.com', role: 'USER', products: 5 },
  { id: 2, name: 'Siti Nurhaliza', email: 'siti@example.com', role: 'USER', products: 3 },
  { id: 3, name: 'Admin Metuah', email: 'admin@metuahhub.id', role: 'ADMIN', products: 0 },
]

export default function AdminUsersPage() {
  const t = useTranslations()
  const [search, setSearch] = useState('')

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t.dashboard.adminUsers}</h1>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Cari..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 font-medium">{t.dashboard.name}</th>
                <th className="pb-3 font-medium">{t.dashboard.email}</th>
                <th className="pb-3 font-medium">{t.dashboard.role}</th>
                <th className="pb-3 font-medium">{t.dashboard.product}</th>
                <th className="pb-3 font-medium text-right">{t.dashboard.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {users.filter(u => u.name.toLowerCase().includes(search.toLowerCase())).map((u) => (
                <tr key={u.id}>
                  <td className="py-3 font-medium text-gray-900 dark:text-white">{u.name}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">{u.email}</td>
                  <td className="py-3"><span className={`text-xs px-2 py-1 rounded-full ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>{u.role}</span></td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">{u.products}</td>
                  <td className="py-3 text-right"><button className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"><UserX size={18} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
