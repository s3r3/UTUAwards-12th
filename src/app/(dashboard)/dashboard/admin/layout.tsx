'use client'

import { useState } from 'react'
import { ShieldAlert, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)

  if (status === 'loading') {
    return <div className="min-h-screen bg-cream p-6 dark:bg-gray-950"><div className="h-16 max-w-64 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" /></div>
  }

  if (session?.user?.role !== 'ADMIN') {
    return (
      <main className="grid min-h-screen place-items-center bg-cream p-6 dark:bg-gray-950">
        <div className="max-w-sm text-center">
          <ShieldAlert className="mx-auto mb-4 text-amber-600" size={48} />
          <h1 className="font-serif text-2xl font-semibold text-gray-950 dark:text-white">Akses terbatas</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Halaman ini hanya tersedia untuk admin ACELORA.</p>
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-cream text-gray-700 dark:bg-gray-950 dark:text-gray-200">
      {open && <button aria-label="Tutup menu" onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-black/40 md:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-gray-200 bg-white transition-transform dark:border-gray-800 dark:bg-gray-900 md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setOpen(false)} className="absolute right-3 top-4 rounded-lg p-1 text-gray-500 hover:bg-gray-100 md:hidden dark:hover:bg-gray-800" aria-label="Tutup menu"><X size={18} /></button>
        <AdminSidebar onNavigate={() => setOpen(false)} />
      </aside>
      <div className="min-w-0 md:ml-72">
        <AdminHeader onMenu={() => setOpen(true)} />
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
