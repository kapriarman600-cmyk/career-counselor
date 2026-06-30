"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity, BookOpen, Target, Trophy, Clock, TrendingUp,
  BarChart, LineChart, PieChart, Loader2, Sparkles, User
} from "lucide-react";

type KPIStats = {
  totalMocks: number;
  avgScore: number;
  maxAccuracy: number;
  eduCoins: number;
  level: number;
};

type StatsData = {
  progressData: { label: string; score: number; accuracy: number; date?: string; }[];
  studyHoursData: { day: string; hours: number; }[];
  appVsSelData: { exam: string; applicants: number; selections: number; }[];
  cutoffTrendsData: { year: string; score: number; }[];
  careerGrowthData: { years: string; tech: number; finance: number; civil: number; }[];
  kpis: KPIStats;
};

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  // Hover state for tooltip data
  const [hoveredProgressIndex, setHoveredProgressIndex] = useState<number | null>(null);
  const [hoveredStudyIndex, setHoveredStudyIndex] = useState<number | null>(null);
  const [hoveredGrowthIndex, setHoveredGrowthIndex] = useState<number | null>(null);
  const [hoveredCutoffIndex, setHoveredCutoffIndex] = useState<number | null>(null);
  const [hoveredAppIndex, setHoveredAppIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setAuthenticated(true);
        setStats(data.stats);
      } else {
        // Load default stats for demo purposes
        setAuthenticated(false);
        setStats(getDemoStats());
      }
    } catch (err) {
      console.error(err);
      setStats(getDemoStats());
    } finally {
      setLoading(false);
    }
  };

  const getDemoStats = (): StatsData => ({
    progressData: [],
    studyHoursData: [
      { day: "Mon", hours: 0.0 },
      { day: "Tue", hours: 0.0 },
      { day: "Wed", hours: 0.0 },
      { day: "Thu", hours: 0.0 },
      { day: "Fri", hours: 0.0 },
      { day: "Sat", hours: 0.0 },
      { day: "Sun", hours: 0.0 }
    ],
    appVsSelData: [],
    cutoffTrendsData: [],
    careerGrowthData: [],
    kpis: {
      totalMocks: 0,
      avgScore: 0,
      maxAccuracy: 0,
      eduCoins: 0,
      level: 1
    }
  });

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 80px)" }}>
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  const kpis = stats?.kpis || getDemoStats().kpis;

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 80px)" }}>
      {/* Sidebar */}
      <div className="sidebar" style={{ display: "flex", flexDirection: "column" }}>
        <h3 style={{ padding: "0 1rem", marginBottom: "1rem", fontSize: "0.9rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Analytics</h3>
        <a href="#" className="sidebar-link active"><Activity size={18} /> Overview</a>
        <Link href="/study-planner" className="sidebar-link"><BookOpen size={18} /> Syllabus Planner</Link>
        <Link href="/exams" className="sidebar-link"><Target size={18} /> Exams Directory</Link>
        <Link href="/colleges" className="sidebar-link"><Trophy size={18} /> College Discovery</Link>
        <Link href="/careers" className="sidebar-link"><TrendingUp size={18} /> Careers Encyclopedia</Link>
      </div>

      {/* Main Content Area */}
      <div className="content-area" style={{ paddingBottom: "5rem" }}>

        {/* Banner Alert for non-authenticated */}
        {!authenticated && (
          <div className="glass-panel" style={{ background: "rgba(99, 102, 241, 0.1)", border: "1px solid var(--primary)", padding: "1rem 1.5rem", borderRadius: "12px", marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p className="text-secondary" style={{ margin: 0, fontSize: "0.95rem" }}>
              🔒 You are currently viewing demonstration graphs. **Log In** or **Sign Up** to link your database mock attempts and study streak.
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <Link href="/login" className="btn-outline" style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }}>Log In</Link>
              <Link href="/register" className="btn-primary" style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }}>Sign Up</Link>
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Performance & Career Analytics</h1>
            <p className="text-secondary">Explore real metrics, historical trends, and custom preparation curves.</p>
          </div>
          <div className="badge" style={{ fontSize: "1rem", padding: "0.6rem 1.2rem", background: "rgba(251, 191, 36, 0.15)", borderLeft: "3px solid var(--coin)" }}>
            <Trophy size={18} style={{ color: "var(--coin)" }} /> {kpis.eduCoins} EduCoins (Lvl {kpis.level})
          </div>
        </div>

        {/* KPIs Row */}
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <p className="text-secondary" style={{ fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "0.5rem" }}>Overall Accuracy</p>
            <h2 style={{ fontSize: "2.2rem", color: "var(--success)" }}>{kpis.maxAccuracy}%</h2>
            <p style={{ fontSize: "0.8rem", color: "var(--success)", marginTop: "0.4rem" }}>Based on mock attempts</p>
          </div>
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <p className="text-secondary" style={{ fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "0.5rem" }}>Tests Attempted</p>
            <h2 style={{ fontSize: "2.2rem", color: "var(--primary)" }}>{kpis.totalMocks} Mocks</h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.4rem" }}>In database log files</p>
          </div>
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <p className="text-secondary" style={{ fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "0.5rem" }}>Avg Score</p>
            <h2 style={{ fontSize: "2.2rem", color: "var(--coin)" }}>{kpis.avgScore} / 300</h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.4rem" }}>Standard score curve</p>
          </div>
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <p className="text-secondary" style={{ fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "0.5rem" }}>Study Focus</p>
            <h2 style={{ fontSize: "2.2rem", color: "var(--accent)" }}>Daily</h2>
            <p style={{ fontSize: "0.8rem", color: "var(--accent)", marginTop: "0.4rem" }}>Tracked in syllabus planner</p>
          </div>
        </div>

        {/* Dynamic Charts Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>

          {/* Row 1: User Progress Line Chart & Study Time Bar Chart */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "2.5rem" }}>

            {/* 1. User Progress SVG Line Chart */}
            <div className="glass-panel" style={{ minHeight: "350px", display: "flex", flexDirection: "column" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.2rem", color: "white" }}>User Progress (Mock Score Trends)</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Displays increase in mock scores over successive attempts</p>
              </div>

              <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                {!stats || stats.progressData.length === 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "200px", color: "var(--text-secondary)", fontSize: "0.95rem", textAlign: "center", padding: "1rem" }}>
                    <p style={{ margin: 0 }}>No mock score trends available yet.</p>
                    <Link href="/exams" style={{ color: "var(--primary)", marginTop: "0.5rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                      Complete your first mock test →
                    </Link>
                  </div>
                ) : (
                  <>
                    <svg width="100%" height="200" style={{ overflow: "visible" }}>
                      <defs>
                        <linearGradient id="lineGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Guidelines */}
                      <line x1="0" y1="30" x2="100%" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                      <line x1="0" y1="90" x2="100%" y2="90" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                      <line x1="0" y1="150" x2="100%" y2="150" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />

                      {/* Construct Line Path */}
                      {(() => {
                        const widthScale = stats.progressData.length > 1 ? 100 / (stats.progressData.length - 1) : 100;
                        const points = stats.progressData.map((d, i) => {
                          const x = stats.progressData.length > 1 ? `${i * widthScale}%` : "50%";
                          const y = 200 - ((d.score / 300) * 160 + 20); // Keep pad 20
                          return { x, y, val: d.score, label: d.label, accuracy: d.accuracy };
                        });

                        const pathD = stats.progressData.length > 1
                          ? `M ${points.map(p => `${p.x} ${p.y}`).join(" L ")}`
                          : `M 0 ${points[0].y} L 100% ${points[0].y}`;
                        const areaD = stats.progressData.length > 1
                          ? `${pathD} L 100% 200 L 0% 200 Z`
                          : `M 0 ${points[0].y} L 100% ${points[0].y} L 100% 200 L 0 200 Z`;

                        return (
                          <>
                            <path d={areaD} fill="url(#lineGlow)" />
                            <path d={pathD} fill="transparent" stroke="var(--primary)" strokeWidth="3" style={{ transition: "all 0.5s ease" }} />
                            {points.map((p, idx) => (
                              <g key={idx}>
                                <circle
                                  cx={p.x}
                                  cy={p.y}
                                  r={hoveredProgressIndex === idx ? 8 : 5}
                                  fill="white"
                                  stroke="var(--primary)"
                                  strokeWidth="3"
                                  style={{ cursor: "pointer", transition: "r 0.2s" }}
                                  onMouseEnter={() => setHoveredProgressIndex(idx)}
                                  onMouseLeave={() => setHoveredProgressIndex(null)} />
                                <text x={p.x} y="195" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">
                                  {p.label}
                                </text>
                              </g>
                            ))}
                          </>
                        );
                      })()}
                    </svg>

                    {/* Tooltip Overlay */}
                    {hoveredProgressIndex !== null && (
                      <div style={{
                        position: "absolute", top: "10px", left: "50%", transform: "translateX(-50%)",
                        background: "rgba(15, 23, 42, 0.95)", border: "1px solid var(--primary)",
                        padding: "0.5rem 1rem", borderRadius: "8px", fontSize: "0.85rem", zIndex: 10
                      }}>
                        <strong style={{ color: "white" }}>{stats.progressData[hoveredProgressIndex].label}</strong>
                        <p style={{ margin: "2px 0 0" }}>Score: <span style={{ color: "var(--coin)", fontWeight: "bold" }}>{stats.progressData[hoveredProgressIndex].score}/300</span></p>
                        <p style={{ margin: 0 }}>Accuracy: <span style={{ color: "var(--success)" }}>{stats.progressData[hoveredProgressIndex].accuracy}%</span></p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* 2. Study Time Bar Chart */}
            <div className="glass-panel" style={{ minHeight: "350px", display: "flex", flexDirection: "column" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.2rem", color: "white" }}>Weekly Study Time Analytics</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Track hours studied per day throughout the current week</p>
              </div>

              <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                {!stats || !stats.studyHoursData.some(d => d.hours > 0) ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "200px", color: "var(--text-secondary)", fontSize: "0.95rem", textAlign: "center", padding: "1rem" }}>
                    <p style={{ margin: 0 }}>No study hours logged this week.</p>
                    <Link href="/study-planner" style={{ color: "var(--accent)", marginTop: "0.5rem", fontWeight: 600 }}>
                      Start your first study session →
                    </Link>
                  </div>
                ) : (
                  <>
                    <svg width="100%" height="200" style={{ overflow: "visible" }}>
                      {/* Gridlines */}
                      <line x1="0" y1="50" x2="100%" y2="50" stroke="rgba(255,255,255,0.05)" />
                      <line x1="0" y1="100" x2="100%" y2="100" stroke="rgba(255,255,255,0.05)" />
                      <line x1="0" y1="150" x2="100%" y2="150" stroke="rgba(255,255,255,0.05)" />

                      {(() => {
                        const barWidth = 35;
                        const length = stats.studyHoursData.length;
                        const spacing = 100 / length;

                        return stats.studyHoursData.map((d, i) => {
                          const barHeight = (d.hours / 10) * 150;
                          const x = `${i * spacing + spacing / 3}%`;
                          const y = 170 - barHeight;

                          return (
                            <g key={i}>
                              <rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                                rx="6"
                                fill={hoveredStudyIndex === i ? "var(--accent)" : "rgba(244, 63, 94, 0.75)"}
                                style={{ cursor: "pointer", transition: "fill 0.2s" }}
                                onMouseEnter={() => setHoveredStudyIndex(i)}
                                onMouseLeave={() => setHoveredStudyIndex(null)} />
                              <text x={x} dx={barWidth / 2} y="192" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">
                                {d.day}
                              </text>
                            </g>
                          );
                        });
                      })()}
                    </svg>

                    {/* Tooltip Overlay */}
                    {hoveredStudyIndex !== null && (
                      <div style={{
                        position: "absolute", top: "10px", left: "50%", transform: "translateX(-50%)",
                        background: "rgba(15, 23, 42, 0.95)", border: "1px solid var(--accent)",
                        padding: "0.5rem 1rem", borderRadius: "8px", fontSize: "0.85rem", zIndex: 10
                      }}>
                        <strong style={{ color: "white" }}>{stats.studyHoursData[hoveredStudyIndex].day}</strong>
                        <p style={{ margin: "2px 0 0" }}>Study Time: <span style={{ color: "var(--accent)", fontWeight: "bold" }}>{stats.studyHoursData[hoveredStudyIndex].hours} Hours</span></p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

          </div>

          {/* Row 2: Applications vs Selections & Cutoff Trends */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "2.5rem" }} />          {/* 3. Applications vs Selections Ratio Chart */}
          <div
            className="glass-panel"
            style={{
              minHeight: "350px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.2rem", color: "white" }}>Exam Success & Selection Ratios</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Compares yearly applicants to final seats available</p>
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem", justifyContent: "center" }}>
              {!stats || stats.appVsSelData.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "200px", color: "var(--text-secondary)", fontSize: "0.95rem", textAlign: "center", padding: "1rem" }}>
                  <p style={{ margin: 0 }}>No target exams configured.</p>
                  <Link href="/counselor" style={{ color: "var(--primary)", marginTop: "0.5rem", fontWeight: 600 }}>
                    Select a target exam with AI Counselor →
                  </Link>
                </div>
              ) : (
                stats.appVsSelData.map((d, idx) => {
                  const percent = (d.selections / d.applicants) * 100;
                  const fillWidth = Math.max(2, Math.log10(d.selections) / Math.log10(d.applicants) * 100);

                  return (
                    <div key={idx} style={{ position: "relative" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.3rem" }}>
                        <span style={{ fontWeight: 600, color: "white" }}>{d.exam}</span>
                        <span style={{ color: "var(--text-secondary)" }}>
                          {d.selections.toLocaleString()} / {d.applicants.toLocaleString()} ({percent.toFixed(2)}% rate)
                        </span>
                      </div>
                      <div style={{ width: "100%", height: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "5px", overflow: "hidden" }}>
                        <div style={{
                          width: `${fillWidth}%`, height: "100%",
                          background: "linear-gradient(to right, var(--primary), var(--secondary))",
                          borderRadius: "5px", transition: "width 1s ease"
                        }}></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 4. Cutoff Trends Line Chart */}
          <div className="glass-panel" style={{ minHeight: "350px", display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.2rem", color: "white" }}>Target Exam Cutoff Trends</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Historical cutoff marks over the last 5 years</p>
            </div>

            <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {!stats || stats.cutoffTrendsData.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "200px", color: "var(--text-secondary)", fontSize: "0.95rem", textAlign: "center", padding: "1rem" }}>
                  <p style={{ margin: 0 }}>No cutoff trends available for target exams.</p>
                  <Link href="/exams" style={{ color: "var(--coin)", marginTop: "0.5rem", fontWeight: 600 }}>
                    Explore exams directory →
                  </Link>
                </div>
              ) : (
                <>
                  <svg width="100%" height="200" style={{ overflow: "visible" }}>
                    <line x1="0" y1="40" x2="100%" y2="40" stroke="rgba(255,255,255,0.05)" />
                    <line x1="0" y1="100" x2="100%" y2="100" stroke="rgba(255,255,255,0.05)" />
                    <line x1="0" y1="160" x2="100%" y2="160" stroke="rgba(255,255,255,0.05)" />

                    {(() => {
                      const widthScale = stats.cutoffTrendsData.length > 1 ? 100 / (stats.cutoffTrendsData.length - 1) : 100;
                      const maxVal = Math.max(...stats.cutoffTrendsData.map(d => d.score), 100);
                      const points = stats.cutoffTrendsData.map((d, i) => {
                        const x = stats.cutoffTrendsData.length > 1 ? `${i * widthScale}%` : "50%";
                        const y = 200 - ((d.score / maxVal) * 150 + 10);
                        return { x, y, score: d.score, year: d.year };
                      });

                      const pathD = stats.cutoffTrendsData.length > 1
                        ? `M ${points.map(p => `${p.x} ${p.y}`).join(" L ")}`
                        : `M 0 ${points[0].y} L 100% ${points[0].y}`;

                      return (
                        <>
                          <path d={pathD} fill="transparent" stroke="var(--coin)" strokeWidth="3" />
                          {points.map((p, idx) => (
                            <g key={idx}>
                              <circle
                                cx={p.x}
                                cy={p.y}
                                r={hoveredCutoffIndex === idx ? 7 : 4}
                                fill="white"
                                stroke="var(--coin)"
                                strokeWidth="3"
                                style={{ cursor: "pointer", transition: "r 0.2s" }}
                                onMouseEnter={() => setHoveredCutoffIndex(idx)}
                                onMouseLeave={() => setHoveredCutoffIndex(null)} />
                              <text x={p.x} y="195" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">
                                {p.year}
                              </text>
                            </g>
                          ))}
                        </>
                      );
                    })()}
                  </svg>

                  {/* Tooltip Overlay */}
                  {hoveredCutoffIndex !== null && (
                    <div style={{
                      position: "absolute", top: "10px", left: "50%", transform: "translateX(-50%)",
                      background: "rgba(15, 23, 42, 0.95)", border: "1px solid var(--coin)",
                      padding: "0.5rem 1rem", borderRadius: "8px", fontSize: "0.85rem", zIndex: 10
                    }}>
                      <strong style={{ color: "white" }}>Year {stats.cutoffTrendsData[hoveredCutoffIndex].year}</strong>
                      <p style={{ margin: "2px 0 0" }}>Cutoff: <span style={{ color: "var(--coin)", fontWeight: "bold" }}>{stats.cutoffTrendsData[hoveredCutoffIndex].score} Marks</span></p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

        </div>

        {/* Row 3: Career Salary Growth Curve */}
        <div className="glass-panel" style={{ minHeight: "380px", display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", color: "white" }}>Experience vs Salary Growth Curve (LPA)</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Compares average salary trajectories over 12 years of experience</p>
          </div>

          <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {!stats || stats.careerGrowthData.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "220px", color: "var(--text-secondary)", fontSize: "0.95rem", textAlign: "center", padding: "1rem" }}>
                <p style={{ margin: 0 }}>No target careers configured in your profile.</p>
                <Link href="/counselor" style={{ color: "var(--primary)", marginTop: "0.5rem", fontWeight: 600 }}>
                  Consult the AI Counselor to select target careers →
                </Link>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1rem", fontSize: "0.85rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "white" }}>
                    <span style={{ width: "12px", height: "4px", background: "var(--primary)", borderRadius: "2px" }}></span> Tech Industry
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "white" }}>
                    <span style={{ width: "12px", height: "4px", background: "var(--success)", borderRadius: "2px" }}></span> Corporate Finance
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "white" }}>
                    <span style={{ width: "12px", height: "4px", background: "var(--accent)", borderRadius: "2px" }}></span> Civil Administration
                  </span>
                </div>

                <svg width="100%" height="220" style={{ overflow: "visible" }}>
                  {/* Gridlines */}
                  <line x1="0" y1="40" x2="100%" y2="40" stroke="rgba(255,255,255,0.05)" />
                  <line x1="0" y1="100" x2="100%" y2="100" stroke="rgba(255,255,255,0.05)" />
                  <line x1="0" y1="160" x2="100%" y2="160" stroke="rgba(255,255,255,0.05)" />

                  {(() => {
                    const widthScale = stats.careerGrowthData.length > 1 ? 100 / (stats.careerGrowthData.length - 1) : 100;

                    const techPoints = stats.careerGrowthData.map((d, i) => ({
                      x: `${i * widthScale}%`,
                      y: 220 - ((d.tech / 60) * 160 + 20),
                      val: d.tech,
                      label: d.years
                    }));

                    const finPoints = stats.careerGrowthData.map((d, i) => ({
                      x: `${i * widthScale}%`,
                      y: 220 - ((d.finance / 60) * 160 + 20),
                      val: d.finance,
                      label: d.years
                    }));

                    const civPoints = stats.careerGrowthData.map((d, i) => ({
                      x: `${i * widthScale}%`,
                      y: 220 - ((d.civil / 60) * 160 + 20),
                      val: d.civil,
                      label: d.years
                    }));

                    const techD = `M ${techPoints.map(p => `${p.x} ${p.y}`).join(" L ")}`;
                    const finD = `M ${finPoints.map(p => `${p.x} ${p.y}`).join(" L ")}`;
                    const civD = `M ${civPoints.map(p => `${p.x} ${p.y}`).join(" L ")}`;

                    return (
                      <>
                        <path d={techD} fill="transparent" stroke="var(--primary)" strokeWidth="3" />
                        <path d={finD} fill="transparent" stroke="var(--success)" strokeWidth="3" />
                        <path d={civD} fill="transparent" stroke="var(--accent)" strokeWidth="3" />

                        {stats.careerGrowthData.map((d, i) => (
                          <g key={i}>
                            <circle
                              cx={techPoints[i].x}
                              cy={techPoints[i].y}
                              r={hoveredGrowthIndex === i ? 6 : 4}
                              fill="white"
                              stroke="var(--primary)"
                              strokeWidth="2"
                              style={{ cursor: "pointer" }}
                              onMouseEnter={() => setHoveredGrowthIndex(i)}
                              onMouseLeave={() => setHoveredGrowthIndex(null)} />
                            <circle
                              cx={finPoints[i].x}
                              cy={finPoints[i].y}
                              r={hoveredGrowthIndex === i ? 6 : 4}
                              fill="white"
                              stroke="var(--success)"
                              strokeWidth="2"
                              style={{ cursor: "pointer" }}
                              onMouseEnter={() => setHoveredGrowthIndex(i)}
                              onMouseLeave={() => setHoveredGrowthIndex(null)} />
                            <circle
                              cx={civPoints[i].x}
                              cy={civPoints[i].y}
                              r={hoveredGrowthIndex === i ? 6 : 4}
                              fill="white"
                              stroke="var(--accent)"
                              strokeWidth="2"
                              style={{ cursor: "pointer" }}
                              onMouseEnter={() => setHoveredGrowthIndex(i)}
                              onMouseLeave={() => setHoveredGrowthIndex(null)} />
                            <text x={techPoints[i].x} y="215" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">
                              {d.years}
                            </text>
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>

                {/* Tooltip Overlay */}
                {hoveredGrowthIndex !== null && (
                  <div style={{
                    position: "absolute", top: "10px", left: "50%", transform: "translateX(-50%)",
                    background: "rgba(15, 23, 42, 0.95)", border: "1px solid var(--primary)",
                    padding: "0.5rem 1rem", borderRadius: "8px", fontSize: "0.85rem", zIndex: 10
                  }}>
                    <strong style={{ color: "white" }}>Salary trajectory at {stats.careerGrowthData[hoveredGrowthIndex].years}</strong>
                    <p style={{ margin: "2px 0 0" }}>Tech: <span style={{ color: "var(--primary)", fontWeight: "bold" }}>₹{stats.careerGrowthData[hoveredGrowthIndex].tech} LPA</span></p>
                    <p style={{ margin: 0 }}>Finance: <span style={{ color: "var(--success)", fontWeight: "bold" }}>₹{stats.careerGrowthData[hoveredGrowthIndex].finance} LPA</span></p>
                    <p style={{ margin: 0 }}>Civil: <span style={{ color: "var(--accent)", fontWeight: "bold" }}>₹{stats.careerGrowthData[hoveredGrowthIndex].civil} LPA</span></p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </div>

      <div>
        {/* dashboard content */}

        <style
          dangerouslySetInnerHTML={{
            __html: `
        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `,
          }}
        />
      </div>
    </div>
  )
}


