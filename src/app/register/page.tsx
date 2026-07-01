"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, UserCircle, Eye, EyeOff } from "lucide-react";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { validatePassword } from "@/lib/auth-validation";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordChecks = validatePassword(formData.password);
  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!isPasswordValid) {
      setError("Please ensure your password meets all requirements.");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      });

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        throw new Error("Server error occurred. Please try again.");
      }

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSuccess(data.message);
      setFormData({ name: "", email: "", password: "", confirmPassword: "", role: "student" });
    } catch (err: any) {
      setError(err.message);
    } finally {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}>
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-left-content">
            <h1 style={{ fontSize: "3.5rem", marginBottom: "1rem", lineHeight: 1.1, letterSpacing: "-0.02em" }}>Start Your Journey with<br/><span className="text-gradient">CareerVerse AI</span></h1>
            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: "2.5rem", maxWidth: "400px" }}>Create an account to discover top colleges, prepare for exams, and unlock your true potential.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ padding: "1.2rem", background: "var(--bg-card)", borderRadius: "16px", border: "1px solid var(--border-light)", display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--success)" }}>
                  <User size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>Personalized Path</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>Get AI-driven insights tailored just for you.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-form-wrapper">
            <div className="glass-panel">
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Create Account</h2>
            <p style={{ color: "var(--text-secondary)" }}>Join PathFinder and start your journey</p>
          </div>

          {error && (
            <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", color: "#fca5a5", padding: "0.75rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid #22c55e", color: "#86efac", padding: "0.75rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
              {success}
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
            <span style={{ padding: "0 1rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>or register with email</span>
            <div style={{ flex: 1, height: "1px", background: "var(--border)" }}></div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">Full Name</label>
              <div style={{ position: "relative" }}>
                <User size={18} color="var(--text-secondary)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field" 
                  style={{ paddingLeft: "2.5rem" }} 
                  placeholder="John Doe" 
                  required
                />
              </div>
            </div>

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

            <div className="form-group">
              <label className="label">Password</label>
              <div style={{ position: "relative" }}>
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
              
              {/* Password Strength Meter */}
              {formData.password && (
                <div style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  <div style={{ display: "flex", gap: "0.25rem", marginBottom: "0.5rem" }}>
                    {[...Array(5)].map((_, i) => {
                      const score = Object.values(passwordChecks).filter(Boolean).length;
                      let color = "var(--border)";
                      if (score > i) {
                        if (score < 3) color = "#ef4444";
                        else if (score < 5) color = "#f59e0b";
                        else color = "#22c55e";
                      }
                      return <div key={i} style={{ height: "4px", flex: 1, borderRadius: "2px", background: color, transition: "background 0.3s" }}></div>;
                    })}
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.25rem" }}>
                    <li style={{ color: passwordChecks.minLength ? "#22c55e" : "inherit" }}>{passwordChecks.minLength ? "✓" : "○"} Min 8 chars</li>
                    <li style={{ color: passwordChecks.hasUpper ? "#22c55e" : "inherit" }}>{passwordChecks.hasUpper ? "✓" : "○"} Uppercase</li>
                    <li style={{ color: passwordChecks.hasLower ? "#22c55e" : "inherit" }}>{passwordChecks.hasLower ? "✓" : "○"} Lowercase</li>
                    <li style={{ color: passwordChecks.hasNumber ? "#22c55e" : "inherit" }}>{passwordChecks.hasNumber ? "✓" : "○"} Number</li>
                    <li style={{ color: passwordChecks.hasSpecial ? "#22c55e" : "inherit" }}>{passwordChecks.hasSpecial ? "✓" : "○"} Special char</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="label">Confirm Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={18} color="var(--text-secondary)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field" 
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }} 
                  placeholder="••••••••" 
                  required
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", padding: 0 }}>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <div style={{ fontSize: "0.85rem", color: "#ef4444", marginTop: "0.25rem" }}>Passwords do not match</div>
              )}
            </div>

            <div className="form-group">
              <label className="label">I am a</label>
              <div style={{ position: "relative" }}>
                <UserCircle size={18} color="var(--text-secondary)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                <select 
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="input-field" 
                  style={{ paddingLeft: "2.5rem", appearance: "none" }}
                >
                  <option value="student">Student</option>
                  <option value="professional">Working Professional</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "1rem" }} disabled={loading || (formData.password ? !isPasswordValid : false) || formData.password !== formData.confirmPassword}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--primary)", fontWeight: "600" }}>
              Log In
            </Link>
          </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
