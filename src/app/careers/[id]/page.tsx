import { prisma } from "../../../lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, BrainCircuit, GraduationCap, Compass, Briefcase, Award, Milestone, FileText, ArrowRight } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function CareerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const career = await prisma.career.findUnique({
    where: { id }
  });

  if (!career) {
    notFound();
  }

  return (
    <div style={{ minHeight: "calc(100vh - 80px)", position: "relative", paddingBottom: "5rem" }}>
      {/* Background glow */}
      <div style={{ position: "absolute", top: "5%", left: "10%", width: "400px", height: "400px", background: "var(--secondary)", filter: "blur(180px)", opacity: 0.15, zIndex: -1 }}></div>

      {/* Breadcrumbs and back button */}
      <div className="container" style={{ paddingTop: "2rem" }}>
        <Link href="/careers" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", marginBottom: "2rem", fontWeight: 500 }}>
          <ArrowLeft size={16}/> Back to Careers Directory
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="container">
        <div className="glass-panel" style={{ background: "linear-gradient(135deg, var(--bg-card), rgba(139, 92, 246, 0.05))", borderLeft: "4px solid var(--secondary)", padding: "3rem", marginBottom: "3rem" }}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <span className="badge" style={{ background: "rgba(139, 92, 246, 0.15)", color: "var(--secondary)", fontSize: "0.9rem" }}>
              {career.industry}
            </span>
            <span className="badge" style={{ 
              background: career.demandLevel.toLowerCase() === "high" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)", 
              color: career.demandLevel.toLowerCase() === "high" ? "var(--success)" : "var(--warning)",
              fontSize: "0.9rem"
            }}>
              {career.demandLevel} Demand
            </span>
          </div>
          
          <h1 style={{ fontSize: "3.5rem", marginBottom: "1rem", lineHeight: 1.1 }}>{career.title}</h1>
          <p className="text-secondary" style={{ fontSize: "1.2rem", maxWidth: "800px", lineHeight: "1.6", marginBottom: "2rem" }}>
            {career.description}
          </p>

          <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap", borderTop: "1px solid var(--border-light)", paddingTop: "1.5rem" }}>
            <div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.3rem" }}>Average Salary Range</p>
              <h3 style={{ fontSize: "1.5rem", color: "var(--text-primary)" }}>{career.averageSalary}</h3>
            </div>
            <div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.3rem" }}>Minimum Study Level</p>
              <h3 style={{ fontSize: "1.5rem", color: "var(--text-primary)" }}>Bachelor's Degree</h3>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
              <Link href="/study-planner" className="btn-primary" style={{ padding: "0.8rem 1.5rem" }}>
                <BrainCircuit size={18} /> Design Prep Plan
              </Link>
            </div>
          </div>
        </div>

        {/* Detailed Modules Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2.5rem", alignItems: "flex-start" }}>
          
          {/* Left Column: Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            
            {/* Overview */}
            <div className="glass-panel">
              <h2 style={{ fontSize: "1.8rem", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Compass size={24} className="text-primary"/> Career Overview
              </h2>
              <p className="text-secondary" style={{ whiteSpace: "pre-line", lineHeight: "1.7" }}>
                {career.overview || "An engaging and multi-faceted career path providing substantial professional growth, impact, and continuous learning opportunities across public and private sectors in India."}
              </p>
            </div>

            {/* Roadmap */}
            <div className="glass-panel" style={{ borderLeft: "4px solid var(--success)" }}>
              <h2 style={{ fontSize: "1.8rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Milestone size={24} style={{ color: "var(--success)" }}/> Professional Journey Roadmap
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", position: "relative" }}>
                {career.roadmap ? (
                  career.roadmap.split("\n").map((step, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "1.5rem", position: "relative" }}>
                      <div style={{ 
                        width: "36px", height: "36px", borderRadius: "50%", 
                        background: "rgba(16, 185, 129, 0.15)", color: "var(--success)", 
                        display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center",
                        fontWeight: "700", flexShrink: 0, zIndex: 2
                      }}>
                        {idx + 1}
                      </div>
                      <div style={{ alignSelf: "center", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                        {step.replace(/^\d+\.\s*/, "")}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-secondary">Custom career progression details and roadmaps will load shortly.</p>
                )}
              </div>
            </div>

            {/* Future Scope */}
            <div className="glass-panel">
              <h2 style={{ fontSize: "1.8rem", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Award size={24} className="text-accent" /> Future Outlook & Scope
              </h2>
              <p className="text-secondary" style={{ whiteSpace: "pre-line", lineHeight: "1.7" }}>
                {career.futureScope}
              </p>
            </div>

            {/* Recommended Resources */}
            <div className="glass-panel">
              <h2 style={{ fontSize: "1.8rem", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FileText size={24} style={{ color: "var(--coin)" }} /> Learning Resources & Frameworks
              </h2>
              <div style={{ background: "rgba(0,0,0,0.15)", borderRadius: "10px", padding: "1.2rem", color: "var(--text-secondary)", lineHeight: "1.7" }}>
                {career.recommendedResources ? (
                  <ul style={{ listStyleType: "none", padding: 0 }}>
                    {career.recommendedResources.split(",").map((res, i) => (
                      <li key={i} style={{ marginBottom: "0.8rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ width: "6px", height: "6px", background: "var(--coin)", borderRadius: "50%" }}></span>
                        {res.trim()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Check reference publications, online learning modules (Coursera/NPTEL), and specialized syllabus tutorials.</p>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Requirements & Academics */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", position: "sticky", top: "100px" }}>
            
            {/* Required Skills */}
            <div className="glass-panel" style={{ padding: "1.8rem" }}>
              <h3 style={{ fontSize: "1.3rem", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Briefcase size={20} className="text-primary"/> Required Skills
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {career.requiredSkills ? (
                  career.requiredSkills.split(",").map((skill) => (
                    <span key={skill} style={{ background: "rgba(99, 102, 241, 0.15)", color: "var(--primary)", padding: "0.4rem 0.8rem", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600 }}>
                      {skill.trim()}
                    </span>
                  ))
                ) : (
                  <span className="text-secondary">No skills listed yet.</span>
                )}
              </div>
            </div>

            {/* Eligibility */}
            <div className="glass-panel" style={{ padding: "1.8rem" }}>
              <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Award size={20} className="text-accent"/> Eligibility Criteria
              </h3>
              <p className="text-secondary" style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
                {career.eligibility || "Must secure Class 12 passing certificate and proceed to standard university graduation requirements."}
              </p>
            </div>

            {/* Entrance Exams */}
            <div className="glass-panel" style={{ padding: "1.8rem" }}>
              <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <BookOpen size={20} style={{ color: "var(--coin)" }}/> Entrance Exams
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {career.entranceExams ? (
                  career.entranceExams.split(",").map((exam) => (
                    <div key={exam} style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "0.5rem" }}>
                      <span style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>{exam.trim()}</span>
                      <Link href="/exams" style={{ fontSize: "0.8rem", color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                        View Exam <ArrowRight size={12}/>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-secondary" style={{ fontSize: "0.9rem" }}>No entrance exams required or listed.</p>
                )}
              </div>
            </div>

            {/* Top Colleges */}
            <div className="glass-panel" style={{ padding: "1.8rem" }}>
              <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <GraduationCap size={20} style={{ color: "var(--success)" }}/> Top Colleges
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {career.topColleges ? (
                  career.topColleges.split(",").map((college) => (
                    <div key={college} style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "0.5rem" }}>
                      <span style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>{college.trim()}</span>
                      <Link href="/colleges" style={{ fontSize: "0.8rem", color: "var(--success)", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                        Find <ArrowRight size={12}/>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-secondary" style={{ fontSize: "0.9rem" }}>Standard colleges across major cities in India.</p>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
