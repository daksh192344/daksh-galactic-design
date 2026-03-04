import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  role: "bot" | "user";
  content: string;
  options?: string[];
  inputType?: "text" | "email" | "tel" | "textarea";
  inputPlaceholder?: string;
}

interface CollectedData {
  business_name?: string;
  industry?: string;
  has_logo?: boolean;
  has_content?: string;
  pages?: string;
  priority?: string;
  social_links?: { instagram?: string; facebook?: string; twitter?: string };
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  preferred_contact_time?: string;
}

const steps: Omit<Message, "id">[] = [
  {
    role: "bot",
    content: "👋 Hi! I'm the Daksh.dev AI assistant. I'll help you get started with your dream website. Let's begin!\n\nWhat is your **business name**?",
    inputType: "text",
    inputPlaceholder: "Enter your business name...",
  },
  {
    role: "bot",
    content: "Which **industry** is your business in?",
    options: ["Real Estate", "Restaurant", "Gym & Fitness", "Startup", "Portfolio", "E-Commerce", "Education", "Other"],
  },
  {
    role: "bot",
    content: "Do you already have a **logo** for your business?",
    options: ["Yes", "No"],
  },
  {
    role: "bot",
    content: "Do you have **content** (text, images) ready for the website?",
    options: ["Yes", "No", "Need help writing"],
  },
  {
    role: "bot",
    content: "How many **pages** do you need?",
    options: ["3 Pages", "5 Pages", "10 Pages"],
  },
  {
    role: "bot",
    content: "What is more important for you?",
    options: ["⚡ Faster Delivery", "🎨 Higher Design Quality"],
  },
  {
    role: "bot",
    content: "Share your **social media links** (Instagram, Facebook, etc.)\n\nYou can type them separated by commas, or type 'skip' if you don't have any.",
    inputType: "textarea",
    inputPlaceholder: "e.g. instagram.com/mybusiness, facebook.com/mybusiness",
  },
  {
    role: "bot",
    content: "Great! Now let's get your **contact details**.\n\nWhat is your full name?",
    inputType: "text",
    inputPlaceholder: "Enter your full name...",
  },
  {
    role: "bot",
    content: "What is your **email address**?",
    inputType: "email",
    inputPlaceholder: "Enter your email...",
  },
  {
    role: "bot",
    content: "What is your **phone number**?",
    inputType: "tel",
    inputPlaceholder: "Enter your phone number...",
  },
  {
    role: "bot",
    content: "When is the **best time** to contact you?",
    options: ["Morning (9-12)", "Afternoon (12-5)", "Evening (5-9)", "Anytime"],
  },
];

