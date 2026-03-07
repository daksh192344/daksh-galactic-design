import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = ({ onStartProject }: { onStartProject?: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const hashLinks = ["Features", "Pricing", "Reviews"];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50"
      aria-label="Main Navigation"
    >
      <div className="container flex items-center justify-between h-16">

        {/* Logo */}
        <a
          href="/"
          className="font-display text-xl font-bold"
          aria-label="Great Coders Homepage"
        >
          <span className="neon-text">Great Coders</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">

          {hashLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm text-muted-foreground hover:text-primary transition-colors font-body"
            >
              {link}
            </a>
          ))}

          <a
            href="/portfolio"
            className="text-sm text-muted-foreground hover:text-primary transition-colors font-body"
          >
            Portfolio
          </a>

          <button
            onClick={onStartProject}
            className="neon-button px-5 py-2 rounded-lg text-sm"
          >
            Get Started
          </button>

        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-foreground"
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card border-t border-border/50"
          >
            <div className="container py-4 flex flex-col gap-4">

              {hashLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-primary transition-colors font-body"
                >
                  {link}
                </a>
              ))}

              <a
                href="/portfolio"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-primary transition-colors font-body"
              >
                Portfolio
              </a>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onStartProject?.();
                }}
                className="neon-button px-5 py-2.5 rounded-lg text-sm text-center"
              >
                Get Started
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  );
};

export default Navbar;