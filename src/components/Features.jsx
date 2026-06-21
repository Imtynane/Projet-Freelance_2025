import { motion } from "framer-motion"


function Features() {
  //const items = [
    //{ title: "Emploi du temps", text: "Planifie tes cours et projets facilement.", emoji: "📅" },
   // { title: "Budget étudiant", text: "Suis tes dépenses étudiantes.", emoji: "💸" },
   // { title: "Suivi des tâches", text: "Ne rate jamais une échéance.", emoji: "✅" },
  //]

  return (
        <section className="py-16 bg-white" id="features">
            <div className="max-w-6xl mx-auto px-6 text-center">
                     {/* Titre */}
                <motion.h2 
                    className="text-3xl font-bold text-gray-900"
                    initial={{ opacity: 0, y: -50 }} // Animation initiale
                    whileInView={{ opacity: 1, y: 0 }} // Animation quand dans le viewport
                    transition={{ duration: 0.6 }} // Durée de l'animation
                    viewport={{ once: true }}
                >
                    Pourquoi choisir ITMIA ?
                </motion.h2>

                <motion.p 
                    className="mt-4 text-gray-600"
                    initial={{ opacity: 0}} // Animation initiale
                    whileInView={{ opacity: 1}} // Animation quand dans le viewport
                    transition={{ duration: 0.2}} // Durée et délai de l'animation
                    viewport={{ once: true }}
                >
                    Tes études, organisées comme jamais.
                </motion.p>

                    {/* Grille des fonctionnalités */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          
                        {/* Feature 1 */}
                    <motion.div 
                        className="p-6 bg-gray-50 rounded-lg shadow hover:shadow-md"
                        initial={{ opacity: 0, y: 50 }} // Animation initiale
                        whileInView={{ opacity: 1, y: 0 }} // Animation quand dans le viewport
                        transition={{ duration: 0.6, delay: 0.2 }} // Durée et délai de l'animation
                        viewport={{ once: true }}
                    >
                        <span className="text-4xl">📅</span>
                        <h3 className="mt-4 text-xl font-semibold text-gray-900">Planifie tes cours</h3>
                        <p className="mt-2 text-gray-600">
                            Organise ton emploi du temps sans stress.
                        </p>
                    </motion.div>

                        {/* Feature 2 */}
                    <motion.div 
                        className="p-6 bg-gray-50 rounded-lg shadow hover:shadow-md"
                        initial={{ opacity: 0, y: 50 }} // Animation initiale
                        whileInView={{ opacity: 1, y: 0 }} // Animation quand dans le viewport
                        transition={{ duration: 0.6, delay: 0.4 }} // Durée et délai de l'animation
                        viewport={{ once: true }}
                    >
                        <span className="text-4xl">💸</span>
                        <h3 className="mt-4 text-xl font-semibold text-gray-900">Gère ton budget</h3>
                        <p className="mt-2 text-gray-600">
                            Suis tes dépenses étudiantes facilement.
                         </p>
                    </motion.div>

                        {/* Feature 3 */}
                    <motion.div 
                        className="p-6 bg-gray-50 rounded-lg shadow hover:shadow-md"
                        initial={{ opacity: 0, y: 50 }} // Animation initiale
                        whileInView={{ opacity: 1, y: 0 }} // Animation quand dans le viewport
                        transition={{ duration: 0.6, delay: 0.6 }} // Durée et délai de l'animation
                        viewport={{ once: true }}
                    >
                        <span className="text-4xl">✅</span>
                        <h3 className="mt-4 text-xl font-semibold text-gray-900">Respecte tes deadlines</h3>
                        <p className="mt-2 text-gray-600">
                            Ne rate jamais une échéance importante.
                        </p>
                    </motion.div>

                </div>
            </div>









            {/*
                <h2 className="text-3xl font-bold text-center mb-12">Fonctionnalités</h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
                    {items.map((it) => (
                        <div key={it.title} className="p-6 border rounded-lg shadow hover:shadow-lg">
                            <h3 className="text-xl font-semibold">{it.emoji} {it.title}</h3>
                            <p className="mt-2 text-gray-600">{it.text}</p>
                        </div>
                    ))}
                </div>
            */ }
        </section>
    )
}

export default Features

