'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  Bell, Heart, Home, LogOut, MapPin, Settings,
  ShoppingBag, Star, HelpCircle, Store,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const groups: { title: string; items: { href: string; label: string; icon: LucideIcon }[] }[] = [
  { title: 'MAIN', items: [{ href: '/dashboard', label: 'Dashboard', icon: Home }] },
  {
    title: 'BELANJA', items: [
      { href: '/dashboard/orders', label: 'Pesanan Saya', icon: ShoppingBag },
      { href: '/dashboard/wishlist', label: 'Wishlist', icon: Heart },
      { href: '/dashboard/reviews', label: 'Ulasan Saya', icon: Star },
    ],
  },
  {
    title: 'AKUN', items: [
      { href: '/dashboard/addresses', label: 'Alamat', icon: MapPin },
      { href: '/dashboard/notifications', label: 'Notifikasi', icon: Bell },
    ],
  },
  {
    title: 'LAINNYA', items: [
      { href: '/dashboard/profile', label: 'Profil', icon: Store },
      { href: '/dashboard/settings', label: 'Pengaturan', icon: Settings },
      { href: '/dashboard/help', label: 'Bantuan', icon: HelpCircle },
    ],
  },
]

export default function UserSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const initial = (session?.user?.name || 'U').charAt(0).toUpperCase()

  return (
    <aside className="flex h-full flex-col bg-white dark:bg-gray-900">
      <div className="border-b border-gray-200 px-5 py-5 dark:border-gray-800">
        <Link href="/" onClick={onNavigate} className="block">
          <p className="font-serif text-2xl font-bold text-gray-950 dark:text-white">ACELORA</p>
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400">Member Area</p>
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
            <p className="truncate text-sm font-semibold text-gray-950 dark:text-white">{session?.user?.name || 'Member'}</p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">{session?.user?.email || 'member@acelora.id'}</p>
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
