'use client'

import { useEffect, useRef } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Lenis from 'lenis'
import { useUIStore } from '@/store/ui.store'
import AuthContext from '@/contexts/AuthContext'
// ChatBot removed

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000, refetchOnWindowFocus: false },
  },
})

function ThemeApplier() {
  const theme = useUIStore((s) => s.theme)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
  return null
}

function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (lenisRef.current) return
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis
    const raf = (time: number) => { lenis.raf(time); rafRef.current = requestAnimationFrame(raf) }
    rafRef.current = requestAnimationFrame(raf)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (lenisRef.current) { lenisRef.current.destroy(); lenisRef.current = null }
    }
  }, [])

  return <>{children}</>
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext>
        <ThemeApplier />
        <LenisProvider>
          {children}
        </LenisProvider>
      </AuthContext>
    </QueryClientProvider>
  )
}
