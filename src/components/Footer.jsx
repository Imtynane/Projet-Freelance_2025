function Footer() {
  return (
    <footer className="bg-itmia-navy text-white/60 py-8 text-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
          <span className="text-white font-bold text-xs">M</span>
        </div>
        <span className="font-bold text-white">ITMIA</span>
      </div>
      <p className="text-sm">© {new Date().getFullYear()} ITMIA — Intelligence Cognitive Adaptative</p>
      <p className="text-xs mt-1">Conçu pour chaque apprenant, du collège au doctorat.</p>
      <p className="text-xs mt-4 text-white/30">ODJO Imtynane · ECPI 2024–2025</p>
    </footer>
  );
}

export default Footer;
