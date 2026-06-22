"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, BookOpen, Users, Calendar, TrendingUp, ArrowRight } from "lucide-react";

interface Exam {
  id: string;
  name: string;
  category: string;
  difficultyLevel: string;
  salary: string;
  successRate: number | null;
  description: string;
}

interface ExamsFilterListProps {
  initialExams: Exam[];
  categories: string[];
}

export default function ExamsFilterList({ initialExams, categories }: ExamsFilterListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredExams = initialExams.filter(exam => {
    const matchesSearch = exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exam.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exam.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || exam.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Search & Filter Bar */}
      <div className="glass-panel" style={{ padding: "1.5rem", marginBottom: "3rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        
        {/* Search */}
        <div style={{ flex: 2, minWidth: "250px", position: "relative" }}>
          <Search size={18} className="text-secondary" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text" 
            placeholder="Search competitive exams by name or details..." 
            className="input-field" 
            style={{ paddingLeft: "2.8rem", margin: 0 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div style={{ flex: 1, minWidth: "180px" }}>
          <select 
            className="input-field" 
            style={{ margin: 0 }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: "1.5rem", color: "var(--text-secondary)" }}>
        Found {filteredExams.length} examinations
      </div>

      {/* Exams Grid */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "2rem" }}>
        {filteredExams.map((exam) => (
          <div key={exam.id} className="glass-panel" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <span className="badge" style={{ background: "rgba(99, 102, 241, 0.15)", color: "var(--primary)" }}>
                {exam.category}
              </span>
              <span className="badge" style={{ 
                background: exam.difficultyLevel.toLowerCase() === "extreme" ? "rgba(239, 68, 68, 0.15)" : exam.difficultyLevel.toLowerCase() === "high" ? "rgba(245, 158, 11, 0.15)" : "rgba(16, 185, 129, 0.15)", 
                color: exam.difficultyLevel.toLowerCase() === "extreme" ? "var(--danger)" : exam.difficultyLevel.toLowerCase() === "high" ? "var(--warning)" : "var(--success)" 
              }}>
                {exam.difficultyLevel} Difficulty
              </span>
            </div>

            <h3 style={{ fontSize: "1.4rem", marginBottom: "0.8rem", lineHeight: 1.2 }}>{exam.name}</h3>
            
            <p className="text-secondary" style={{ fontSize: "0.95rem", marginBottom: "1.5rem", flex: 1 }}>
              {exam.description.length > 130 ? `${exam.description.slice(0, 130)}...` : exam.description}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.5rem", marginBottom: "1.5rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <TrendingUp size={16} className="text-primary"/> 
                <span>Pay Scale: <strong style={{ color: "white" }}>{exam.salary}</strong></span>
              </div>
              {exam.successRate && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Users size={16} className="text-accent"/> 
                  <span>Success Rate: <strong style={{ color: "white" }}>{exam.successRate}%</strong></span>
                </div>
              )}
            </div>

            <div style={{ marginTop: "auto", display: "flex", gap: "1rem" }}>
              <Link href={`/exams/${exam.id}`} className="btn-primary" style={{ flex: 1, padding: "0.75rem" }}>
                View Full Details <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
        {filteredExams.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem 0", color: "var(--text-secondary)" }}>
            No exams match your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}
