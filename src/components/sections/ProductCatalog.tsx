'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useTranslations } from '@/lib/i18n'
import {
  Search,
  Coffee,
  Waves,
  Leaf,
  Package,
  Star,
  X,
  MapPin,
  Tag,
  ShoppingBag,
  ChevronRight,
} from 'lucide-react'

// ─── Data ───────────────────────────────────────────────────────────────────

const categories = [
  { id: 'all', name: 'Semua', icon: Package, color: 'from-gray-500 to-gray-600' },
  { id: 'COFFEE', name: 'Kopi Gayo', icon: Coffee, color: 'from-amber-600 to-orange-600' },
  { id: 'PATCHOULI', name: 'Nilam Aceh', icon: Leaf, color: 'from-[#22c55e] to-emerald-600' },
  { id: 'SEAFOOD', name: 'Seafood', icon: Waves, color: 'from-[#0ea5e9] to-blue-600' },
  { id: 'SPICES', name: 'Rempah', icon: Star, color: 'from-red-500 to-rose-600' },
  { id: 'PROCESSED', name: 'Produk Olahan', icon: Package, color: 'from-purple-500 to-violet-600' },
]

const products = [
  {
    id: 1,
    name: 'Kopi Arabica Gayo Premium',
    category: 'COFFEE',
    origin: 'Gayo Lues',
    price: 'Rp 150.000/kg',
    rating: 4.9,
    emoji: '☕',
    emojiColor: 'from-amber-500 to-orange-600',
    description:
      'Kopi arabica single origin dari dataran tinggi Gayo Lues, ditanam pada ketinggian 1.200-1.500 mdpl. Cita rasa fruity dengan aroma floral yang khas dan aftertaste yang panjang.',
    certifications: ['Organic', 'Fair Trade', 'Rainforest Alliance'],
    stock: 250,
  },
  {
    id: 2,
    name: 'Minyak Nilam Aceh',
    category: 'PATCHOULI',
    origin: 'Aceh Selatan',
    price: 'Rp 250.000/liter',
    rating: 4.8,
    emoji: '🌿',
    emojiColor: 'from-[#22c55e] to-emerald-600',
    description:
      'Minyak nilam murni (Patchouli Oil) diekstrak secara tradisional dari tanaman nilam pilihan Aceh Selatan. Kadar PA ≥ 30%, ideal untuk industri parfum dan kosmetik premium.',
    certifications: ['ISO 9001', 'Halal MUI'],
    stock: 80,
  },
  {
    id: 3,
    name: 'Udang Vannamei Fresh',
    category: 'SEAFOOD',
    origin: 'Aceh Timur',
    price: 'Rp 85.000/kg',
    rating: 4.7,
    emoji: '🦐',
    emojiColor: 'from-[#0ea5e9] to-cyan-500',
    description:
      'Udang vannamei segar dari tambak terintegrasi di pesisir Aceh Timur. Dibudidayakan tanpa antibiotik, tersertifikasi HACCP, siap untuk pasar ekspor.',
    certifications: ['HACCP', 'ASC'],
    stock: 500,
  },
  {
    id: 4,
    name: 'Rempah Kustom Aceh',
    category: 'SPICES',
    origin: 'Aceh Besar',
    price: 'Rp 75.000/box',
    rating: 4.9,
    emoji: '🌶️',
    emojiColor: 'from-red-500 to-rose-600',
    description:
      'Campuran rempah autentik Aceh yang telah diracik oleh maestro kuliner lokal. Terdiri dari 12 jenis rempah pilihan, dikemas higienis dalam box premium.',
    certifications: ['Halal MUI', 'BPOM'],
    stock: 300,
  },
  {
    id: 5,
    name: 'Kopi Robusta Gayo',
    category: 'COFFEE',
    origin: 'Bener Meriah',
    price: 'Rp 120.000/kg',
    rating: 4.6,
    emoji: '☕',
    emojiColor: 'from-stone-600 to-amber-700',
    description:
      'Kopi robusta dari Bener Meriah dengan karakter bold dan earthy yang kuat. Cocok untuk espresso blend atau pasar Asia Timur yang menyukai kopi bertubuh penuh.',
    certifications: ['Organic', 'Fair Trade'],
    stock: 180,
  },
  {
    id: 6,
    name: 'Ikan Tongkol Asap',
    category: 'PROCESSED',
    origin: 'Pidie',
    price: 'Rp 95.000/kg',
    rating: 4.8,
    emoji: '🐟',
    emojiColor: 'from-purple-500 to-indigo-600',
    description:
      'Ikan tongkol asap tradisional dari nelayan Pidie dengan metode pengasapan kayu bakar pilihan. Tekstur padat, cita rasa gurih yang khas, bebas pengawet kimia.',
    certifications: ['Halal MUI', 'P-IRT'],
    stock: 120,
  },
]

