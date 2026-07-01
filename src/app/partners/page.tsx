'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Globe, MapPin, Building, Search } from 'lucide-react'

const regions = [
  { id: 'all', name: 'Semua' },
  { id: 'ASIA', name: 'Asia' },
  { id: 'EUROPE', name: 'Eropa' },
  { id: 'MIDDLE_EAST', name: 'Timur Tengah' },
  { id: 'AMERICA', name: 'Amerika' },
  { id: 'AFRICA', name: 'Afrika' },
]

const partners = [
  { company: 'Tokyo Spice Trading Co.', country: 'Jepang', location: 'Tokyo', category: 'ASIA', focus: 'Rempah & Kopi' },
  { company: 'Malaysian Agri Corp', country: 'Malaysia', location: 'Kuala Lumpur', category: 'ASIA', focus: 'Nilam & Seafood' },
  { company: 'Dubai Import House', country: 'UAE', location: 'Dubai', category: 'MIDDLE_EAST', focus: 'Produk Halal' },
  { company: 'Hamburg Commodities GmbH', country: 'Jerman', location: 'Hamburg', category: 'EUROPE', focus: 'Kopi Specialty' },
  { company: 'Singapore Food Hub', country: 'Singapura', location: 'Singapore', category: 'ASIA', focus: 'Seafood & Olahan' },
  { company: 'Istanbul Trading', country: 'Turki', location: 'Istanbul', category: 'MIDDLE_EAST', focus: 'Rempah & Nilam' },
  { company: 'Amsterdam Essentials BV', country: 'Belanda', location: 'Amsterdam', category: 'EUROPE', focus: 'Minyak Nilam' },
  { company: 'Seoul Organic Market', country: 'Korea Selatan', location: 'Seoul', category: 'ASIA', focus: 'Kopi & Rempah' },
  { company: 'New York Specialty Foods', country: 'Amerika Serikat', location: 'New York', category: 'AMERICA', focus: 'Kopi Gayo' },
  { company: 'Nairobi Agri Exchange', country: 'Kenya', location: 'Nairobi', category: 'AFRICA', focus: 'Supply Chain' },
  { company: 'Riyadh Halal Group', country: 'Arab Saudi', location: 'Riyadh', category: 'MIDDLE_EAST', focus: 'Sertifikasi Halal' },
  { company: 'Bangkok Trade Center', country: 'Thailand', location: 'Bangkok', category: 'ASIA', focus: 'Seafood' },
]

export default function PartnersPage() {
  const [region, setRegion] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = partners.filter((p) => {
    const matchRegion = region === 'all' || p.category === region
    const matchSearch = p.company.toLowerCase().includes(search.toLowerCase()) || p.country.toLowerCase().includes(search.toLowerCase())
    return matchRegion && matchSearch
  })

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-28 pb-12 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Mitra <span className="bg-gradient-to-r from-primary-600 to-ocean-600 bg-clip-text text-transparent">Internasional</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Jaringan mitra global yang menghubungkan produk agro-maritim Aceh dengan pasar dunia.
          </p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari mitra atau negara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {regions.map((r) => (
              <button
                key={r.id}
                onClick={() => setRegion(r.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  region === r.id
                    ? 'gradient-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white shrink-0">
                    <Building size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{p.company}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <Globe size={14} /> {p.country}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <MapPin size={14} /> {p.location}
                    </div>
                    <span className="inline-block mt-2 text-xs font-medium px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
                      {p.focus}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-16">Tidak ada mitra ditemukan.</p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
