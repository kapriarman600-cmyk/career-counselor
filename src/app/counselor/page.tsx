"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User as UserIcon } from "lucide-react";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function CounselorChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hello! I am your AI Career Counselor. Tell me a little about yourself—are you currently a student or a working professional?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    const updatedMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages.map(m => ({ role: m.role, content: m.content })) })
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessages(prev => [...prev, { role: "ai", content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: "ai", content: "I'm having trouble connecting right now. Please try again later." }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", content: "Network error occurred. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 80px)", padding: "2rem" }}>
      <div className="container" style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: "800px" }}>
        
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <h2>AI Career Counselor</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Personalized guidance powered by AI</p>
        </div>

        <div className="glass-panel" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", padding: 0 }}>
          
          <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ 
                display: "flex", 
                gap: "1rem", 
                alignItems: "flex-start",
                flexDirection: msg.role === "user" ? "row-reverse" : "row"
              }}>
                <div style={{ 
                  width: "40px", height: "40px", borderRadius: "50%", 
                  background: msg.role === "ai" ? "rgba(79, 70, 229, 0.2)" : "rgba(56, 189, 248, 0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  {msg.role === "ai" ? <Bot size={20} color="var(--primary)" /> : <UserIcon size={20} color="var(--accent)" />}
                </div>
                
                <div style={{ 
                  background: msg.role === "user" ? "var(--primary)" : "rgba(255, 255, 255, 0.05)",
                  padding: "1rem", 
                  borderRadius: "12px",
                  borderTopRightRadius: msg.role === "user" ? 0 : "12px",
                  borderTopLeftRadius: msg.role === "ai" ? 0 : "12px",
                  maxWidth: "80%",
                  lineHeight: "1.5"
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(79, 70, 229, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Bot size={20} color="var(--primary)" />
                </div>
                <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "1rem", borderRadius: "12px", borderTopLeftRadius: 0 }}>
                  <span style={{ display: "inline-block", width: "8px", height: "8px", background: "var(--text-secondary)", borderRadius: "50%", margin: "0 2px", animation: "pulse 1.5s infinite" }}></span>
                  <span style={{ display: "inline-block", width: "8px", height: "8px", background: "var(--text-secondary)", borderRadius: "50%", margin: "0 2px", animation: "pulse 1.5s infinite 0.2s" }}></span>
                  <span style={{ display: "inline-block", width: "8px", height: "8px", background: "var(--text-secondary)", borderRadius: "50%", margin: "0 2px", animation: "pulse 1.5s infinite 0.4s" }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: "1rem", borderTop: "1px solid rgba(255, 255, 255, 0.1)", background: "rgba(15, 23, 42, 0.5)" }}>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message here..."
                style={{ 
                  flex: 1, padding: "1rem", borderRadius: "8px", background: "rgba(0,0,0,0.2)", 
                  border: "1px solid rgba(255,255,255,0.1)", color: "white", outline: "none"
                }}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="btn-primary" 
                style={{ padding: "0 1.5rem" }}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}} />
    </div>
  );
}
