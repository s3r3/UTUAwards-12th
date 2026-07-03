'use client'

'use client'

import { use, useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, MapPin, Star, Package, ShoppingBag, ChevronRight, Store, ArrowUpDown } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import { useTranslations } from '@/lib/i18n'

const products = [
  { id: '1', name: 'Kopi Arabica Gayo Premium', category: 'Kopi Gayo', origin: 'Gayo Lues', price: 'Rp 150.000/kg', rating: 4.9, image: '/images/kopi_arabica.png', description: 'Kopi arabica single origin dari dataran tinggi Gayo Lues. Cita rasa fruity dengan aroma floral yang khas dan aftertaste yang panjang.', certifications: ['Organic', 'Fair Trade'], stock: 250,
    suppliers: [
      { id: 's1', name: 'CV. Gayo Mandiri', location: 'Gayo Lues', price: 145000, priceLabel: 'Rp 145.000/kg', rating: 4.8, image: '🌿', stock: 120, phone: '+62 812-3456-7890', verified: true },
      { id: 's2', name: 'PT. Aceh Agro Sejahtera', location: 'Bener Meriah', price: 155000, priceLabel: 'Rp 155.000/kg', rating: 4.9, image: '🏭', stock: 200, phone: '+62 813-9876-5432', verified: true },
      { id: 's3', name: 'UD. Kopi Rakyat', location: 'Aceh Tengah', price: 138000, priceLabel: 'Rp 138.000/kg', rating: 4.6, image: '☕', stock: 80, phone: '+62 852-1112-2233', verified: false },
      { id: 's4', name: 'Koperasi Gayo Lues', location: 'Gayo Lues', price: 160000, priceLabel: 'Rp 160.000/kg', rating: 4.7, image: '🤝', stock: 300, phone: '+62 811-3344-5566', verified: true },
    ]
  },
  { id: '2', name: 'Minyak Nilam Aceh', category: 'Nilam Aceh', origin: 'Aceh Selatan', price: 'Rp 250.000/liter', rating: 4.8, image: '/images/PatchouliOil.png', description: 'Minyak nilam murni kualitas ekspor dengan kadar patchouli alcohol tinggi. Ideal untuk industri parfum dan kosmetik premium.', certifications: ['ISO 9001', 'Halal MUI'], stock: 80,
    suppliers: [
      { id: 's5', name: 'PT. Nilam Aceh Indah', location: 'Aceh Selatan', price: 245000, priceLabel: 'Rp 245.000/liter', rating: 4.9, image: '🌿', stock: 50, phone: '+62 812-5555-1234', verified: true },
      { id: 's6', name: 'CV. Atsiri Nusantara', location: 'Aceh Barat', price: 260000, priceLabel: 'Rp 260.000/liter', rating: 4.7, image: '🧪', stock: 100, phone: '+62 813-6666-7890', verified: true },
      { id: 's7', name: 'UD. Minyak Kaye', location: 'Aceh Selatan', price: 235000, priceLabel: 'Rp 235.000/liter', rating: 4.5, image: '🫙', stock: 35, phone: '+62 852-7777-3344', verified: false },
    ]
  },
]

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations()
  const { id } = use(params)
  const product = products.find(p => p.id === id)

  if (!product) return (
    <main className="min-h-screen"><Navbar /><div className="pt-32 text-center"><Package size={48} className="mx-auto text-gray-300 mb-4" /><h2 className="text-xl font-bold text-gray-900">{t.dashboard.productNotFound}</h2><Link href="/products" className="text-primary-600 mt-2 inline-block">{t.dashboard.back}</Link></div><Footer /></main>
  )

  const [sortBy, setSortBy] = useState<'cheapest' | 'expensive'>('cheapest')

  const sortedSuppliers = useMemo(() => {
    if (!product) return []
    const s = [...product.suppliers]
    if (sortBy === 'cheapest') {
      s.sort((a, b) => a.price - b.price)
    } else {
      s.sort((a, b) => b.price - a.price)
    }
    return s
  }, [product, sortBy])

  // Price range text
  const minPrice = product ? Math.min(...product.suppliers.map(s => s.price)) : 0
  const maxPrice = product ? Math.max(...product.suppliers.map(s => s.price)) : 0

  const formatPrice = (num: number) => {
    return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  if (!product) return (
    <main className="min-h-screen"><Navbar /><div className="pt-32 text-center"><Package size={48} className="mx-auto text-gray-300 mb-4" /><h2 className="text-xl font-bold text-gray-900">{t.dashboard.productNotFound}</h2><Link href="/products" className="text-primary-600 mt-2 inline-block">{t.dashboard.back}</Link></div><Footer /></main>
  )

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-28 pb-20 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-4">
          <Link href="/products" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-6"><ArrowLeft size={16} /> {t.dashboard.back}</Link>

          {/* Produk Header */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800 mb-10">
            <div className="h-56 bg-gradient-to-br from-primary-400 to-ocean-500 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10" />
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs px-3 py-1 rounded-full bg-primary-100 text-primary-700 font-medium border border-primary-200">{product.category}</span>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-3">{product.name}</h1>
                  <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-1.5"><MapPin size={14} />{product.origin}</p>
                </div>
                <div className="text-right bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
                  <div className="text-xs text-gray-400 mb-0.5">Rentang Harga</div>
                  <div className="text-lg font-bold text-primary-600">{formatPrice(minPrice)} - {formatPrice(maxPrice)}</div>
                  <div className="flex items-center justify-end gap-1 mt-1"><Star size={13} fill="currentColor" className="text-yellow-500" /><span className="text-sm text-gray-600">{product.rating}</span></div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">{product.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">{product.certifications.map((c, i) => <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 font-medium">{c}</span>)}</div>
            </div>
          </div>

          {/* Supplier Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Store size={22} className="text-primary-500" />
                  Supplier Tersedia
                </h2>
                <p className="text-sm text-gray-500 mt-1">{product.suppliers.length} supplier dengan harga berbeda</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Urutkan:</span>
                <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setSortBy('cheapest')}
                    className={`px-3.5 py-2 text-xs font-semibold transition-colors flex items-center gap-1 ${
                      sortBy === 'cheapest'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <ArrowUpDown size={12} /> Termurah
                  </button>
                  <button
                    onClick={() => setSortBy('expensive')}
                    className={`px-3.5 py-2 text-xs font-semibold transition-colors flex items-center gap-1 ${
                      sortBy === 'expensive'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <ArrowUpDown size={12} /> Termahal
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedSuppliers.map((supplier) => (
                <div key={supplier.id} className="group bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    {/* Supplier Avatar */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-100 to-ocean-100 dark:from-primary-900 dark:to-ocean-900 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                      {supplier.id}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">{supplier.name}</h3>
                          <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5"><MapPin size={10} />{supplier.location}</p>
                        </div>
                        {supplier.verified && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-800 flex-shrink-0">
                            ✓ Verified
                          </span>
                        )}
                      </div>

                      {/* Price & Stock */}
                      <div className="flex items-end justify-between mt-3 pt-3 border-t border-gray-50 dark:border-gray-800">
                        <div>
                          <div className="text-lg font-bold text-primary-600 dark:text-primary-400">{supplier.priceLabel}</div>
                          <div className="text-xs text-gray-400 mt-0.5">Stok: {supplier.stock} kg</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5 text-yellow-500">
                            <Star size={11} fill="currentColor" />
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{supplier.rating}</span>
                          </div>
                          <a
                            href={`https://wa.me/${supplier.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
                          >
                            <ShoppingBag size={13} />
                            Hubungi
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
