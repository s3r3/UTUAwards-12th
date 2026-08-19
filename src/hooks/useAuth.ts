'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useAuthStore } from '@/store/auth.store'
import { useEffect } from 'react'

export function useAuth() {
  const { data: session, status } = useSession()
  const { user, setUser, logout: storeLogout, isLoading, setLoading } = useAuthStore()

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true)
    } else {
      setLoading(false)
      if (session?.user) {
        const u = session.user as Record<string, unknown>
        setUser({
          id: (u.id as string) || '',
          name: (u.name as string) || '',
          email: (u.email as string) || '',
          role: (u.role as 'USER' | 'ADMIN' | 'PARTNER') || 'USER',
        })
      } else {
        setUser(null)
      }
    }
  }, [session, status, setUser, setLoading])

  const login = async (email: string, password: string) => {
    const result = await signIn('credentials', { email, password, redirect: false })
    return result
  }

  const logout = async () => {
    storeLogout()
    await signOut({ redirect: false })
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    login,
    logout,
  }
}
