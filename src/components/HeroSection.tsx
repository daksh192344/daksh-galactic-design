import { motion } from "framer-motion";
import { Briefcase, MessageCircle, ChevronDown, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = ({ onStartProject }: { onStartProject?: () => void }) => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">

      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Modern website development for small businesses"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
      </div>

      {/* Animated grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(hsl(0 0% 100% / 0.12) 1px, transparent 1px),
            linear-gradient(90deg, hsl(0 0% 100% / 0.12) 1px, transparent 1px)
          `,
            backgroundSize: "60px 60px",
            transform: "perspective(500px) rotateX(60deg)",
            transformOrigin: "center top",
            maskImage:
              "linear-gradient(to bottom, transparent, black 20%, black 60%, transparent)",
          }}
        />
      </div>

      {/* Floating lights */}
      <motion.div
        className="absolute w-72 h-72 rounded-full left-[10%] top-[20%]"
        style={{
          background: "radial-gradient(circle, hsl(0 0% 100% / 0.35), transparent 70%)",
          filter: "blur(30px)",
        }}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div
        className="absolute w-56 h-56 rounded-full right-[10%] top-[15%]"
        style={{
          background: "radial-gradient(circle, hsl(0 0% 100% / 0.25), transparent 70%)",
          filter: "blur(25px)",
        }}
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 30, -30, 0],
          scale: [1, 0.8, 1.1, 1],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative container text-center px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 glass-card neon-border px-4 py-2 rounded-full mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-display text-primary tracking-widest uppercase">
            Website Developer & Designer
          </span>
        </motion.div>

        {/* SEO Optimized Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6"
        >
          High-Converting
          <br />
          <span className="gradient-text">
            Small Business Websites
          </span>
        </motion.h1>

        {/* SEO Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-muted-foreground text-lg max-w-xl mx-auto mb-8 font-body"
        >
          We build modern websites for businesses with fast performance,
          beautiful design and SEO optimization — starting at just ₹2,000.
        </motion.p>

        {/* Buttons */}
        <motion.div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">

          <button
            onClick={onStartProject}
            className="neon-button px-8 py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <MessageCircle size={16} /> Get My Website
          </button>

          <a
            href="#portfolio"
            className="neon-button-outline px-8 py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <Briefcase size={16} /> View Portfolio
          </a>

          <button
            onClick={() => navigate("/join")}
            className="neon-button-outline px-8 py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <Users size={16} /> Join Our Team
          </button>

        </motion.div>

        <p className="text-sm text-primary font-display">
          ⚡ Only 5 client slots available this week
        </p>

      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground font-display uppercase">
          Scroll
        </span>
        <ChevronDown size={18} className="text-primary animate-scroll-bounce" />
      </div>

    </section>
  );
};

export default HeroSection;