import { prisma } from "../../lib/db";
import Link from "next/link";
import { Compass, BookOpen, Users, Calendar, TrendingUp, ArrowRight } from "lucide-react";
import ExamsFilterList from "./ExamsFilterList";

export const dynamic = "force-dynamic";

export default async function ExamsDirectory() {
  const exams = await prisma.exam.findMany({
    orderBy: { name: "asc" }
  });

  // Extract categories dynamically
  const categories = Array.from(new Set(exams.map(e => e.category))).filter(Boolean);

  return (
    <div>
      {/* Header */}
      <div style={{ background: "linear-gradient(to bottom, rgba(99, 102, 241, 0.1), transparent)", padding: "4rem 0 2rem" }}>
        <div className="container">
          <div className="badge animate-slide-up" style={{ background: "rgba(99, 102, 241, 0.2)", color: "var(--primary)", marginBottom: "1rem" }}>
            <BookOpen size={14}/> Exams Directory
          </div>
          <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Exam <span className="text-gradient">Encyclopedia</span></h1>
          <p className="text-secondary" style={{ fontSize: "1.2rem", maxWidth: "800px" }}>
            Comprehensive guides for major Indian competitive exams. Find syllabus details, cutoffs, and prep strategies.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: "1rem 2rem 5rem" }}>
        <ExamsFilterList initialExams={exams} categories={categories} />
      </div>
    </div>
  );
}
