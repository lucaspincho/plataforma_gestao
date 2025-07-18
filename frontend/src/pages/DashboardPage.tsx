import { useQuery } from 'react-query'
import { 
  Users, 
  FileText, 
  CheckSquare, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react'
import { api } from '@/services/api'
import { useAuth } from '@/contexts/AuthContext'

interface DashboardStats {
  totalClients: number
  totalProcesses: number
  totalTasks: number
  pendingTasks: number
  activeProcesses: number
}

const DashboardPage = () => {
  const { user } = useAuth()

  const { data: statsData, isLoading } = useQuery(
    'dashboard-stats',
    async () => {
      const response = await api.get('/dashboard')
      return response.data.data.stats as DashboardStats
    }
  )

  const stats = statsData || {
    totalClients: 0,
    totalProcesses: 0,
    totalTasks: 0,
    pendingTasks: 0,
    activeProcesses: 0,
  }

  const cards = [
    {
      title: 'Total de Clientes',
      value: stats.totalClients,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Processos Ativos',
      value: stats.activeProcesses,
      icon: FileText,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: 'Tarefas Pendentes',
      value: stats.pendingTasks,
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
    },
    {
      title: 'Total de Tarefas',
      value: stats.totalTasks,
      icon: CheckSquare,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
  ]

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bem-vindo, {user?.name}!
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Aqui está um resumo das atividades do seu escritório
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon
          return (
            <div key={index} className={`card ${card.bgColor} border-0`}>
              <div className="card-content">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`inline-flex items-center justify-center p-3 ${card.color} rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className={`text-sm font-medium ${card.textColor} truncate`}>
                        {card.title}
                      </dt>
                      <dd className={`text-3xl font-bold ${card.textColor}`}>
                        {card.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Seções adicionais */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Tarefas Recentes */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title flex items-center">
              <CheckSquare className="mr-2 h-5 w-5" />
              Tarefas Recentes
            </h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {stats.pendingTasks > 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <CheckSquare className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2">Você tem {stats.pendingTasks} tarefas pendentes</p>
                  <button className="btn btn-primary btn-sm mt-3">
                    Ver Todas as Tarefas
                  </button>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <CheckSquare className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2">Nenhuma tarefa pendente</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Próximas Audiências */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Próximas Audiências
            </h3>
          </div>
          <div className="card-content">
            <div className="text-center text-gray-500 py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2">Nenhuma audiência agendada</p>
              <button className="btn btn-secondary btn-sm mt-3">
                Agendar Audiência
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Atividade Recente */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Atividade Recente
          </h3>
        </div>
        <div className="card-content">
          <div className="text-center text-gray-500 py-8">
            <TrendingUp className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2">Nenhuma atividade recente</p>
            <p className="text-sm text-gray-400">As atividades aparecerão aqui conforme você usa o sistema</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage 