'use client'

import { useState, useEffect } from 'react'
import LoadingScreen from './LoadingScreen'

export default function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} duration={3000} />}
      <main className={isLoading ? 'hidden' : ''}>
        {children}
      </main>
    </>
  )
}