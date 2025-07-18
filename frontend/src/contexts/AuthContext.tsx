import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '@/services/api'

interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'ADVOGADO' | 'ASSISTENTE'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Verificar se existe token salvo ao carregar a página
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      
      if (!token) {
        setLoading(false)
        return
      }

      try {
        // Configurar token no header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        // Verificar se token é válido
        const response = await api.get('/auth/verify')
        setUser(response.data.data.user)
      } catch (error) {
        // Token inválido, remover
        localStorage.removeItem('token')
        delete api.defaults.headers.common['Authorization']
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user: userData } = response.data.data

      // Salvar token
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      setUser(userData)
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Erro ao fazer login'
      throw new Error(message)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 