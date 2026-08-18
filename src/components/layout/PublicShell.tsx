'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideShell = pathname.startsWith('/dashboard') || pathname === '/login' || pathname === '/register'

  if (hideShell) return <>{children}</>

  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
