"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Calendar, Target, Clock, BrainCircuit, Loader2, BookOpen, 
  CheckSquare, Check, Square, Plus, Trash2, Award, 
  Activity, Bell, BellRing, Sparkles, Trophy 
} from "lucide-react";

type StudyTask = { id: string; title: string; date: string; durationMins: number; isCompleted: boolean; };
type Habit = { id: string; title: string; streak: number; lastCompleted: string | null; };
type Goal = { id: string; title: string; targetDate: string; isCompleted: boolean; category: string; };
type Reminder = { id: string; title: string; dateTime: string; isCompleted: boolean; };

export default function StudyPlanner() {
  const searchParams = useSearchParams();
  const initialExamParam = searchParams.get("exam") || "UPSC CSE";

  // AI Generator state
  const [generatorData, setGeneratorData] = useState({
    exam: initialExamParam,
    level: "Beginner",
    hours: "6",
    months: "6"
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPlan, setAiPlan] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"ai" | "tasks" | "habits" | "reminders" | "analytics">("tasks");

  // Database lists
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [coins, setCoins] = useState(0);

  // Inputs
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskHours, setNewTaskHours] = useState("60");
  const [newTaskDate, setNewTaskDate] = useState("");
  
  const [newHabitTitle, setNewHabitTitle] = useState("");
  
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalCategory, setNewGoalCategory] = useState("STUDY");
  const [newGoalDate, setNewGoalDate] = useState("");
  
  const [newReminderTitle, setNewReminderTitle] = useState("");
  const [newReminderDate, setNewReminderDate] = useState("");

  // Load data from DB on mount
  useEffect(() => {
    fetchPlannerData();
  }, []);

  const fetchPlannerData = async () => {
    try {
      const res = await fetch("/api/planner");
      const data = await res.json();
      if (data.authenticated) {
        setAuthenticated(true);
        setTasks(data.tasks || []);
        setHabits(data.habits || []);
        setGoals(data.goals || []);
        setReminders(data.reminders || []);
      }
      
      // Also fetch user coins
      const sessionRes = await fetch("/api/session");
      const sessionData = await sessionRes.json();
      if (sessionData.authenticated) {
        setCoins(sessionData.user.eduCoins);
      }
    } catch (err) {
      console.error("Error loading planner data:", err);
    }
  };

  const handleGenerateAI = async () => {
    setAiLoading(true);
    setAiPlan(null);
    try {
      const res = await fetch("/api/study-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(generatorData)
      });
      const data = await res.json();
      if (res.ok) {
        setAiPlan(data.plan);
      } else {
        setAiPlan("Failed to generate plan. Please try again.");
      }
    } catch (error) {
      setAiPlan("Network error. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  // Add Item handler
  const handleAddItem = async (type: "task" | "habit" | "goal" | "reminder") => {
    if (!authenticated) {
      alert("Please sign up or log in to manage your planner items and earn EduCoins!");
      return;
    }

    let payload: any = { type };
    if (type === "task") {
      if (!newTaskTitle.trim()) return;
      payload.title = newTaskTitle;
      payload.date = newTaskDate || new Date().toISOString().split("T")[0];
      payload.durationMins = parseInt(newTaskHours) || 60;
    } else if (type === "habit") {
      if (!newHabitTitle.trim()) return;
      payload.title = newHabitTitle;
    } else if (type === "goal") {
      if (!newGoalTitle.trim()) return;
      payload.title = newGoalTitle;
      payload.category = newGoalCategory;
      payload.targetDate = newGoalDate || new Date(Date.now() + 7*24*60*60*1000).toISOString().split("T")[0];
    } else if (type === "reminder") {
      if (!newReminderTitle.trim()) return;
      payload.title = newReminderTitle;
      payload.dateTime = newReminderDate || new Date(Date.now() + 24*60*60*1000).toISOString();
    }

    try {
      const res = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        if (type === "task") {
          setTasks([...tasks, data.item]);
          setNewTaskTitle("");
        } else if (type === "habit") {
          setHabits([...habits, data.item]);
          setNewHabitTitle("");
        } else if (type === "goal") {
          setGoals([...goals, data.item]);
          setNewGoalTitle("");
        } else if (type === "reminder") {
          setReminders([...reminders, data.item]);
          setNewReminderTitle("");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle status
  const handleToggleCompleted = async (type: "task" | "habit" | "goal" | "reminder", id: string, currentVal: boolean) => {
    try {
      const payload: any = { type, id };
      if (type === "habit") {
        payload.incrementStreak = true;
      } else {
        payload.isCompleted = !currentVal;
      }

      const res = await fetch("/api/planner", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        // Reload planner items and balance
        fetchPlannerData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete item
  const handleDeleteItem = async (type: "task" | "habit" | "goal" | "reminder", id: string) => {
    try {
      const res = await fetch("/api/planner", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id })
      });
      if (res.ok) {
        if (type === "task") setTasks(tasks.filter(t => t.id !== id));
        else if (type === "habit") setHabits(habits.filter(h => h.id !== id));
        else if (type === "goal") setGoals(goals.filter(g => g.id !== id));
        else if (type === "reminder") setReminders(reminders.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Completion calculation for analytics
  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const totalTasks = tasks.length;
  const taskPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const completedGoals = goals.filter(g => g.isCompleted).length;
  const totalGoals = goals.length;
  const goalPercent = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <div style={{ minHeight: "calc(100vh - 80px)", position: "relative", paddingBottom: "5rem" }}>
      {/* Background element */}
      <div style={{ position: "absolute", top: "10%", left: "5%", width: "300px", height: "300px", background: "var(--primary)", filter: "blur(150px)", opacity: 0.1, zIndex: -1 }}></div>

      <div className="container" style={{ padding: "4rem 2rem 2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div className="badge" style={{ marginBottom: "1rem" }}><BrainCircuit size={14}/> Interactive Suite</div>
            <h1 style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>Syllabus & <span className="text-gradient">Study Planner</span></h1>
            <p className="text-secondary" style={{ maxWidth: "600px" }}>
              Combine AI schedule generation with live trackers for tasks, habits, and goals to earn EduCoins.
            </p>
          </div>

          {authenticated && (
            <div className="glass-panel" style={{ padding: "1rem 1.5rem", margin: 0, display: "flex", alignItems: "center", gap: "0.8rem", borderLeft: "4px solid var(--coin)" }}>
              <Trophy size={20} style={{ color: "var(--coin)" }} />
              <div>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Gamification Reward</p>
                <h4 style={{ margin: 0, color: "white" }}>{coins} EduCoins</h4>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border-light)", gap: "0.5rem", marginBottom: "2.5rem", overflowX: "auto" }}>
          <button 
            onClick={() => setActiveTab("tasks")} 
            className={`nav-item ${activeTab === "tasks" ? "active" : ""}`}
            style={{ padding: "1rem", borderBottom: activeTab === "tasks" ? "2px solid var(--primary)" : "none", color: activeTab === "tasks" ? "var(--primary)" : "var(--text-secondary)", fontWeight: 600, display: "flex", gap: "0.5rem", alignItems: "center" }}
          >
            <CheckSquare size={18}/> Daily & Weekly Tasks
          </button>
          <button 
            onClick={() => setActiveTab("habits")} 
            className={`nav-item ${activeTab === "habits" ? "active" : ""}`}
            style={{ padding: "1rem", borderBottom: activeTab === "habits" ? "2px solid var(--primary)" : "none", color: activeTab === "habits" ? "var(--primary)" : "var(--text-secondary)", fontWeight: 600, display: "flex", gap: "0.5rem", alignItems: "center" }}
          >
            <Award size={18}/> Habits & Goals
          </button>
          <button 
            onClick={() => setActiveTab("reminders")} 
            className={`nav-item ${activeTab === "reminders" ? "active" : ""}`}
            style={{ padding: "1rem", borderBottom: activeTab === "reminders" ? "2px solid var(--primary)" : "none", color: activeTab === "reminders" ? "var(--primary)" : "var(--text-secondary)", fontWeight: 600, display: "flex", gap: "0.5rem", alignItems: "center" }}
          >
            <Bell size={18}/> Reminders
          </button>
          <button 
            onClick={() => setActiveTab("ai")} 
            className={`nav-item ${activeTab === "ai" ? "active" : ""}`}
            style={{ padding: "1rem", borderBottom: activeTab === "ai" ? "2px solid var(--primary)" : "none", color: activeTab === "ai" ? "var(--primary)" : "var(--text-secondary)", fontWeight: 600, display: "flex", gap: "0.5rem", alignItems: "center" }}
          >
            <BrainCircuit size={18}/> AI Schedule Roadmap
          </button>
          <button 
            onClick={() => setActiveTab("analytics")} 
            className={`nav-item ${activeTab === "analytics" ? "active" : ""}`}
            style={{ padding: "1rem", borderBottom: activeTab === "analytics" ? "2px solid var(--primary)" : "none", color: activeTab === "analytics" ? "var(--primary)" : "var(--text-secondary)", fontWeight: 600, display: "flex", gap: "0.5rem", alignItems: "center" }}
          >
            <Activity size={18}/> Progress Analytics
          </button>
        </div>

        {/* Tab Contents */}
        <div>
          
          {/* TAB 1: Tasks */}
          {activeTab === "tasks" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "flex-start" }}>
              {/* Add task panel */}
              <div className="glass-panel">
                <h3 style={{ fontSize: "1.4rem", marginBottom: "1.5rem", color: "white" }}>Log New Study Task</h3>
                
                <div className="form-group">
                  <label className="label">Task Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Solve JEE Mathematics integration MCQs" 
                    className="input-field" 
                    value={newTaskTitle}
                    onChange={e => setNewTaskTitle(e.target.value)}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div>
                    <label className="label">Duration (Minutes)</label>
                    <input 
                      type="number" 
                      className="input-field" 
                      value={newTaskHours}
                      onChange={e => setNewTaskHours(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Scheduled Date</label>
                    <input 
                      type="date" 
                      className="input-field" 
                      value={newTaskDate}
                      onChange={e => setNewTaskDate(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  onClick={() => handleAddItem("task")} 
                  className="btn-primary" 
                  style={{ width: "100%", display: "flex", justifyContent: "center", gap: "0.5rem", padding: "1rem" }}
                >
                  <Plus size={18}/> Log Task (+10 Coins on Finish)
                </button>
              </div>

              {/* Tasks List */}
              <div className="glass-panel" style={{ minHeight: "350px", display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: "1.4rem", marginBottom: "1.5rem", color: "white" }}>Daily Checklist</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1 }}>
                  {tasks.map((task) => (
                    <div 
                      key={task.id} 
                      style={{ 
                        display: "flex", justifyItems: "center", justifyContent: "space-between", 
                        padding: "1rem", borderRadius: "12px", background: "rgba(0,0,0,0.15)",
                        border: "1px solid var(--border-light)", 
                        opacity: task.isCompleted ? 0.6 : 1
                      }}
                    >
                      <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
                        <button 
                          onClick={() => handleToggleCompleted("task", task.id, task.isCompleted)}
                          style={{ color: "var(--primary)", cursor: "pointer" }}
                        >
                          {task.isCompleted ? <CheckSquare size={20}/> : <Square size={20}/>}
                        </button>
                        <div>
                          <p style={{ textDecoration: task.isCompleted ? "line-through" : "none", color: "white", fontWeight: 500 }}>
                            {task.title}
                          </p>
                          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                            {task.durationMins} minutes • {new Date(task.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteItem("task", task.id)}
                        style={{ color: "var(--text-muted)", cursor: "pointer" }}
                      >
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  ))}
                  {tasks.length === 0 && (
                    <div style={{ textAlign: "center", margin: "auto", color: "var(--text-secondary)", padding: "2rem" }}>
                      <CheckSquare size={36} style={{ opacity: 0.3, marginBottom: "0.5rem" }}/>
                      <p>Your task list is empty. Add a task to start tracking!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Habits & Goals */}
          {activeTab === "habits" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "flex-start" }}>
              {/* Habits Column */}
              <div className="glass-panel">
                <h3 style={{ fontSize: "1.4rem", marginBottom: "1.5rem", color: "white" }}>Daily Habit Tracker</h3>
                
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
                  <input 
                    type="text" 
                    placeholder="New habit, e.g. Study 1hr Math..." 
                    className="input-field" 
                    style={{ margin: 0 }}
                    value={newHabitTitle}
                    onChange={e => setNewHabitTitle(e.target.value)}
                  />
                  <button onClick={() => handleAddItem("habit")} className="btn-primary" style={{ padding: "0 1rem" }}>
                    <Plus size={20}/>
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {habits.map((habit) => (
                    <div 
                      key={habit.id} 
                      style={{ 
                        display: "flex", justifyItems: "center", justifyContent: "space-between", 
                        padding: "1rem", borderRadius: "12px", background: "rgba(0,0,0,0.15)",
                        border: "1px solid var(--border-light)"
                      }}
                    >
                      <div>
                        <p style={{ color: "white", fontWeight: 500 }}>{habit.title}</p>
                        <span style={{ fontSize: "0.8rem", color: "var(--coin)", display: "flex", alignItems: "center", gap: "0.2rem", marginTop: "0.3rem" }}>
                          <Trophy size={12}/> Streak: {habit.streak} days
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
                        <button 
                          onClick={() => handleToggleCompleted("habit", habit.id, false)}
                          className="badge" 
                          style={{ background: "rgba(16, 185, 129, 0.2)", color: "var(--success)", padding: "0.4rem 0.8rem", cursor: "pointer", border: "none" }}
                        >
                          Log Check (+5 Coins)
                        </button>
                        <button 
                          onClick={() => handleDeleteItem("habit", habit.id)}
                          style={{ color: "var(--text-muted)", cursor: "pointer" }}
                        >
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </div>
                  ))}
                  {habits.length === 0 && (
                    <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "1.5rem" }}>No habits logged yet.</p>
                  )}
                </div>
              </div>

              {/* Goals Column */}
              <div className="glass-panel">
                <h3 style={{ fontSize: "1.4rem", marginBottom: "1.5rem", color: "white" }}>Milestone Goal Tracker</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem", background: "rgba(0,0,0,0.1)", padding: "1rem", borderRadius: "12px" }}>
                  <input 
                    type="text" 
                    placeholder="Goal title, e.g. Score 200+ in Mains mock test" 
                    className="input-field" 
                    value={newGoalTitle}
                    onChange={e => setNewGoalTitle(e.target.value)}
                  />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <select 
                      className="input-field"
                      value={newGoalCategory}
                      onChange={e => setNewGoalCategory(e.target.value)}
                    >
                      <option value="STUDY">Study Goals</option>
                      <option value="EXAM">Exam milestones</option>
                      <option value="CAREER">Career roadmap</option>
                    </select>
                    <input 
                      type="date" 
                      className="input-field"
                      value={newGoalDate}
                      onChange={e => setNewGoalDate(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={() => handleAddItem("goal")} 
                    className="btn-primary" 
                    style={{ display: "flex", justifyItems: "center", justifyContent: "center", gap: "0.5rem" }}
                  >
                    <Plus size={18}/> Set Goal (+25 Coins on Success)
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {goals.map((goal) => (
                    <div 
                      key={goal.id} 
                      style={{ 
                        display: "flex", justifyItems: "center", justifyContent: "space-between", 
                        padding: "1rem", borderRadius: "12px", background: "rgba(0,0,0,0.15)",
                        border: "1px solid var(--border-light)",
                        opacity: goal.isCompleted ? 0.6 : 1
                      }}
                    >
                      <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
                        <button 
                          onClick={() => handleToggleCompleted("goal", goal.id, goal.isCompleted)}
                          style={{ color: "var(--success)", cursor: "pointer" }}
                        >
                          {goal.isCompleted ? <CheckSquare size={20}/> : <Square size={20}/>}
                        </button>
                        <div>
                          <p style={{ textDecoration: goal.isCompleted ? "line-through" : "none", color: "white", fontWeight: 500 }}>
                            {goal.title}
                          </p>
                          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                            Category: {goal.category} • Target: {new Date(goal.targetDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteItem("goal", goal.id)}
                        style={{ color: "var(--text-muted)", cursor: "pointer" }}
                      >
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  ))}
                  {goals.length === 0 && (
                    <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "1.5rem" }}>No milestones listed.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Reminders */}
          {activeTab === "reminders" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "flex-start" }}>
              <div className="glass-panel">
                <h3 style={{ fontSize: "1.4rem", marginBottom: "1.5rem", color: "white" }}>Set Visual Study Reminder</h3>
                
                <div className="form-group">
                  <label className="label">Reminder Subject</label>
                  <input 
                    type="text" 
                    placeholder="e.g. UPSC polity session with Mentor Sharma" 
                    className="input-field" 
                    value={newReminderTitle}
                    onChange={e => setNewReminderTitle(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "2rem" }}>
                  <label className="label">Scheduled Time & Date</label>
                  <input 
                    type="datetime-local" 
                    className="input-field" 
                    value={newReminderDate}
                    onChange={e => setNewReminderDate(e.target.value)}
                  />
                </div>

                <button 
                  onClick={() => handleAddItem("reminder")} 
                  className="btn-primary" 
                  style={{ width: "100%", display: "flex", justifyItems: "center", justifyContent: "center", gap: "0.5rem", padding: "1rem" }}
                >
                  <BellRing size={18}/> Schedule Reminder
                </button>
              </div>

              {/* Reminders List */}
              <div className="glass-panel" style={{ minHeight: "300px" }}>
                <h3 style={{ fontSize: "1.4rem", marginBottom: "1.5rem", color: "white" }}>Scheduled Reminders</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {reminders.map((rem) => (
                    <div 
                      key={rem.id} 
                      style={{ 
                        display: "flex", justifyItems: "center", justifyContent: "space-between", 
                        padding: "1rem", borderRadius: "12px", background: "rgba(255,165,0,0.05)",
                        border: "1px solid rgba(255,165,0,0.2)"
                      }}
                    >
                      <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
                        <BellRing size={18} className="text-warning"/>
                        <div>
                          <p style={{ color: "white", fontWeight: 500 }}>{rem.title}</p>
                          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                            Alert on: {new Date(rem.dateTime).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteItem("reminder", rem.id)}
                        style={{ color: "var(--text-muted)", cursor: "pointer" }}
                      >
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  ))}
                  {reminders.length === 0 && (
                    <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--text-secondary)" }}>
                      No reminders scheduled.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AI Planner */}
          {activeTab === "ai" && (
            <div style={{ display: "grid", gridTemplateColumns: aiPlan ? "1fr 2fr" : "max-content", justifyContent: "center", gap: "2rem" }}>
              
              {/* Form Panel */}
              <div className="glass-panel" style={{ width: "100%", maxWidth: "450px", height: "fit-content" }}>
                <h3 style={{ marginBottom: "1.5rem", fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Target size={20} className="text-primary"/> Plan Parameters
                </h3>
                
                <div className="form-group">
                  <label className="label">Target Exam</label>
                  <select 
                    className="input-field" 
                    value={generatorData.exam} 
                    onChange={e => setGeneratorData({...generatorData, exam: e.target.value})}
                  >
                    <option value="UPSC CSE">UPSC Civil Services</option>
                    <option value="JEE Advanced">JEE Advanced</option>
                    <option value="NEET UG">NEET UG</option>
                    <option value="SSC CGL">SSC CGL</option>
                    <option value="CAT">CAT (MBA)</option>
                    <option value="GATE">GATE</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="label">Current Preparation Level</label>
                  <select 
                    className="input-field" 
                    value={generatorData.level} 
                    onChange={e => setGeneratorData({...generatorData, level: e.target.value})}
                  >
                    <option value="Beginner">Beginner (Starting fresh)</option>
                    <option value="Intermediate">Intermediate (Completed 50% syllabus)</option>
                    <option value="Advanced">Advanced (Revision & Mocks)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="label">Daily Study Hours Available</label>
                  <div style={{ position: "relative" }}>
                    <Clock size={18} className="text-secondary" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                    <input 
                      type="number" 
                      min="1" 
                      max="16" 
                      className="input-field" 
                      style={{ paddingLeft: "2.5rem" }} 
                      value={generatorData.hours} 
                      onChange={e => setGeneratorData({...generatorData, hours: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: "2rem" }}>
                  <label className="label">Time until Exam (Months)</label>
                  <div style={{ position: "relative" }}>
                    <Calendar size={18} className="text-secondary" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                    <input 
                      type="number" 
                      min="1" 
                      max="24" 
                      className="input-field" 
                      style={{ paddingLeft: "2.5rem" }} 
                      value={generatorData.months} 
                      onChange={e => setGeneratorData({...generatorData, months: e.target.value})} 
                    />
                  </div>
                </div>

                <button className="btn-primary" style={{ width: "100%", padding: "1rem" }} onClick={handleGenerateAI} disabled={aiLoading}>
                  {aiLoading ? <><Loader2 className="animate-spin" size={20} /> Generating Plan...</> : <><BrainCircuit size={20} /> Generate AI Study Plan</>}
                </button>
              </div>

              {/* Result Panel */}
              {aiPlan && (
                <div className="glass-panel animate-slide-up" style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border-light)" }}>
                    <h3 style={{ fontSize: "1.4rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <BookOpen size={24} className="text-accent" /> Your Custom Roadmap
                    </h3>
                  </div>
                  
                  <div style={{ flex: 1, overflowY: "auto", paddingRight: "1rem" }}>
                    <div 
                      className="prose prose-invert"
                      style={{ 
                        whiteSpace: "pre-wrap", 
                        lineHeight: "1.8",
                        color: "var(--text-secondary)" 
                      }}
                    >
                      {aiPlan.split('\n').map((line, i) => {
                        if (line.startsWith('# ')) return <h1 key={i} style={{ color: 'white', marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.8rem' }}>{line.replace('# ', '')}</h1>
                        if (line.startsWith('## ')) return <h2 key={i} style={{ color: 'var(--primary)', marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.5rem' }}>{line.replace('## ', '')}</h2>
                        if (line.startsWith('### ')) return <h3 key={i} style={{ color: 'white', marginTop: '1rem', marginBottom: '0.5rem', fontSize: '1.2rem' }}>{line.replace('### ', '')}</h3>
                        if (line.startsWith('- ')) return <li key={i} style={{ marginLeft: '1rem', marginBottom: '0.2rem' }}>{line.replace('- ', '')}</li>
                        if (line.trim() === '') return <br key={i} />
                        return <p key={i} style={{ marginBottom: '0.5rem' }}>{line}</p>
                      })}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 5: Analytics */}
          {activeTab === "analytics" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "stretch" }}>
              
              {/* Task Meter */}
              <div className="glass-panel" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyItems: "center", justifyContent: "center" }}>
                <h3 style={{ fontSize: "1.4rem", marginBottom: "2rem" }}>Task Completion Status</h3>
                
                {/* SVG Progress Circle */}
                <div style={{ position: "relative", width: "160px", height: "160px", marginBottom: "2rem" }}>
                  <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="80" cy="80" r="70" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                    <circle 
                      cx="80" 
                      cy="80" 
                      r="70" 
                      fill="transparent" 
                      stroke="var(--primary)" 
                      strokeWidth="12" 
                      strokeDasharray={2 * Math.PI * 70}
                      strokeDashoffset={2 * Math.PI * 70 * (1 - taskPercent / 100)}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
                    />
                  </svg>
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                    <h2 style={{ fontSize: "2.2rem", margin: 0 }}>{taskPercent}%</h2>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Done</p>
                  </div>
                </div>
                
                <p className="text-secondary">
                  You have completed **{completedTasks}** out of **{totalTasks}** registered tasks.
                </p>
              </div>

              {/* Milestone Meter */}
              <div className="glass-panel" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyItems: "center", justifyContent: "center" }}>
                <h3 style={{ fontSize: "1.4rem", marginBottom: "2rem" }}>Milestone Progress</h3>
                
                <div style={{ position: "relative", width: "160px", height: "160px", marginBottom: "2rem" }}>
                  <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="80" cy="80" r="70" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                    <circle 
                      cx="80" 
                      cy="80" 
                      r="70" 
                      fill="transparent" 
                      stroke="var(--success)" 
                      strokeWidth="12" 
                      strokeDasharray={2 * Math.PI * 70}
                      strokeDashoffset={2 * Math.PI * 70 * (1 - goalPercent / 100)}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
                    />
                  </svg>
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                    <h2 style={{ fontSize: "2.2rem", margin: 0, color: "var(--success)" }}>{goalPercent}%</h2>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Achieved</p>
                  </div>
                </div>

                <p className="text-secondary">
                  You have cleared **{completedGoals}** out of **{totalGoals}** primary academic goals.
                </p>
              </div>

            </div>
          )}

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .nav-item.active { border-bottom: 2px solid var(--primary) !important; color: var(--primary) !important; }
      `}} />
    </div>
  );
}
