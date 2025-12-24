'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export interface User {
  id: string
  email: string
  name: string
  is_admin: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAdmin: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
  refreshUser: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  const checkUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setIsAdmin(data.user?.is_admin ?? false)
      } else {
        setUser(null)
        setIsAdmin(false)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setUser(null)
      setIsAdmin(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkUser()
  }, [])

  const refreshUser = async () => {
    await checkUser()
  }

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    }
    setUser(null)
    setIsAdmin(false)
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
