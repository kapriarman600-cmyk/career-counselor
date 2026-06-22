import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid message format' }, { status: 400 });
    }

    const lastUserMessage = messages[messages.length - 1]?.content || "";
    const cleanUserMessage = lastUserMessage.toLowerCase();

    // System prompt definition
    const systemPrompt = "You are a professional, empathetic, and highly knowledgeable AI Career Counselor named PathFinder. Your goal is to guide students and professionals through their career journeys, provide tailored advice based on their interests, suggest actionable next steps, and help with resumes or interview preparation. You are part of the 'CareerVerse AI' ecosystem. Keep responses concise, engaging, and structured.";

    // Try calling OpenRouter
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
          signal: AbortSignal.timeout(8000) // 8 second timeout to fail fast
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({ reply });
          }
        } else {
          console.warn("OpenRouter API returned non-OK status:", response.status);
        }
      } catch (apiError) {
        console.error("OpenRouter fetch failed, switching to dynamic counselor engine:", apiError);
      }
    }

    // Dynamic Rule-Based AI Fallback Counselor Engine
    let reply = "";

    if (cleanUserMessage.includes("hello") || cleanUserMessage.includes("hi ") || cleanUserMessage.trim() === "hi") {
      reply = "Hello! I am your AI Career Counselor PathFinder. I'm here to help you navigate your academic and professional path. To get started, tell me: Are you a school student (which class?), a college student, or a working professional? What subjects or fields interest you most?";
    } else if (cleanUserMessage.includes("computer") || cleanUserMessage.includes("code") || cleanUserMessage.includes("program") || cleanUserMessage.includes("coding") || cleanUserMessage.includes("software") || cleanUserMessage.includes("developer") || cleanUserMessage.includes("cs")) {
      reply = `Software engineering and tech are excellent, high-growth fields! Here is a structured guidance sheet for you:

### 🌟 Recommended Careers
1. **Software Developer:** Build web, mobile, and system apps.
2. **AI/ML Engineer:** Train neural networks and build predictive models.
3. **Data Scientist:** Analyze data for business forecasting.
4. **Cyber Security Analyst:** Safeguard networks against hacks.

### 🏫 Top Institutions
- **IITs (Bombay, Delhi, Madras)** - admission via JEE Advanced.
- **IIIT Hyderabad / Bangalore** - famous for coding curriculum.
- **BITS Pilani / NIT Trichy** - outstanding placements and student communities.

### 📝 Actionable Next Steps
1. **Learn a Language:** Master Python (for AI/Data Science) or C++/Java (for core DSA).
2. **DSA Foundations:** Practice Data Structures & Algorithms on platforms like LeetCode.
3. **Build Projects:** Create a GitHub profile and host 2-3 personal full-stack projects.
4. **Entrance Prep:** If in school, focus heavily on Math & Physics for JEE. If in college, prepare for GATE or study system design.`;
    } else if (cleanUserMessage.includes("medical") || cleanUserMessage.includes("doctor") || cleanUserMessage.includes("mbbs") || cleanUserMessage.includes("neet") || cleanUserMessage.includes("biology") || cleanUserMessage.includes("biotech")) {
      reply = `Healthcare is a noble and highly stable profession. Here are your pathways:

### 🌟 Recommended Careers
1. **Clinical Practitioner (Doctor - MBBS):** General medicine, surgery, pediatrics.
2. **Biotechnologist:** Work in genomics, drug development, or agricultural research.
3. **Pharmacist:** Manage pharmaceutical operations or research.

### 🏫 Top Institutions
- **AIIMS New Delhi** - The gold standard of medical education.
- **JIPMER Puducherry** - Elite facilities and clinical exposure.
- **Maulana Azad Medical College (Delhi)** - Highly competitive state setup.

### 📝 Actionable Next Steps
1. **Master NCERT:** Focus 100% on class 11 and 12 NCERT Biology, Chemistry, and Physics.
2. **Crack NEET-UG:** Practice previous year NEET papers and maintain an 'error notebook' for mock tests.
3. **Explore Specializations:** Research MD/MS fields (Cardiology, Pediatrics, General Surgery) to align your long-term interest.`;
    } else if (cleanUserMessage.includes("civil") || cleanUserMessage.includes("upsc") || cleanUserMessage.includes("ias") || cleanUserMessage.includes("ips") || cleanUserMessage.includes("government") || cleanUserMessage.includes("govt") || cleanUserMessage.includes("ssc")) {
      reply = `Civil Services and Government administration offer unparalleled social impact, authority, and job security in India.

### 🌟 Key Pathways
1. **UPSC Civil Services:** Gateway to IAS (Administrative), IPS (Police), IFS (Foreign), and central services.
2. **State PSC Exams:** Entry to state-level administrative roles (SDM, DSP).
3. **SSC CGL:** Recruits inspectors and officers in central ministries.

### 📝 Actionable Next Steps
1. **Daily Newspaper Reading:** Read *The Hindu* or *The Indian Express* editorials to build opinion and current affairs base.
2. **Understand the Syllabus:** Memorize the UPSC syllabus structure (Prelims GS/CSAT, Mains 9 papers).
3. **Choose Optional wisely:** Pick a graduation subject or one you enjoy for the two Optional Papers (500 marks).
4. **Answer Writing:** Practice writing logical, balanced answers in 150-250 words daily.`;
    } else if (cleanUserMessage.includes("law") || cleanUserMessage.includes("lawyer") || cleanUserMessage.includes("clat") || cleanUserMessage.includes("legal")) {
      reply = `A career in Law is intellectually stimulating and highly diverse, ranging from court litigation to corporate boards.

### 🌟 Recommended Sectors
1. **Corporate Lawyer:** Manage mergers, contracts, and IP compliance for firms.
2. **Litigating Advocate:** Practice criminal, civil, or constitutional law in courts.
3. **Judicial Services:** Clear state exams to become a Judge.

### 🏫 Top Institutions
- **NLSIU Bangalore** - The top National Law School in India.
- **NALSAR Hyderabad & NUJS Kolkata** - Elite corporate law placements.

### 📝 Actionable Next Steps
1. **Prepare for CLAT:** Focus on English comprehension, logical reasoning, and legal reasoning.
2. **Develop Critical Thinking:** Read analytical editorials and practice debating.
3. **Earn a Degree:** Pursue a 5-year integrated BA LLB or BBA LLB from a top law university.`;
    } else if (cleanUserMessage.includes("business") || cleanUserMessage.includes("mba") || cleanUserMessage.includes("manage") || cleanUserMessage.includes("management") || cleanUserMessage.includes("consult")) {
      reply = `Management and consulting are fast-paced, high-reward corporate careers.

### 🌟 Recommended Careers
1. **Management Consultant:** Solve complex strategic problems for Fortune 500 firms.
2. **Product Manager:** Lead cross-functional tech teams to launch products.
3. **Investment Banker:** Manage mergers, valuations, and corporate fundraising.

### 🏫 Top Institutions
- **IIM Ahmedabad, Bangalore, Calcutta** - Elite triple-crown business schools.
- **ISB Hyderabad / XLRI Jamshedpur** - Famous for post-grad consulting roles.

### 📝 Actionable Next Steps
1. **Prepare for CAT/GMAT:** Focus on Quantitative Aptitude, DILR puzzles, and English comprehension (VARC).
2. **Academic Consistency:** Maintain high grades in 10th, 12th, and college, as B-schools evaluate past academic scores.
3. **Build Leadership Profile:** Engage in college societies, take responsibilities, and secure internships.`;
    } else if (cleanUserMessage.includes("design") || cleanUserMessage.includes("creative") || cleanUserMessage.includes("ux") || cleanUserMessage.includes("ui") || cleanUserMessage.includes("artist") || cleanUserMessage.includes("art")) {
      reply = `Design is a highly creative, user-centric career path that merges psychology, visual art, and tech.

### 🌟 Recommended Careers
1. **UI/UX Designer:** Craft user interfaces and mobile app screen flows.
2. **Product Designer:** Design physical objects and consumer devices.
3. **Communication/Graphic Designer:** Brand logo assets, advertising layouts, and animations.

### 🏫 Top Institutions
- **NID Ahmedabad** - Premier design institute.
- **IDC School of Design (IIT Bombay) / NIFT Delhi** - Elite placements and labs.

### 📝 Actionable Next Steps
1. **Master Design Tools:** Learn Figma (for UI/UX) or Adobe Photoshop/Illustrator.
2. **Build a Portfolio:** Host your case studies and visual mockups on Behance or Dribbble.
3. **Entrance Prep:** If aiming for B.Des, prepare for NID DAT or UCEED exams (visual thinking & spatial questions).`;
    } else if (cleanUserMessage.includes("commerce") || cleanUserMessage.includes("ca ") || cleanUserMessage.includes("chartered") || cleanUserMessage.includes("finance") || cleanUserMessage.includes("banking") || cleanUserMessage.includes("cs ")) {
      reply = `Commerce, finance, and accounting form the core backbone of corporate business operations.

### 🌟 Recommended Careers
1. **Chartered Accountant (CA):** Handle taxation audits and corporate accounting sheets.
2. **Financial Analyst:** Study market trends and guide company portfolio investments.
3. **Company Secretary (CS):** Advise corporate boards on regulatory compliance.

### 📝 Actionable Next Steps
1. **CA Registration:** If interested in CA, register with ICAI after class 12 and clear CA Foundation.
2. **Develop Analytical Skills:** Build proficiency in MS Excel, financial modeling, and macroeconomics.
3. **Academic Degrees:** Pursue B.Com or BBA from a reputable college while studying for CFA (Finance) or CA certification.`;
    } else {
      reply = `That sounds like an interesting direction! To help me give you the most detailed, tailored advice, could you share a bit more?
      
1. **What stream or subjects** do you enjoy studying most (e.g., Mathematics, Biology, Economics, Humanities, Design)?
2. **What is your target career goal** (e.g., tech industry, medical, government services, creative design, corporate finance)?
3. **Are you preparing for any entrance exams** (like JEE, NEET, CLAT, UPSC, CAT)?
      
Once you share these details, I will construct a personalized, step-by-step roadmap for you!`;
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
