import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, CheckCircle2, Users, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type RoleType = "" | "cold_caller" | "social_media_marketer" | "nocode_builder" | "web_developer" | "designer" | "digital_marketer";

const roleOptions: { value: RoleType; label: string }[] = [
  { value: "cold_caller", label: "Cold Caller" },
  { value: "social_media_marketer", label: "Social Media Marketer" },
  { value: "nocode_builder", label: "No-Code Website Builder" },
  { value: "web_developer", label: "Web Developer" },
  { value: "designer", label: "Designer" },
  { value: "digital_marketer", label: "Digital Marketer" },
];

const roleQuestions: Record<string, { label: string; placeholder: string; type?: string }[]> = {
  cold_caller: [
    { label: "Do you have sales experience?", placeholder: "e.g. Yes, 2 years in B2B sales..." },
    { label: "How many calls can you make per day?", placeholder: "e.g. 50-100 calls" },
  ],
  social_media_marketer: [
    { label: "Which platforms do you manage?", placeholder: "e.g. Instagram, YouTube, TikTok" },
    { label: "Share links of accounts you managed", placeholder: "e.g. instagram.com/account1, ..." },
  ],
  nocode_builder: [
    { label: "Which tools do you use?", placeholder: "e.g. Framer, Webflow, Lovable, Wix" },
    { label: "Share previous projects or website links", placeholder: "e.g. myproject.com, ..." },
  ],
  web_developer: [
    { label: "Programming languages used", placeholder: "e.g. JavaScript, Python, TypeScript" },
    { label: "GitHub profile", placeholder: "e.g. github.com/username" },
    { label: "Portfolio links", placeholder: "e.g. myportfolio.com" },
  ],
  designer: [
    { label: "Design tools you use", placeholder: "e.g. Figma, Adobe XD, Photoshop" },
    { label: "Portfolio or Dribbble/Behance link", placeholder: "e.g. dribbble.com/username" },
  ],
  digital_marketer: [
    { label: "Which areas of digital marketing?", placeholder: "e.g. SEO, PPC, Email Marketing" },
    { label: "Share case studies or results", placeholder: "e.g. Increased traffic by 200%..." },
  ],
};

