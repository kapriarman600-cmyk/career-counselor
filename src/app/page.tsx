import Link from "next/link";
import { ArrowRight, BrainCircuit, Target, Trophy, BookOpen, GraduationCap, Briefcase, Sparkles, Compass } from "lucide-react";

export default function Home() {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <div className="badge animate-slide-up" style={{ marginBottom: "1.5rem" }}>
            <Sparkles size={14} /> New: AI Resume Builder Released
          </div>
          <h1 className="animate-slide-up delay-100">
            The Ultimate <span className="text-gradient">Student Success</span> Ecosystem
          </h1>
          <p className="animate-slide-up delay-200">
            CareerVerse AI is a revolutionary platform combining AI-powered career counseling, exam preparation, college discovery, and mentorship to guide Indian students from Class 8 to their dream job.
          </p>
          <div className="flex justify-center gap-4 animate-slide-up delay-300">
            <Link href="/register" className="btn-primary" style={{ padding: "1rem 2rem", fontSize: "1.1rem" }}>
              Get Started for Free <ArrowRight size={20} />
            </Link>
            <Link href="/counselor" className="btn-outline" style={{ padding: "1rem 2rem", fontSize: "1.1rem" }}>
              <BrainCircuit size={20}/> Talk to AI Counselor
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: "6rem 0", position: "relative", zIndex: 10 }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Everything you need to <span className="text-gradient">succeed</span></h2>
            <p className="text-secondary" style={{ maxWidth: "600px", margin: "0 auto" }}>Explore our 14 interconnected modules designed to provide end-to-end guidance for your career and academic journey.</p>
          </div>

          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
            
            {/* Feature 1 */}
            <div className="glass-panel">
              <div style={{ background: "rgba(99, 102, 241, 0.1)", width: "60px", height: "60px", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                <BrainCircuit size={30} className="text-primary" />
              </div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.8rem" }}>AI Career Counseling</h3>
              <p className="text-secondary" style={{ marginBottom: "1.5rem" }}>Assess your interests, personality, and aptitude. Let our AI recommend careers, create roadmaps, and forecast your growth.</p>
              <Link href="/counselor" className="text-primary font-bold" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                Try Assessment <ArrowRight size={16}/>
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel">
              <div style={{ background: "rgba(244, 63, 94, 0.1)", width: "60px", height: "60px", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                <BookOpen size={30} className="text-accent" />
              </div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.8rem" }}>150+ Exam Directory</h3>
              <p className="text-secondary" style={{ marginBottom: "1.5rem" }}>Detailed information on UPSC, JEE, NEET, SSC, and 150+ exams. Get cutoffs, syllabus, pyqs, and AI study planners.</p>
              <Link href="/exams" className="text-accent font-bold" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                Explore Exams <ArrowRight size={16}/>
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel">
              <div style={{ background: "rgba(16, 185, 129, 0.1)", width: "60px", height: "60px", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                <GraduationCap size={30} style={{ color: "var(--success)" }} />
              </div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.8rem" }}>College Discovery</h3>
              <p className="text-secondary" style={{ marginBottom: "1.5rem" }}>Search, compare, and predict colleges. Access placement data, reviews, and admission guidance for top institutions.</p>
              <Link href="/colleges" style={{ color: "var(--success)", fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                Find Colleges <ArrowRight size={16}/>
              </Link>
            </div>

            {/* Feature 4 */}
            <div className="glass-panel">
              <div style={{ background: "rgba(245, 158, 11, 0.1)", width: "60px", height: "60px", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                <Trophy size={30} style={{ color: "var(--coin)" }} />
              </div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.8rem" }}>Gamified Learning</h3>
              <p className="text-secondary" style={{ marginBottom: "1.5rem" }}>Earn EduCoins by studying, taking mock tests, and logging in. Redeem coins for premium courses and mentorship.</p>
              <Link href="/rewards" style={{ color: "var(--coin)", fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                View Rewards <ArrowRight size={16}/>
              </Link>
            </div>

            {/* Feature 5 */}
            <div className="glass-panel">
              <div style={{ background: "rgba(139, 92, 246, 0.1)", width: "60px", height: "60px", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                <Briefcase size={30} style={{ color: "var(--secondary)" }} />
              </div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.8rem" }}>Mentorship</h3>
              <p className="text-secondary" style={{ marginBottom: "1.5rem" }}>Connect with industry experts, alumni, and toppers for 1-to-1 video sessions, resume reviews, and mock interviews.</p>
              <Link href="/mentorship" style={{ color: "var(--secondary)", fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                Find Mentors <ArrowRight size={16}/>
              </Link>
            </div>

            {/* Feature 6 */}
            <div className="glass-panel">
              <div style={{ background: "rgba(56, 189, 248, 0.1)", width: "60px", height: "60px", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                <Target size={30} style={{ color: "#38bdf8" }} />
              </div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.8rem" }}>Test Series & Analytics</h3>
              <p className="text-secondary" style={{ marginBottom: "1.5rem" }}>Take timed mock tests with AI evaluation. Get deep analytics on weak areas, rank prediction, and performance heatmaps.</p>
              <Link href="/tests" style={{ color: "#38bdf8", fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                Start Practicing <ArrowRight size={16}/>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: "6rem 0", background: "linear-gradient(to right, rgba(99, 102, 241, 0.05), rgba(244, 63, 94, 0.05))" }}>
        <div className="container">
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", textAlign: "center" }}>
            <div>
              <div style={{ fontSize: "3.5rem", fontWeight: "800", fontFamily: "var(--font-outfit)", background: "linear-gradient(135deg, var(--primary), var(--secondary))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>150+</div>
              <div className="text-secondary font-bold">Exams Covered</div>
            </div>
            <div>
              <div style={{ fontSize: "3.5rem", fontWeight: "800", fontFamily: "var(--font-outfit)", background: "linear-gradient(135deg, var(--primary), var(--secondary))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>10K+</div>
              <div className="text-secondary font-bold">Mock Tests</div>
            </div>
            <div>
              <div style={{ fontSize: "3.5rem", fontWeight: "800", fontFamily: "var(--font-outfit)", background: "linear-gradient(135deg, var(--primary), var(--secondary))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>500+</div>
              <div className="text-secondary font-bold">Expert Mentors</div>
            </div>
            <div>
              <div style={{ fontSize: "3.5rem", fontWeight: "800", fontFamily: "var(--font-outfit)", background: "linear-gradient(135deg, var(--primary), var(--secondary))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>2M+</div>
              <div className="text-secondary font-bold">EduCoins Rewarded</div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}
