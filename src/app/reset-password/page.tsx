"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff } from "lucide-react";
import { validatePassword } from "@/lib/auth-validation";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordChecks = validatePassword(password);
  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!token) {
      setError("No reset token provided. Please use the link from your email.");
      setLoading(false);
      return;
    }

    if (!isPasswordValid) {
      setError("Please ensure your password meets all requirements.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess("Your password has been successfully reset. You can now login.");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
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
          <h1 style={{ fontSize: "3.5rem", marginBottom: "1rem", lineHeight: 1.1, letterSpacing: "-0.02em" }}>Set New<br/><span className="text-gradient">Password</span></h1>
          <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: "2.5rem", maxWidth: "400px" }}>Create a strong, secure password to protect your CareerVerse AI account.</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-wrapper">
          <div className="glass-panel">
        
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Create New Password</h2>
          <p style={{ color: "var(--text-secondary)" }}>Please enter and confirm your new password.</p>
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

        {!success && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">New Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={18} color="var(--text-secondary)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              {password && (
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
              <label className="label">Confirm New Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={18} color="var(--text-secondary)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field" 
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }} 
                  placeholder="••••••••" 
                  required
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", padding: 0 }}>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <div style={{ fontSize: "0.85rem", color: "#ef4444", marginTop: "0.25rem" }}>Passwords do not match</div>
              )}
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "1.5rem", padding: "1rem" }} disabled={loading || !isPasswordValid || password !== confirmPassword}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "4rem" }}>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
