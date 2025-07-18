import { useState } from 'react'
import { useQuery } from 'react-query'
import { Search, Plus, FileText, Calendar, User } from 'lucide-react'
import { api } from '@/services/api'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Process {
  id: string
  number: string
  title: string
  type: string
  status: string
  court: string
  client: {
    name: string
    document: string
  }
  responsible: {
    name: string
  }
  createdAt: string
  _count: {
    tasks: number
    audiences: number
    deadlines: number
  }
}

const ProcessesPage = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading, error } = useQuery(
    ['processes', page, search],
    async () => {
      const response = await api.get('/processes', {
        params: { page, limit: 10, search: search || undefined }
      })
      return response.data.data
    },
    {
      keepPreviousData: true,
    }
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ATIVO':
        return 'bg-green-100 text-green-800'
      case 'SUSPENSO':
        return 'bg-yellow-100 text-yellow-800'
      case 'ARQUIVADO':
        return 'bg-gray-100 text-gray-800'
      case 'FINALIZADO':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      CIVIL: 'Cível',
      TRABALHISTA: 'Trabalhista',
      CRIMINAL: 'Criminal',
      TRIBUTARIO: 'Tributário',
      FAMILIA: 'Família',
      EMPRESARIAL: 'Empresarial',
      PREVIDENCIARIO: 'Previdenciário',
      OUTRO: 'Outro'
    }
    return types[type] || type
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Erro ao carregar processos</p>
      </div>
    )
  }

  const processes = data?.processes || []
  const pagination = data?.pagination || { total: 0, pages: 0 }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Processos</h1>
          <p className="mt-1 text-sm text-gray-600">
            {pagination.total} processo(s) encontrado(s)
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            Novo Processo
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por número, título ou cliente..."
            className="input pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de Processos */}
      <div className="space-y-4">
        {processes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-gray-500">Nenhum processo encontrado</p>
            <button className="btn btn-primary mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Processo
            </button>
          </div>
        ) : (
          processes.map((process: Process) => (
            <div key={process.id} className="card hover:shadow-md transition-shadow">
              <div className="card-content">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {process.title}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(process.status)}`}>
                        {process.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">
                      Processo nº {process.number}
                    </p>
                    
                    <div className="flex items-center space-x-6 mt-3 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="mr-1 h-4 w-4" />
                        {process.client.name}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        {format(new Date(process.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                      <div>
                        <span className="font-medium">{getTypeLabel(process.type)}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mt-3 text-xs text-gray-400">
                      <span>{process._count.tasks} tarefas</span>
                      <span>{process._count.audiences} audiências</span>
                      <span>{process._count.deadlines} prazos</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <p className="text-sm text-gray-500">
                      Resp: {process.responsible.name}
                    </p>
                    {process.court && (
                      <p className="text-xs text-gray-400 text-right">
                        {process.court}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginação */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="btn btn-secondary btn-sm disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= pagination.pages}
              className="btn btn-secondary btn-sm disabled:opacity-50"
            >
              Próximo
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Página <span className="font-medium">{page}</span> de{' '}
                <span className="font-medium">{pagination.pages}</span>
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="btn btn-secondary btn-sm disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= pagination.pages}
                className="btn btn-secondary btn-sm disabled:opacity-50"
              >
                Próximo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProcessesPage 