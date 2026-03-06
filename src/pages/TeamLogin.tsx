import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";

const TeamLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  // Check if already logged in as a team member
  useEffect(() => {
    const checkExisting = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: member } = await supabase
          .from("team_members")
          .select("id")
          .eq("user_id", session.user.id)
          .maybeSingle();
        if (member) {
          navigate("/team/dashboard", { replace: true });
          return;
        }
      }
      setChecking(false);
    };
    checkExisting();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Login failed. Please try again.");
        setLoading(false);
        return;
      }

      const { data: member } = await supabase
        .from("team_members")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!member) {
        await supabase.auth.signOut();
        toast.error("No team member account found for this login.");
        setLoading(false);
        return;
      }

      toast.success("Welcome back!");
      navigate("/team/dashboard");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card neon-border rounded-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <a href="/" className="font-display text-2xl font-bold inline-block mb-2">
            <span className="neon-text">Daksh</span>.dev
          </a>
          <p className="text-muted-foreground font-body text-sm">Team Member Login</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground font-body mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-secondary/50 border border-border/30 rounded-xl px-4 py-3 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-body mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-secondary/50 border border-border/30 rounded-xl px-4 py-3 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full neon-button px-6 py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LogIn size={16} />
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6 font-body">
          <a href="/" className="text-primary hover:underline">← Back to website</a>
        </p>
      </motion.div>
    </div>
  );
};

export default TeamLogin;
