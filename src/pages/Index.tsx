import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustSection from "@/components/TrustSection";
import FeaturesSection from "@/components/FeaturesSection";
import PortfolioSection from "@/components/PortfolioSection";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import RequirementCollector from "@/components/RequirementCollector";

const Index = () => {
  const [isCollectorOpen, setIsCollectorOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onStartProject={() => setIsCollectorOpen(true)} />
      <HeroSection onStartProject={() => setIsCollectorOpen(true)} />
      <TrustSection />
      <FeaturesSection />
      <PortfolioSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection onStartProject={() => setIsCollectorOpen(true)} />
      <Footer />
      <RequirementCollector
        isOpen={isCollectorOpen}
        onClose={() => setIsCollectorOpen(false)}
      />
    </div>
  );
};

export default Index;
