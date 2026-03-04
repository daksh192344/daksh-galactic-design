import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];

const PerformanceRatings = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingMemberId, setRatingMemberId] = useState<string | null>(null);
  const [newRating, setNewRating] = useState(5);

  const fetchMembers = async () => {
    const { data } = await supabase
      .from("team_members")
      .select("*")
      .order("rating", { ascending: false });
    setMembers(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, []);

  const submitRating = async (member: TeamMember) => {
    const totalRatings = (member.total_ratings ?? 0) + 1;
    const currentRating = Number(member.rating ?? 5);
    const avgRating = ((currentRating * (totalRatings - 1)) + newRating) / totalRatings;
    const clampedRating = Math.min(5, Math.max(0, Number(avgRating.toFixed(1))));

    await supabase.from("team_members").update({
      rating: clampedRating,
      total_ratings: totalRatings,
    }).eq("id", member.id);

    toast.success(`Rating updated for ${member.name}`);
    setRatingMemberId(null);
    setNewRating(5);
    fetchMembers();
  };

  if (loading) {
    return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="glass-card rounded-xl p-6 animate-pulse h-20" />)}</div>;
  }

  return (
    <div className="space-y-4">
      {members.map((m, index) => (
        <div key={m.id} className="glass-card neon-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-display text-primary text-lg font-bold">
              #{index + 1}
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-foreground">{m.name}</h4>
              <p className="text-xs text-muted-foreground font-body capitalize">{m.role.replace("_", " ")} • {m.projects_completed ?? 0} projects</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.round(Number(m.rating ?? 5)) ? "fill-primary text-primary" : "text-muted-foreground/30"}
                />
              ))}
              <span className="ml-1 font-display text-sm text-primary">{Number(m.rating ?? 5).toFixed(1)}</span>
            </div>

            {ratingMemberId === m.id ? (
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="w-20 accent-[hsl(180,100%,50%)]"
                />
                <span className="text-xs text-primary font-display">{newRating}</span>
                <button
                  onClick={() => submitRating(m)}
                  className="neon-button px-3 py-1 rounded-lg text-xs"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setRatingMemberId(m.id); setNewRating(5); }}
                className="neon-button-outline px-3 py-1 rounded-lg text-xs"
              >
                Rate
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PerformanceRatings;
