'use client'

import { useState } from 'react'
import { Bell, Check, Info, Package } from 'lucide-react'
import { useI18NStore, useTranslations } from '@/lib/i18n'
import { userFallbackNotifications } from '@/data/userDemo'

interface Notification {
  id: string
  title: string
  desc: string
  date: string
  unread: boolean
  type: string
}

const TYPE_META: Record<string, { en: { title: string; desc: string }; id: { title: string; desc: string } }> = {
  order: {
    en: { title: 'Order Shipped', desc: 'Order #ORD-12345 is on its way.' },
    id: { title: 'Pesanan Dikirim', desc: 'Pesanan #ORD-12345 sedang dalam perjalanan.' },
  },
  payment: {
    en: { title: 'Payment Successful', desc: 'Payment for #ORD-12344 has been verified.' },
    id: { title: 'Pembayaran Berhasil', desc: 'Pembayaran untuk #ORD-12344 telah diverifikasi.' },
  },
  product: {
    en: { title: 'Product Back in Stock', desc: 'Gayo Arabica Coffee Specialty is back!' },
    id: { title: 'Produk Favorit Kembali', desc: 'Kopi Arabika Gayo Specialty telah hadir kembali!' },
  },
}

export default function NotificationsPage() {
  const t = useTranslations()
  const lang = useI18NStore((s) => s.lang)
  const [notifications, setNotifications] = useState<Notification[]>(userFallbackNotifications)
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all')

  const toggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: !n.unread } : n))
  }

  const filtered = activeTab === 'all' ? notifications : notifications.filter(n => n.unread)

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 text-sm font-medium ${activeTab === 'all' ? 'border-b-2 border-emerald-600 text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}
        >
          {t.member.notifAll} ({notifications.length})
        </button>
        <button
          onClick={() => setActiveTab('unread')}
          className={`pb-3 text-sm font-medium ${activeTab === 'unread' ? 'border-b-2 border-emerald-600 text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}
        >
          {t.member.notifUnread} ({notifications.filter(n => n.unread).length})
        </button>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
            <Bell className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
            <p>{t.member.notifEmpty}</p>
          </div>
        ) : (
          filtered.map(n => {
            const meta = TYPE_META[n.type]?.[lang] ?? { title: n.title, desc: n.desc }
            return (
              <div key={n.id} className={`flex items-start gap-4 rounded-xl border p-4 ${n.unread ? 'border-emerald-100 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-900/10' : 'border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900'}`}>
                <div className={`rounded-full p-2 ${n.unread ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-gray-100 text-gray-400 dark:bg-gray-800'}`}>
                  {n.type === 'order' && <Package size={18} />}
                  {n.type === 'payment' && <Check size={18} />}
                  {n.type === 'product' && <Info size={18} />}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{meta.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{meta.desc}</p>
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{n.date}</p>
                </div>
                <button onClick={() => toggleRead(n.id)} className="shrink-0 text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400">
                  {n.unread ? t.member.markRead : t.member.markUnread}
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
