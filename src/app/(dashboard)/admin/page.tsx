'use client'

import { useState } from 'react'
import { Users, Package, Globe, BookOpen, Search, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

const adminStats = [
  { label: 'Total Users', value: 245, icon: Users, color: 'bg-primary-500' },
  { label: 'Total {t.dashboard.product}', value: 512, icon: Package, color: 'bg-ocean-500' },
  { label: 'Mitra Aktif', value: 25, icon: Globe, color: 'bg-purple-500' },
  { label: 'Program Mentoring', value: 15, icon: BookOpen, color: 'bg-yellow-500' },
]

const pendingProducts = [
  { id: 1, name: 'Kopi Luwak Gayo', owner: 'Pak Ahmad', category: 'COFFEE', date: '30 Jun 2026' },
  { id: 2, name: 'Ikan Cakalang Asap', owner: 'Bu Siti', category: 'PROCESSED', date: '29 Jun 2026' },
  { id: 3, name: 'Cengkeh Aceh Barat', owner: 'Pak Budi', category: 'SPICES', date: '28 Jun 2026' },
]

export default function AdminPage() {
  const t = useTranslations()
  const [search, setSearch] = useState('')

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t.dashboard.adminPanel}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {adminStats.map((s, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
            <div className={`p-2.5 rounded-xl ${s.color} text-white w-fit mb-3`}>
              <s.icon size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{s.value}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock size={20} className="text-yellow-500" /> {t.dashboard.product} Menunggu Approval
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Cari..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 font-medium">{t.dashboard.product}</th>
                <th className="pb-3 font-medium">{t.dashboard.owner}</th>
                <th className="pb-3 font-medium">{t.dashboard.category}</th>
                <th className="pb-3 font-medium">{t.dashboard.date}</th>
                <th className="pb-3 font-medium text-right">{t.dashboard.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {pendingProducts
                .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
                .map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 font-medium text-gray-900 dark:text-white">{p.name}</td>
                    <td className="py-3 text-gray-600 dark:text-gray-400">{p.owner}</td>
                    <td className="py-3"><span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">{p.category}</span></td>
                    <td className="py-3 text-gray-600 dark:text-gray-400">{p.date}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"><CheckCircle size={18} /></button>
                        <button className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><XCircle size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
