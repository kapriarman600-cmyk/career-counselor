"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, UserCircle } from "lucide-react";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError("Password must be at least 8 characters and include letters, numbers, and a special character.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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

      // Redirect to counselor on success
      router.push("/counselor");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ padding: "4rem 2rem", display: "flex", justifyContent: "center" }}>
      <div className="glass-panel" style={{ maxWidth: "450px", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Create Account</h2>
          <p style={{ color: "var(--text-secondary)" }}>Join PathFinder and start your journey</p>
        </div>

        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", color: "#fca5a5", padding: "0.75rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
            {error}
          </div>
        )}

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

          <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "1rem" }} disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
