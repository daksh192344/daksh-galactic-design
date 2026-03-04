import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Zap, UserPlus } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Project = Database["public"]["Tables"]["projects"]["Row"];
type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];
type ProjectStatus = Database["public"]["Enums"]["project_status"];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  in_progress: "bg-blue-500/20 text-blue-400",
  review: "bg-purple-500/20 text-purple-400",
  completed: "bg-primary/20 text-primary",
  rejected: "bg-destructive/20 text-destructive",
};

const statusOrder: ProjectStatus[] = ["pending", "in_progress", "review", "completed"];

const ProjectWorkflow = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const fetchData = async () => {
    const [projRes, teamRes] = await Promise.all([
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("team_members").select("*").order("rating", { ascending: false }),
    ]);
    setProjects(projRes.data ?? []);
    setTeamMembers(teamRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (projectId: string, newStatus: ProjectStatus) => {
    const { error } = await supabase.from("projects").update({ status: newStatus }).eq("id", projectId);
    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(`Status updated to ${newStatus.replace("_", " ")}`);
      fetchData();
    }
  };

  const assignMember = async (projectId: string, memberId: string) => {
    const { error } = await supabase.from("projects").update({ assigned_to: memberId }).eq("id", projectId);
    if (error) {
      toast.error("Failed to assign");
    } else {
      // Also create task assignment
      await supabase.from("task_assignments").insert({
        project_id: projectId,
        team_member_id: memberId,
        task_description: "Primary assignment",
      });
      toast.success("Member assigned");
      setAssigningId(null);
      fetchData();
    }
  };

  const autoAssign = async (project: Project) => {
    // Find highest-rated available developer
    const available = teamMembers.filter((m) => m.is_available && m.role === "developer");
    if (available.length === 0) {
      toast.error("No available developers");
      return;
    }
    // Sort by rating descending
    const best = available.sort((a, b) => (Number(b.rating ?? 0)) - (Number(a.rating ?? 0)))[0];
    await assignMember(project.id, best.id);
    toast.success(`Auto-assigned to ${best.name} (⭐ ${Number(best.rating ?? 5).toFixed(1)})`);
  };

  const getMemberName = (id: string | null) => {
    if (!id) return null;
    return teamMembers.find((m) => m.id === id)?.name ?? "Unknown";
  };

  if (loading) {
    return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="glass-card rounded-xl p-6 animate-pulse h-28" />)}</div>;
  }

  if (projects.length === 0) {
    return (
      <div className="glass-card neon-border rounded-xl p-12 text-center">
        <p className="text-muted-foreground font-body">No projects yet. Approve a client request to create one.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div key={project.id} className="glass-card neon-border rounded-xl p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-display font-semibold text-foreground text-sm">{project.business_name}</h3>
              <p className="text-xs text-muted-foreground font-body">{project.client_name} — {project.industry}</p>
            </div>
            <span className={`text-xs font-display px-3 py-1 rounded-full ${statusColors[project.status ?? "pending"]}`}>
              {(project.status ?? "pending").replace("_", " ")}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-body text-muted-foreground mb-4">
            <span>📄 {project.pages}</span>
            <span>⚡ {project.priority}</span>
            {project.assigned_to && (
              <span className="text-primary">👤 {getMemberName(project.assigned_to)}</span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Status buttons */}
            {statusOrder.map((s) => (
              <button
                key={s}
                onClick={() => updateStatus(project.id, s)}
                disabled={project.status === s}
                className={`text-xs px-3 py-1.5 rounded-lg font-body transition-all ${
                  project.status === s
                    ? "neon-button cursor-default"
                    : "neon-button-outline opacity-60 hover:opacity-100"
                }`}
              >
                {s.replace("_", " ")}
              </button>
            ))}

            <div className="flex-1" />

            {/* Assignment */}
            {!project.assigned_to ? (
              <>
                <button
                  onClick={() => autoAssign(project)}
                  className="neon-button px-3 py-1.5 rounded-lg text-xs flex items-center gap-1"
                >
                  <Zap size={12} /> Auto-Assign
                </button>
                <button
                  onClick={() => setAssigningId(assigningId === project.id ? null : project.id)}
                  className="neon-button-outline px-3 py-1.5 rounded-lg text-xs flex items-center gap-1"
                >
                  <UserPlus size={12} /> Manual
                </button>
              </>
            ) : null}
          </div>

          {assigningId === project.id && (
            <div className="mt-3 flex flex-wrap gap-2">
              {teamMembers.filter((m) => m.is_available).map((m) => (
                <button
                  key={m.id}
                  onClick={() => assignMember(project.id, m.id)}
                  className="neon-button-outline px-3 py-1.5 rounded-lg text-xs"
                >
                  {m.name} ({m.role.replace("_", " ")}) ⭐{Number(m.rating ?? 5).toFixed(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectWorkflow;
