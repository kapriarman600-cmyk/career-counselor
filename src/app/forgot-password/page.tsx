"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      setMessage(data.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-left-content">
          <h1 style={{ fontSize: "3.5rem", marginBottom: "1rem", lineHeight: 1.1, letterSpacing: "-0.02em" }}>Secure Account<br/><span className="text-gradient">Recovery</span></h1>
          <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: "2.5rem", maxWidth: "400px" }}>Regain access to your CareerVerse AI account quickly and securely.</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-wrapper">
          <div className="glass-panel">
        
        <div style={{ marginBottom: "1.5rem" }}>
          <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            <ArrowLeft size={16}/> Back to Login
          </Link>
        </div>

        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Reset Password</h2>
          <p style={{ color: "var(--text-secondary)" }}>Enter your email and we'll send you recovery link</p>
        </div>

        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", color: "#fca5a5", padding: "0.75rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid var(--success)", color: "#a7f3d0", padding: "0.75rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
            {message}
          </div>
        )}

        {!message && (
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: "2rem" }}>
              <label className="label">Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={18} color="var(--text-secondary)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field" 
                  style={{ paddingLeft: "2.5rem" }} 
                  placeholder="john@example.com" 
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%", padding: "1rem" }} disabled={loading}>
              {loading ? "Sending..." : <><Send size={18}/> Send Reset Link</>}
            </button>
          </form>
        )}

          </div>
        </div>
      </div>
    </div>
  );
}
