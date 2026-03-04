import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "₹2,000",
    features: ["3 Pages", "Basic Design", "3-Day Delivery"],
    popular: false,
  },
  {
    name: "Professional",
    price: "₹3,000",
    features: ["5 Pages", "Advanced UI", "Performance Optimized", "WhatsApp Integration"],
    popular: true,
  },
  {
    name: "Premium",
    price: "₹5,000",
    features: ["10 Pages", "3D Animations", "Priority Support", "SEO Optimization"],
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 px-6">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-4xl font-display font-bold text-center mb-3"
        >
          Choose Your <span className="gradient-text">Plan</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-muted-foreground text-center mb-12 font-body"
        >
          Premium websites crafted with precision and passion
        </motion.p>

        <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`glass-card rounded-xl p-6 relative ${
                plan.popular ? "neon-border animate-pulse-glow" : "border border-border/30"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 neon-button px-4 py-1 rounded-full text-xs font-display">
                  Most Popular
                </span>
              )}
              <h3 className="font-display font-semibold text-foreground text-lg mt-2">{plan.name}</h3>
              <p className="text-3xl font-display font-bold gradient-text my-4">{plan.price}</p>
              <a
                href="#cta"
                className={`block text-center py-3 rounded-xl text-sm font-display mb-6 ${
                  plan.popular ? "neon-button" : "neon-button-outline"
                }`}
              >
                Buy Now
              </a>
              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                    <Check size={16} className="text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
