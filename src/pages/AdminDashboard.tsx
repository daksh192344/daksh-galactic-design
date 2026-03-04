import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, FolderKanban, Inbox, Star, LogOut, Menu, X
} from "lucide-react";
import DashboardOverview from "@/components/admin/DashboardOverview";
import ClientRequests from "@/components/admin/ClientRequests";
import TeamManagement from "@/components/admin/TeamManagement";
import ProjectWorkflow from "@/components/admin/ProjectWorkflow";
import PerformanceRatings from "@/components/admin/PerformanceRatings";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "requests", label: "Client Requests", icon: Inbox },
  { id: "team", label: "Team", icon: Users },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "ratings", label: "Ratings", icon: Star },
];

const AdminDashboard = () => {
  const { session, isAdmin, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session || !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview": return <DashboardOverview />;
      case "requests": return <ClientRequests />;
      case "team": return <TeamManagement />;
      case "projects": return <ProjectWorkflow />;
      case "ratings": return <PerformanceRatings />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-50 h-screen w-64 glass-card border-r border-border/30 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-5 border-b border-border/30 flex items-center justify-between">
          <a href="/" className="font-display text-lg font-bold">
            <span className="neon-text">Daksh</span>.dev
          </a>
          <button className="md:hidden text-muted-foreground" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body transition-all ${
                activeTab === tab.id
                  ? "neon-button"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border/30">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-14 border-b border-border/30 flex items-center px-4 gap-4 glass-card">
          <button className="md:hidden text-foreground" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <h2 className="font-display text-sm font-semibold capitalize">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h2>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
