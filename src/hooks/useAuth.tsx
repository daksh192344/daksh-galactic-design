import { useState, useEffect, useRef, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

interface AuthContextType {
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  retry: () => void;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const resolvedRef = useRef(false);

  const resolve = () => {
    resolvedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setLoading(false);
  };

  const checkAdmin = async (userId: string) => {
    try {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      return !!data;
    } catch {
      return false;
    }
  };

  const initAuth = () => {
    resolvedRef.current = false;
    setLoading(true);
    setError(null);

    // Timeout fallback — if auth doesn't resolve in 8s, stop loading
    timeoutRef.current = setTimeout(() => {
      if (!resolvedRef.current) {
        console.warn("Auth timeout — resolving loading state");
        setError("Authentication timed out. Click retry to try again.");
        setLoading(false);
      }
    }, 8000);

    // Restore session
    supabase.auth.getSession().then(async ({ data: { session }, error: sessionError }) => {
      if (sessionError) {
        console.error("getSession error:", sessionError);
        setError("Failed to restore session.");
        resolve();
        return;
      }
      setSession(session);
      if (session?.user) {
        const admin = await checkAdmin(session.user.id);
        setIsAdmin(admin);
      }
      resolve();
    }).catch((err) => {
      console.error("getSession exception:", err);
      setError("Failed to restore session.");
      resolve();
    });

    // Listen for auth changes — NO async callback to avoid blocking the auth lock
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        // Fire-and-forget to avoid blocking the auth lock
        checkAdmin(session.user.id).then(setIsAdmin).catch(() => setIsAdmin(false));
      } else {
        setIsAdmin(false);
      }
      // Always resolve loading on any auth event
      if (!resolvedRef.current) resolve();
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  };

  useEffect(() => {
    const cleanup = initAuth();
    return cleanup;
  }, []);

  const retry = () => {
    initAuth();
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, isAdmin, loading, error, retry, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
