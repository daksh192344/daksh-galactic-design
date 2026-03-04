import { motion } from "framer-motion";
import { Briefcase, MessageCircle, ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = ({ onStartProject }: { onStartProject?: () => void }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
      </div>

      {/* Animated 3D grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(hsl(180 100% 50% / 0.05) 1px, transparent 1px),
            linear-gradient(90deg, hsl(180 100% 50% / 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'center top',
          maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 60%, transparent)',
        }} />
      </div>

      {/* Floating 3D orbs */}
      <motion.div
        className="absolute w-48 h-48 sm:w-72 sm:h-72 rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(180 100% 50% / 0.15), transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-32 h-32 sm:w-56 sm:h-56 rounded-full right-10 top-32"
        style={{
          background: 'radial-gradient(circle, hsl(160 100% 50% / 0.1), transparent 70%)',
          filter: 'blur(30px)',
        }}
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 30, -30, 0],
          scale: [1, 0.8, 1.1, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 3D Rotating rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="absolute w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full border border-primary/10"
          animate={{ rotateZ: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: 'preserve-3d', transform: 'rotateX(70deg)' }}
        />
        <motion.div
          className="absolute w-[350px] h-[350px] sm:w-[600px] sm:h-[600px] rounded-full border border-primary/5"
          animate={{ rotateZ: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: 'preserve-3d', transform: 'rotateX(70deg) rotateY(20deg)' }}
        />
      </div>

      {/* Floating particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100 - Math.random() * 200],
            x: [0, (Math.random() - 0.5) * 100],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeOut",
          }}
        />
      ))}

      <div className="relative container text-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 glass-card neon-border px-4 py-2 rounded-full mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] sm:text-xs font-display text-primary tracking-widest uppercase">
            Web Developer & Designer
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-4 sm:mb-6"
        >
          Get a High-Converting
          <br />
          <span className="gradient-text">Website for Your Business</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-6 sm:mb-8 font-body px-2"
        >
          Modern websites with 3D animations and high performance — starting at just ₹2,000
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 px-4 sm:px-0"
        >
          <button onClick={onStartProject} className="neon-button px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2">
            <MessageCircle size={16} /> Get My Website
          </button>
          <a href="#portfolio" className="neon-button-outline px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2">
            <Briefcase size={16} /> View Portfolio
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xs sm:text-sm text-primary font-display"
        >
          ⚡ Only 5 client slots available this week
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] sm:text-xs text-muted-foreground font-display tracking-widest uppercase">Scroll</span>
        <ChevronDown size={18} className="text-primary animate-scroll-bounce" />
      </div>
    </section>
  );
};

export default HeroSection;
