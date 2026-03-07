import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

type Props = {
onStartProject?: () => void;
};

const HeroSection = ({ onStartProject }: Props) => {

return (
<section className="min-h-screen flex items-center justify-center text-center px-4 pt-20">

  <div className="max-w-3xl">

    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-4xl md:text-6xl font-bold mb-6"
    >
      Get a High-Converting
      <br/>
      Website for Your Business
    </motion.h1>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="text-muted-foreground text-lg mb-8"
    >
      Modern websites with high performance and responsive design starting at ₹2000.
    </motion.p>

    <button
      onClick={onStartProject}
      className="bg-primary text-white px-6 py-3 rounded-xl flex items-center gap-2 mx-auto"
    >
      <MessageCircle size={18}/>
      Get My Website
    </button>

  </div>

</section>

);
};

export default HeroSection;