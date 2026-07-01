'use client'

import { Globe, Building2, MapPin } from 'lucide-react'

const partners = [
  { company: 'PT. Global Trade Asia', country: 'Malaysia', location: 'Kuala Lumpur', status: 'Active' },
  { company: 'European Foods Ltd', country: 'Belanda', location: 'Amsterdam', status: 'Active' },
  { company: 'Middle East Trading Co', country: 'UAE', location: 'Dubai', status: 'Active' },
  { company: 'American Natural Goods', country: 'USA', location: 'New York', status: 'Pending' },
]

export default function PartnersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Mitra Internasional</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {partners.map((p, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-ocean-500 text-white"><Building2 size={20} /></div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">{p.company}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1"><MapPin size={12} />{p.location}, {p.country}</p>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-2 inline-block ${p.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
