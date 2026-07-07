'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, ShoppingBag } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { useEffect, useState } from 'react'

function SuccessInner() {
  const searchParams = useSearchParams()
  const t = useTranslations()
  const [orderId, setOrderId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const orderId = searchParams.get('order_id')
    if (orderId) { setOrderId(orderId); setLoading(false); return }
    const check = async () => {
      const res = await fetch('/api/orders')
      const d = await res.json()
      if (d.success && d.data.length > 0) {
        setOrderId(d.data[0].id)
        setLoading(false)
      } else {
        setTimeout(check, 1000)
      }
    }
    check()
  }, [searchParams])

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-4" />
        <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-2" />
        <div className="h-4 bg-gray-200 rounded w-64 mx-auto" />
      </div>
    )
  }

  if (orderId) {
    return (
      <>
        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Pembayaran Berhasil!</h1>
        <p className="text-gray-500 mb-2">Terima kasih! Pesanan Anda akan segera diproses.</p>
        <p className="text-sm text-gray-400 mb-6">ID Pesanan: <span className="font-mono">{orderId.slice(0, 12)}</span></p>
        <div className="flex gap-3 justify-center">
          <Link href={`/orders/${orderId}`} className="px-6 py-2.5 rounded-xl bg-primary-500 text-white font-medium flex items-center gap-2">
            <Package size={18} /> Lihat Pesanan
          </Link>
          <Link href="/products" className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
            <ShoppingBag size={18} /> Belanja Lagi
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <h1 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Pesanan tidak ditemukan</h1>
      <p className="text-gray-500 mb-6">Cek pesanan Anda di dashboard.</p>
      <Link href="/dashboard/orders" className="px-6 py-2.5 rounded-xl bg-primary-500 text-white font-medium">Lihat Pesanan</Link>
    </>
  )
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen pt-28 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Suspense fallback={
          <div className="animate-pulse">
            <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-4" />
            <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-2" />
          </div>
        }>
          <SuccessInner />
        </Suspense>
      </div>
    </div>
  )
}
