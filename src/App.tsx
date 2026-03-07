import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "@/hooks/useAuth";

import Index from "./pages/Index";
import Portfolio from "./pages/Portfolio";
import JoinTeam from "./pages/JoinTeam";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

import TeamLogin from "./pages/TeamLogin";
import TeamDashboard from "./pages/TeamDashboard";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>

      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>

          <AuthProvider>

            <Routes>

              {/* Main Pages */}
              <Route path="/" element={<Index />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/join" element={<JoinTeam />} />

              {/* Admin */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* Team */}
              <Route path="/team/login" element={<TeamLogin />} />
              <Route path="/team/dashboard" element={<TeamDashboard />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />

            </Routes>

          </AuthProvider>

        </BrowserRouter>

      </TooltipProvider>

    </QueryClientProvider>
  );
}

export default App;