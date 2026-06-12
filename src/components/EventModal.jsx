import { motion, AnimatePresence } from "framer-motion";

function EventModal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Fond semi-transparent */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Contenu de la modale */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ scale: 0.8, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
              {children}

              {/* Bouton de fermeture */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              >
                ✖
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default EventModal;