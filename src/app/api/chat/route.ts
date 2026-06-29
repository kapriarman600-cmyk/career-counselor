import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

// Helper to sanitize and clean markdown JSON wrapping
function cleanJsonString(str: string): string {
  let cleaned = str.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

// GET handler to fetch previous chat history
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get('session_user_id')?.value;

    if (!sessionUserId) {
      return NextResponse.json({ messages: [] }, { status: 200 });
    }

    const dbMessages = await prisma.chatMessage.findMany({
      where: { userId: sessionUserId },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({
      messages: dbMessages.map(m => ({
        role: m.role,
        content: m.content
      }))
    }, { status: 200 });
  } catch (error: any) {
    console.error('GET chat history error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

// POST handler to chat with personalization
export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid message format' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get('session_user_id')?.value;

    let user = null;
    let isGuest = true;

    // Retrieve authenticated user
    if (sessionUserId) {
      user = await prisma.user.findUnique({
        where: { id: sessionUserId },
        include: {
          profile: true,
          mockTests: {
            orderBy: { createdAt: 'asc' }
          },
          studyPlans: {
            include: {
              tasks: true
            }
          }
        }
      });
      if (user) {
        isGuest = false;
      }
    }

    // Fallback to default student if not logged in
    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: 'student@example.com' },
        include: {
          profile: true,
          mockTests: {
            orderBy: { createdAt: 'asc' }
          },
          studyPlans: {
            include: {
              tasks: true
            }
          }
        }
      });
    }

    // Ensure user has a profile record
    let profile = user?.profile;
    if (user && !profile) {
      profile = await prisma.studentProfile.create({
        data: {
          userId: user.id,
          currentClass: 'Class 12',
          studyStreak: 0,
          longestStreak: 0
        }
      });
    }

    // Save user's message to the database if logged in
    const lastUserMessage = messages[messages.length - 1]?.content || "";
    if (!isGuest && user) {
      await prisma.chatMessage.create({
        data: {
          userId: user.id,
          role: 'user',
          content: lastUserMessage
        }
      });
    }

    // Compile Mock Test Attempts summary
    let mockTestsSummary = "No mock tests attempted yet. Encourage the student to take mock tests in the practice tab to unlock insights.";
    if (user && user.mockTests.length > 0) {
      const totalScore = user.mockTests.reduce((acc, test) => acc + test.score, 0);
      const avgScore = Math.round(totalScore / user.mockTests.length);
      const avgAccuracy = (user.mockTests.reduce((acc, test) => acc + test.accuracy, 0) / user.mockTests.length).toFixed(1);

      mockTestsSummary = `The student has taken ${user.mockTests.length} mock test(s).
- Average score: ${avgScore}/300
- Average accuracy: ${avgAccuracy}%
Attempts:
` + user.mockTests.map((t, i) => `  ${i + 1}. Title: "${t.mockTestId}" - Score: ${t.score}, Accuracy: ${t.accuracy}%, Time Taken: ${t.timeTakenMins}m, Weak Areas: ${t.weakAreas || 'None specified'}`).join('\n');
    }

    // Compile Study Plans & checklist progress summary
    let studyPlansSummary = "No active study plans configured. Suggest creating one in the Syllabus Planner.";
    if (user && user.studyPlans.length > 0) {
      studyPlansSummary = user.studyPlans.map((plan, i) => {
        const totalTasks = plan.tasks.length;
        const completedTasks = plan.tasks.filter(t => t.isCompleted).length;
        const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        return `Plan ${i + 1}: Target Exam ID "${plan.targetExamId}"
- Daily study target: ${plan.dailyHours} hours
- Progress: ${completedTasks}/${totalTasks} tasks completed (${percent}%)`;
      }).join('\n');
    }

    // Determine missing fields in StudentProfile
    const missingFields = [];
    if (!profile?.currentClass) missingFields.push("class/year");
    if (!profile?.stream) missingFields.push("stream");
    if (!profile?.targetCareers) missingFields.push("target career");
    if (!profile?.targetExams) missingFields.push("target exam");
    if (!profile?.interests) missingFields.push("interests");
    if (!profile?.strengths) missingFields.push("strengths");
    if (!profile?.weaknesses) missingFields.push("weaknesses");
    if (!profile?.preferredLanguage) missingFields.push("preferred language");
    if (!profile?.educationHistory) missingFields.push("education history");

    const missingFieldsPrompt = missingFields.length > 0
      ? `The following profile information is currently missing: [${missingFields.join(', ')}].
If relevant, ask conversational follow-up questions to gather these details one by one (don't ask for all at once).`
      : "The student's profile is complete.";

    // Build personalization system prompt
    const studentProfileBlock = `
=== STUDENT CONTEXT ===
- Name: ${user?.name || 'Student'}
- Class/Year: ${profile?.currentClass || 'Not specified'}
- Stream: ${profile?.stream || 'Not specified'}
- Target Career(s): ${profile?.targetCareers || 'Not specified'}
- Target Exam(s): ${profile?.targetExams || 'Not specified'}
- Skills: ${profile?.skills || 'Not specified'}
- Learning Style: ${profile?.learningStyle || 'Not specified'}
- Interests: ${profile?.interests || 'Not specified'}
- Strengths: ${profile?.strengths || 'Not specified'}
- Weaknesses: ${profile?.weaknesses || 'Not specified'}
- Preferred Language: ${profile?.preferredLanguage || 'Not specified'}
- Education History: ${profile?.educationHistory || 'Not specified'}
- Level: ${user?.level || 1}
- EduCoins Balance: ${user?.eduCoins || 0}
- Study Streak: ${profile?.studyStreak || 0} days (Longest: ${profile?.longestStreak || 0} days)

=== MOCK TEST METRICS ===
${mockTestsSummary}

=== STUDY PLAN & SYLLABUS PROGRESS ===
${studyPlansSummary}
`;

    const systemPrompt = `You are a professional, empathetic, and highly knowledgeable AI Career Counselor named PathFinder. Your goal is to guide students through their career and academic journeys inside the 'CareerVerse AI' ecosystem.

Instead of generic guidance, you MUST use the student's profile and preparation metrics provided below to tailor your advice.
If the student asks in their preferred language (or specifies one), respond in that language.

${studentProfileBlock}

${missingFieldsPrompt}
${isGuest ? "\nIMPORTANT: The user is currently not logged in (browsing as guest). Prepend a brief, welcoming note encouraging them to register or log in to track their study plans, mock exams, and build a persistent counselor relationship. Keep this note warm and brief." : ""}

=== INSTRUCTIONS ===
1. Tailor all advice to their target career, exams, and weak areas.
2. Provide actionable recommendations (e.g. customized study hours, learning roadmaps, specific colleges, and prep strategies).
3. If critical profile fields are missing, weave in follow-up questions naturally.
4. Keep answers clean, structured with headings, and concise.

=== PROFILE SYNCHRONIZATION ===
If the user shares new details about their class, stream, targets, skills, interests, strengths, weaknesses, preferred language, or education in their message, you MUST output a JSON block wrapped in <profile_update> and </profile_update> tags at the very end of your response, listing the updated fields.
Only list fields that were newly mentioned or updated.
Format example:
<profile_update>
{
  "stream": "Science",
  "interests": "coding, astrophysics",
  "strengths": "mathematics",
  "weaknesses": "inorganic chemistry",
  "preferredLanguage": "English",
  "currentClass": "Class 12"
}
</profile_update>
Do not include empty fields or fields that did not change.`;

    const cleanUserMessage = lastUserMessage.toLowerCase();

    // Call OpenRouter
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (apiKey && apiKey !== '<your-openrouter-key>' && !apiKey.startsWith('<')) {
      try {
        const formattedMessages = [
          { role: "system", content: systemPrompt },
          ...messages.map((msg: any) => ({
            role: msg.role === 'ai' ? 'assistant' : 'user',
            content: msg.content
          }))
        ];

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "CareerVerse AI"
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash:free",
            messages: formattedMessages
          }),
          signal: AbortSignal.timeout(10000)
        });

        if (response.ok) {
          const data = await response.json();
          let reply = data.choices?.[0]?.message?.content || "";

          if (reply) {
            let cleanReply = reply;

            // Extract profile updates if present
            const tagStart = reply.indexOf("<profile_update>");
            const tagEnd = reply.indexOf("</profile_update>");

            if (tagStart !== -1 && tagEnd !== -1 && tagEnd > tagStart) {
              const jsonStr = reply.substring(tagStart + 16, tagEnd).trim();
              cleanReply = (reply.substring(0, tagStart) + reply.substring(tagEnd + 17)).trim();

              try {
                const cleanedJson = cleanJsonString(jsonStr);
                const updates = JSON.parse(cleanedJson);

                if (updates && typeof updates === 'object' && Object.keys(updates).length > 0 && !isGuest && user) {
                  const allowedFields = [
                    "currentClass", "stream", "targetExams", "targetCareers",
                    "skills", "learningStyle", "interests", "strengths",
                    "weaknesses", "preferredLanguage", "educationHistory"
                  ];
                  const updateData: any = {};
                  for (const f of allowedFields) {
                    if (updates[f] !== undefined) {
                      updateData[f] = updates[f];
                    }
                  }

                  if (Object.keys(updateData).length > 0) {
                    await prisma.studentProfile.update({
                      where: { userId: user.id },
                      data: updateData
                    });
                  }
                }
              } catch (parseError) {
                console.error("Failed to parse profile updates:", parseError, jsonStr);
              }
            }

            // Save AI reply to the database if logged in
            if (!isGuest && user) {
              await prisma.chatMessage.create({
                data: {
                  userId: user.id,
                  role: 'ai',
                  content: cleanReply
                }
              });
            }

            return NextResponse.json({ reply: cleanReply });
          }
        }
      } catch (apiError) {
        console.error("OpenRouter API error, falling back to dynamic rule engine:", apiError);
      }
    }

    // Dynamic Rule-Based AI Fallback Counselor Engine (Personalized)
    let reply = "";
    const namePart = user ? ` ${user.name.split(" ")[0]}` : "";
    const activeStream = profile?.stream || "your study area";
    const activeExam = profile?.targetExams || "exams";
    const activeCareers = profile?.targetCareers || "careers";

    if (cleanUserMessage.includes("hello") || cleanUserMessage.includes("hi ") || cleanUserMessage.trim() === "hi") {
      reply = `Hello${namePart}! I am your AI Career Counselor PathFinder. ${isGuest ? "(Please Log In or Sign Up to sync your dashboard and track progress!)\n\n" : ""}Based on your profile, you are currently focused on the **${activeStream}** stream, targeting **${activeCareers}** and preparing for **${activeExam}**.

What would you like to discuss today? We can design a study roadmap, check top colleges, or explore preparation strategies!`;
    } else if (cleanUserMessage.includes("computer") || cleanUserMessage.includes("code") || cleanUserMessage.includes("program") || cleanUserMessage.includes("coding") || cleanUserMessage.includes("software") || cleanUserMessage.includes("developer") || cleanUserMessage.includes("cs")) {
      reply = `Software and tech are high-growth pathways tailored for you, ${user?.name || "Student"}! 
      
### 🌟 Recommended Careers
1. **Software Developer:** Build web/mobile apps.
2. **AI/ML Engineer:** Build models (excellent since you are focused on ${activeStream}).
3. **Data Scientist:** Analytics and business growth.

### 🏫 Top Institutions
- **IITs** (JEE Advanced), **IIIT Hyderabad**, and **BITS Pilani**.

### 📝 Personalized Next Steps
1. **Develop Skills:** Learn Python/Java. Your profile lists skills: ${profile?.skills || "none added yet"}.
2. **Mock practice:** You average ${(user?.mockTests?.length ?? 0) > 0 ? "mock performance analytics" : "no mock attempts yet"}. Focus on mock test speed.
3. **Project Portfolio:** Host 2-3 full stack repositories on GitHub.`;
    } else if (cleanUserMessage.includes("medical") || cleanUserMessage.includes("doctor") || cleanUserMessage.includes("mbbs") || cleanUserMessage.includes("neet") || cleanUserMessage.includes("biology") || cleanUserMessage.includes("biotech")) {
      reply = `Medicine & Healthcare offer high impact. Here are your pathways:

### 🌟 Pathways
1. **Clinical Doctor (MBBS):** Clear NEET-UG.
2. **Biotech Researcher:** Great if you prefer research over clinical fields.

### 🏫 Top Colleges
- **AIIMS New Delhi**, **JIPMER Puducherry**, and **MAMC Delhi**.

### 📝 Recommendations
1. **Focus Biology:** Re-review NCERT textbooks.
2. **Address Weak Areas:** Pay attention to mock weak areas: ${(user?.mockTests || []).map(m => m.weakAreas).filter(Boolean).join(", ") || "Chemistry, Physics"}.`;
    } else if (cleanUserMessage.includes("civil") || cleanUserMessage.includes("upsc") || cleanUserMessage.includes("ias") || cleanUserMessage.includes("ips") || cleanUserMessage.includes("government") || cleanUserMessage.includes("govt")) {
      reply = `Civil Services offer unparalleled administrative scope.

### 🌟 Pathways
1. **UPSC Civil Services:** Gateway to IAS/IPS/IFS.
2. **State PSC Exams:** For state administration.

### 📝 Action Plan
1. **Newspaper Analysis:** Daily editorials in *The Hindu*.
2. **Syllabus Roadmap:** Check your study plan: ${(user?.studyPlans?.length ?? 0) > 0 ? "You have a planner configured" : "Create a study plan in the planner to organize GS papers"}.
3. **Answer Writing:** Practice descriptive GS questions daily.`;
    } else {
      reply = `That sounds like a great direction! To help me tailor a detailed roadmap, could you share a bit more?
      
1. **What stream or subjects** do you enjoy studying most (e.g. Science, Commerce, Arts)?
2. **What is your target career** (e.g. technology, medicine, administration, business)?
3. **Are you preparing for any exams** (like JEE, NEET, UPSC, CLAT)?

Once you tell me, I'll compile a customized roadmap for you!`;
    }

    // Save fallback response to database if authenticated
    if (!isGuest && user) {
      await prisma.chatMessage.create({
        data: {
          userId: user.id,
          role: 'ai',
          content: reply
        }
      });
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error.message },
      { status: 500 }
    );
  }
}
