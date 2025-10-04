function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 text-center">
        <p>© {new Date().getFullYear()} StudyMate. Tous droits réservés.</p>
        <p className="mt-2">Fait avec ❤️ pour les étudiants.</p>
        <div className="flex justify-center gap-4 mt-4">
            <a href="#" className="hover:text-white"><i className="fab fa-facebook"></i></a>
            <a href="#" className="hover:text-white"><i className="fab fa-twitter"></i></a>
            <a href="#" className="hover:text-white"><i className="fab fa-linkedin"></i></a>
        </div>
    </footer>
  )
}

export default Footer
