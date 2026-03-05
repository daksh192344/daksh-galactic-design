import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Star, Trash2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type TeamMember = Database["public"]["Tables"]["team_members"]["Row"] & { user_id?: string | null };
type TeamRole = Database["public"]["Enums"]["team_role"];

const roles: TeamRole[] = ["developer", "designer", "cold_caller", "manager"];

const TeamManagement = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<TeamRole>("developer");
  const [newEmail, setNewEmail] = useState("");

  // Credential creation state
  const [credentialMemberId, setCredentialMemberId] = useState<string | null>(null);
  const [credEmail, setCredEmail] = useState("");
  const [credPassword, setCredPassword] = useState("");
  const [creatingCred, setCreatingCred] = useState(false);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("rating", { ascending: false });

    if (!error) setMembers((data as TeamMember[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    const { error } = await supabase.from("team_members").insert({
      name: newName.trim(),
      role: newRole,
      email: newEmail.trim() || null,
    });
    if (error) {
      toast.error("Failed to add member");
    } else {
      toast.success("Team member added");
      setNewName("");
      setNewEmail("");
      setShowForm(false);
      fetchMembers();
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("team_members").delete().eq("id", id);
    toast.success("Member removed");
    fetchMembers();
  };

  const toggleAvailability = async (member: TeamMember) => {
    await supabase.from("team_members").update({ is_available: !member.is_available }).eq("id", member.id);
    fetchMembers();
  };

  const handleCreateCredentials = async () => {
    if (!credEmail.trim() || !credPassword.trim() || !credentialMemberId) return;
    if (credPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setCreatingCred(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("create-team-member", {
        body: {
          email: credEmail.trim(),
          password: credPassword,
          teamMemberId: credentialMemberId,
        },
      });

      if (res.error || res.data?.error) {
        toast.error(res.data?.error || res.error?.message || "Failed to create credentials");
      } else {
        toast.success("Login credentials created successfully!");
        setCredentialMemberId(null);
        setCredEmail("");
        setCredPassword("");
        fetchMembers();
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
    setCreatingCred(false);
  };

  if (loading) {
    return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="glass-card rounded-xl p-6 animate-pulse h-24" />)}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground font-body">{members.length} team members</p>
        <button onClick={() => setShowForm(!showForm)} className="neon-button px-4 py-2 rounded-lg text-xs flex items-center gap-1">
          <Plus size={14} /> Add Member
        </button>
      </div>

      {showForm && (
        <div className="glass-card neon-border rounded-xl p-5 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Name"
              className="bg-secondary/50 border border-border/30 rounded-xl px-4 py-2.5 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as TeamRole)}
              className="bg-secondary/50 border border-border/30 rounded-xl px-4 py-2.5 text-sm text-foreground font-body focus:outline-none focus:border-primary/50"
            >
              {roles.map((r) => (
                <option key={r} value={r}>{r.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
              ))}
            </select>
            <input
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Email (optional)"
              className="bg-secondary/50 border border-border/30 rounded-xl px-4 py-2.5 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
          </div>
          <button onClick={handleAdd} className="neon-button px-6 py-2 rounded-lg text-xs">Save</button>
        </div>
      )}

      {/* Credential creation modal */}
      {credentialMemberId && (
        <div className="glass-card neon-border rounded-xl p-5 mb-6">
          <h4 className="font-display text-sm font-bold mb-3 flex items-center gap-2">
            <KeyRound size={16} className="text-primary" />
            Create Login Credentials
          </h4>
          <p className="text-xs text-muted-foreground font-body mb-3">
            For: {members.find(m => m.id === credentialMemberId)?.name}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <input
              value={credEmail}
              onChange={(e) => setCredEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="bg-secondary/50 border border-border/30 rounded-xl px-4 py-2.5 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
            <input
              value={credPassword}
              onChange={(e) => setCredPassword(e.target.value)}
              placeholder="Password (min 6 chars)"
              type="text"
              className="bg-secondary/50 border border-border/30 rounded-xl px-4 py-2.5 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreateCredentials}
              disabled={creatingCred}
              className="neon-button px-6 py-2 rounded-lg text-xs disabled:opacity-50"
            >
              {creatingCred ? "Creating..." : "Create Login"}
            </button>
            <button
              onClick={() => { setCredentialMemberId(null); setCredEmail(""); setCredPassword(""); }}
              className="neon-button-outline px-4 py-2 rounded-lg text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {members.map((m) => (
          <div key={m.id} className="glass-card neon-border rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-display text-primary text-sm font-bold">
                {m.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-display text-sm font-semibold text-foreground">{m.name}</h4>
                <p className="text-xs text-muted-foreground font-body capitalize">{m.role.replace("_", " ")}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="flex items-center gap-1 text-xs text-primary font-body">
                  <Star size={12} className="fill-primary" /> {Number(m.rating ?? 5).toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground font-body">{m.projects_completed ?? 0} projects</p>
              </div>
              {!m.user_id && (
                <button
                  onClick={() => { setCredentialMemberId(m.id); setCredEmail(m.email || ""); }}
                  className="neon-button-outline px-3 py-1.5 rounded-lg text-xs flex items-center gap-1"
                  title="Create login credentials"
                >
                  <KeyRound size={12} /> Credentials
                </button>
              )}
              {m.user_id && (
                <span className="text-xs text-green-400 font-body">Has Login</span>
              )}
              <button
                onClick={() => toggleAvailability(m)}
                className={`text-xs px-3 py-1 rounded-full font-body ${
                  m.is_available ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                }`}
              >
                {m.is_available ? "Available" : "Busy"}
              </button>
              <button onClick={() => handleDelete(m.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamManagement;
