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
        setUser({
          id: (session.user as any).id,
          name: session.user.name || '',
          email: session.user.email || '',
          role: (session.user as any).role || 'USER',
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
