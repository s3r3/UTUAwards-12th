'use client'

import { usePathname } from 'next/navigation'
import ChatBot from './ChatBot'

const DASHBOARD_PATHS = ['/dashboard', '/admin']

export default function ChatBotWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = DASHBOARD_PATHS.some(p => pathname.startsWith(p))

  return (
    <>
      {children}
      {!isDashboard && <ChatBot />}
    </>
  )
}
