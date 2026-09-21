'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { ArrowRight, CheckCircle, Clock, Heart, MapPin, ShoppingBag, Truck } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import UserMetricCard from '@/components/user/UserMetricCard'
import type { Order } from '@/types'

interface DashboardData {
  stats: { total: number; processing: number; shipping: number; delivered: number }
  recentOrders: { id: string; total: number; status: string; createdAt: string; productName: string; productImage: string | null }[]
  recommendations: { id: string; name: string; image: string | null; price: number; ownerName: string }[]
}

function readWishlistCount() {
  if (typeof window === 'undefined') return 0
  try {
    return (JSON.parse(localStorage.getItem('acelora-wishlist') || '[]') as string[]).length
  } catch {
    return 0
  }
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const t = useTranslations()
  const [orders, setOrders] = useState<Order[]>([])
  const [data, setData] = useState<DashboardData | null>(null)
  const [wishlistCount] = useState(readWishlistCount)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      fetch('/api/orders').then(r => r.json()),
      fetch('/api/dashboard-data').then(r => r.json()),
    ]).then(([ordersRes, dashRes]) => {
      if (ordersRes.status === 'fulfilled' && (ordersRes.value as { success?: boolean; data?: Order[] })?.success) {
        setOrders((ordersRes.value as { data: Order[] }).data)
      }
      if (dashRes.status === 'fulfilled' && (dashRes.value as { success?: boolean; data?: DashboardData })?.success) {
        setData((dashRes.value as { data: DashboardData }).data)
      }
    }).finally(() => setLoading(false))
  }, [])

  const firstName = session?.user?.name?.split(' ')[0] || 'Member'
  const total = data?.stats.total ?? orders.length
  const processing = data?.stats.processing ?? orders.filter(o => ['PENDING', 'PAID', 'PROCESSING'].includes(o.status)).length
  const shipping = data?.stats.shipping ?? orders.filter(o => o.status === 'SHIPPING').length
  const delivered = data?.stats.delivered ?? orders.filter(o => o.status === 'DELIVERED').length
  const recent = data?.recentOrders ?? orders.slice(0, 5).map(o => ({
    id: o.id, total: o.total, status: o.status, createdAt: o.createdAt,
    productName: o.items[0]?.product?.name || `Order #${o.id.slice(0, 8)}`,
    productImage: o.items[0]?.product?.image || null,
  }))

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="font-serif text-2xl font-semibold text-gray-950 dark:text-white">{t.member.greeting} {firstName}!</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.member.dashboardSubtitle}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { href: '/dashboard/orders', label: t.member.attentionOrders.replace('{count}', String(processing)), tone: 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:hover:bg-amber-900/30' },
            { href: '/dashboard/wishlist', label: t.member.wishlistCount.replace('{count}', String(wishlistCount)), tone: 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30' },
            { href: '/products', label: t.member.continueShopping, tone: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/30' },
          ].map((a) => (
            <Link key={a.href + a.label} href={a.href} className={`flex items-center justify-between rounded-lg p-4 text-sm font-medium transition-colors ${a.tone}`}>
              {a.label}<ArrowRight size={16} />
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <UserMetricCard label={t.member.totalOrders} value={loading ? '—' : String(total)} icon={ShoppingBag} tone="emerald" />
        <UserMetricCard label={t.member.processing} value={loading ? '—' : String(processing)} icon={Clock} tone="amber" />
        <UserMetricCard label={t.member.shipping} value={loading ? '—' : String(shipping)} icon={Truck} tone="ocean" />
        <UserMetricCard label={t.member.completed} value={loading ? '—' : String(delivered)} icon={CheckCircle} tone="emerald" />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold text-gray-950 dark:text-white">{t.member.recentOrders}</h3>
            <Link href="/dashboard/orders" className="text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400">{t.member.viewAll}</Link>
          </div>
          <div className="mt-4 divide-y divide-gray-100 dark:divide-gray-800">
            {recent.length === 0 && <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">{t.member.noOrdersYet}</p>}
            {recent.slice(0, 5).map((o) => (
              <Link key={o.id} href={`/dashboard/orders/${o.id}`} className="flex items-center gap-4 py-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-stone-100 dark:bg-gray-800">
                  {o.productImage ? <Image src={o.productImage} alt={o.productName} fill unoptimized className="object-cover" /> : <ShoppingBag size={18} className="m-3 text-gray-400" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-950 dark:text-white">{o.productName}</p>
                  <p className="font-mono text-xs text-gray-500 dark:text-gray-400">#{o.id.slice(0, 8)} · {new Date(o.createdAt).toLocaleDateString('id-ID')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-950 dark:text-white">Rp {o.total.toLocaleString('id-ID')}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{o.status}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="font-serif text-lg font-semibold text-gray-950 dark:text-white">{t.member.quickActions}</h3>
            <div className="mt-4 space-y-2 text-sm">
              <Link href="/dashboard/addresses" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"><MapPin size={16} /> {t.member.manageAddresses}</Link>
              <Link href="/dashboard/wishlist" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"><Heart size={16} /> {t.member.wishlistCount.replace('{count}', String(wishlistCount))}</Link>
              <Link href="/dashboard/reviews" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"><CheckCircle size={16} /> {t.member.writeReview}</Link>
            </div>
          </div>
          {data && data.recommendations.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="font-serif text-lg font-semibold text-gray-950 dark:text-white">{t.member.recommendations}</h3>
              <ul className="mt-4 space-y-3">
                {data.recommendations.slice(0, 4).map((p) => (
                  <li key={p.id}>
                    <Link href={`/products/${p.id}`} className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-stone-100 dark:bg-gray-800">
                        {p.image && <Image src={p.image} alt={p.name} fill unoptimized className="object-cover" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-950 dark:text-white">{p.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Rp {p.price.toLocaleString('id-ID')}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
