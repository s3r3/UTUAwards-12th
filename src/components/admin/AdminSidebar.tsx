'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  BarChart3, Bell, ClipboardList, Home, Layers, LogOut, Megaphone,
  Package, ScrollText, Settings, ShieldCheck, ShoppingBag, Store,
  Truck, Users, Wallet, Warehouse, UserCheck, FileText,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const groups: { title: string; items: { href: string; label: string; icon: LucideIcon }[] }[] = [
  { title: 'MAIN', items: [{ href: '/dashboard/admin', label: 'Dashboard', icon: Home }] },
  {
    title: 'OPERASIONAL', items: [
      { href: '/dashboard/admin/orders', label: 'Pesanan', icon: ShoppingBag },
      { href: '/dashboard/admin/products', label: 'Produk', icon: Package },
      { href: '/dashboard/admin/products/approval', label: 'Approval Produk', icon: ClipboardList },
      { href: '/dashboard/admin/categories', label: 'Kategori', icon: Layers },
      { href: '/dashboard/admin/inventory', label: 'Inventori', icon: Warehouse },
      { href: '/dashboard/admin/fulfillment', label: 'Fulfillment', icon: Truck },
    ],
  },
  {
    title: 'MITRA & PENGGUNA', items: [
      { href: '/dashboard/admin/partners/verification', label: 'Verifikasi Mitra', icon: ShieldCheck },
      { href: '/dashboard/admin/partners/applications', label: 'Aplikasi Mitra', icon: UserCheck },
      { href: '/dashboard/admin/partners/performance', label: 'Performa Mitra', icon: BarChart3 },
      { href: '/dashboard/admin/buyers', label: 'Pembeli B2B', icon: Store },
      { href: '/dashboard/admin/users', label: 'Pengguna', icon: Users },
    ],
  },
  {
    title: 'KEUANGAN', items: [
      { href: '/dashboard/admin/transactions', label: 'Transaksi', icon: Wallet },
      { href: '/dashboard/admin/payments', label: 'Pembayaran', icon: FileText },
      { href: '/dashboard/admin/payouts', label: 'Payout Mitra', icon: Wallet },
    ],
  },
  {
    title: 'GROWTH', items: [
      { href: '/dashboard/admin/campaigns', label: 'Campaign', icon: Megaphone },
      { href: '/dashboard/admin/announcements', label: 'Pengumuman', icon: Bell },
      { href: '/dashboard/admin/notifications', label: 'Notifikasi', icon: Bell },
    ],
  },
  {
    title: 'INSIGHT', items: [
      { href: '/dashboard/admin/analytics', label: 'Analytics', icon: BarChart3 },
      { href: '/dashboard/admin/reports', label: 'Laporan', icon: FileText },
      { href: '/dashboard/admin/audit-log', label: 'Audit Log', icon: ScrollText },
    ],
  },
  {
    title: 'AKUN', items: [
      { href: '/dashboard/admin/settings', label: 'Pengaturan', icon: Settings },
    ],
  },
]

export default function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const initial = (session?.user?.name || 'A').charAt(0).toUpperCase()

  return (
    <aside className="flex h-full flex-col bg-white dark:bg-gray-900">
      <div className="border-b border-gray-200 px-5 py-5 dark:border-gray-800">
        <Link href="/" onClick={onNavigate} className="block">
          <p className="font-serif text-2xl font-bold text-gray-950 dark:text-white">ACELORA</p>
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400">Admin Console</p>
        </Link>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {groups.map((group) => (
          <section key={group.title}>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">{group.title}</p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${active ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}
                  >
                    <item.icon size={18} aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </section>
        ))}
      </nav>

      <div className="border-t border-gray-200 p-4 dark:border-gray-800">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/60">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-100 font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">{initial}</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-950 dark:text-white">{session?.user?.name || 'Admin'}</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">Administrator</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          <LogOut size={16} /> Keluar
        </button>
      </div>
    </aside>
  )
}
