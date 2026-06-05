import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";

const WORKER_URL = "https://xena-worker.xaninxz.workers.dev";

export default function XenaChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey! I'm XENA ✦ Ask me anything about XANIN XZ — services, pricing, or just say hi 👋" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAction = async (action) => {
    if (action.type === "navigate") {
      navigate(`/${action.page}`);
      setOpen(false);
    } else if (action.type === "whatsapp") {
      window.open("https://wa.me/8801352192471", "_blank");
    } else if (action.type === "openPackages") {
      navigate("/services");
      setOpen(false);
    } else if (action.type === "discord_lead") {
      await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "discord_lead",
          name: action.name,
          contact: action.contact,
          message: "Visitor requested contact via XENA",
        }),
      });
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await res.json();
      const reply = data.reply;

      try {
        const action = JSON.parse(reply);
        if (action.type) {
          await handleAction(action);
          const actionMessages = {
            navigate: `Taking you to the ${action.page} page ✦`,
            whatsapp: "Opening WhatsApp for you! 💬",
            openPackages: "Opening our packages! 📦",
            discord_lead: "Done! Master Kaizo will reach out to you soon 🙌",
          };
          setMessages(prev => [...prev, {
            role: "assistant",
            content: actionMessages[action.type] || reply
          }]);
        }
      } catch {
        setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Something went wrong. Try again? 😅"
      }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#030303] border border-[#6c63ff]/40 hover:border-[#6c63ff]/80 text-[#6c63ff] shadow-lg shadow-[#6c63ff]/10 hover:shadow-[#6c63ff]/20 flex items-center justify-center transition-all duration-300"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <X size={16} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                <path d="M9 10l-2 2 2 2M15 10l2 2-2 2M11 8l-1 8"/>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
            className="fixed bottom-24 right-6 z-50 w-[320px] sm:w-[360px] bg-[#030303] border border-white/[0.06] rounded-3xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#6c63ff]/10 border border-[#6c63ff]/20 flex items-center justify-center text-[#6c63ff]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  <path d="M9 10l-2 2 2 2M15 10l2 2-2 2M11 8l-1 8"/>
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-semibold tracking-wide">XENA</p>
                <p className="text-white/20 text-[10px] uppercase tracking-widest">XANIN XZ Assistant</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6c63ff] animate-pulse"></span>
                <span className="text-white/20 text-[10px] uppercase tracking-widest">online</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[300px] scrollbar-none">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#6c63ff] text-white rounded-br-sm"
                      : "bg-white/[0.04] border border-white/[0.06] text-white/60 rounded-bl-sm"
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white/[0.04] border border-white/[0.06] px-3.5 py-3 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1 items-center">
                      <span className="w-1 h-1 rounded-full bg-[#6c63ff]/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1 h-1 rounded-full bg-[#6c63ff]/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1 h-1 rounded-full bg-[#6c63ff]/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="px-4 pb-3 flex flex-wrap gap-2">
                {["View Pricing", "Premade Sites", "Contact Kaizo"].map((label) => (
                  <button
                    key={label}
                    onClick={async () => {
                      const userMsg = { role: "user", content: label };
                      const updatedMessages = [...messages, userMsg];
                      setMessages(updatedMessages);
                      setLoading(true);
                      try {
                        const res = await fetch(WORKER_URL, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ messages: updatedMessages }),
                        });
                        const data = await res.json();
                        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
                      } catch {
                        setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Try again? 😅" }]);
                      }
                      setLoading(false);
                    }}
                    className="text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border border-[#6c63ff]/20 text-[#6c63ff]/60 hover:border-[#6c63ff]/50 hover:text-[#6c63ff] transition-all duration-200"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-white/[0.06] flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask XENA anything..."
                className="flex-1 bg-white/[0.03] text-white/70 placeholder-white/20 text-sm rounded-xl px-3.5 py-2 outline-none border border-white/[0.06] focus:border-[#6c63ff]/40 transition-colors"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="w-9 h-9 rounded-xl bg-[#6c63ff]/10 hover:bg-[#6c63ff]/20 border border-[#6c63ff]/20 hover:border-[#6c63ff]/40 disabled:opacity-30 text-[#6c63ff] flex items-center justify-center transition-all"
              >
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}