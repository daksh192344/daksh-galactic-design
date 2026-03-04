import { motion } from "framer-motion";

const logos = [
  "TechFlow", "StartupX", "DesignCo", "CloudNet", "AppForge",
  "DataSync", "WebCraft", "DigiLabs", "NexGen", "CodeBrew",
];

const TrustSection = () => {
  return (
    <section className="py-16 border-y border-border/30 overflow-hidden">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-sm text-muted-foreground font-display tracking-widest uppercase mb-8"
      >
        Trusted by 30+ businesses
      </motion.p>

      <div className="relative">
        <div className="flex animate-slide-logos">
          {[...logos, ...logos].map((name, i) => (
            <div
              key={i}
              className="flex-shrink-0 mx-8 glass-card neon-border px-6 py-3 rounded-lg"
            >
              <span className="font-display text-sm text-primary/70 whitespace-nowrap">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
