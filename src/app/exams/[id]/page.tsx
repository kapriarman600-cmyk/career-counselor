import { prisma } from "../../../lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Calendar, GraduationCap, Compass, Briefcase, Award, Milestone, FileText, ArrowRight, Globe } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function ExamDetailPage({ params }: PageProps) {
  const { id } = await params;
  const exam = await prisma.exam.findUnique({
    where: { id }
  });

  if (!exam) {
    notFound();
  }

  return (
    <div style={{ minHeight: "calc(100vh - 80px)", position: "relative", paddingBottom: "5rem" }}>
      {/* Background glow */}
      <div style={{ position: "absolute", top: "5%", left: "10%", width: "400px", height: "400px", background: "var(--primary)", filter: "blur(180px)", opacity: 0.1, zIndex: -1 }}></div>

      {/* Back button */}
      <div className="container" style={{ paddingTop: "2rem" }}>
        <Link href="/exams" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", marginBottom: "2rem", fontWeight: 500 }}>
          <ArrowLeft size={16}/> Back to Exams Directory
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="container">
        <div className="glass-panel" style={{ background: "linear-gradient(135deg, var(--bg-card), rgba(99, 102, 241, 0.05))", borderLeft: "4px solid var(--primary)", padding: "3rem", marginBottom: "3rem" }}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <span className="badge" style={{ background: "rgba(99, 102, 241, 0.15)", color: "var(--primary)", fontSize: "0.9rem" }}>
              {exam.category} Category
            </span>
            <span className="badge" style={{ 
              background: exam.difficultyLevel.toLowerCase() === "extreme" ? "rgba(239, 68, 68, 0.15)" : "rgba(245, 158, 11, 0.15)", 
              color: exam.difficultyLevel.toLowerCase() === "extreme" ? "var(--danger)" : "var(--warning)",
              fontSize: "0.9rem"
            }}>
              {exam.difficultyLevel} Difficulty
            </span>
          </div>
          
          <h1 style={{ fontSize: "3rem", marginBottom: "1rem", lineHeight: 1.2 }}>{exam.name}</h1>
          <p className="text-secondary" style={{ fontSize: "1.2rem", maxWidth: "800px", lineHeight: "1.6", marginBottom: "2rem" }}>
            {exam.description}
          </p>

          <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap", borderTop: "1px solid var(--border-light)", paddingTop: "1.5rem", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.3rem" }}>Salary / Pay Scale</p>
              <h3 style={{ fontSize: "1.4rem", color: "var(--text-primary)" }}>{exam.salary}</h3>
            </div>
            {exam.successRate && (
              <div>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.3rem" }}>Success Rate</p>
                <h3 style={{ fontSize: "1.4rem", color: "var(--accent)" }}>{exam.successRate}%</h3>
              </div>
            )}
            <div style={{ marginLeft: "auto", display: "flex", gap: "1rem" }}>
              <Link href={`/study-planner?exam=${encodeURIComponent(exam.name)}`} className="btn-primary" style={{ padding: "0.8rem 1.5rem" }}>
                <Clock size={18} /> Create Study Plan
              </Link>
            </div>
          </div>
        </div>

        {/* Detailed Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2.5rem", alignItems: "flex-start" }}>
          
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            
            {/* Syllabus */}
            <div className="glass-panel">
              <h2 style={{ fontSize: "1.8rem", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <BookOpen size={24} className="text-primary"/> Examination Syllabus
              </h2>
              <p className="text-secondary" style={{ whiteSpace: "pre-line", lineHeight: "1.7" }}>
                {exam.syllabus}
              </p>
            </div>

            {/* Exam Pattern */}
            <div className="glass-panel" style={{ borderLeft: "4px solid var(--accent)" }}>
              <h2 style={{ fontSize: "1.8rem", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Award size={24} className="text-accent" /> Test Pattern & Marking Schema
              </h2>
              <p className="text-secondary" style={{ whiteSpace: "pre-line", lineHeight: "1.7" }}>
                {exam.pattern}
              </p>
            </div>

            {/* Preparation Strategy */}
            <div className="glass-panel" style={{ borderLeft: "4px solid var(--success)" }}>
              <h2 style={{ fontSize: "1.8rem", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Milestone size={24} style={{ color: "var(--success)" }}/> Preparation Strategy & Milestones
              </h2>
              <p className="text-secondary" style={{ whiteSpace: "pre-line", lineHeight: "1.7" }}>
                {exam.preparationStrategy || "1. Understand basic concepts from standard text publications. 2. Solve previous 10 years papers. 3. Regularly review weak items via mistake loggers. 4. Take full mock tests to check speed and composure."}
              </p>
            </div>

            {/* Recommended Books */}
            <div className="glass-panel">
              <h2 style={{ fontSize: "1.8rem", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FileText size={24} style={{ color: "var(--coin)" }} /> Recommended Reference Books
              </h2>
              <div style={{ background: "rgba(0,0,0,0.15)", borderRadius: "10px", padding: "1.5rem", color: "var(--text-secondary)", lineHeight: "1.7" }}>
                {exam.recommendedBooks ? (
                  <ul style={{ listStyleType: "none", padding: 0 }}>
                    {exam.recommendedBooks.split(",").map((book, i) => (
                      <li key={i} style={{ marginBottom: "0.8rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ width: "6px", height: "6px", background: "var(--coin)", borderRadius: "50%" }}></span>
                        {book.trim()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Standard educational board materials, NCERT booklets, and national preparation guides.</p>
                )}
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            
            {/* Eligibility */}
            <div className="glass-panel" style={{ padding: "1.8rem" }}>
              <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Award size={20} className="text-primary"/> Eligibility Criteria
              </h3>
              <p className="text-secondary" style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
                {exam.eligibility}
              </p>
            </div>

            {/* Selection Process */}
            <div className="glass-panel" style={{ padding: "1.8rem" }}>
              <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Milestone size={20} className="text-accent"/> Selection Process
              </h3>
              <p className="text-secondary" style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
                {exam.selectionProcess}
              </p>
            </div>

            {/* Previous Year Cutoffs */}
            <div className="glass-panel" style={{ padding: "1.8rem" }}>
              <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <GraduationCap size={20} style={{ color: "var(--success)" }}/> Cutoff History
              </h3>
              <p className="text-secondary" style={{ fontSize: "0.95rem", lineHeight: "1.6", whiteSpace: "pre-line" }}>
                {exam.previousYearCutoffs || "Cutoff thresholds vary each year. Please refer to official notifications."}
              </p>
            </div>

            {/* Useful Links */}
            {exam.resources && (
              <div className="glass-panel" style={{ padding: "1.8rem" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Globe size={20} style={{ color: "var(--coin)" }}/> Official Portals
                </h3>
                <p className="text-secondary" style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>
                  {exam.resources}
                </p>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
