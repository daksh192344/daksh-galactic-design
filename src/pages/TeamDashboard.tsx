import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { LogOut, FolderKanban, CheckCircle, Clock, AlertCircle, Star } from "lucide-react";
import { toast } from "sonner";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  rating: number | null;
  projects_completed: number | null;
}

interface TaskAssignment {
  id: string;
  task_description: string | null;
  status: string | null;
  created_at: string;
  project_id: string;
  projects: {
    business_name: string;
    client_name: string;
    priority: string;
    status: string | null;
  } | null;
}

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; label: string }> = {
  assigned: { icon: Clock, color: "text-yellow-400", label: "Assigned" },
  in_progress: { icon: AlertCircle, color: "text-blue-400", label: "In Progress" },
  completed: { icon: CheckCircle, color: "text-green-400", label: "Completed" },
};

const TeamDashboard = () => {
  const [member, setMember] = useState<TeamMember | null>(null);
  const [tasks, setTasks] = useState<TaskAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/team/login", { replace: true });
        return;
      }

      const { data: memberData } = await supabase
        .from("team_members")
        .select("id, name, role, rating, projects_completed")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!memberData) {
        await supabase.auth.signOut();
        navigate("/team/login", { replace: true });
        return;
      }

      setMember(memberData);

      const { data: taskData } = await supabase
        .from("task_assignments")
        .select("id, task_description, status, created_at, project_id, projects(business_name, client_name, priority, status)")
        .eq("team_member_id", memberData.id)
        .order("created_at", { ascending: false });

      setTasks((taskData as TaskAssignment[]) || []);
      setLoading(false);
    };

    load();
  }, [navigate]);

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    const { error } = await supabase
      .from("task_assignments")
      .update({ status: newStatus })
      .eq("id", taskId);

    if (error) {
      toast.error("Failed to update status");
      return;
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    toast.success("Status updated");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/team/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeTasks = tasks.filter((t) => t.status !== "completed");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  return (
    <div className="min-h-screen bg-background">
      <header className="glass-card border-b border-border/30 px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="font-display text-lg font-bold">
            <span className="neon-text">Daksh</span>.dev
          </a>
          <span className="text-muted-foreground text-xs font-body">/ Team Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="font-display text-sm font-semibold">{member?.name}</p>
            <p className="text-xs text-muted-foreground font-body capitalize">{member?.role?.replace("_", " ")}</p>
          </div>
          <button onClick={handleSignOut} className="text-muted-foreground hover:text-destructive transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Active Tasks", value: activeTasks.length, icon: FolderKanban },
            { label: "Completed", value: completedTasks.length, icon: CheckCircle },
            { label: "Rating", value: Number(member?.rating ?? 5).toFixed(1), icon: Star },
            { label: "Projects Done", value: member?.projects_completed ?? 0, icon: Clock },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl p-4"
            >
              <stat.icon size={16} className="text-primary mb-2" />
              <p className="font-display text-lg font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-body">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div>
          <h2 className="font-display text-lg font-bold mb-3">Active Tasks</h2>
          {activeTasks.length === 0 ? (
            <div className="glass-card rounded-xl p-8 text-center">
              <CheckCircle size={32} className="text-primary mx-auto mb-2" />
              <p className="text-muted-foreground font-body text-sm">No active tasks. You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeTasks.map((task) => {
                const config = statusConfig[task.status || "assigned"] || statusConfig.assigned;
                const StatusIcon = config.icon;
                return (
                  <motion.div key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card neon-border rounded-xl p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <StatusIcon size={14} className={config.color} />
                          <span className={`text-xs font-body ${config.color}`}>{config.label}</span>
                        </div>
                        <h3 className="font-display text-sm font-semibold truncate">
                          {task.projects?.business_name || "Unknown Project"}
                        </h3>
                        <p className="text-xs text-muted-foreground font-body mt-1">
                          {task.task_description || "No description provided"}
                        </p>
                        <div className="flex gap-3 mt-2 text-xs text-muted-foreground font-body">
                          <span>Client: {task.projects?.client_name}</span>
                          <span className={`capitalize ${task.projects?.priority === "urgent" ? "text-red-400" : "text-muted-foreground"}`}>
                            {task.projects?.priority}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {task.status === "assigned" && (
                          <button onClick={() => updateTaskStatus(task.id, "in_progress")} className="neon-button px-3 py-2 rounded-lg text-xs">
                            Start Working
                          </button>
                        )}
                        {task.status === "in_progress" && (
                          <button onClick={() => updateTaskStatus(task.id, "completed")} className="neon-button px-3 py-2 rounded-lg text-xs">
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {completedTasks.length > 0 && (
          <div>
            <h2 className="font-display text-lg font-bold mb-3 text-muted-foreground">Completed</h2>
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <div key={task.id} className="glass-card rounded-xl p-4 opacity-60">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-400" />
                    <h3 className="font-display text-sm font-semibold">
                      {task.projects?.business_name || "Unknown Project"}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground font-body mt-1">
                    {task.task_description || "No description"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TeamDashboard;
