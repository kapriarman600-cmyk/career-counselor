"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ padding: "6rem 2rem", display: "flex", justifyContent: "center", minHeight: "calc(100vh - 80px)" }}>
      <div className="glass-panel" style={{ maxWidth: "450px", width: "100%", height: "fit-content" }}>
        
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Welcome Back</h2>
          <p style={{ color: "var(--text-secondary)" }}>Login to resume your path planning</p>
        </div>

        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", color: "#fca5a5", padding: "0.75rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
            {error}
          </div>
        )}

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
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field" 
                style={{ paddingLeft: "2.5rem" }} 
                placeholder="••••••••" 
                required
              />
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
  );
}
