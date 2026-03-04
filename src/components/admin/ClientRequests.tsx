import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, Mail, Phone, Clock, Building2 } from "lucide-react";
import { toast } from "sonner";

interface ProjectRequest {
  id: string;
  business_name: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  industry: string;
  pages: string;
  priority: string;
  has_logo: boolean | null;
  has_content: string | null;
  preferred_contact_time: string | null;
  status: string | null;
  created_at: string;
}

const ClientRequests = () => {
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("project_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error("Failed to load requests");
    } else {
      setRequests(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleApprove = async (req: ProjectRequest) => {
    // Create a project from this request
    const { error: projectError } = await supabase.from("projects").insert({
      request_id: req.id,
      client_name: req.client_name,
      business_name: req.business_name,
      industry: req.industry,
      pages: req.pages,
      priority: req.priority,
      status: "pending",
    });

    if (projectError) {
      toast.error("Failed to create project");
      return;
    }

    // Update request status
    await supabase.from("project_requests").update({ status: "approved" }).eq("id", req.id);
    toast.success(`Project approved for ${req.client_name}`);
    fetchRequests();
  };

  const handleReject = async (req: ProjectRequest) => {
    await supabase.from("project_requests").update({ status: "rejected" }).eq("id", req.id);
    toast.success(`Request rejected`);
    fetchRequests();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-card rounded-xl p-6 animate-pulse h-40" />
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="glass-card neon-border rounded-xl p-12 text-center">
        <p className="text-muted-foreground font-body">No client requests yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <div key={req.id} className="glass-card neon-border rounded-xl p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-display font-semibold text-foreground">{req.client_name}</h3>
              <p className="text-xs text-primary font-body flex items-center gap-1">
                <Building2 size={12} /> {req.business_name} — {req.industry}
              </p>
            </div>
            <span
              className={`text-xs font-display px-3 py-1 rounded-full ${
                req.status === "approved"
                  ? "bg-primary/20 text-primary"
                  : req.status === "rejected"
                  ? "bg-destructive/20 text-destructive"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {req.status ?? "new"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-xs font-body text-muted-foreground">
            <div>📄 {req.pages}</div>
            <div>⚡ {req.priority === "fast_delivery" ? "Fast Delivery" : req.priority === "high_quality" ? "High Quality" : req.priority}</div>
            <div>🎨 Logo: {req.has_logo ? "Yes" : "No"}</div>
            <div>📝 Content: {req.has_content ?? "No"}</div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs font-body text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Mail size={12} /> {req.client_email}</span>
            <span className="flex items-center gap-1"><Phone size={12} /> {req.client_phone}</span>
            {req.preferred_contact_time && (
              <span className="flex items-center gap-1"><Clock size={12} /> {req.preferred_contact_time}</span>
            )}
          </div>

          {(!req.status || req.status === "new") && (
            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(req)}
                className="neon-button px-4 py-2 rounded-lg text-xs flex items-center gap-1"
              >
                <Check size={14} /> Approve
              </button>
              <button
                onClick={() => handleReject(req)}
                className="neon-button-outline px-4 py-2 rounded-lg text-xs flex items-center gap-1 hover:border-destructive hover:text-destructive"
              >
                <X size={14} /> Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ClientRequests;
