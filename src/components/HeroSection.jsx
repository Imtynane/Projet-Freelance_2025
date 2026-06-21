import { motion } from "framer-motion"
import ImageWithFallback from "../ImageWithFallback"

function Herosection() {
  return (
    <section className="h-screen w-full flex flex-col md:flex-row items-center justify-center gap-12 p-12 bg-gray-50">

      {/* Texte à gauche */}
      <div className="text-center md:text-left px-6 max-w-xl">
        <motion.h1
          className="text-4xl font-bold text-gray-900"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Organise tes études comme un pro !!! 😎
        </motion.h1>

        <motion.p
          className="mt-4 text-lg text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Emploi du temps, budget et projets en un seul endroit.
        </motion.p>

        <motion.button
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          whileHover={{ scale: 1.1 }} // Grossit au hover
          whileTap={{ scale: 0.95 }} // Petit effet quand on clique
          animate={{ scale: [1, 1.05, 1] }} // "pulse" en boucle
          transition={{ duration: 2, repeat: Infinity }}
        >
          Essaye gratuitement
        </motion.button>
      </div>

      {/* Image à droite */}
      <motion.div
        className="relative flex justify-center"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <ImageWithFallback
          src="/fallback/desola-lanre-ologun-kwzWjTnDPLk-unsplash.jpg"
          alt="Etudiants utilisant ITMIA"
          className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto object-contain"
        />
      </motion.div>
    </section>
  )
}

export default Herosection
