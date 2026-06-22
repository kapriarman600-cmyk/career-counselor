"use client";

import Link from "next/link";
import { LogOut, Trophy, User as UserIcon } from "lucide-react";

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

  if (!user) {
    return (
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Link href="/login" className="nav-item" style={{ fontWeight: 600 }}>Log In</Link>
        <Link href="/register" className="btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>Sign Up</Link>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}>
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
