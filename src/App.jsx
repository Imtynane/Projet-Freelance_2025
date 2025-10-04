import Features from "./components/Features";
import Herosection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Testimonials from "./components/Testimonials";
import Mockup from "./components/Mockup";
import CTA from "./components/CTA";

function App() {
  return(
    <>
      <Navbar brandName="StudyMate"/>
      {/* wrapper central : limite la largeur et centre le contenu */}
      <main>
        <Herosection />
        <Features />
        <Mockup />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  )
}

export default App