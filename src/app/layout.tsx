import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Sparkles, BrainCircuit, BookOpen, GraduationCap, Compass, Briefcase, LayoutDashboard, Calendar } from "lucide-react";
import { cookies } from "next/headers";
import { prisma } from "../lib/db";
import NavbarUser from "../components/NavbarUser";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "CareerVerse AI | The Ultimate Student Success Ecosystem",
  description: "AI-powered Career Guidance, Exam Preparation, College Discovery, Skill Development, and Mentorship Platform.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get("session_user_id")?.value;
  let user = null;

  if (sessionUserId) {
    user = await prisma.user.findUnique({
      where: { id: sessionUserId },
      select: {
        id: true,
        name: true,
        role: true,
        eduCoins: true,
        level: true
      }
    });
  }

  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-sans`}>
        <nav className="navbar">
          <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Link href="/" className="logo">
              <Sparkles size={24} color="var(--primary)" />
              CareerVerse AI
            </Link>
            <div className="nav-links" style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
              <Link href="/counselor" className="nav-item"><BrainCircuit size={16}/> AI Counselor</Link>
              <Link href="/study-planner" className="nav-item"><Calendar size={16}/> Planner</Link>
              <Link href="/exams" className="nav-item"><BookOpen size={16}/> Exams</Link>
              <Link href="/colleges" className="nav-item"><GraduationCap size={16}/> Colleges</Link>
              <Link href="/careers" className="nav-item"><Compass size={16}/> Careers</Link>
              <Link href="/mentorship" className="nav-item"><Briefcase size={16}/> Mentors</Link>
              <Link href="/dashboard" className="nav-item"><LayoutDashboard size={16}/> Dashboard</Link>
              <div style={{ width: "1px", height: "24px", background: "rgba(255,255,255,0.1)", margin: "0 0.5rem" }}></div>
              <NavbarUser user={user} />
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
