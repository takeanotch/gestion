export default function EditorDashboard() {
  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tableau de bord Éditeur</h1>
        <p className="text-gray-600">Gestion des contenus</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-medium text-gray-700 mb-4">Mes articles</h3>
          {/* Liste des articles */}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-medium text-gray-700 mb-4">Créer un nouveau contenu</h3>
          {/* Formulaire de création */}
        </div>
      </div>
    </div>
  )
}