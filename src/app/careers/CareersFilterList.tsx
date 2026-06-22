"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, Star, TrendingUp } from "lucide-react";

interface Career {
  id: string;
  title: string;
  industry: string;
  description: string;
  demandLevel: string;
  averageSalary: string;
  requiredSkills: string | null;
}

interface CareersFilterListProps {
  initialCareers: Career[];
  industries: string[];
}

export default function CareersFilterList({ initialCareers, industries }: CareersFilterListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [selectedDemand, setSelectedDemand] = useState("all");

  const filteredCareers = initialCareers.filter(career => {
    const matchesSearch = career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          career.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (career.requiredSkills && career.requiredSkills.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesIndustry = selectedIndustry === "all" || career.industry === selectedIndustry;
    const matchesDemand = selectedDemand === "all" || career.demandLevel.toLowerCase() === selectedDemand.toLowerCase();

    return matchesSearch && matchesIndustry && matchesDemand;
  });

  return (
    <div>
      {/* Filters Bar */}
      <div className="glass-panel" style={{ padding: "1.5rem", marginBottom: "3rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        
        {/* Search */}
        <div style={{ flex: 2, minWidth: "250px", position: "relative" }}>
          <Search size={18} className="text-secondary" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text" 
            placeholder="Search by title, skills, description..." 
            className="input-field" 
            style={{ paddingLeft: "2.8rem", margin: 0 }} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Industry dropdown */}
        <div style={{ flex: 1, minWidth: "180px" }}>
          <select 
            className="input-field" 
            style={{ margin: 0 }}
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
          >
            <option value="all">All Industries</option>
            {industries.map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        {/* Demand level dropdown */}
        <div style={{ flex: 1, minWidth: "150px" }}>
          <select 
            className="input-field" 
            style={{ margin: 0 }}
            value={selectedDemand}
            onChange={(e) => setSelectedDemand(e.target.value)}
          >
            <option value="all">All Demand Levels</option>
            <option value="high">High Demand</option>
            <option value="medium">Medium Demand</option>
            <option value="low">Low Demand</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: "1.5rem", color: "var(--text-secondary)" }}>
        Found {filteredCareers.length} career pathways
      </div>

      {/* Careers Grid */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "2rem" }}>
        {filteredCareers.map((career) => (
          <div key={career.id} className="glass-panel" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <span className="badge" style={{ background: "rgba(139, 92, 246, 0.15)", color: "var(--secondary)" }}>
                {career.industry}
              </span>
              <span className="badge" style={{ 
                background: career.demandLevel.toLowerCase() === "high" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)", 
                color: career.demandLevel.toLowerCase() === "high" ? "var(--success)" : "var(--warning)" 
              }}>
                {career.demandLevel} Demand
              </span>
            </div>

            <h3 style={{ fontSize: "1.4rem", marginBottom: "0.8rem" }}>{career.title}</h3>
            
            <p className="text-secondary" style={{ fontSize: "0.95rem", marginBottom: "1.5rem", flex: 1 }}>
              {career.description.length > 130 ? `${career.description.slice(0, 130)}...` : career.description}
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
              <TrendingUp size={16} className="text-primary" />
              <span>Avg Salary: <strong style={{ color: "white" }}>{career.averageSalary}</strong></span>
            </div>

            {/* Skills chips */}
            {career.requiredSkills && (
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                {career.requiredSkills.split(",").slice(0, 3).map((skill) => (
                  <span key={skill} style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.05)", padding: "0.2rem 0.5rem", borderRadius: "6px", color: "var(--text-secondary)" }}>
                    {skill.trim()}
                  </span>
                ))}
                {career.requiredSkills.split(",").length > 3 && (
                  <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.3rem", color: "var(--text-muted)" }}>
                    +{career.requiredSkills.split(",").length - 3} more
                  </span>
                )}
              </div>
            )}

            <div style={{ marginTop: "auto" }}>
              <Link href={`/careers/${career.id}`} className="btn-primary" style={{ width: "100%", padding: "0.75rem" }}>
                Explore Career Details <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
        {filteredCareers.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem 0", color: "var(--text-secondary)" }}>
            No careers match your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}
