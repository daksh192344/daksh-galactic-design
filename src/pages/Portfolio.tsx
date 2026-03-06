import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Play, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  video_type: string | null;
  thumbnail_url: string | null;
  created_at: string;
}

const getEmbedUrl = (url: string, type: string | null) => {
  if (!url) return null;
  if (type === "youtube" || url.includes("youtube.com") || url.includes("youtu.be")) {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  }
  if (type === "instagram" || url.includes("instagram.com")) {
    const match = url.match(/instagram\.com\/(?:reel|p)\/([\w-]+)/);
    return match ? `https://www.instagram.com/reel/${match[1]}/embed` : url;
  }
  return url;
};

const Portfolio = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("portfolio_items")
        .select("*")
        .order("created_at", { ascending: false });
      setItems(data || []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-5xl font-display font-bold mb-4">
              Our <span className="gradient-text">Portfolio</span>
            </h1>
            <p className="text-muted-foreground font-body max-w-2xl mx-auto">
              Explore our latest projects, Instagram reels, YouTube shorts, and more
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="glass-card rounded-xl p-12 text-center">
              <p className="text-muted-foreground font-body">No portfolio items yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card neon-border rounded-xl overflow-hidden group hover:shadow-[var(--neon-glow-strong)] transition-all duration-500"
                >
                  <div className="relative aspect-video bg-secondary/50">
                    {activeVideo === item.id && item.video_url ? (
                      <iframe
                        src={getEmbedUrl(item.video_url, item.video_type) || ""}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    ) : (
                      <div
                        className="w-full h-full cursor-pointer flex items-center justify-center relative"
                        onClick={() => item.video_url && setActiveVideo(item.id)}
                      >
                        {item.thumbnail_url ? (
                          <img
                            src={item.thumbnail_url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-secondary/80 flex items-center justify-center">
                            <span className="font-display text-xs text-muted-foreground uppercase tracking-wider">
                              {item.video_type || "Video"}
                            </span>
                          </div>
                        )}
                        {item.video_url && (
                          <div className="absolute inset-0 flex items-center justify-center bg-background/30 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-14 h-14 rounded-full neon-button flex items-center justify-center">
                              <Play size={24} className="ml-1" />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {item.video_type && (
                      <span className="absolute top-3 left-3 glass-card px-3 py-1 rounded-md text-xs font-display text-primary capitalize">
                        {item.video_type}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-semibold text-foreground mb-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-muted-foreground font-body line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Portfolio;
