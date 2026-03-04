import { motion } from "framer-motion";
import { Briefcase, MessageCircle, ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = ({ onStartProject }: { onStartProject?: () => void }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float-particle ${8 + Math.random() * 12}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      <div className="relative container text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 glass-card neon-border px-4 py-2 rounded-full mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-display text-primary tracking-widest uppercase">
            Web Developer & Designer
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6"
        >
          Get a High-Converting
          <br />
          <span className="gradient-text">Website for Your Business</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto mb-8 font-body"
        >
          Modern websites with 3D animations and high performance — starting at just ₹2,000
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <button onClick={onStartProject} className="neon-button px-8 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2">
            <MessageCircle size={18} /> Get My Website
          </button>
          <a href="#portfolio" className="neon-button-outline px-8 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2">
            <Briefcase size={18} /> View Portfolio
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-primary font-display"
        >
          ⚡ Only 5 client slots available this week
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground font-display tracking-widest uppercase">Scroll</span>
        <ChevronDown size={20} className="text-primary animate-scroll-bounce" />
      </div>
    </section>
  );
};

export default HeroSection;
