"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Star, Clock, Trophy, Calendar, CheckCircle2, AlertCircle, X, ChevronRight } from "lucide-react";

interface Mentor {
  id: string;
  userId: string;
  name: string | null;
  photo: string | null;
  expertise: string | null;
  experienceYears: number;
  rating: number;
  totalSessions: number;
  hourlyRateCoins: number;
  education: string | null;
  skills: string | null;
  guidanceAreas: string | null;
  availability: string | null;
  bio: string | null;
}

interface CurrentUser {
  id: string;
  name: string;
  eduCoins: number;
}

interface MentorshipClientListProps {
  initialMentors: Mentor[];
  currentUser: CurrentUser | null;
}

export default function MentorshipClientList({ initialMentors, currentUser }: MentorshipClientListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userCoins, setUserCoins] = useState(currentUser?.eduCoins || 0);

  const filteredMentors = initialMentors.filter(mentor => {
    const searchString = `${mentor.name || ""} ${mentor.expertise || ""} ${mentor.skills || ""} ${mentor.bio || ""}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const handleOpenBooking = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setBookingDate("");
    setBookingTime("");
    setBookingSuccess(false);
    setBookingError("");
  };

  const handleCloseBooking = () => {
    setSelectedMentor(null);
  };

  const handleConfirmBooking = async () => {
    if (!bookingDate || !bookingTime) {
      setBookingError("Please select both a date and time slot.");
      return;
    }

    setLoading(true);
    setBookingError("");

    try {
      const res = await fetch("/api/mentorship/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mentorId: selectedMentor?.id })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to book session");
      }

      setUserCoins(data.userCoins);
      setBookingSuccess(true);
      
      // Update session info in header dynamically if needed (forces page updates)
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    } catch (err: any) {
      setBookingError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Search & User Stats */}
      <div style={{ display: "flex", gap: "2rem", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem", flexWrap: "wrap" }}>
        
        {/* Search */}
        <div style={{ flex: 1, minWidth: "280px", position: "relative" }}>
          <Search size={18} className="text-secondary" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text" 
            placeholder="Search mentors by name, company, skill..." 
            className="input-field" 
            style={{ paddingLeft: "2.8rem", margin: 0 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* User Balance display */}
        {currentUser ? (
          <div className="glass-panel" style={{ padding: "0.8rem 1.5rem", margin: 0, display: "flex", alignItems: "center", gap: "1rem" }}>
            <div>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Your Balance</p>
              <h4 style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "white" }}>
                <Trophy size={16} style={{ color: "var(--coin)" }} /> {userCoins} EduCoins
              </h4>
            </div>
          </div>
        ) : (
          <Link href="/login" className="btn-outline">
            Login to Book Mentors
          </Link>
        )}
      </div>

      {/* Mentors Grid */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "2.5rem" }}>
        {filteredMentors.map((mentor) => (
          <div key={mentor.id} className="glass-panel" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            
            {/* Header info */}
            <div style={{ display: "flex", gap: "1.2rem", marginBottom: "1.5rem", alignItems: "flex-start" }}>
              <img 
                src={mentor.photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"} 
                alt={mentor.name || "Mentor"} 
                style={{ width: "65px", height: "65px", borderRadius: "12px", objectFit: "cover", background: "rgba(255,255,255,0.05)" }}
              />
              <div>
                <h3 style={{ fontSize: "1.3rem", color: "white", marginBottom: "0.3rem" }}>{mentor.name}</h3>
                <p style={{ color: "var(--primary)", fontSize: "0.9rem", fontWeight: 500 }}>{mentor.education}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "0.4rem", fontSize: "0.85rem" }}>
                  <Star size={14} fill="var(--coin)" color="var(--coin)"/>
                  <span style={{ color: "white", fontWeight: "bold" }}>{mentor.rating.toFixed(1)}</span>
                  <span style={{ color: "var(--text-secondary)" }}>({mentor.totalSessions} sessions completed)</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-secondary" style={{ fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "1.5rem", flex: 1 }}>
              {mentor.bio}
            </p>

            {/* Technical details */}
            <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ marginBottom: "0.6rem" }}>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.2rem" }}>Expertise</p>
                <span style={{ fontSize: "0.9rem", color: "white" }}>{mentor.expertise}</span>
              </div>
              <div style={{ marginBottom: "0.6rem" }}>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.2rem" }}>Availability</p>
                <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Clock size={14}/> {mentor.availability || "Flexible"}
                </span>
              </div>
            </div>

            {/* Skills chips */}
            {mentor.skills && (
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                {mentor.skills.split(",").map((s) => (
                  <span key={s} style={{ fontSize: "0.75rem", background: "rgba(99, 102, 241, 0.1)", color: "var(--primary)", padding: "0.2rem 0.5rem", borderRadius: "6px", fontWeight: 500 }}>
                    {s.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Cost and Action button */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", borderTop: "1px solid var(--border-light)", paddingTop: "1rem" }}>
              <div>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Session Cost</p>
                <strong style={{ display: "flex", alignItems: "center", gap: "0.2rem", color: "var(--coin)", fontSize: "1.1rem" }}>
                  <Trophy size={14}/> {mentor.hourlyRateCoins} Coins/hr
                </strong>
              </div>

              <button 
                onClick={() => handleOpenBooking(mentor)}
                className="btn-primary" 
                style={{ padding: "0.6rem 1.2rem", fontSize: "0.9rem" }}
              >
                Book Session <ChevronRight size={16}/>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Booking Modal Popup */}
      {selectedMentor && (
        <div style={{ 
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
          background: "rgba(0,0,0,0.7)", zIndex: 1000, 
          display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" 
        }}>
          <div className="glass-panel animate-slide-up" style={{ maxWidth: "480px", width: "100%", padding: "2rem", position: "relative" }}>
            
            <button 
              onClick={handleCloseBooking} 
              style={{ position: "absolute", top: "1rem", right: "1rem", cursor: "pointer", color: "var(--text-secondary)" }}
            >
              <X size={20}/>
            </button>

            {bookingSuccess ? (
              <div style={{ textAlign: "center", padding: "1rem 0" }}>
                <CheckCircle2 size={60} color="var(--success)" style={{ margin: "0 auto 1.5rem" }} />
                <h3 style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>Appointment Confirmed!</h3>
                <p className="text-secondary" style={{ marginBottom: "1.5rem" }}>
                  You have successfully booked a session with **{selectedMentor.name}**. 
                  {selectedMentor.hourlyRateCoins} EduCoins have been deducted from your profile balance.
                </p>
                <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid var(--success)", padding: "1rem", borderRadius: "10px", color: "white", fontSize: "0.95rem" }}>
                  <p><strong>Date:</strong> {bookingDate}</p>
                  <p><strong>Time:</strong> {bookingTime}</p>
                </div>
                <button onClick={handleCloseBooking} className="btn-primary" style={{ marginTop: "2rem", width: "100%" }}>
                  Great, thanks!
                </button>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Confirm Session Booking</h3>
                <p className="text-secondary" style={{ fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                  Book a 1-to-1 session with **{selectedMentor.name}** ({selectedMentor.expertise}).
                </p>

                {bookingError && (
                  <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid red", color: "#fca5a5", padding: "0.75rem", borderRadius: "8px", marginBottom: "1.5rem", fontSize: "0.9rem", display: "flex", gap: "0.5rem" }}>
                    <AlertCircle size={18} style={{ flexShrink: 0 }}/>
                    <span>{bookingError}</span>
                  </div>
                )}

                {/* Form fields */}
                <div className="form-group">
                  <label className="label">Select Date</label>
                  <div style={{ position: "relative" }}>
                    <Calendar size={18} className="text-secondary" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                    <input 
                      type="date" 
                      className="input-field" 
                      style={{ paddingLeft: "2.5rem" }}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: "2rem" }}>
                  <label className="label">Select Time Slot</label>
                  <select 
                    className="input-field"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                  >
                    <option value="">-- Choose Slot --</option>
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                    <option value="05:00 PM - 06:00 PM">05:00 PM - 06:00 PM</option>
                    <option value="07:00 PM - 08:00 PM">07:00 PM - 08:00 PM</option>
                  </select>
                </div>

                {/* Cost balance overview */}
                <div style={{ 
                  background: "rgba(0,0,0,0.2)", 
                  padding: "1rem", 
                  borderRadius: "10px", 
                  marginBottom: "1.5rem", 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  fontSize: "0.9rem" 
                }}>
                  <div>
                    <span style={{ color: "var(--text-secondary)" }}>Your Balance:</span>
                    <strong style={{ color: "white", marginLeft: "0.4rem" }}>{userCoins}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-secondary)" }}>Session Cost:</span>
                    <strong style={{ color: "var(--coin)", marginLeft: "0.4rem" }}>-{selectedMentor.hourlyRateCoins}</strong>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button onClick={handleCloseBooking} className="btn-outline" style={{ flex: 1 }}>
                    Cancel
                  </button>
                  <button 
                    onClick={handleConfirmBooking} 
                    className="btn-primary" 
                    style={{ flex: 2 }}
                    disabled={loading || !currentUser || userCoins < selectedMentor.hourlyRateCoins}
                  >
                    {loading ? "Booking Slot..." : "Confirm & Pay"}
                  </button>
                </div>

                {!currentUser && (
                  <p style={{ fontSize: "0.8rem", color: "var(--accent)", marginTop: "1rem", textAlign: "center" }}>
                    Please <Link href="/login" style={{ textDecoration: "underline" }}>login</Link> to spend coins and book appointments.
                  </p>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
