export default function UserDashboard() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Mon Espace Personnel</h1>
        <p className="text-gray-600">Bienvenue dans votre tableau de bord</p>
      </header>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl text-gray-500 font-semibold mb-4">Mes informations</h2>
        {/* Profil utilisateur */}
        
        <div className="mt-6">
          <h2 className="text-xl  text-gray-600 font-semibold mb-4">Activité récente</h2>
          {/* Historique */}
        </div>
      </div>
    </div>
  )
}