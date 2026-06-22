import { prisma } from "../../lib/db";
import Link from "next/link";
import { Search, Compass, Target, ArrowRight, Star } from "lucide-react";
import CareersFilterList from "./CareersFilterList";

export const dynamic = "force-dynamic";

export default async function CareersDirectory() {
  const careers = await prisma.career.findMany({
    orderBy: { title: "asc" }
  });

  // Extract unique industries for filter dropdown
  const industries = Array.from(new Set(careers.map(c => c.industry))).filter(Boolean);

  return (
    <div>
      {/* Header */}
      <div style={{ background: "linear-gradient(to bottom, rgba(139, 92, 246, 0.1), transparent)", padding: "4rem 0 2rem" }}>
        <div className="container">
          <div className="badge animate-slide-up" style={{ background: "rgba(139, 92, 246, 0.2)", color: "var(--secondary)", marginBottom: "1rem" }}>
            <Compass size={14}/> Explorer
          </div>
          <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Career <span className="text-gradient">Encyclopedia</span></h1>
          <p className="text-secondary" style={{ fontSize: "1.2rem", maxWidth: "800px" }}>
            Discover and analyze detailed roadmaps, entrance exams, salaries, and resources for 29 core Indian career fields.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: "1rem 2rem 5rem" }}>
        <CareersFilterList initialCareers={careers} industries={industries} />
      </div>
    </div>
  );
}
