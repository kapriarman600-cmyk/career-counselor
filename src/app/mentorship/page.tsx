import { prisma } from "../../lib/db";
import { cookies } from "next/headers";
import { Briefcase } from "lucide-react";
import MentorshipClientList from "./MentorshipClientList";

export const dynamic = "force-dynamic";

export default async function MentorshipPage() {
  // Fetch mentors
  const mentors = await prisma.mentorProfile.findMany({
    orderBy: { experienceYears: "desc" }
  });

  // Fetch current user if logged in
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get("session_user_id")?.value;
  let currentUser = null;

  if (sessionUserId) {
    currentUser = await prisma.user.findUnique({
      where: { id: sessionUserId },
      select: {
        id: true,
        name: true,
        eduCoins: true
      }
    });
  }

  return (
    <div>
      {/* Header */}
      <div style={{ background: "linear-gradient(to bottom, rgba(99, 102, 241, 0.1), transparent)", padding: "4rem 0 2rem" }}>
        <div className="container">
          <div className="badge animate-slide-up" style={{ background: "rgba(99, 102, 241, 0.2)", color: "var(--primary)", marginBottom: "1rem" }}>
            <Briefcase size={14}/> Network
          </div>
          <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Expert <span className="text-gradient">Mentorship</span></h1>
          <p className="text-secondary" style={{ fontSize: "1.2rem", maxWidth: "800px" }}>
            Connect with 1-to-1 experts from Google, AI labs, law firms, and administrative fields. Book slots using your earned EduCoins.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: "1rem 2rem 5rem" }}>
        <MentorshipClientList initialMentors={mentors} currentUser={currentUser} />
      </div>
    </div>
  );
}
