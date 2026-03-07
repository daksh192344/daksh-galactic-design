import { useState } from "react";
import { Menu, X } from "lucide-react";

type Props = {
onStartProject?: () => void;
};

const Navbar = ({ onStartProject }: Props) => {
const [isOpen, setIsOpen] = useState(false);

const links = [
{ name: "Features", href: "#features" },
{ name: "Pricing", href: "#pricing" },
{ name: "Reviews", href: "#reviews" },
{ name: "Portfolio", href: "/portfolio" }
];

return (
<nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
<div className="container mx-auto flex items-center justify-between h-16 px-4">

    <a href="/" className="text-xl font-bold">
      Great Coders
    </a>

    <div className="hidden md:flex items-center gap-6">
      {links.map((link) => (
        <a
          key={link.name}
          href={link.href}
          className="text-sm text-muted-foreground hover:text-primary"
        >
          {link.name}
        </a>
      ))}

      <button
        onClick={onStartProject}
        className="bg-primary text-white px-4 py-2 rounded-lg text-sm"
      >
        Get Started
      </button>
    </div>

    <button
      className="md:hidden"
      onClick={() => setIsOpen(!isOpen)}
    >
      {isOpen ? <X size={24}/> : <Menu size={24}/>}
    </button>

  </div>

  {isOpen && (
    <div className="md:hidden border-t border-border p-4 space-y-4">

      {links.map((link) => (
        <a
          key={link.name}
          href={link.href}
          className="block text-muted-foreground"
          onClick={() => setIsOpen(false)}
        >
          {link.name}
        </a>
      ))}

      <button
        onClick={() => {
          setIsOpen(false);
          onStartProject?.();
        }}
        className="bg-primary text-white px-4 py-2 rounded-lg w-full"
      >
        Get Started
      </button>

    </div>
  )}
</nav>

);
};

export default Navbar;