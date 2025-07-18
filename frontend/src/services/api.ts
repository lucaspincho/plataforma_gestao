import axios from 'axios'
import toast from 'react-hot-toast'

export const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error?.message || 'Erro na requisição'
    
    // Não mostrar toast para erros de autenticação (401) pois o AuthContext já trata
    if (error.response?.status !== 401) {
      toast.error(message)
    }
    
    // Se token expirado, redirecionar para login
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

// Configurar token automaticamente se existir
const token = localStorage.getItem('token')
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
} 