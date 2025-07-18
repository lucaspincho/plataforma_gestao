import { useQuery } from 'react-query'
import { CheckSquare, Plus, Clock, AlertTriangle, Check } from 'lucide-react'
import { api } from '@/services/api'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  dueDate: string
  assigned: {
    name: string
  }
  process?: {
    number: string
    title: string
  }
}

const TasksPage = () => {
  const { data, isLoading } = useQuery(
    'tasks',
    async () => {
      const response = await api.get('/tasks')
      return response.data.data.tasks as Task[]
    }
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return 'bg-yellow-100 text-yellow-800'
      case 'EM_ANDAMENTO':
        return 'bg-blue-100 text-blue-800'
      case 'CONCLUIDA':
        return 'bg-green-100 text-green-800'
      case 'CANCELADA':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'ALTA':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'MEDIA':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'BAIXA':
        return <Check className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const tasks = data || []

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tarefas</h1>
          <p className="mt-1 text-sm text-gray-600">
            {tasks.length} tarefa(s) encontrada(s)
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            Nova Tarefa
          </button>
        </div>
      </div>

      {/* Lista de Tarefas */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <CheckSquare className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-gray-500">Nenhuma tarefa encontrada</p>
            <button className="btn btn-primary mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeira Tarefa
            </button>
          </div>
        ) : (
          tasks.map((task: Task) => (
            <div key={task.id} className="card hover:shadow-md transition-shadow">
              <div className="card-content">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      {getPriorityIcon(task.priority)}
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {task.title}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-2">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-6 mt-3 text-sm text-gray-500">
                      <div>
                        Responsável: <span className="font-medium">{task.assigned.name}</span>
                      </div>
                      {task.dueDate && (
                        <div>
                          Prazo: {format(new Date(task.dueDate), 'dd/MM/yyyy', { locale: ptBR })}
                        </div>
                      )}
                      <div>
                        Prioridade: <span className="font-medium">{task.priority}</span>
                      </div>
                    </div>

                    {task.process && (
                      <div className="mt-2 text-xs text-gray-400">
                        Processo: {task.process.number} - {task.process.title}
                      </div>
                    )}
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

export default TasksPage 