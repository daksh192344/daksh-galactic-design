import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Eye, X, MapPin, Mail, Phone, Link as LinkIcon, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  role_specific_answers: Record<string, string>;
  portfolio_links: string[];
  status: string;
  created_at: string;
}

const roleLabelMap: Record<string, string> = {
  cold_caller: "Cold Caller",
  social_media_marketer: "Social Media Marketer",
  nocode_builder: "No-Code Builder",
  web_developer: "Web Developer",
  designer: "Designer",
  digital_marketer: "Digital Marketer",
};

const TeamApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from("team_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load applications");
      console.error(error);
    } else {
      setApplications((data || []) as Application[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    const app = applications.find((a) => a.id === id);
    if (!app) return;

    try {
      const { error } = await supabase
        .from("team_applications")
        .update({ status })
        .eq("id", id);

      if (error) {
        console.error("Update status error:", error);
        toast.error("Failed to update status: " + error.message);
        return;
      }

      if (status === "approved") {
        const roleMap: Record<string, "cold_caller" | "developer" | "designer" | "manager"> = {
          cold_caller: "cold_caller",
          web_developer: "developer",
          designer: "designer",
          nocode_builder: "developer",
          social_media_marketer: "manager",
          digital_marketer: "manager",
        };

        const teamRole = roleMap[app.role] || "developer";
        const { error: insertError } = await supabase.from("team_members").insert([{
          name: app.full_name,
          email: app.email,
          role: teamRole,
        }]);

        if (insertError) {
          console.error("Insert team member error:", insertError);
          toast.error("Status updated but failed to add team member: " + insertError.message);
        } else {
          toast.success(`${app.full_name} has been added to the team!`);
        }
      } else {
        toast.success("Application rejected");
      }

      await fetchApplications();
      setSelectedApp(null);
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred");
    }
  };

  const statusColor = (status: string) => {
    if (status === "approved") return "text-green-400";
    if (status === "rejected") return "text-red-400";
    return "text-yellow-400";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-lg font-bold">Team Applications</h3>
        <span className="text-xs text-muted-foreground font-body">{applications.length} total</span>
      </div>

      {applications.length === 0 ? (
        <div className="glass-card rounded-xl p-8 text-center">
          <Briefcase size={40} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-body text-sm">No applications yet</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {applications.map((app) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-display text-sm font-semibold truncate">{app.full_name}</h4>
                  <span className={`text-xs font-body capitalize ${statusColor(app.status)}`}>
                    {app.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground font-body">
                  <span className="flex items-center gap-1">
                    <Briefcase size={12} /> {roleLabelMap[app.role] || app.role}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {app.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail size={12} /> {app.email}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => setSelectedApp(app)}
                  className="neon-button-outline px-3 py-2 rounded-lg text-xs flex items-center gap-1"
                >
                  <Eye size={14} /> View
                </button>
                {app.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(app.id, "approved")}
                      className="neon-button px-3 py-2 rounded-lg text-xs flex items-center gap-1"
                    >
                      <CheckCircle size={14} /> Approve
                    </button>
                    <button
                      onClick={() => updateStatus(app.id, "rejected")}
                      className="px-3 py-2 rounded-lg text-xs flex items-center gap-1 bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "hsla(180, 20%, 2%, 0.85)" }}
            onClick={() => setSelectedApp(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card neon-border rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-bold">{selectedApp.full_name}</h3>
                <button onClick={() => setSelectedApp(null)} className="text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 text-sm font-body">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-muted-foreground">Role</span>
                    <p className="text-primary font-display text-xs">{roleLabelMap[selectedApp.role] || selectedApp.role}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Status</span>
                    <p className={`capitalize font-display text-xs ${statusColor(selectedApp.status)}`}>{selectedApp.status}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Mail size={10} /> Email</span>
                    <p>{selectedApp.email}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Phone size={10} /> Phone</span>
                    <p>{selectedApp.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin size={10} /> Location</span>
                    <p>{selectedApp.location}</p>
                  </div>
                </div>

                {/* Role-specific answers */}
                {selectedApp.role_specific_answers && Object.keys(selectedApp.role_specific_answers).length > 0 && (
                  <div>
                    <h4 className="font-display text-xs font-semibold text-primary mb-2 uppercase tracking-wider">Role Questions</h4>
                    <div className="space-y-2">
                      {Object.entries(selectedApp.role_specific_answers).map(([q, a]) => (
                        <div key={q} className="glass-card rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1">{q}</p>
                          <p className="text-sm">{a as string}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Portfolio Links */}
                {selectedApp.portfolio_links && (selectedApp.portfolio_links as string[]).length > 0 && (
                  <div>
                    <h4 className="font-display text-xs font-semibold text-primary mb-2 uppercase tracking-wider">Portfolio Links</h4>
                    <div className="space-y-1">
                      {(selectedApp.portfolio_links as string[]).map((link, i) => (
                        <a
                          key={i}
                          href={link.startsWith("http") ? link : `https://${link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary hover:underline text-xs"
                        >
                          <LinkIcon size={12} /> {link}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {selectedApp.status === "pending" && (
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => updateStatus(selectedApp.id, "approved")}
                      className="flex-1 neon-button px-4 py-3 rounded-xl text-xs flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={14} /> Approve
                    </button>
                    <button
                      onClick={() => updateStatus(selectedApp.id, "rejected")}
                      className="flex-1 px-4 py-3 rounded-xl text-xs flex items-center justify-center gap-2 bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamApplications;
