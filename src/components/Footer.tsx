import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="py-8 border-t border-border/30">
    <div className="container px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground font-body">
        © 2026 <span className="neon-text font-display">Daksh.dev</span> — All rights reserved.
      </p>
      <Link
        to="/join"
        className="text-sm text-primary hover:text-primary/80 transition-colors font-display tracking-wider"
      >
        Join Our Team →
      </Link>
    </div>
  </footer>
);

export default Footer;
