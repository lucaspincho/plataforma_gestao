import { useState } from 'react'
import { useQuery } from 'react-query'
import { Search, Plus, Users, Phone, Mail, Building } from 'lucide-react'
import { api } from '@/services/api'

interface Client {
  id: string
  name: string
  email: string
  phone: string
  document: string
  type: string
  city: string
  state: string
  _count: {
    processes: number
  }
}

const ClientsPage = () => {
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery(
    ['clients', search],
    async () => {
      const response = await api.get('/clients', {
        params: { search: search || undefined, limit: 50 }
      })
      return response.data.data
    }
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const clients = data?.clients || []

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="mt-1 text-sm text-gray-600">
            {clients.length} cliente(s) encontrado(s)
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </button>
        </div>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar cliente por nome, email ou documento..."
          className="input pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-gray-500">Nenhum cliente encontrado</p>
            <button className="btn btn-primary mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Cadastrar Primeiro Cliente
            </button>
          </div>
        ) : (
          clients.map((client: Client) => (
            <div key={client.id} className="card hover:shadow-md transition-shadow">
              <div className="card-content">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      {client.type === 'PESSOA_JURIDICA' ? (
                        <Building className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Users className="h-5 w-5 text-gray-400" />
                      )}
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {client.name}
                      </h3>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">
                      {client.document}
                    </p>
                    
                    <div className="space-y-2 mt-3">
                      {client.email && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="mr-2 h-4 w-4" />
                          {client.email}
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="mr-2 h-4 w-4" />
                          {client.phone}
                        </div>
                      )}
                      {client.city && client.state && (
                        <div className="flex items-center text-sm text-gray-500">
                          📍 {client.city}, {client.state}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-400">
                        {client._count.processes} processo(s)
                      </p>
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

export default ClientsPage 