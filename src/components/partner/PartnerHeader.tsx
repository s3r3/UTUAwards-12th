'use client'

import Link from 'next/link'
import { Bell, Menu, Moon, Search, ShoppingBag, Sun } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useUIStore } from '@/store/ui.store'
import { partnerStore } from '@/data/partnerDemo'

const titles: Record<string, string> = {
  '/partner/dashboard': 'Dashboard', '/partner/toko': 'Toko Saya', '/partner/produk': 'Produk', '/partner/pesanan': 'Pesanan',
  '/partner/pelanggan': 'Pelanggan B2B', '/partner/penjualan': 'Penjualan', '/partner/inventori': 'Inventori', '/partner/fulfillment': 'Fulfillment',
  '/partner/marketing': 'Marketing', '/partner/analytics': 'Analytics', '/partner/notifikasi': 'Notifikasi', '/partner/pesan': 'Pesan',
  '/partner/keuangan': 'Keuangan', '/partner/verifikasi': 'Verifikasi Bisnis', '/partner/pengaturan': 'Pengaturan', '/partner/bantuan': 'Bantuan',
}

export default function PartnerHeader({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname()
  const { theme, setTheme } = useUIStore()
  const isDark = theme === 'dark'
  const title = titles[pathname] || 'Partner Portal'

  return (
    <header className="sticky top-0 z-20 flex min-h-16 items-center gap-3 border-b border-gray-200 bg-white/95 px-4 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95 sm:px-6">
      <button onClick={onMenu} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden" aria-label="Buka menu">
        <Menu size={20} />
      </button>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 dark:text-gray-400">Partner Portal</p>
        <h1 className="truncate font-serif text-xl font-semibold text-gray-950 dark:text-white">{title}</h1>
      </div>
      <label className="hidden items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-400 lg:flex dark:border-gray-800">
        <Search size={16} aria-hidden="true" />
        <input className="w-44 bg-transparent outline-none placeholder:text-gray-400" placeholder="Cari produk, pesanan..." aria-label="Cari" />
      </label>
      <Link href="/partner/notifikasi" className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Notifikasi">
        <Bell size={19} />
        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-emerald-500" />
      </Link>
      <Link href="/partner/toko" className="hidden items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 sm:flex dark:text-gray-300 dark:hover:bg-gray-800">
        <ShoppingBag size={16} /> {partnerStore.name}
      </Link>
      <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Ganti tema">
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  )
}
