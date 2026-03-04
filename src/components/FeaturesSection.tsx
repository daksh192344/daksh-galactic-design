import { useState, useRef } from "react";
import { motion } from "framer-motion";

const faces = [
  { label: "3D Website Design", desc: "Stunning 3D visuals that make your website stand out from competitors." },
  { label: "AI-Powered Builder", desc: "Leverage AI to build smarter, faster, and more personalized websites." },
  { label: "48-Hour Delivery", desc: "Get your complete website delivered in just 48 hours, guaranteed." },
  { label: "Conversion-Optimized", desc: "UI designed to maximize leads, sales, and user engagement." },
];

const FeaturesSection = () => {
  const [rotation, setRotation] = useState({ x: -15, y: -25 });
  const [activeIndex, setActiveIndex] = useState(0);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };

    setRotation((prev) => {
      const newY = prev.y + dx * 0.5;
      const newX = prev.x - dy * 0.5;
      // Determine active face based on Y rotation
      const normalizedY = ((newY % 360) + 360) % 360;
      let idx = 0;
      if (normalizedY >= 315 || normalizedY < 45) idx = 0;
      else if (normalizedY >= 45 && normalizedY < 135) idx = 2;
      else if (normalizedY >= 135 && normalizedY < 225) idx = 3;
      else idx = 1;
      setActiveIndex(idx);
      return { x: newX, y: newY };
    });
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <section id="features" className="py-20 px-6">
      <div className="container text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-4xl font-display font-bold mb-3"
        >
          Explore Our <span className="gradient-text">Features</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-muted-foreground mb-12 font-body"
        >
          Drag to rotate the cube and explore our features
        </motion.p>

        <div className="flex flex-col items-center">
          <div
            className="cube-container cursor-grab active:cursor-grabbing touch-none select-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <div
              className="cube"
              style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
            >
              <div className="cube-face front">{faces[0].label}</div>
              <div className="cube-face right">{faces[1].label}</div>
              <div className="cube-face left">{faces[2].label}</div>
              <div className="cube-face back">{faces[3].label}</div>
              <div className="cube-face top">Daksh.dev</div>
              <div className="cube-face bottom">Premium</div>
            </div>
          </div>

          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 max-w-md"
          >
            <h3 className="font-display text-lg text-primary mb-2">{faces[activeIndex].label}</h3>
            <p className="text-muted-foreground font-body text-sm">{faces[activeIndex].desc}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
