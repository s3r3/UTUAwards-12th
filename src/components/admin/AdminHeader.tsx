'use client'

import Link from 'next/link'
import { Bell, Menu, Moon, Search, Sun } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useUIStore } from '@/store/ui.store'

const titles: Record<string, string> = {
  '/dashboard/admin': 'Dashboard',
  '/dashboard/admin/orders': 'Pesanan',
  '/dashboard/admin/products': 'Produk',
  '/dashboard/admin/products/approval': 'Approval Produk',
  '/dashboard/admin/categories': 'Kategori',
  '/dashboard/admin/inventory': 'Inventori',
  '/dashboard/admin/fulfillment': 'Fulfillment',
  '/dashboard/admin/partners/verification': 'Verifikasi Mitra',
  '/dashboard/admin/partners/applications': 'Aplikasi Mitra',
  '/dashboard/admin/partners/performance': 'Performa Mitra',
  '/dashboard/admin/buyers': 'Pembeli B2B',
  '/dashboard/admin/users': 'Pengguna',
  '/dashboard/admin/transactions': 'Transaksi',
  '/dashboard/admin/payments': 'Pembayaran',
  '/dashboard/admin/payouts': 'Payout Mitra',
  '/dashboard/admin/campaigns': 'Campaign',
  '/dashboard/admin/announcements': 'Pengumuman',
  '/dashboard/admin/notifications': 'Notifikasi',
  '/dashboard/admin/analytics': 'Analytics',
  '/dashboard/admin/reports': 'Laporan',
  '/dashboard/admin/audit-log': 'Audit Log',
  '/dashboard/admin/settings': 'Pengaturan',
}

export default function AdminHeader({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname()
  const { theme, setTheme } = useUIStore()
  const isDark = theme === 'dark'
  const title = titles[pathname] || 'Admin Console'

  return (
    <header className="sticky top-0 z-20 flex min-h-16 items-center gap-3 border-b border-gray-200 bg-white/95 px-4 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95 sm:px-6">
      <button onClick={onMenu} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden" aria-label="Buka menu">
        <Menu size={20} />
      </button>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 dark:text-gray-400">Admin Console</p>
        <h1 className="truncate font-serif text-xl font-semibold text-gray-950 dark:text-white">{title}</h1>
      </div>
      <label className="hidden items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-400 lg:flex dark:border-gray-800">
        <Search size={16} aria-hidden="true" />
        <input className="w-44 bg-transparent outline-none placeholder:text-gray-400" placeholder="Cari pesanan, produk, user..." aria-label="Cari" />
      </label>
      <Link href="/dashboard/admin/notifications" className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Notifikasi">
        <Bell size={19} />
        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-emerald-500" />
      </Link>
      <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Ganti tema">
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  )
}
