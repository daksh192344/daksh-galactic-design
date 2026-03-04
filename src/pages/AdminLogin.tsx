import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Lock, Mail, AlertCircle } from "lucide-react";
import { Navigate } from "react-router-dom";

const AdminLogin = () => {
  const { signIn, session, isAdmin, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (session && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card neon-border rounded-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold mb-2">
            <span className="neon-text">Daksh</span>.dev
          </h1>
          <p className="text-muted-foreground text-sm font-body">Admin Dashboard Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-body text-muted-foreground">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-secondary/50 border border-border/30 rounded-xl pl-10 pr-4 py-3 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                placeholder="admin@daksh.dev"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-body text-muted-foreground">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-secondary/50 border border-border/30 rounded-xl pl-10 pr-4 py-3 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full neon-button py-3 rounded-xl text-sm font-display disabled:opacity-50"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6 font-body">
          <a href="/" className="text-primary hover:underline">← Back to website</a>
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
