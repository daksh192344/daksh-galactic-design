import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, ExternalLink, Upload, X } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  video_type: string | null;
  thumbnail_url: string | null;
  created_at: string;
}

const PortfolioManager = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoType, setVideoType] = useState("youtube");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const fetchItems = async () => {
    const { data } = await supabase
      .from("portfolio_items")
      .select("*")
      .order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleThumbnailUpload = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const fileName = `thumb_${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("portfolio").upload(fileName, file, { contentType: file.type });
    if (error) {
      toast.error("Failed to upload thumbnail");
      return null;
    }
    const { data } = supabase.storage.from("portfolio").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);

    let finalThumbnail = thumbnailUrl;
    if (thumbnailFile) {
      setUploading(true);
      const url = await handleThumbnailUpload(thumbnailFile);
      setUploading(false);
      if (url) finalThumbnail = url;
    }

    const { error } = await supabase.from("portfolio_items").insert({
      title: title.trim(),
      description: description.trim() || null,
      video_url: videoUrl.trim() || null,
      video_type: videoType,
      thumbnail_url: finalThumbnail || null,
    });

    if (error) {
      toast.error("Failed to add portfolio item");
      setSaving(false);
      return;
    }

    toast.success("Portfolio item added!");
    setTitle("");
    setDescription("");
    setVideoUrl("");
    setVideoType("youtube");
    setThumbnailUrl("");
    setThumbnailFile(null);
    setShowForm(false);
    setSaving(false);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
      return;
    }
    toast.success("Deleted");
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold">Portfolio Items ({items.length})</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="neon-button px-4 py-2 rounded-lg text-xs flex items-center gap-2"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? "Cancel" : "Add Item"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card neon-border rounded-xl p-4 space-y-3">
          <div>
            <label className="text-xs text-muted-foreground font-body mb-1 block">Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-secondary/50 border border-border/30 rounded-lg px-3 py-2 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              placeholder="Project title"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-body mb-1 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-secondary/50 border border-border/30 rounded-lg px-3 py-2 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
              placeholder="Brief description of the project"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground font-body mb-1 block">Video Type</label>
              <select
                value={videoType}
                onChange={(e) => setVideoType(e.target.value)}
                className="w-full bg-secondary/50 border border-border/30 rounded-lg px-3 py-2 text-sm text-foreground font-body focus:outline-none focus:border-primary/50"
              >
                <option value="youtube">YouTube / YT Short</option>
                <option value="instagram">Instagram Reel</option>
                <option value="video">Direct Video URL</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-body mb-1 block">Video URL</label>
              <input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full bg-secondary/50 border border-border/30 rounded-lg px-3 py-2 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                placeholder="https://youtube.com/shorts/..."
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-body mb-1 block">Thumbnail</label>
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { setThumbnailFile(f); setThumbnailUrl(""); }
                }}
                className="flex-1 bg-secondary/50 border border-border/30 rounded-lg px-3 py-2 text-sm text-foreground font-body file:mr-2 file:bg-primary/20 file:border-0 file:text-primary file:text-xs file:rounded file:px-2 file:py-1"
              />
            </div>
            {!thumbnailFile && (
              <input
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                className="w-full mt-2 bg-secondary/50 border border-border/30 rounded-lg px-3 py-2 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                placeholder="Or paste thumbnail URL"
              />
            )}
          </div>
          <button
            type="submit"
            disabled={saving || uploading}
            className="neon-button px-4 py-2 rounded-lg text-xs flex items-center gap-2 disabled:opacity-50"
          >
            <Upload size={14} />
            {uploading ? "Uploading..." : saving ? "Saving..." : "Add Portfolio Item"}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="glass-card rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {item.thumbnail_url && (
                <img src={item.thumbnail_url} alt={item.title} className="w-16 h-10 object-cover rounded-lg flex-shrink-0" />
              )}
              <div className="min-w-0">
                <h4 className="font-display text-sm font-semibold truncate">{item.title}</h4>
                <p className="text-xs text-muted-foreground font-body truncate">{item.description || "No description"}</p>
                <div className="flex gap-2 mt-1">
                  {item.video_type && (
                    <span className="text-xs text-primary font-body capitalize">{item.video_type}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {item.video_url && (
                <a href={item.video_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <ExternalLink size={16} />
                </a>
              )}
              <button onClick={() => handleDelete(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="glass-card rounded-xl p-8 text-center">
            <p className="text-muted-foreground font-body text-sm">No portfolio items yet. Add your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioManager;
