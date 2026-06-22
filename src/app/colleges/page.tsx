import { prisma } from "../../lib/db";
import Link from "next/link";
import { Search, GraduationCap, MapPin, Award, ArrowRight } from "lucide-react";
import CollegesFilterList from "./CollegesFilterList";

export const dynamic = "force-dynamic";

export default async function CollegesDirectory() {
  const colleges = await prisma.college.findMany({
    orderBy: { ranking: "asc" }
  });

  // Extract unique locations for filtering
  const locations = Array.from(new Set(colleges.map(c => {
    // Extract state or main city from location (usually last part of comma-separated location)
    const parts = c.location.split(",");
    return parts[parts.length - 1].trim();
  }))).filter(Boolean);

  return (
    <div>
      {/* Header */}
      <div style={{ background: "linear-gradient(to bottom, rgba(16, 185, 129, 0.1), transparent)", padding: "4rem 0 2rem" }}>
        <div className="container">
          <div className="badge animate-slide-up" style={{ background: "rgba(16, 185, 129, 0.2)", color: "var(--success)", marginBottom: "1rem" }}>
            <GraduationCap size={14}/> Academics
          </div>
          <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>College <span className="text-gradient">Discovery</span></h1>
          <p className="text-secondary" style={{ fontSize: "1.2rem", maxWidth: "800px" }}>
            Explore 18 of India's premier public and private universities. Analyze placement statistics, courses, and cutoff details.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: "1rem 2rem 5rem" }}>
        <CollegesFilterList initialColleges={colleges} locations={locations} />
      </div>
    </div>
  );
}
