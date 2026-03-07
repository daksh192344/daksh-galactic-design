import { useState } from "react";
import { Helmet } from "react-helmet-async";

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

      <Helmet>
        <title>Affordable Website Development for Small Businesses | Great Coders</title>
        <meta
          name="description"
          content="Modern websites with high performance and beautiful design. Launch your business website starting at ₹2000."
        />
      </Helmet>

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