import { motion } from "framer-motion"

function CTA() {
  return (
    <section className="py-16 bg-blue-600 text-white text-center">
      <motion.h2
        className="text-3xl font-bold"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Prêt à mieux organiser tes études ?
      </motion.h2>

      <motion.p
        className="mt-4 text-lg"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Rejoins StudyMate et passe à un niveau supérieur 🚀
      </motion.p>

      <motion.button
        className="mt-8 px-10 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100"
        whileHover={{
          scale: 1.15,
          boxShadow: "0px 0px 20px rgba(255,255,255,0.8)",
        }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        Essaye gratuitement
      </motion.button>
    </section>
  )
}

export default CTA