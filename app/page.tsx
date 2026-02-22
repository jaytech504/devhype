import Header from "@/components/landing/header";
import HeroSection from "@/components/landing/hero-section";
import SocialProof from "@/components/landing/social-proof";
import FeatureGrid from "@/components/landing/feature-grid";
import HowItWorks from "@/components/landing/how-it-works";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Header />
      <HeroSection />
      <SocialProof />
      <FeatureGrid />
      <HowItWorks />
      <Footer />
    </main>
  );
}

