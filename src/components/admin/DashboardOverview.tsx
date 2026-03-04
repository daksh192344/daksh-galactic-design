import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, FolderKanban, CheckCircle2, Inbox } from "lucide-react";

const DashboardOverview = () => {
  const [stats, setStats] = useState({ clients: 0, active: 0, completed: 0, team: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [requests, projects, teamMembers] = await Promise.all([
        supabase.from("project_requests").select("id", { count: "exact", head: true }),
        supabase.from("projects").select("id, status"),
        supabase.from("team_members").select("id", { count: "exact", head: true }),
      ]);

      const activeCount = projects.data?.filter((p) => p.status !== "completed" && p.status !== "rejected").length ?? 0;
      const completedCount = projects.data?.filter((p) => p.status === "completed").length ?? 0;

      setStats({
        clients: requests.count ?? 0,
        active: activeCount,
        completed: completedCount,
        team: teamMembers.count ?? 0,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Clients", value: stats.clients, icon: Inbox, color: "text-primary" },
    { label: "Active Projects", value: stats.active, icon: FolderKanban, color: "text-primary" },
    { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "text-primary" },
    { label: "Team Members", value: stats.team, icon: Users, color: "text-primary" },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card neon-border rounded-xl p-6 animate-pulse h-28" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="glass-card neon-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">{card.label}</span>
              <card.icon size={18} className={card.color} />
            </div>
            <p className="text-3xl font-display font-bold gradient-text">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card neon-border rounded-xl p-6">
        <h3 className="font-display text-sm font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <p className="text-sm text-muted-foreground font-body">
            Use the sidebar to navigate between sections. Review client requests, manage your team, and track project progress.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
