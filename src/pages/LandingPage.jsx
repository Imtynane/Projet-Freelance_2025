import Herosection from "../components/HeroSection";
import Features from "../components/Features";
import Mockup from "../components/Mockup";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";

export default function LandingPage() {
  return (
    <main>
      <Herosection />
      <Features />
      <Mockup />
      <Testimonials />
      <CTA />
    </main>
  );
}
