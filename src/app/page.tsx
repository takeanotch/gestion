// app/page.tsx
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      {/* En-tête */}


      {/* Pied de page */}
      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Votre Application. Tous droits réservés.</p>
          <p className="mt-2">
            Design créé avec ❤️ et{" "}
            <span className="text-blue-500 font-semibold">Tailwind CSS</span>
          </p>
        </div>
      </footer>
    </div>
  );
}