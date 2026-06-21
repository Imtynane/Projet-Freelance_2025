import { Link } from 'react-router-dom'

const features = [
  {
    icon: '🧠',
    title: 'Jumeau Cognitif',
    desc: 'ITMIA modélise ton profil d\'apprentissage en temps réel — chronotype, charge cognitive, état de flux — et adapte chaque session à ton cerveau.',
    tag: 'Innovation #1',
  },
  {
    icon: '📈',
    title: 'Prédiction de Performance',
    desc: 'Grâce à l\'analyse de tes comportements d\'étude, ITMIA anticipe tes résultats à J+7 et J+14 avec une précision de ±2,5 %.',
    tag: 'Innovation #2',
  },
  {
    icon: '🚨',
    title: 'Détection Précoce du Burnout',
    desc: 'ITMIA identifie les signaux faibles de décrochage jusqu\'à 14 jours avant leur apparition pour que tu puisses agir à temps.',
    tag: 'Innovation #3',
  },
  {
    icon: '🔁',
    title: 'Révision Espacée (Ebbinghaus)',
    desc: 'L\'algorithme NCOP planifie automatiquement tes révisions au moment optimal selon la courbe d\'oubli, maximisant ta rétention à long terme.',
    tag: 'Neurosciences',
  },
  {
    icon: '⚡',
    title: 'État de Flux Optimal',
    desc: 'ITMIA ajuste la difficulté de tes sessions pour te maintenir dans la zone de flux de Csikszentmihalyi — ni trop facile, ni en surcharge.',
    tag: 'Neurosciences',
  },
  {
    icon: '🔒',
    title: 'Sécurité & Confidentialité',
    desc: 'Architecture RGPD by design. Tes données neurocognitives t\'appartiennent — chiffrées, jamais revendues, supprimables à tout moment.',
    tag: 'Sécurité',
  },
]

const stats = [
  { value: '±2,5%', label: 'Précision prédiction notes' },
  { value: '+23%', label: 'Gain de productivité' },
  { value: 'J-14', label: 'Détection burnout' },
  { value: '45 min', label: 'Économisées par jour' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-itmia-navy via-itmia-blue to-blue-500">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-full text-white/90 text-sm mb-6 border border-white/20">
            <span className="w-2 h-2 bg-ITMIA-success rounded-full animate-pulse-slow" />
            Système d'IA dédié aux apprenants · Collège → Doctorat
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight animate-fade-in">
            ITMIA
          </h1>

          <p className="text-xl md:text-2xl text-white/80 mb-4 font-light">
            Intelligence Cognitive Adaptative
          </p>

          <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Les autres plateformes gèrent des cours. <strong className="text-white">ITMIA comprend ton cerveau.</strong>{' '}
            Prédiction de performances · Jumeau cognitif · Détection précoce du burnout.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-itmia-navy font-semibold rounded-xl hover:bg-itmia-light transition-all shadow-lg text-base"
            >
              Commencer gratuitement →
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white/10 text-white border border-white/30 font-medium rounded-xl hover:bg-white/20 transition-all text-base"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 px-4 bg-itmia-navy">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.value} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-sm text-white/60">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Problème / Solution ── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold text-ITMIA-danger uppercase tracking-widest">Le problème</span>
              <h2 className="text-3xl font-bold text-itmia-navy mt-2 mb-4">
                Tu n'as pas besoin de plus de contenu.
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Moodle, Notion, Anki, Google Classroom — tous ces outils distribuent du contenu.
                Aucun ne répond à la vraie question : <strong>comment fonctionne ton cerveau à toi,
                à cet instant précis, et comment l'optimiser ?</strong>
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-ITMIA-success uppercase tracking-widest">La solution ITMIA</span>
              <h2 className="text-3xl font-bold text-itmia-navy mt-2 mb-4">
                Une IA qui modélise ton apprentissage.
              </h2>
              <p className="text-gray-600 leading-relaxed">
                ITMIA construit ton <strong>jumeau cognitif</strong> — une représentation numérique
                de ton profil d'apprentissage mise à jour à chaque session — pour prédir, adapter
                et protéger ta progression académique.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="fonctionnalites" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-itmia-blue uppercase tracking-widest">Fonctionnalités</span>
            <h2 className="text-3xl md:text-4xl font-bold text-itmia-navy mt-2">
              Trois innovations. Un seul système.
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Aucun concurrent ne combine ces trois piliers. C'est ce qui fait de ITMIA une rupture, pas une amélioration.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl border border-gray-100 hover:border-itmia-blue hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{f.icon}</span>
                  <span className="text-xs font-medium text-itmia-blue bg-itmia-light px-2 py-1 rounded-full">
                    {f.tag}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-itmia-navy mb-2 group-hover:text-itmia-blue transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Algorithme NCOP ── */}
      <section className="py-20 px-4 bg-itmia-light">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold text-itmia-blue uppercase tracking-widest">Algorithme propriétaire</span>
          <h2 className="text-3xl font-bold text-itmia-navy mt-2 mb-4">
            Le protocole NCOP
          </h2>
          <p className="text-gray-600 mb-10 leading-relaxed">
            Le <strong>NeuroFlow Cognitive Optimization Protocol</strong> fusionne trois théories
            neuroscientifiques validées — Ebbinghaus (1885), Csikszentmihalyi (1990) et Sweller (1988) —
            dans un algorithme unique qui orchestre ton apprentissage en temps réel.
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { name: 'Ebbinghaus', year: '1885', desc: 'Courbe d\'oubli & révision espacée' },
              { name: 'Csikszentmihalyi', year: '1990', desc: 'État de flux optimal' },
              { name: 'Sweller', year: '1988', desc: 'Charge cognitive adaptative' },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-xl p-4 shadow-sm border border-white">
                <div className="text-xs text-itmia-blue font-semibold mb-1">{t.year}</div>
                <div className="font-bold text-itmia-navy text-sm mb-1">{t.name}</div>
                <div className="text-xs text-gray-500">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-20 px-4 bg-itmia-navy">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à apprendre autrement ?
          </h2>
          <p className="text-white/70 mb-8 text-lg">
            Rejoins ITMIA et laisse ton jumeau cognitif optimiser chaque session d'étude.
          </p>
          <Link
            to="/register"
            className="inline-block px-10 py-4 bg-white text-itmia-navy font-semibold rounded-xl hover:bg-itmia-light transition-all shadow-lg text-base"
          >
            Créer mon profil cognitif →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-4 border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-itmia-navy flex items-center justify-center">
              <span className="text-white font-bold text-xs">I</span>
            </div>
            <span className="font-bold text-itmia-navy">ITMIA</span>
          </div>
          <p className="text-xs text-gray-400">
            Intelligence Cognitive Adaptative · ODJO Imtynane · ECPI 2024–2025
          </p>
          <div className="flex gap-4">
            <Link to="/login" className="text-xs text-gray-400 hover:text-itmia-navy transition-colors">Connexion</Link>
            <Link to="/register" className="text-xs text-gray-400 hover:text-itmia-navy transition-colors">Inscription</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}

