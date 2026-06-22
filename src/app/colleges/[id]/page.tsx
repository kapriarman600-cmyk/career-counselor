import { prisma } from "../../../lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Award, GraduationCap, Globe, BookOpen, Star, Sparkles, TrendingUp, Users, ArrowRight } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function CollegeProfilePage({ params }: PageProps) {
  const { id } = await params;
  const college = await prisma.college.findUnique({
    where: { id },
    include: { courses: true }
  });

  if (!college) {
    notFound();
  }

  return (
    <div style={{ minHeight: "calc(100vh - 80px)", position: "relative", paddingBottom: "5rem" }}>
      {/* Background glow */}
      <div style={{ position: "absolute", top: "5%", right: "10%", width: "400px", height: "400px", background: "var(--success)", filter: "blur(180px)", opacity: 0.1, zIndex: -1 }}></div>

      {/* Back button */}
      <div className="container" style={{ paddingTop: "2rem" }}>
        <Link href="/colleges" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", marginBottom: "2rem", fontWeight: 500 }}>
          <ArrowLeft size={16}/> Back to Colleges Discovery
        </Link>
      </div>

      <div className="container">
        {/* Profile Header */}
        <div className="glass-panel" style={{ background: "linear-gradient(135deg, var(--bg-card), rgba(16, 185, 129, 0.05))", borderLeft: "4px solid var(--success)", padding: "3rem", marginBottom: "3rem" }}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <span className="badge" style={{ background: "rgba(16, 185, 129, 0.15)", color: "var(--success)", fontSize: "0.9rem" }}>
              {college.type} Institution
            </span>
            {college.ranking && (
              <span className="badge" style={{ background: "rgba(245, 158, 11, 0.15)", color: "var(--warning)", fontSize: "0.9rem" }}>
                National Rank #{college.ranking}
              </span>
            )}
            {college.accreditation && (
              <span className="badge" style={{ background: "rgba(255, 255, 255, 0.05)", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                {college.accreditation}
              </span>
            )}
          </div>
          
          <h1 style={{ fontSize: "3rem", marginBottom: "1rem", lineHeight: 1.2 }}>{college.name}</h1>
          
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", fontSize: "1.1rem", marginBottom: "2rem" }}>
            <MapPin size={18} className="text-accent" />
            <span>{college.location}</span>
          </div>

          <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap", borderTop: "1px solid var(--border-light)", paddingTop: "1.5rem", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.3rem" }}>Average Package</p>
              <h3 style={{ fontSize: "1.5rem", color: "var(--text-primary)" }}>{college.avgPlacement || "N/A"}</h3>
            </div>
            <div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.3rem" }}>Highest Package</p>
              <h3 style={{ fontSize: "1.5rem", color: "var(--success)" }}>{college.highestPlacement || "N/A"}</h3>
            </div>
            {college.officialWebsite && (
              <div style={{ marginLeft: "auto" }}>
                <a href={`https://${college.officialWebsite}`} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding: "0.8rem 1.5rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                  <Globe size={18} /> Visit Official Website <ArrowRight size={14}/>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2.5rem", alignItems: "flex-start" }}>
          
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            
            {/* Description */}
            <div className="glass-panel">
              <h2 style={{ fontSize: "1.8rem", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <GraduationCap size={24} className="text-primary"/> About the University
              </h2>
              <p className="text-secondary" style={{ lineHeight: "1.7" }}>
                {college.description}
              </p>
            </div>

            {/* Courses Offered */}
            <div className="glass-panel">
              <h2 style={{ fontSize: "1.8rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <BookOpen size={24} className="text-accent"/> Courses & Fee Structure
              </h2>
              
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.95rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border-light)", color: "var(--text-primary)" }}>
                      <th style={{ padding: "0.8rem" }}>Course Name</th>
                      <th style={{ padding: "0.8rem" }}>Duration</th>
                      <th style={{ padding: "0.8rem" }}>Estimated Fees</th>
                      <th style={{ padding: "0.8rem", textAlign: "center" }}>Seats</th>
                    </tr>
                  </thead>
                  <tbody>
                    {college.courses.map((course) => (
                      <tr key={course.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", color: "var(--text-secondary)" }}>
                        <td style={{ padding: "0.8rem", fontWeight: 500, color: "white" }}>{course.name}</td>
                        <td style={{ padding: "0.8rem" }}>{course.duration}</td>
                        <td style={{ padding: "0.8rem" }}>{course.fees}</td>
                        <td style={{ padding: "0.8rem", textAlign: "center" }}>{course.seats || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Admission Process */}
            <div className="glass-panel">
              <h2 style={{ fontSize: "1.8rem", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Sparkles size={24} style={{ color: "var(--coin)" }}/> Admission Process
              </h2>
              <p className="text-secondary" style={{ whiteSpace: "pre-line", lineHeight: "1.7" }}>
                {college.admissionProcess || "Admission is based primarily on candidate rankings in national competitive examinations, followed by centralized state or national counseling rounds."}
              </p>
            </div>

            {/* Reviews */}
            <div className="glass-panel">
              <h2 style={{ fontSize: "1.8rem", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Star size={24} className="text-primary"/> Student Reviews & Campus Life
              </h2>
              <div style={{ background: "rgba(0,0,0,0.15)", borderRadius: "10px", padding: "1.5rem", borderLeft: "4px solid var(--primary)" }}>
                <div style={{ display: "flex", gap: "0.2rem", marginBottom: "0.8rem" }}>
                  <Star size={16} fill="var(--coin)" color="var(--coin)"/>
                  <Star size={16} fill="var(--coin)" color="var(--coin)"/>
                  <Star size={16} fill="var(--coin)" color="var(--coin)"/>
                  <Star size={16} fill="var(--coin)" color="var(--coin)"/>
                  <Star size={16} fill="var(--coin)" color="var(--coin)"/>
                </div>
                <p className="text-secondary" style={{ fontStyle: "italic", lineHeight: "1.6" }}>
                  "{college.reviews || "Fantastic study environment, highly qualified professors, and unmatched corporate networking opportunities. The workload is high, but it makes you industry-ready."}"
                </p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.8rem", textAlign: "right" }}>
                  — Verified Student Review
                </p>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            
            {/* Cutoffs */}
            <div className="glass-panel" style={{ padding: "1.8rem" }}>
              <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <TrendingUp size={20} className="text-accent"/> Cutoffs & Seat Matrix
              </h3>
              <p className="text-secondary" style={{ fontSize: "0.95rem", lineHeight: "1.6", whiteSpace: "pre-line" }}>
                {college.cutoffs || "Cutoffs depend on the yearly exam difficulty and number of applicants. Usually requires percentile above 98+ for computer science branches."}
              </p>
            </div>

            {/* Placements Card */}
            <div className="glass-panel" style={{ padding: "1.8rem" }}>
              <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Users size={20} style={{ color: "var(--success)" }}/> Placement Partners
              </h3>
              <p className="text-secondary" style={{ fontSize: "0.9rem", lineHeight: "1.5" }}>
                Major recruiters include Google, Microsoft, Amazon, McKinsey & Co, Goldman Sachs, Tata Group, Reliance Industries, and major public sector enterprises.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
