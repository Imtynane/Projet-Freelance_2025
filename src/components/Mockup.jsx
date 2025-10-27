function Mockup() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 text-center relative overflow-hidden">
      {/* Titre */}
      <h2 className="text-3xl font-bold text-gray-900">
        Un aperçu de StudyMate 📱
      </h2>
      <p className="mt-4 text-gray-600">
        Découvre ton futur compagnon d’organisation.
      </p>

      {/* Image de mockup */}
      <div className="mt-12 flex justify-center">
        <div className="animate-float border-4 border-white rounded-3xl shadow-2xl shadow-blue-200 
                        overflow-hidden w-80 h-[500px] bg-black relative 
                        transform transition-transform duration-500 hover:rotate-3 hover:scale-105">
          {/* Halo coloré derrière */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl -z-10 rounded-3xl"></div>

          {/* Image */}
          <img
            src="/fallback/Capture d'écran 2025-10-08 182923.png"
            alt="Aperçu de l'application StudyMate"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}

export default Mockup
