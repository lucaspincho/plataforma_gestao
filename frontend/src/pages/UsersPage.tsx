import { useQuery } from 'react-query'
import { UserCheck, Plus, Mail, Shield, User } from 'lucide-react'
import { api } from '@/services/api'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

const UsersPage = () => {
  const { data, isLoading } = useQuery(
    'users',
    async () => {
      const response = await api.get('/users')
      return response.data.data.users as User[]
    }
  )

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800'
      case 'ADVOGADO':
        return 'bg-blue-100 text-blue-800'
      case 'ASSISTENTE':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      ADMIN: 'Administrador',
      ADVOGADO: 'Advogado',
      ASSISTENTE: 'Assistente'
    }
    return roles[role] || role
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const users = data || []

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          <p className="mt-1 text-sm text-gray-600">
            {users.length} usuário(s) no sistema
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            Novo Usuário
          </button>
        </div>
      </div>

      {/* Grid de Usuários */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <UserCheck className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-gray-500">Nenhum usuário encontrado</p>
          </div>
        ) : (
          users.map((user: User) => (
            <div key={user.id} className="card hover:shadow-md transition-shadow">
              <div className="card-content">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {user.name}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="mr-2 h-4 w-4" />
                        {user.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Shield className="mr-2 h-4 w-4" />
                        Criado em {format(new Date(user.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default UsersPage 