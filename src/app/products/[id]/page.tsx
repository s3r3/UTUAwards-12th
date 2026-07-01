'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MapPin, Star, Package, ShoppingBag, ChevronRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'

const products = [
  { id: '1', name: 'Kopi Arabica Gayo Premium', category: 'Kopi Gayo', origin: 'Gayo Lues', price: 'Rp 150.000/kg', rating: 4.9, emoji: '☕', description: 'Kopi arabica single origin dari dataran tinggi Gayo Lues.', certifications: ['Organic', 'Fair Trade'], stock: 250 },
  { id: '2', name: 'Minyak Nilam Aceh', category: 'Nilam Aceh', origin: 'Aceh Selatan', price: 'Rp 250.000/liter', rating: 4.8, emoji: '🌿', description: 'Minyak nilam murni kualitas ekspor.', certifications: ['ISO 9001', 'Halal MUI'], stock: 80 },
]

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const product = products.find(p => p.id === id)

  if (!product) return (
    <main className="min-h-screen"><Navbar /><div className="pt-32 text-center"><Package size={48} className="mx-auto text-gray-300 mb-4" /><h2 className="text-xl font-bold text-gray-900">Produk tidak ditemukan</h2><Link href="/products" className="text-primary-600 mt-2 inline-block">Kembali</Link></div><Footer /></main>
  )

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/products" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-6"><ArrowLeft size={16} /> Kembali</Link>
          <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="h-64 bg-gradient-to-br from-primary-400 to-ocean-500 flex items-center justify-center"><span className="text-8xl">{product.emoji}</span></div>
            <div className="p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-primary-100 text-primary-700 font-medium">{product.category}</span>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-2">{product.name}</h1>
                  <p className="flex items-center gap-1 text-sm text-gray-500 mt-1"><MapPin size={14} />{product.origin}</p>
                </div>
                <div className="text-right"><div className="text-2xl font-bold text-primary-600">{product.price}</div><div className="flex items-center gap-1 text-yellow-500 mt-1"><Star size={14} fill="currentColor" /><span className="text-sm text-gray-600">{product.rating}</span></div></div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{product.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">{product.certifications.map((c, i) => <span key={i} className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">{c}</span>)}</div>
              <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-6">
                <span className="text-sm text-gray-500">Stok: {product.stock} kg</span>
                <Button className="gap-2"><ShoppingBag size={16} /> Hubungi Penjual</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
