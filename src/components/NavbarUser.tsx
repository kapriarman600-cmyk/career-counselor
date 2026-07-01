"use client";

import Link from "next/link";
import { LogOut, Trophy, User as UserIcon, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

interface NavbarUserProps {
  user: {
    id: string;
    name: string;
    role: string;
    eduCoins: number;
    level: number;
  } | null;
}

export default function NavbarUser({ user }: NavbarUserProps) {
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (res.ok) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };

  if (!user) {
    return (
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <button onClick={toggleTheme} className="nav-item" style={{ background: "none", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", cursor: "pointer", padding: "0.5rem" }} aria-label="Toggle Theme">
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div style={{ width: "1px", height: "24px", background: "var(--border-light)", margin: "0 0.2rem" }}></div>
        <Link href="/login" className="nav-item" style={{ fontWeight: 600 }}>Log In</Link>
        <Link href="/register" className="btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>Sign Up</Link>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}>
      {/* Theme Toggle Button */}
      <button onClick={toggleTheme} className="nav-item" style={{ background: "none", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", cursor: "pointer", padding: "0.5rem" }} aria-label="Toggle Theme">
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Level & EduCoins Badge */}
      <Link href="/dashboard" className="badge" style={{ textTransform: "none", cursor: "pointer" }}>
        <Trophy size={14} style={{ color: "var(--coin)" }} />
        <span>Lvl {user.level}</span>
        <span style={{ opacity: 0.3 }}>|</span>
        <span>{user.eduCoins} Coins</span>
      </Link>

      {/* User Name & Profile Link */}
      <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-primary)", fontWeight: 500 }}>
        <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(99, 102, 241, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <UserIcon size={16} className="text-primary" />
        </div>
        <span style={{ fontSize: "0.95rem" }}>{user.name.split(" ")[0]}</span>
      </Link>

      {/* Logout Button */}
      <button 
        onClick={handleLogout}
        className="nav-item" 
        style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-secondary)", fontSize: "0.95rem", cursor: "pointer", padding: 0 }}
      >
        <LogOut size={16} />
        <span style={{ display: "none" }}>Logout</span>
      </button>
    </div>
  );
}
