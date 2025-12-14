import ProtectedRoute from '@/components/ProtectedRoute'

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <div className="max-w-4xl mx-auto mt-10">
        <h1 className="text-2xl mb-4">Espace Administrateur</h1>
        <p>Contenu réservé aux administrateurs</p>
      </div>
    </ProtectedRoute>
  )
}