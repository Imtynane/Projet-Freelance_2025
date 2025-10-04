function Navbar({brandName = "StudyMate"}) {
  return (
    <nav className="flex justify-between items-center p-6 bg-white shadow sticky top-0 z-50" aria-label="Navigation principale">
    <h1 className="text-2xl font-bold text-blue-600">{brandName}</h1>

    <ul className="flex gap-6 text-gray-700">
      <li><a href="#home" className="hover:text-blue-600">Home</a></li>
      <li><a href="#features" className="hover:text-blue-600">Features</a></li>
      <li><a href="#contact" className="hover:text-blue-600">Contact</a></li>
    </ul>
  </nav>  
  )
  
}

export default Navbar