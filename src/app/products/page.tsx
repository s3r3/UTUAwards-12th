'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { Search, Coffee, Waves, Leaf, Package, Star, MapPin, ArrowRight } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

const categories = [
  { id: 'all', name: 'Semua', icon: Package },
  { id: 'COFFEE', name: 'Kopi Gayo', icon: Coffee },
  { id: 'PATCHOULI', name: 'Nilam Aceh', icon: Leaf },
  { id: 'SEAFOOD', name: 'Seafood', icon: Waves },
  { id: 'SPICES', name: 'Rempah', icon: Star },
  { id: 'PROCESSED', name: 'Produk Olahan', icon: Package },
]

const products = [
  { id: 1, name: 'Kopi Arabica Gayo Premium', category: 'COFFEE', origin: 'Gayo Lues', price: 'Rp 150.000/kg', rating: 4.9, status: 'APPROVED', desc: 'Kopi arabica specialty grade 1 dari dataran tinggi Gayo.' },
  { id: 2, name: 'Minyak Nilam Aceh', category: 'PATCHOULI', origin: 'Aceh Selatan', price: 'Rp 250.000/liter', rating: 4.8, status: 'APPROVED', desc: 'Minyak nilam kualitas ekspor dengan kadar patchouli alcohol tinggi.' },
  { id: 3, name: 'Udang Vannamei Fresh', category: 'SEAFOOD', origin: 'Aceh Timur', price: 'Rp 85.000/kg', rating: 4.7, status: 'VERIFIED', desc: 'Udang vannamei segar dari tambak berkualitas.' },
  { id: 4, name: 'Rempah Kustom Aceh', category: 'SPICES', origin: 'Aceh Besar', price: 'Rp 75.000/box', rating: 4.9, status: 'APPROVED', desc: 'Campuran rempah khas Aceh untuk masakan tradisional.' },
  { id: 5, name: 'Kopi Robusta Gayo', category: 'COFFEE', origin: 'Bener Meriah', price: 'Rp 120.000/kg', rating: 4.6, status: 'APPROVED', desc: 'Robusta pilihan dari perkebunan organik Bener Meriah.' },
  { id: 6, name: 'Ikan Tongkol Asap', category: 'PROCESSED', origin: 'Pidie', price: 'Rp 95.000/kg', rating: 4.8, status: 'VERIFIED', desc: 'Tongkol asap tradisional dengan cita rasa khas Aceh.' },
  { id: 7, name: 'Lada Hitam Aceh', category: 'SPICES', origin: 'Aceh Tenggara', price: 'Rp 180.000/kg', rating: 4.7, status: 'APPROVED', desc: 'Lada hitam premium dari perkebunan rakyat.' },
  { id: 8, name: 'Kepiting Rajungan', category: 'SEAFOOD', origin: 'Aceh Utara', price: 'Rp 120.000/kg', rating: 4.5, status: 'REVIEW', desc: 'Rajungan segar berkualitas ekspor.' },
]

const statusColor: Record<string, string> = {
  APPROVED: 'bg-green-100 text-green-700',
  VERIFIED: 'bg-blue-100 text-blue-700',
  REVIEW: 'bg-yellow-100 text-yellow-700',
  PENDING: 'bg-gray-100 text-gray-700',
}

export default function ProductsPage() {
  const t = useTranslations()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'all' || p.category === category
    return matchSearch && matchCat
  })

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-28 pb-12 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t.products.title} <span className="bg-gradient-to-r from-primary-600 to-ocean-600 bg-clip-text text-transparent">{t.products.titleHighlight}</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            {t.hero.desc}
          </p>

          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={t.products.searchPlaceholder}
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
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === c.id
                    ? 'gradient-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <c.icon size={16} /> {c.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <Link key={p.id} href={`/products/${p.id}`} className="block bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 group">
                <div className="h-48 bg-gradient-to-br from-primary-200 to-ocean-200 dark:from-primary-900 dark:to-ocean-900 flex items-center justify-center">
                  <Package className="text-primary-500" size={48} />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor[p.status]}`}>{p.status}</span>
                    <span className="text-sm text-yellow-500 font-medium">★ {p.rating}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{p.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{p.desc}</p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <MapPin size={14} className="mr-1" /> {p.origin}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary-600 dark:text-primary-400">{p.price}</span>
                    <span className="text-sm text-primary-600 dark:text-primary-400 group-hover:underline inline-flex items-center gap-1">
                      Detail <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-16">{t.products.notFound}</p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
