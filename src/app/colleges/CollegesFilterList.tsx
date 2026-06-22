"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Award, ArrowRight, TrendingUp } from "lucide-react";

interface College {
  id: string;
  name: string;
  location: string;
  type: string;
  ranking: number | null;
  accreditation: string | null;
  avgPlacement: string | null;
  highestPlacement: string | null;
}

interface CollegesFilterListProps {
  initialColleges: College[];
  locations: string[];
}

export default function CollegesFilterList({ initialColleges, locations }: CollegesFilterListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const filteredColleges = initialColleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          college.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (college.accreditation && college.accreditation.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === "all" || college.type.toLowerCase() === selectedType.toLowerCase();
    
    const collegeLocationStr = college.location.toLowerCase();
    const matchesLocation = selectedLocation === "all" || collegeLocationStr.includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesType && matchesLocation;
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
            placeholder="Search colleges by name or details..." 
            className="input-field" 
            style={{ paddingLeft: "2.8rem", margin: 0 }} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Type Filter */}
        <div style={{ flex: 1, minWidth: "150px" }}>
          <select 
            className="input-field" 
            style={{ margin: 0 }}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="public">Public / Central</option>
            <option value="private">Private</option>
          </select>
        </div>

        {/* Location Filter */}
        <div style={{ flex: 1, minWidth: "180px" }}>
          <select 
            className="input-field" 
            style={{ margin: 0 }}
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="all">All Locations</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: "1.5rem", color: "var(--text-secondary)" }}>
        Showing {filteredColleges.length} universities
      </div>

      {/* Colleges Grid */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "2rem" }}>
        {filteredColleges.map((college) => (
          <div key={college.id} className="glass-panel" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <span className="badge" style={{ background: "rgba(16, 185, 129, 0.15)", color: "var(--success)" }}>
                {college.type} University
              </span>
              {college.ranking && (
                <span className="badge" style={{ background: "rgba(245, 158, 11, 0.15)", color: "var(--warning)" }}>
                  Rank #{college.ranking}
                </span>
              )}
            </div>

            <h3 style={{ fontSize: "1.4rem", marginBottom: "0.8rem", lineHeight: 1.2 }}>{college.name}</h3>
            
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1.2rem" }}>
              <MapPin size={16} className="text-accent" />
              <span>{college.location}</span>
            </div>

            {college.accreditation && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                <Award size={16} style={{ color: "var(--coin)" }} />
                <span>{college.accreditation}</span>
              </div>
            )}

            {/* Placement highlights */}
            <div style={{ 
              background: "rgba(0,0,0,0.15)", 
              borderRadius: "10px", 
              padding: "1rem", 
              marginBottom: "1.5rem", 
              display: "grid", 
              gridTemplateColumns: "1fr 1fr", 
              gap: "0.5rem",
              fontSize: "0.85rem" 
            }}>
              <div>
                <p style={{ color: "var(--text-muted)", marginBottom: "0.2rem" }}>Avg Placement</p>
                <strong style={{ color: "white", fontSize: "1rem" }}>{college.avgPlacement || "N/A"}</strong>
              </div>
              <div>
                <p style={{ color: "var(--text-muted)", marginBottom: "0.2rem" }}>Highest Pack</p>
                <strong style={{ color: "var(--success)", fontSize: "1rem" }}>{college.highestPlacement || "N/A"}</strong>
              </div>
            </div>

            <div style={{ marginTop: "auto" }}>
              <Link href={`/colleges/${college.id}`} className="btn-primary" style={{ width: "100%", padding: "0.75rem" }}>
                View College Profile <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
        {filteredColleges.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem 0", color: "var(--text-secondary)" }}>
            No colleges match your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}
