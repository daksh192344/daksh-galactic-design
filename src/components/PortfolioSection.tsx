import { motion } from "framer-motion";
import portfolioImg from "@/assets/project-portfolio.jpg";
import startupImg from "@/assets/project-startup.jpg";
import ecommerceImg from "@/assets/project-ecommerce.jpg";

const projects = [
  { title: "Portfolio Website", desc: "Modern dark-themed portfolio with 3D elements", tag: "Web Design", image: portfolioImg },
  { title: "Startup Landing Page", desc: "High-converting SaaS landing page with animations", tag: "Landing Page", image: startupImg },
  { title: "E-Commerce Website", desc: "Full-featured online store with premium UI", tag: "E-Commerce", image: ecommerceImg },
];

const PortfolioSection = () => {
  return (
    <section id="portfolio" className="py-20 px-6">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-4xl font-display font-bold text-center mb-3"
        >
          Our <span className="gradient-text">Work</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-muted-foreground text-center mb-12 font-body"
        >
          Recent projects showcasing our design & development expertise
        </motion.p>

        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card neon-border rounded-xl overflow-hidden group hover:shadow-[var(--neon-glow-strong)] transition-all duration-500"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 glass-card px-3 py-1 rounded-md text-xs font-display text-primary">
                  {project.tag}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display font-semibold text-foreground mb-1">{project.title}</h3>
                <p className="text-sm text-muted-foreground font-body">{project.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
