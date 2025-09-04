'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in when app loads
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('teia_user')
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        localStorage.removeItem('teia_user')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock authentication logic
      let userData: User | null = null

      if (email === 'admin@teia-algarve.pt' && password === 'admin123') {
        userData = {
          id: '1',
          name: 'Administrador TEIA',
          email: email,
          role: 'admin'
        }
      } else if (email.includes('@') && password.length >= 6) {
        userData = {
          id: '2',
          name: 'Utilizador TEIA',
          email: email,
          role: 'user'
        }
      }

      if (userData) {
        setUser(userData)
        localStorage.setItem('teia_user', JSON.stringify(userData))
        return true
      }

      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('teia_user')
  }

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}