interface RequirementCollectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const RequirementCollector = ({ isOpen, onClose }: RequirementCollectorProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [collectedData, setCollectedData] = useState<CollectedData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Start the conversation
      setTimeout(() => {
        addBotMessage(0);
      }, 500);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentStep]);

  const addBotMessage = (stepIndex: number) => {
    const step = steps[stepIndex];
    if (!step) return;
    setMessages((prev) => [
      ...prev,
      { ...step, id: `bot-${stepIndex}-${Date.now()}` },
    ]);
  };

  const handleUserResponse = (response: string) => {
    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: `user-${currentStep}-${Date.now()}`, role: "user", content: response },
    ]);

    // Save data based on current step
    const newData = { ...collectedData };
    switch (currentStep) {
      case 0: newData.business_name = response; break;
      case 1: newData.industry = response; break;
      case 2: newData.has_logo = response === "Yes"; break;
      case 3: newData.has_content = response.toLowerCase().includes("yes") ? "yes" : response.toLowerCase().includes("help") ? "need_help" : "no"; break;
      case 4: newData.pages = response; break;
      case 5: newData.priority = response.includes("Faster") ? "fast_delivery" : "high_quality"; break;
      case 6: {
        if (response.toLowerCase() !== "skip") {
          const links = response.split(",").map((l) => l.trim());
          newData.social_links = {};
          links.forEach((link) => {
            if (link.includes("instagram")) newData.social_links!.instagram = link;
            else if (link.includes("facebook")) newData.social_links!.facebook = link;
            else if (link.includes("twitter") || link.includes("x.com")) newData.social_links!.twitter = link;
          });
        }
        break;
      }
      case 7: newData.client_name = response; break;
      case 8: newData.client_email = response; break;
      case 9: newData.client_phone = response; break;
      case 10: newData.preferred_contact_time = response; break;
    }
    setCollectedData(newData);

    const nextStep = currentStep + 1;

    if (nextStep >= steps.length) {
      // All questions answered, submit
      submitData(newData);
    } else {
      setCurrentStep(nextStep);
      setInputValue("");
      setTimeout(() => addBotMessage(nextStep), 600);
    }
  };

  const submitData = async (data: CollectedData) => {
    setIsSubmitting(true);

    // Show summary
    const summary = `✅ **Project Summary**\n\n📋 **Client:** ${data.client_name}\n🏢 **Business:** ${data.business_name}\n🏭 **Industry:** ${data.industry}\n📄 **Pages:** ${data.pages}\n🎨 **Logo:** ${data.has_logo ? "Yes" : "No"}\n📝 **Content:** ${data.has_content}\n⚡ **Priority:** ${data.priority === "fast_delivery" ? "Fast Delivery" : "High Quality"}\n📧 **Email:** ${data.client_email}\n📱 **Phone:** ${data.client_phone}\n⏰ **Best Time:** ${data.preferred_contact_time}`;

    setMessages((prev) => [
      ...prev,
      { id: `bot-summary-${Date.now()}`, role: "bot", content: summary },
    ]);

    try {
      const { error } = await supabase.from("project_requests").insert({
        business_name: data.business_name!,
        industry: data.industry!,
        has_logo: data.has_logo ?? false,
        has_content: data.has_content ?? "no",
        pages: data.pages!,
        priority: data.priority!,
        social_links: data.social_links ?? {},
        client_name: data.client_name!,
        client_email: data.client_email!,
        client_phone: data.client_phone!,
        preferred_contact_time: data.preferred_contact_time,
      });

      if (error) throw error;

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-final-${Date.now()}`,
            role: "bot",
            content: "🎉 **Your project request has been submitted!**\n\nOur team will review your requirements and get back to you within 24 hours. Thank you for choosing Daksh.dev!",
          },
        ]);
        setIsComplete(true);
        setIsSubmitting(false);
      }, 800);
    } catch (err) {
      console.error("Submit error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-error-${Date.now()}`,
          role: "bot",
          content: "❌ Something went wrong while submitting. Please try again or contact us directly via WhatsApp.",
        },
      ]);
      setIsSubmitting(false);
    }
  };

  const handleSubmitInput = () => {
    if (!inputValue.trim()) return;
    handleUserResponse(inputValue.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitInput();
    }
  };

  const resetChat = () => {
    setMessages([]);
    setCurrentStep(0);
    setInputValue("");
    setCollectedData({});
    setIsComplete(false);
    setIsSubmitting(false);
    onClose();
  };

  const currentStepData = steps[currentStep];
  const showInput = currentStepData && !currentStepData.options && !isComplete && !isSubmitting;
  const showOptions = currentStepData?.options && messages.length > 0 && messages[messages.length - 1]?.role === "bot" && !isComplete && !isSubmitting;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "hsla(180, 20%, 2%, 0.85)" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25 }}
            className="glass-card neon-border rounded-2xl w-full max-w-lg h-[85vh] max-h-[700px] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold text-foreground">Daksh.dev Assistant</h3>
                  <p className="text-xs text-primary">Online</p>
                </div>
              </div>
              <button onClick={resetChat} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "bot" && (
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center mt-1">
                        <Bot size={14} className="text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm font-body whitespace-pre-line ${
                        msg.role === "user"
                          ? "neon-button rounded-br-md"
                          : "glass-card border border-border/30 text-foreground rounded-bl-md"
                      }`}
                    >
                      {msg.content.split("**").map((part, i) =>
                        i % 2 === 1 ? (
                          <strong key={i} className="font-semibold">{part}</strong>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-7 h-7 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center mt-1">
                        <User size={14} className="text-muted-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isSubmitting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2 items-center"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
                    <Bot size={14} className="text-primary" />
                  </div>
                  <div className="glass-card border border-border/30 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}

              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex justify-center pt-4"
                >
                  <CheckCircle2 size={48} className="text-primary" />
                </motion.div>
              )}
            </div>

            {/* Options */}
            {showOptions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 pb-2 flex flex-wrap gap-2"
              >
                {currentStepData.options!.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleUserResponse(opt)}
                    className="neon-button-outline px-4 py-2 rounded-xl text-xs font-body hover:scale-105 transition-transform"
                  >
                    {opt}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Text Input */}
            {showInput && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border-t border-border/30"
              >
                <div className="flex gap-2 items-end">
                  {currentStepData.inputType === "textarea" ? (
                    <textarea
                      ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={currentStepData.inputPlaceholder}
                      rows={2}
                      className="flex-1 bg-secondary/50 border border-border/30 rounded-xl px-4 py-3 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
                    />
                  ) : (
                    <input
                      ref={inputRef as React.RefObject<HTMLInputElement>}
                      type={currentStepData.inputType || "text"}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={currentStepData.inputPlaceholder}
                      className="flex-1 bg-secondary/50 border border-border/30 rounded-xl px-4 py-3 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                    />
                  )}
                  <button
                    onClick={handleSubmitInput}
                    disabled={!inputValue.trim()}
                    className="neon-button w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-40 flex-shrink-0"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RequirementCollector;
