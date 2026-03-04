import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Arjun Mehta",
    company: "E-commerce Startup",
    text: "Daksh delivered a stunning website that boosted our sales by 40%. Highly recommended!",
  },
  {
    name: "Priya Sharma",
    company: "Restaurant Chain",
    text: "Beautiful design, fast delivery, and great communication throughout the project.",
  },
  {
    name: "Rahul Verma",
    company: "SaaS Company",
    text: "The 3D animations and modern UI exceeded our expectations. Truly world-class work.",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="reviews" className="py-20 px-6">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-4xl font-display font-bold text-center mb-3"
        >
          Client <span className="gradient-text">Reviews</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-muted-foreground text-center mb-12 font-body"
        >
          What our clients say about working with us
        </motion.p>

        <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card neon-border rounded-xl p-6"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={16} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground font-body mb-4">"{t.text}"</p>
              <p className="font-display font-semibold text-foreground text-sm">{t.name}</p>
              <p className="text-xs text-primary font-body">{t.company}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