// ─── Types ───────────────────────────────────────────────────────────────────

type Product = (typeof products)[0]

// ─── Modal ───────────────────────────────────────────────────────────────────

function ProductModal({
  product,
  onClose,
}: {
  product: Product
  onClose: () => void
}) {
  const category = categories.find((c) => c.id === product.category)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl z-10"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Product image area */}
          <div
            className={`relative h-52 bg-gradient-to-br ${product.emojiColor} flex items-center justify-center`}
          >
            <span className="text-8xl filter drop-shadow-xl">{product.emoji}</span>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white transition-colors"
            >
              <X size={18} />
            </button>
            <div className="absolute bottom-4 left-4">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white bg-black/25 backdrop-blur-sm`}
              >
                {category?.name}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">
                {product.name}
              </h3>
              <div className="flex items-center gap-1 text-yellow-500 shrink-0 ml-3">
                <Star size={14} fill="currentColor" />
                <span className="text-sm font-semibold">{product.rating}</span>
              </div>
            </div>

            <p className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <MapPin size={13} />
              {product.origin}
            </p>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
              {product.description}
            </p>

            {/* Certifications */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.certifications.map((cert) => (
                <span
                  key={cert}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20"
                >
                  <Tag size={10} />
                  {cert}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-black text-[#22c55e]">{product.price}</div>
                <div className="text-xs text-gray-400 mt-0.5">Stok: {product.stock} unit</div>
              </div>
              <div className="flex gap-2">
              <Link href={`/products/${product.id}`} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e]/10 transition-colors">
                <Package size={16} />
                Detail Lengkap
              </Link>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#22c55e] to-[#0ea5e9] hover:opacity-90 transition-opacity shadow-lg">
                <ShoppingBag size={16} />
                Hubungi Supplier
              </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
  )
}

// ─── Main ────────────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
}

export default function ProductCatalog() {
  const t = useTranslations()
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' })

  const [inputValue, setInputValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(inputValue), 300)
    return () => clearTimeout(timer)
  }, [inputValue])

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <section
      ref={sectionRef}
      className="relative py-24 bg-gray-50 dark:bg-gray-950 overflow-hidden"
    >
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-[#22c55e]/6 blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-80 h-80 rounded-full bg-[#0ea5e9]/6 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full border border-[#0ea5e9]/30 bg-[#0ea5e9]/10 text-[#0ea5e9] text-sm font-medium">
            <Package size={14} />
            Katalog Produk
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Produk Unggulan{' '}
            <span className="bg-gradient-to-r from-[#22c55e] to-[#0ea5e9] bg-clip-text text-transparent">
              Aceh
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Temukan produk agro-maritim Aceh berkualitas premium untuk pasar global
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          className="max-w-xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#22c55e] transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari produk..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#22c55e]/40 focus:border-[#22c55e] outline-none transition-all shadow-sm"
            />
            {inputValue && (
              <button
                onClick={() => setInputValue('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          className="flex flex-wrap gap-2 justify-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              whileTap={{ scale: 0.95 }}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === cat.id
                  ? 'text-white shadow-lg'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#22c55e]/40 dark:hover:border-[#22c55e]/40'
              }`}
            >
              {selectedCategory === cat.id && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute inset-0 rounded-full bg-gradient-to-r ${cat.color}`}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <cat.icon size={14} />
                {cat.name}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedCategory}-${searchQuery}`}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={cardVariants}
                  whileHover={{ y: -6 }}
                  onClick={() => setSelectedProduct(product)}
                  className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer border border-gray-100 dark:border-gray-800 hover:border-[#22c55e]/30 dark:hover:border-[#22c55e]/30"
                >
                  {/* Image / emoji area */}
                  <div
                    className={`relative h-44 bg-gradient-to-br ${product.emojiColor} overflow-hidden flex items-center justify-center`}
                  >
                    <motion.span
                      className="text-7xl filter drop-shadow-lg"
                      whileHover={{ scale: 1.15 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {product.emoji}
                    </motion.span>
                    {/* Subtle overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#22c55e]/10 text-[#22c55e] font-medium border border-[#22c55e]/20">
                        {categories.find((c) => c.id === product.category)?.name}
                      </span>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          {product.rating}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5 leading-snug">
                      {product.name}
                    </h3>

                    <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <MapPin size={11} />
                      {product.origin}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#22c55e] text-sm">{product.price}</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}
                        className="flex items-center gap-1 text-xs font-semibold text-[#0ea5e9] hover:text-[#22c55e] transition-colors"
                      >
                        Detail <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                variants={cardVariants}
                className="col-span-full text-center py-20 text-gray-400 dark:text-gray-600"
              >
                <Package size={48} className="mx-auto mb-3 opacity-30" />
                <p className="text-lg font-medium">{t.products.notFound}</p>
                <p className="text-sm mt-1">{t.products.notFoundHint}</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
