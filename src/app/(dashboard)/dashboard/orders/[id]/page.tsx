'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, MapPin } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import type { Order } from '@/types'

export default function DashboardOrderDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const t = useTranslations()

  useEffect(() => {
    fetch('/api/orders/' + id).then(r => r.json()).then(d => { if (d.success) setOrder(d.data) }).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div>{t.common.loading}</div>
  if (!order) return <div>Not found</div>

  const sc: Record<string, string> = {
    PAID: 'bg-green-100 text-green-800', PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPING: 'bg-purple-100 text-purple-800', DELIVERED: 'bg-gray-100 text-gray-800', CANCELLED: 'bg-red-100 text-red-800',
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 mb-4 hover:text-primary-600">
        <ArrowLeft size={18} /> {t.common.back}
      </button>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">{t.orders.detail}</h1>
        <span className={'px-3 py-1 rounded-full text-sm font-medium ' + (sc[order.status] || 'bg-yellow-100 text-yellow-800')}>
          {t.orders.statuses[order.status as keyof typeof t.orders.statuses] || order.status}
        </span>
      </div>
      <div className="rounded-2xl border p-4 mb-4 bg-white dark:bg-gray-900">
        {order.items.map(item => (
          <div key={item.id} className="flex gap-3 py-2 border-b last:border-0">
            <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-50 shrink-0">
              {item.product.image && <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{item.product.name}</p>
              <p className="text-xs text-gray-500">{item.quantity}x @ Rp {item.price.toLocaleString('id-ID')}</p>
            </div>
            <p className="font-semibold text-sm">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border p-4 mb-4 bg-white dark:bg-gray-900">
        <h2 className="font-semibold mb-2 flex items-center gap-2 text-sm"><MapPin size={16} /> {t.orders.address}</h2>
        <p className="text-sm">{order.address.street}, {order.address.city}, {order.address.province}</p>
      </div>
      <div className="rounded-2xl border p-4 bg-white dark:bg-gray-900">
        <div className="flex justify-between font-bold"><span>{t.orders.total}</span><span>Rp {order.total.toLocaleString('id-ID')}</span></div>
      </div>
    </div>
  )
}
