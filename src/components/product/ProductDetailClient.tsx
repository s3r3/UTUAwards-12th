'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Minus, Plus, Heart, Share2, UserCircle2, Star, Package, Eye } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCartStore } from '@/store/cart.store'
import { useTranslations, useSeedProduct } from '@/lib/i18n'
import type { Product } from '@/types'
import PackageDesignLightbox from './PackageDesignLightbox'

const PACKAGE_DESIGN_IMAGES: Record<string, string[]> = {
  'KopiArabikaGayo': ['/packageDesign/KopiArabikaGayo/kopi.jpeg', '/packageDesign/KopiArabikaGayo/kopi2.jpeg'],
  'MinyakNilam': ['/packageDesign/MinyakNilam/minyaknilam.jpeg', '/packageDesign/MinyakNilam/minyaknilam1.jpeg'],
  'udangVaname': ['/packageDesign/udangVaname/udang.jpeg', '/packageDesign/udangVaname/udang2.jpeg'],
  'LadaHitam': ['/packageDesign/LadaHitam/lada.jpeg', '/packageDesign/LadaHitam/lada2.jpeg'],
  'coklat': ['/packageDesign/coklat/coklat.jpeg'],
  'dodol': ['/packageDesign/dodol/dodol.jpeg'],
  'kayumanis': ['/packageDesign/kayumanis/kayumanis.jpeg'],
  'kepiting': ['/packageDesign/kepiting/kepiting.jpeg'],
}

const getPackageDesignImages = (folderPath: string): string[] => {
  if (!folderPath) return []
  const segments = folderPath.split('/').filter(Boolean)
  if (segments.length === 0) return []
  const lastSegment = segments[segments.length - 1]
  const folderName = lastSegment.includes('.') ? segments[segments.length - 2] || '' : lastSegment
  return PACKAGE_DESIGN_IMAGES[folderName] || []
}

