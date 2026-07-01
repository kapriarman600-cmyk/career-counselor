"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid login credentials");
      }

      // Force full reload to update session state in layout navbar
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Google authentication failed");
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}>
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-left-content">
            <h1 style={{ fontSize: "3.5rem", marginBottom: "1rem", lineHeight: 1.1, letterSpacing: "-0.02em" }}>Welcome Back to<br/><span className="text-gradient">CareerVerse AI</span></h1>
            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: "2.5rem", maxWidth: "400px" }}>Log in to access your personalized career path, AI counselor, and mentorship programs.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ padding: "1.2rem", background: "var(--bg-card)", borderRadius: "16px", border: "1px solid var(--border-light)", display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(99, 102, 241, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                  <LogIn size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>Resume Planning</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>Pick up right where you left off on your career journey.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-form-wrapper">
            <div className="glass-panel">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Welcome Back</h2>
            <p style={{ color: "var(--text-secondary)" }}>Login to resume your path planning</p>
          </div>

          {error && (
            <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", color: "#fca5a5", padding: "0.75rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
             <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google Sign-In was unsuccessful. Try again.")}
                useOneTap
              />
          </div>
          
          <div style={{ display: "flex", alignItems: "center", margin: "1.5rem 0" }}>
            <div style={{ flex: 1, height: "1px", background: "var(--border)" }}></div>
            <span style={{ padding: "0 1rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>or login with email</span>
            <div style={{ flex: 1, height: "1px", background: "var(--border)" }}></div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={18} color="var(--text-secondary)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field" 
                  style={{ paddingLeft: "2.5rem" }} 
                  placeholder="john@example.com" 
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className="label" style={{ margin: 0 }}>Password</label>
                <Link href="/forgot-password" style={{ fontSize: "0.85rem", color: "var(--primary)" }}>
                  Forgot Password?
                </Link>
              </div>
              <div style={{ position: "relative", marginTop: "0.5rem" }}>
                <Lock size={18} color="var(--text-secondary)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field" 
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }} 
                  placeholder="••••••••" 
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", padding: 0 }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "1.5rem", padding: "1rem" }} disabled={loading}>
              {loading ? "Authenticating..." : <><LogIn size={18}/> Log In</>}
            </button>
          </form>

          <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Don't have an account?{" "}
            <Link href="/register" style={{ color: "var(--primary)", fontWeight: "600" }}>
              Sign Up Now
            </Link>
          </div>

            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
