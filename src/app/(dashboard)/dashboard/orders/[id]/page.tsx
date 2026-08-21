'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, MapPin, Package, Truck, Clock } from 'lucide-react'
import dynamic from 'next/dynamic'

const DeliveryTracker = dynamic(() => import('@/components/RealDeliveryTracker'), {
  ssr: false,
  loading: () => <div className="w-full h-80 bg-gray-200 dark:bg-gray-800 animate-pulse" />
})
import { useTranslations } from '@/lib/i18n'
import type { Order } from '@/types'

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  PAID: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
  PROCESSING: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
  SHIPPING: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
  DELIVERED: { bg: 'bg-gray-50 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-700' },
  CANCELLED: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800' },
  PENDING: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
}

const RENDER_TIME = Date.now()

const trackingSteps = [
  { key: 'ordered', label: 'Order Placed', description: 'Pesanan berhasil ditempatkan' },
  { key: 'processing', label: 'Processing', description: 'Persiapan pengiriman' },
  { key: 'shipped', label: 'Shipped', description: 'Paket telah dikirim' },
  { key: 'in-transit', label: 'In Transit', description: 'Paket dalam perjalanan' },
  { key: 'delivered', label: 'Delivered', description: 'Paket telah diterima' },
]

export default function DashboardOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [trackingItem, setTrackingItem] = useState<string | null>(null)
  const t = useTranslations()

  useEffect(() => {
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id
    if (!id) return
    ;(async () => {
      try {
        const r = await fetch(`/api/orders/${id}`)
        const d = await r.json()
        if (d.success) setOrder(d.data)
      } finally {
        setLoading(false)
      }
    })()
  }, [params?.id])

  if (loading) return <div>{t.common.loading}</div>
  if (!order) return <div>{t.orders.notFound}</div>

  const status = statusColors[order.status] || statusColors.PENDING
  const subtotal = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  // Simulate tracking progress based on order status
  const getTrackingProgress = (itemStatus: string) => {
    switch (itemStatus) {
      case 'DELIVERED': return 4
      case 'SHIPPING': return 3
      case 'PROCESSING': return 2
      case 'PAID': return 1
      default: return 0
    }
  }

  const itemTracking = trackingItem ? order.items.find(i => i.id === trackingItem) : null

  return (
    <div className="space-y-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft size={18} /> {t.common.back}
      </button>

      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {t.orders.detail} #{order.id.slice(0, 8)}
        </h1>
        <span
          className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border ${status.bg} ${status.text} ${status.border}`}
        >
          {t.orders.statuses[order.status as keyof typeof t.orders.statuses] || order.status}
        </span>
      </div>

      {/* Items */}
      <section className="border border-black/10 bg-white dark:bg-gray-900">
        <div className="px-6 py-4 border-b border-black/10">
          <h2 className="font-serif text-xl font-semibold text-gray-900 dark:text-white">{t.orders.items}</h2>
        </div>
        <div className="p-6 space-y-4">
          {order.items.map((item) => {
            const itemTotal = item.price * item.quantity
            const progress = getTrackingProgress('PENDING')
            const isOpen = trackingItem === item.id

            return (
              <div key={item.id} className="border border-black/10 dark:border-gray-800 rounded-lg">
                <button
                  onClick={() => setTrackingItem(isOpen ? null : item.id)}
                  className="w-full flex items-start gap-4 p-4 text-left hover:bg-stone-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-16 h-16 relative bg-stone-100 dark:bg-gray-800 rounded overflow-hidden flex-shrink-0">
                    {item.product?.image ? (
                      <Image src={item.product.image} alt={item.product.name || 'Product'} fill unoptimized className="object-cover rounded" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300">
                        <Package size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      {item.product?.name || `Produk ${item.id.slice(0, 6)}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.quantity} × Rp {item.price.toLocaleString('id-ID')}
                    </p>
                    <p className="text-xs font-mono text-gray-400 mt-2">
                      {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900 dark:text-white whitespace-nowrap">
                      Rp {itemTotal.toLocaleString('id-ID')}
                    </p>
                    <p className="text-xs font-mono text-gray-500">{item.id.slice(0, 8)}</p>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 border-t border-black/5 pt-4">
                    <DeliveryTracker order={order} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Address + Summary */}
      <div className="grid md:grid-cols-[1fr_1fr] gap-6">
        <section className="border border-black/10 bg-white dark:bg-gray-900">
          <div className="px-6 py-4 border-b border-black/10">
            <h2 className="font-serif text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <MapPin size={18} /> {t.orders.address}
            </h2>
          </div>
          <div className="px-6 py-4">
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{order.address.name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {order.address.street}, {order.address.city}, {order.address.province} {order.address.postalCode}
                </p>
                <p className="text-sm text-gray-500">{order.address.phone}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border border-black/10 bg-white dark:bg-gray-900">
          <div className="px-6 py-4 border-b border-black/10">
            <h2 className="font-serif text-xl font-semibold text-gray-900 dark:text-white">Ringkasan</h2>
          </div>
          <div className="px-6 py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-900 dark:text-white">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Ongkir</span>
              <span className="text-gray-900 dark:text-white">Rp {(order.shippingCost || 0).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center border-t border-black/10 pt-4 mt-3">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">Rp {order.total.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}