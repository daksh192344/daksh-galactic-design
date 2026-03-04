import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustSection from "@/components/TrustSection";
import FeaturesSection from "@/components/FeaturesSection";
import PortfolioSection from "@/components/PortfolioSection";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <TrustSection />
      <FeaturesSection />
      <PortfolioSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