const DUMMY_REVIEWS: Record<string, { id: string; userId: string; productId: string; rating: number; comment: string; createdAt: Date; user: { name: string } }[]> = {
  'seed-kopi-arabika-gayo-specialty': [
    { id: 'review-kopi-1', userId: 'user-1', productId: 'seed-kopi-arabika-gayo-specialty', rating: 5, comment: 'Kopi ini aromanya luar biasa! Rasa cokelat dan karamelnya sangat balanced.', createdAt: new Date('2026-05-15T10:00:00Z'), user: { name: 'Ahmad' } },
    { id: 'review-kopi-2', userId: 'user-2', productId: 'seed-kopi-arabika-gayo-specialty', rating: 4, comment: 'Pengiriman cepat, kemasan rapi. Kopi masih fresh sampai tangan.', createdAt: new Date('2026-06-02T14:30:00Z'), user: { name: 'Citra' } },
    { id: 'review-kopi-3', userId: 'user-3', productId: 'seed-kopi-arabika-gayo-specialty', rating: 5, comment: 'Sebagai pencinta kopi Aceh, ini salah satu yang terbaik yang sudah saya coba.', createdAt: new Date('2026-06-20T09:15:00Z'), user: { name: 'Budi' } },
    { id: 'review-kopi-4', userId: 'user-1', productId: 'seed-kopi-arabika-gayo-specialty', rating: 5, comment: 'Rasa floral nya memang khas Gayo. Recommended!', createdAt: new Date('2026-07-05T16:45:00Z'), user: { name: 'Ahmad' } },
    { id: 'review-kopi-5', userId: 'user-4', productId: 'seed-kopi-arabika-gayo-specialty', rating: 4, comment: 'Kualitas sesuai harga. Tidak mengecewakan.', createdAt: new Date('2026-07-18T11:20:00Z'), user: { name: 'Dewi' } },
    { id: 'review-kopi-6', userId: 'user-2', productId: 'seed-kopi-arabika-gayo-specialty', rating: 5, comment: 'Sudah 3x order, tetap konsisten kualitasnya.', createdAt: new Date('2026-08-01T08:00:00Z'), user: { name: 'Citra' } },
    { id: 'review-kopi-7', userId: 'user-5', productId: 'seed-kopi-arabika-gayo-specialty', rating: 4, comment: 'Tempat penyimpananRecommended untuk para pecinta kopi specialty.', createdAt: new Date('2026-08-15T13:10:00Z'), user: { name: 'Eka' } },
  ],
  'seed-minyak-nilam-aceh-grade-a': [
    { id: 'review-nilam-1', userId: 'user-1', productId: 'seed-minyak-nilam-aceh-grade-a', rating: 5, comment: 'Aromanya sangat wangi dan tahan lama. Pakai sehari-hari.', createdAt: new Date('2026-05-10T09:00:00Z'), user: { name: 'Ahmad' } },
    { id: 'review-nilam-2', userId: 'user-3', productId: 'seed-minyak-nilam-aceh-grade-a', rating: 5, comment: 'Kemasan aman, tidak bocor. Kualitas minyak nilam terbaik.', createdAt: new Date('2026-05-28T15:20:00Z'), user: { name: 'Budi' } },
    { id: 'review-nilam-3', userId: 'user-2', productId: 'seed-minyak-nilam-aceh-grade-a', rating: 4, comment: 'Sudah coba berbagai merek, ini yang paling authentic.', createdAt: new Date('2026-06-12T10:45:00Z'), user: { name: 'Citra' } },
    { id: 'review-nilam-4', userId: 'user-4', productId: 'seed-minyak-nilam-aceh-grade-a', rating: 5, comment: 'Untuk aromaterapi sangat efektif. Relaksasi banget.', createdAt: new Date('2026-06-25T18:30:00Z'), user: { name: 'Dewi' } },
    { id: 'review-nilam-5', userId: 'user-1', productId: 'seed-minyak-nilam-aceh-grade-a', rating: 4, comment: 'Harga bersahabat untuk kualitas Grade A.', createdAt: new Date('2026-07-08T07:15:00Z'), user: { name: 'Ahmad' } },
    { id: 'review-nilam-6', userId: 'user-5', productId: 'seed-minyak-nilam-aceh-grade-a', rating: 5, comment: 'Pengiriman aman, packaging bubble wrap. Barang sampai dengan baik.', createdAt: new Date('2026-07-22T12:00:00Z'), user: { name: 'Eka' } },
    { id: 'review-nilam-7', userId: 'user-3', productId: 'seed-minyak-nilam-aceh-grade-a', rating: 4, comment: 'Kadar PA nya sesuai spesifikasi. Puas.', createdAt: new Date('2026-08-05T16:50:00Z'), user: { name: 'Budi' } },
  ],
  'seed-udang-vannamei-segar-aceh': [
    { id: 'review-udang-1', userId: 'user-2', productId: 'seed-udang-vannamei-segar-aceh', rating: 5, comment: 'Udangnya besar-besar dan segar. Dimasak udang goreng crispy mantap.', createdAt: new Date('2026-05-12T11:00:00Z'), user: { name: 'Citra' } },
    { id: 'review-udang-2', userId: 'user-4', productId: 'seed-udang-vannamei-segar-aceh', rating: 5, comment: 'Tanpa antibiotik jadi aman untuk keluarga. Recommended.', createdAt: new Date('2026-05-30T09:30:00Z'), user: { name: 'Dewi' } },
    { id: 'review-udang-3', userId: 'user-1', productId: 'seed-udang-vannamei-segar-aceh', rating: 4, comment: 'Size 80/100 sesuai deskripsi. Barang packed dengan es, tetap segar.', createdAt: new Date('2026-06-14T14:15:00Z'), user: { name: 'Ahmad' } },
    { id: 'review-udang-4', userId: 'user-3', productId: 'seed-udang-vannamei-segar-aceh', rating: 5, comment: 'Langsung dari tambak Aceh Timur. Rasanya manis dan crunchy.', createdAt: new Date('2026-06-28T10:00:00Z'), user: { name: 'Budi' } },
    { id: 'review-udang-5', userId: 'user-5', productId: 'seed-udang-vannamei-segar-aceh', rating: 4, comment: 'Sudah langganan di sini. Harga lebih murah dari supermarket.', createdAt: new Date('2026-07-10T16:45:00Z'), user: { name: 'Eka' } },
    { id: 'review-udang-6', userId: 'user-2', productId: 'seed-udang-vannamei-segar-aceh', rating: 5, comment: 'Packaging rapi, ada es bricks. Udang masih beku saat sampai.', createdAt: new Date('2026-07-24T08:20:00Z'), user: { name: 'Citra' } },
    { id: 'review-udang-7', userId: 'user-1', productId: 'seed-udang-vannamei-segar-aceh', rating: 4, comment: 'Kualitas udang terbaik yang pernah saya beli online.', createdAt: new Date('2026-08-08T13:00:00Z'), user: { name: 'Ahmad' } },
  ],
  'seed-lada-hitam-aceh-premium': [
    { id: 'review-lada-1', userId: 'user-3', productId: 'seed-lada-hitam-aceh-premium', rating: 5, comment: 'Aromanya tajam sesuai ekspektasi lada hitam premium.', createdAt: new Date('2026-05-18T10:30:00Z'), user: { name: 'Budi' } },
    { id: 'review-lada-2', userId: 'user-1', productId: 'seed-lada-hitam-aceh-premium', rating: 4, comment: 'Digiling butir butir, aroma lebih kuat daripada yang sudah bubuk.', createdAt: new Date('2026-06-05T15:00:00Z'), user: { name: 'Ahmad' } },
    { id: 'review-lada-3', userId: 'user-5', productId: 'seed-lada-hitam-aceh-premium', rating: 5, comment: 'Kualitas oleoresin nya tinggi. Untuk masakan sehari-hari sangat pas.', createdAt: new Date('2026-06-19T09:45:00Z'), user: { name: 'Eka' } },
    { id: 'review-lada-4', userId: 'user-2', productId: 'seed-lada-hitam-aceh-premium', rating: 5, comment: 'Lada Aceh memang juara. Ini tidak mengecewakan.', createdAt: new Date('2026-07-02T14:20:00Z'), user: { name: 'Citra' } },
    { id: 'review-lada-5', userId: 'user-4', productId: 'seed-lada-hitam-aceh-premium', rating: 4, comment: 'Harga worth it untuk grade premium. Bumbu dapur wajib punya.', createdAt: new Date('2026-07-15T11:10:00Z'), user: { name: 'Dewi' } },
    { id: 'review-lada-6', userId: 'user-3', productId: 'seed-lada-hitam-aceh-premium', rating: 5, comment: 'Packaging kedap udara. Tetap awet dan aromanya kuat.', createdAt: new Date('2026-07-29T16:30:00Z'), user: { name: 'Budi' } },
    { id: 'review-lada-7', userId: 'user-1', productId: 'seed-lada-hitam-aceh-premium', rating: 4, comment: 'Sudah coba beberapa brand, ini yang paling superior.', createdAt: new Date('2026-08-12T08:50:00Z'), user: { name: 'Ahmad' } },
  ],
  'seed-cokelat-kakao-aceh-premium': [
    { id: 'review-cokelat-1', userId: 'user-4', productId: 'seed-cokelat-kakao-aceh-premium', rating: 5, comment: 'Cokelatnya creamy dan tidak terlalu manis. Bahan kakao asli Aceh.', createdAt: new Date('2026-05-20T10:00:00Z'), user: { name: 'Dewi' } },
    { id: 'review-cokelat-2', userId: 'user-1', productId: 'seed-cokelat-kakao-aceh-premium', rating: 5, comment: 'Untuk baking atau cokelat panas, rasa nya丰富 banget.', createdAt: new Date('2026-06-07T14:30:00Z'), user: { name: 'Ahmad' } },
    { id: 'review-cokelat-3', userId: 'user-3', productId: 'seed-cokelat-kakao-aceh-premium', rating: 4, comment: 'Kemasan cantik, cocok untuk oleh-oleh.', createdAt: new Date('2026-06-22T09:15:00Z'), user: { name: 'Budi' } },
    { id: 'review-cokelat-4', userId: 'user-2', productId: 'seed-cokelat-kakao-aceh-premium', rating: 5, comment: 'Kakao Aceh memang beda dari yang lain. Recommended.', createdAt: new Date('2026-07-05T16:45:00Z'), user: { name: 'Citra' } },
    { id: 'review-cokelat-5', userId: 'user-5', productId: 'seed-cokelat-kakao-aceh-premium', rating: 4, comment: 'Harga reasonable untuk cokelat premium. Will buy again.', createdAt: new Date('2026-07-18T11:20:00Z'), user: { name: 'Eka' } },
    { id: 'review-cokelat-6', userId: 'user-4', productId: 'seed-cokelat-kakao-aceh-premium', rating: 5, comment: 'Packaging aman, tidak leleh di jalan. Cokelat arrived dalam kondisi sempurna.', createdAt: new Date('2026-08-01T08:00:00Z'), user: { name: 'Dewi' } },
    { id: 'review-cokelat-7', userId: 'user-1', productId: 'seed-cokelat-kakao-aceh-premium', rating: 4, comment: 'Untuk pecinta cokelat sejati, ini harus dicoba.', createdAt: new Date('2026-08-15T13:10:00Z'), user: { name: 'Ahmad' } },
  ],
  'seed-dodol-aceh-premium': [
    { id: 'review-dodol-1', userId: 'user-5', productId: 'seed-dodol-aceh-premium', rating: 5, comment: 'Dodol traditional yang authentic. Rasa gula aren dan santan balanced.', createdAt: new Date('2026-05-22T10:00:00Z'), user: { name: 'Eka' } },
    { id: 'review-dodol-2', userId: 'user-1', productId: 'seed-dodol-aceh-premium', rating: 4, comment: 'Tekstur chewy, tidak terlalu keras. Varian original yang best.', createdAt: new Date('2026-06-08T14:30:00Z'), user: { name: 'Ahmad' } },
    { id: 'review-dodol-3', userId: 'user-3', productId: 'seed-dodol-aceh-premium', rating: 5, comment: 'Cocok untuk camilan sore atau bersama keluarga.', createdAt: new Date('2026-06-24T09:15:00Z'), user: { name: 'Budi' } },
    { id: 'review-dodol-4', userId: 'user-2', productId: 'seed-dodol-aceh-premium', rating: 5, comment: 'Dodol Aceh terenak yang pernah saya makan. Recommended.', createdAt: new Date('2026-07-07T16:45:00Z'), user: { name: 'Citra' } },
    { id: 'review-dodol-5', userId: 'user-4', productId: 'seed-dodol-aceh-premium', rating: 4, comment: 'Packaging rapi, higienis. Bisa bertahan lama.', createdAt: new Date('2026-07-20T11:20:00Z'), user: { name: 'Dewi' } },
    { id: 'review-dodol-6', userId: 'user-5', productId: 'seed-dodol-aceh-premium', rating: 5, comment: 'Sudah jadi langganan untuk lebaran. Selalu pesan di sini.', createdAt: new Date('2026-08-02T08:00:00Z'), user: { name: 'Eka' } },
    { id: 'review-dodol-7', userId: 'user-1', productId: 'seed-dodol-aceh-premium', rating: 4, comment: 'Kualitas prima, rasa traditional terjaga. Puas banget.', createdAt: new Date('2026-08-16T13:10:00Z'), user: { name: 'Ahmad' } },
  ],
  'seed-kayu-manis-aceh': [
    { id: 'review-kayu-1', userId: 'user-3', productId: 'seed-kayu-manis-aceh', rating: 5, comment: 'Aromanya manis dan hangat. Untuk masakan atau minuman, sangat pas.', createdAt: new Date('2026-05-25T10:00:00Z'), user: { name: 'Budi' } },
    { id: 'review-kayu-2', userId: 'user-2', productId: 'seed-kayu-manis-aceh', rating: 4, comment: 'Grade ekspor sesuai. Bark nya tebal dan aromatic.', createdAt: new Date('2026-06-10T14:30:00Z'), user: { name: 'Citra' } },
    { id: 'review-kayu-3', userId: 'user-5', productId: 'seed-kayu-manis-aceh', rating: 5, comment: 'Digunakan untuk steamer atau chai, hasilnya luar biasa.', createdAt: new Date('2026-06-26T09:15:00Z'), user: { name: 'Eka' } },
    { id: 'review-kayu-4', userId: 'user-1', productId: 'seed-kayu-manis-aceh', rating: 5, comment: 'Kayu manis asli Aceh memang lebih wangi dari yang lain.', createdAt: new Date('2026-07-09T16:45:00Z'), user: { name: 'Ahmad' } },
    { id: 'review-kayu-5', userId: 'user-4', productId: 'seed-kayu-manis-aceh', rating: 4, comment: 'Harga bersahabat untuk kualitas grade export.', createdAt: new Date('2026-07-22T11:20:00Z'), user: { name: 'Dewi' } },
    { id: 'review-kayu-6', userId: 'user-3', productId: 'seed-kayu-manis-aceh', rating: 5, comment: 'Packaging kedap udara. Tetap awet aromanya.', createdAt: new Date('2026-08-04T08:00:00Z'), user: { name: 'Budi' } },
    { id: 'review-kayu-7', userId: 'user-2', productId: 'seed-kayu-manis-aceh', rating: 4, comment: 'Bumbu dapur essential. Tidak boleh kosong di rak.', createdAt: new Date('2026-08-18T13:10:00Z'), user: { name: 'Citra' } },
  ],
  'seed-kepiting-ranjungan-segar': [
    { id: 'review-kepiting-1', userId: 'user-1', productId: 'seed-kepiting-ranjungan-segar', rating: 5, comment: 'Kepiting nya besar dan segar. Dimasak kepiting saus tiram mantap.', createdAt: new Date('2026-05-28T10:00:00Z'), user: { name: 'Ahmad' } },
    { id: 'review-kepiting-2', userId: 'user-4', productId: 'seed-kepiting-ranjungan-segar', rating: 4, comment: 'Ukuran jumbo sesuai deskripsi. Untuk 2 orang cukup.', createdAt: new Date('2026-06-14T14:30:00Z'), user: { name: 'Dewi' } },
    { id: 'review-kepiting-3', userId: 'user-2', productId: 'seed-kepiting-ranjungan-segar', rating: 5, comment: 'Packaging dengan es, tetap segar sampai rumah.', createdAt: new Date('2026-06-30T09:15:00Z'), user: { name: 'Citra' } },
    { id: 'review-kepiting-4', userId: 'user-5', productId: 'seed-kepiting-ranjungan-segar', rating: 5, comment: 'Kepiting dari perairan Aceh memang lebih manis dagingnya.', createdAt: new Date('2026-07-13T16:45:00Z'), user: { name: 'Eka' } },
    { id: 'review-kepiting-5', userId: 'user-3', productId: 'seed-kepiting-ranjungan-segar', rating: 4, comment: 'Harga worth it untuk ukuran jumbo. Supermarket lebih mahal.', createdAt: new Date('2026-07-26T11:20:00Z'), user: { name: 'Budi' } },
    { id: 'review-kepiting-6', userId: 'user-1', productId: 'seed-kepiting-ranjungan-segar', rating: 5, comment: 'Pengiriman cepat, barang aman. Akan repeat order.', createdAt: new Date('2026-08-07T08:00:00Z'), user: { name: 'Ahmad' } },
    { id: 'review-kepiting-7', userId: 'user-4', productId: 'seed-kepiting-ranjungan-segar', rating: 4, comment: 'Dagingnya tebal dan manis. Recommended untuk seafood lovers.', createdAt: new Date('2026-08-19T10:30:00Z'), user: { name: 'Dewi' } },
  ],
}


