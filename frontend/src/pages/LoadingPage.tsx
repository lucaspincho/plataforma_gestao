import { Scale } from 'lucide-react'

const LoadingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-primary-600 animate-pulse">
          <Scale className="h-8 w-8 text-white" />
        </div>
        <p className="mt-4 text-sm text-gray-600">Carregando...</p>
      </div>
    </div>
  )
}

export default LoadingPage 