const JoinTeam = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    role: "" as RoleType,
    roleAnswers: {} as Record<string, string>,
    portfolioLinks: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateRoleAnswer = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      roleAnswers: { ...prev.roleAnswers, [key]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone || !form.location || !form.role) {
      toast.error("Please fill all required fields");
      return;
    }
    setIsSubmitting(true);

    try {
      const portfolioLinks = form.portfolioLinks
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      const { error } = await supabase.from("team_applications").insert({
        full_name: form.fullName,
        email: form.email,
        phone: form.phone,
        location: form.location,
        role: form.role as any,
        role_specific_answers: form.roleAnswers,
        portfolio_links: portfolioLinks,
      });

      if (error) throw error;
      setIsSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentRoleQuestions = form.role ? roleQuestions[form.role] || [] : [];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card neon-border rounded-2xl p-8 sm:p-12 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <CheckCircle2 size={64} className="text-primary mx-auto mb-6" />
          </motion.div>
          <h2 className="font-display text-xl sm:text-2xl font-bold mb-3">Application Submitted!</h2>
          <p className="text-muted-foreground font-body text-sm mb-6">
            We'll review your application and get back to you within 48 hours. Thank you for your interest in joining Daksh.dev!
          </p>
          <Link to="/" className="neon-button px-6 py-3 rounded-xl text-sm inline-flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
        <div className="container flex items-center justify-between h-16 px-4">
          <Link to="/" className="font-display text-xl font-bold">
            <span className="neon-text">Daksh</span>
            <span className="text-foreground">.dev</span>
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors font-body flex items-center gap-2">
            <ArrowLeft size={16} /> Back
          </Link>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-4">
        <div className="container max-w-2xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 glass-card neon-border px-4 py-2 rounded-full mb-4">
              <Users size={16} className="text-primary" />
              <span className="text-xs font-display text-primary tracking-widest uppercase">Join Our Team</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-bold mb-3">
              Build the Future <span className="gradient-text">With Us</span>
            </h1>
            <p className="text-muted-foreground font-body text-sm sm:text-base max-w-lg mx-auto">
              We're looking for talented individuals to join our growing team. Apply below and let's create amazing websites together.
            </p>
          </motion.div>

          {/* Commission Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card neon-border rounded-xl p-4 mb-8 flex items-start gap-3"
          >
            <DollarSign size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm font-body text-foreground">
              <strong className="text-primary font-display">20% Commission</strong> — Team members who bring clients will receive 20% commission for each project.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Basic Info */}
            <div className="glass-card rounded-xl p-5 sm:p-6 space-y-4">
              <h3 className="font-display text-sm font-semibold text-primary tracking-wider uppercase mb-1">Basic Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-body text-muted-foreground mb-1.5 block">Full Name *</label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full bg-secondary/50 border border-border/30 rounded-xl px-4 py-3 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-body text-muted-foreground mb-1.5 block">Email Address *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="john@example.com"
                    required
                    className="w-full bg-secondary/50 border border-border/30 rounded-xl px-4 py-3 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-body text-muted-foreground mb-1.5 block">Phone Number *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+91 1234567890"
                    required
                    className="w-full bg-secondary/50 border border-border/30 rounded-xl px-4 py-3 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-body text-muted-foreground mb-1.5 block">Location (Country / City) *</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    placeholder="India / Delhi"
                    required
                    className="w-full bg-secondary/50 border border-border/30 rounded-xl px-4 py-3 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div className="glass-card rounded-xl p-5 sm:p-6 space-y-4">
              <h3 className="font-display text-sm font-semibold text-primary tracking-wider uppercase mb-1">Select Your Role</h3>
              <select
                value={form.role}
                onChange={(e) => {
                  updateField("role", e.target.value);
                  setForm((prev) => ({ ...prev, roleAnswers: {} }));
                }}
                required
                className="w-full bg-secondary/50 border border-border/30 rounded-xl px-4 py-3 text-sm text-foreground font-body focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
              >
                <option value="" disabled>Select the role you want to apply for</option>
                {roleOptions.map((r) => (
                  <option key={r.value} value={r.value} className="bg-card text-foreground">
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic Role Questions */}
            <AnimatePresence mode="wait">
              {currentRoleQuestions.length > 0 && (
                <motion.div
                  key={form.role}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card rounded-xl p-5 sm:p-6 space-y-4 overflow-hidden"
                >
                  <h3 className="font-display text-sm font-semibold text-primary tracking-wider uppercase mb-1">
                    Role-Specific Questions
                  </h3>
                  {currentRoleQuestions.map((q, i) => (
                    <div key={i}>
                      <label className="text-xs font-body text-muted-foreground mb-1.5 block">{q.label}</label>
                      <input
                        type="text"
                        value={form.roleAnswers[q.label] || ""}
                        onChange={(e) => updateRoleAnswer(q.label, e.target.value)}
                        placeholder={q.placeholder}
                        className="w-full bg-secondary/50 border border-border/30 rounded-xl px-4 py-3 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Portfolio Links */}
            <div className="glass-card rounded-xl p-5 sm:p-6 space-y-4">
              <h3 className="font-display text-sm font-semibold text-primary tracking-wider uppercase mb-1">Portfolio / Work Links</h3>
              <p className="text-xs text-muted-foreground font-body">Share links to your work (one per line) — websites, GitHub, Instagram reels, YouTube videos, etc.</p>
              <textarea
                value={form.portfolioLinks}
                onChange={(e) => updateField("portfolioLinks", e.target.value)}
                placeholder={"https://github.com/username\nhttps://myportfolio.com\nhttps://instagram.com/reels/..."}
                rows={4}
                className="w-full bg-secondary/50 border border-border/30 rounded-xl px-4 py-3 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full neon-button px-8 py-4 rounded-xl text-sm font-display flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={16} /> Submit Application
                </>
              )}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default JoinTeam;
