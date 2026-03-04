import { motion } from "framer-motion";
import { Rocket } from "lucide-react";

const CTASection = () => {
  return (
    <section id="cta" className="py-24 px-6 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="container relative text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-4xl font-display font-bold mb-4"
        >
          Launch Your Website in{" "}
          <span className="gradient-text">48 Hours</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-muted-foreground mb-8 font-body max-w-md mx-auto"
        >
          Ready to take your business online? Let's build something amazing together.
        </motion.p>
        <motion.a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="neon-button animate-pulse-glow inline-flex items-center gap-2 px-10 py-4 rounded-xl text-base font-display"
        >
          <Rocket size={20} /> Start My Project
        </motion.a>
      </div>
    </section>
  );
};

export default CTASection;