interface ProductDetailClientProps {
  product: Product & { owner?: { name: string; email?: string } | null }
  category?: { label: string }
  isAvailable: boolean
  reviews?: { id: string; rating: number; comment: string | null; user: { name: string | null } | null }[]
  rating?: number
  reviewCount?: number
}

const ACCORDION_DATA = [
  {
    titleKey: 'originTitle',
    contentKey: 'originContent',
  },
  {
    titleKey: 'qualityTitle',
    contentKey: 'qualityContent',
  },
  {
    titleKey: 'shippingStorage',
    contentKey: 'shippingStorageText',
  },
  {
    titleKey: 'faqTitle',
    contentKey: 'faqContent',
  },
]

export default function ProductDetailClient({ product, category, isAvailable, reviews = [], rating = 0, reviewCount = 0 }: ProductDetailClientProps) {
  const t = useTranslations()
  const addItem = useCartStore((s) => s.addItem)
  const seed = useSeedProduct(product.id)
  const displayName = seed?.name ?? product.name
  const displayDesc = seed?.desc ?? product.description
  const displayOrigin = seed?.origin ?? (product.origin || '')
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const packageDesignImages = getPackageDesignImages(product.packageDesign || '')

  const handleQuantity = (delta: number) => {
    setQuantity(prev => {
      const newQuantity = prev + delta;
      if (delta > 0) {
        return Math.min(newQuantity, product.stock || 999);
      } else {
        return Math.max(newQuantity, 1);
      }
    });
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image || '',
      quantity,
      stock: product.stock,
      packageDesign: product.packageDesign || undefined,
    })
  }

  const handleWishlist = () => {
    if (typeof window === 'undefined') return
    setIsWishlisted(!isWishlisted)
    let wishlist: string[] = []
    try {
      wishlist = JSON.parse(localStorage.getItem('acelora-wishlist') || '[]')
    } catch {
      wishlist = []
    }
    if (!isWishlisted) {
      localStorage.setItem('acelora-wishlist', JSON.stringify([...wishlist, product.id]))
    } else {
      localStorage.setItem('acelora-wishlist', JSON.stringify(wishlist.filter((id: string) => id !== product.id)))
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (typeof window === 'undefined') return
    setIsSubmitting(true)
    try {
      const userId = localStorage.getItem('acelora-user-id')
      if (!userId) {
        alert('Silakan login terlebih dahulu untuk memberikan ulasan')
        return
      }
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId: product.id, rating: newRating, comment: newComment }),
      })
      const data = await res.json()
      if (data.success) {
        setNewComment('')
        setNewRating(5)
        alert('Ulasan berhasil dikirim!')
        window.location.reload()
      } else {
        alert(data.error || 'Gagal mengirim ulasan')
      }
    } catch (err) {
      alert('Terjadi kesalahan saat mengirim ulasan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const handleShare = async () => {
    if (!currentUrl) return
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url: currentUrl })
      } catch {
        await navigator.clipboard.writeText(currentUrl)
      }
    } else {
      await navigator.clipboard.writeText(currentUrl)
    }
  }

  useEffect(() => {
    let cancelled = false
    try {
      const saved = localStorage.getItem('acelora-wishlist') || '[]'
      const wishlist: string[] = JSON.parse(saved)
      const value = wishlist.includes(product.id)
      requestAnimationFrame(() => {
        if (!cancelled) setIsWishlisted(value)
      })
    } catch {
      // corrupted localStorage — ignore
    }
    return () => { cancelled = true }
  }, [product.id])

  return (
    <div className="grid md:grid-cols-2 gap-10">
      {/* Image Gallery — sticky left */}
      <div className="md:sticky md:top-24 h-fit">
        <div className="relative aspect-square bg-stone-100">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 55vw"
              priority
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-stone-400">
              <span className="text-xs">No Image</span>
            </div>
          )}
        </div>

        {product.images && product.images.length > 0 && (
          <div className="mt-2 flex gap-2 overflow-x-auto">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                className="aspect-square w-20 flex-shrink-0 overflow-hidden border border-black/10 hover:border-black"
              >
                <img src={img} alt={`${product.name} ${idx + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={handleWishlist}
            className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
              isWishlisted
                ? 'text-red-600'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
            {isWishlisted ? t.landing.saved : (t.landing.saved || 'Save')}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
            aria-label="Bagikan"
          >
            <Share2 size={18} />
            {t.landing.share || 'Share'}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="py-4">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-stone-500">
          <Link href="/" className="hover:underline">{t.landing.homeBreadcrumb || 'Home'}</Link>
          <span className="mx-2">{t.landing.breadcrumbsSep || '•'}</span>
          <Link href="/products" className="hover:underline">{t.landing.farmProduceBreadcrumb || 'Farm Produce'}</Link>
          <span className="mx-2">{t.landing.breadcrumbsSep || '•'}</span>
          <span className="text-stone-900">{displayName}</span>
        </nav>

        <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 leading-tight mb-4">
          {displayName}
        </h1>

        <p className="text-3xl font-bold text-red-800 mb-6">
          Rp {product.price.toLocaleString('id-ID')}
        </p>

        {/* Add to Cart — full width emerald */}
        <div className="mb-6">
          <button
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className="w-full bg-emerald-950 px-6 py-4 text-white text-sm font-semibold uppercase tracking-widest hover:bg-emerald-800 transition-colors flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={18} />
            {isAvailable ? `${t.landing.addToCart} | Rp ${product.price.toLocaleString('id-ID')}` : t.landing.outOfStockLong}
          </button>

          {/* Stock */}
          <p className="mt-2 text-xs text-stone-500">
            {isAvailable ? `${t.landing.inStockShort} (${product.stock} available)` : t.landing.outOfStockShort}
          </p>
        </div>

        {/* Quantity Selector */}
        {isAvailable && (
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm uppercase tracking-widest text-stone-500">{t.landing.quantity}</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantity(-1)}
                className="h-9 w-9 flex items-center justify-center border border-black/15 hover:bg-stone-100 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button
                onClick={() => handleQuantity(1)}
                className="h-9 w-9 flex items-center justify-center border border-black/15 hover:bg-stone-100 transition-colors"
                disabled={quantity >= product.stock}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Description */}
        <p className="text-sm leading-relaxed text-stone-600 mb-8">
          {product.description || 'A premium product sourced with care from our partner communities.'}
        </p>

        {/* Accordion */}
        <div className="border-b border-black/10">
          {ACCORDION_DATA.map((item) => {
            const isOpen = openSection === item.titleKey
            return (
              <div key={item.titleKey} className="border-t border-black/10">
                <button
                  onClick={() => setOpenSection(isOpen ? null : item.titleKey)}
                  className="flex w-full items-center justify-between py-5 text-left"
                >
                  <span className="text-xs font-bold uppercase tracking-wide text-stone-900">
                    {t.landing[item.titleKey as keyof typeof t.landing] as string}
                  </span>
                  {isOpen ? (
                    <Minus size={16} className="text-stone-500" />
                  ) : (
                    <Plus size={16} className="text-stone-500" />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      {item.titleKey === 'shippingStorage' ? (
                        <div className="pb-5">
                          <p className="text-sm leading-relaxed text-stone-600 mb-4">
                            {t.landing.shippingStorageText}
                          </p>
                          {packageDesignImages.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {packageDesignImages.map((img, i) => (
                                <button
                                  key={img}
                                  onClick={() => {
                                    setLightboxIndex(i)
                                    setLightboxOpen(true)
                                  }}
                                  className="relative aspect-square group overflow-hidden border border-black/10 hover:border-black transition-colors"
                                >
                                  <img
                                    src={img}
                                    alt={`Package design ${i + 1}`}
                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Eye size={20} className="text-white" />
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="pb-5 text-sm leading-relaxed whitespace-pre-line text-stone-600">
                          {(t.landing[item.contentKey as keyof typeof t.landing] as string) || item.contentKey}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* Reviews */}
        <div className="mt-10 pt-10 border-t border-black/10">
          <h3 className="text-lg font-bold text-stone-900 mb-6">ULASAN PELANGGAN</h3>
          
          {/* Add Review Form */}
          <div className="mb-8 p-6 bg-stone-50 border border-black/10">
            <h4 className="text-sm font-semibold text-stone-900 mb-4 uppercase tracking-widest">Tulis Ulasan Anda</h4>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <select
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                className="w-full px-3 py-2 border border-black/15 bg-white text-stone-900 text-sm"
              >
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} ★</option>)}
              </select>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-3 py-2 border border-black/15 bg-white text-stone-900 h-24 resize-none text-sm"
                placeholder="Bagikan pengalaman Anda..."
                required
              ></textarea>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-stone-900 text-white text-sm uppercase tracking-widest hover:bg-stone-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
              </button>
            </form>
          </div>

          {/* List Reviews */}
          <div className="space-y-6">
            {(reviews.length > 0 ? reviews : (DUMMY_REVIEWS[product.id] || [])).map((review) => (
              <div key={review.id} className="border-b border-black/10 pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <UserCircle2 className="w-8 h-8 text-stone-400" />
                  <div>
                    <span className="text-sm font-medium text-stone-900">{review.user?.name || 'Anonim'}</span>
                    <div className="flex text-yellow-400 text-xs">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} fill={i < review.rating ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-stone-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Package Design Lightbox */}
        <AnimatePresence>
          {lightboxOpen && packageDesignImages.length > 0 && (
            <PackageDesignLightbox
              images={packageDesignImages}
              folder={product.packageDesign || ''}
              index={lightboxIndex}
              onClose={() => setLightboxOpen(false)}
              onNavigate={setLightboxIndex}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function RelatedProducts({ product, products }: { product: Product; products: Product[] }) {
  return (
    <div className="mt-12">
      <h3 className="font-serif text-xl text-stone-900 mb-6">
        You May Also Like
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="group"
          >
            <div className="relative aspect-square bg-stone-100 overflow-hidden">
              {p.image && (
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              )}
            </div>
            <div className="p-3">
              <h4 className="font-serif text-sm text-stone-900 truncate">
                {p.name}
              </h4>
              <p className="text-red-800 text-xs mt-1">
                Rp {p.price.toLocaleString('id-ID')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
