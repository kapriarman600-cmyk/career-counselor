const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // 1. Clear existing data
  console.log("Cleaning database...");
  await prisma.coinTransaction.deleteMany({});
  await prisma.studyTask.deleteMany({});
  await prisma.studyPlan.deleteMany({});
  await prisma.mockTestAttempt.deleteMany({});
  await prisma.mockTest.deleteMany({});
  await prisma.previousPaper.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.college.deleteMany({});
  await prisma.career.deleteMany({});
  await prisma.exam.deleteMany({});
  await prisma.mentorProfile.deleteMany({});
  await prisma.studentProfile.deleteMany({});
  await prisma.habit.deleteMany({});
  await prisma.goal.deleteMany({});
  await prisma.reminder.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Seed Exams
  console.log("Seeding Exams...");
  const examsData = [
    {
      id: "upsc-cse",
      name: "UPSC Civil Services Examination",
      category: "UPSC",
      description: "Conducted by Union Public Service Commission for recruitment to various Civil Services of the Government of India, including IAS, IPS, and IFS.",
      eligibility: "Graduate degree in any discipline from a recognized university. Age limit: 21 to 32 years (relaxations apply).",
      selectionProcess: "Three stages: 1. Preliminary Examination (Objective type), 2. Main Examination (Written descriptive), 3. Personality Test (Interview).",
      salary: "₹56,100 (starting basic pay) to ₹2,50,000 (Cabinet Secretary level) per month, plus allowances.",
      difficultyLevel: "Extreme",
      successRate: 0.1,
      syllabus: "Prelims: General Studies Paper I (History, Geography, Polity, Economy, Environment) and Paper II (CSAT - Aptitude, Logic). Mains: 9 descriptive papers (Essay, 4 General Studies papers, 2 Optional papers, 2 Language papers).",
      pattern: "Prelims: 2 papers of 200 marks each. Mains: 9 written papers, total 1750 marks. Interview: 275 marks. Grand total: 2025 marks.",
      previousYearCutoffs: "2023 Prelims GS-I Cutoff: 75.41 (General). 2022 Cutoff: 88.22. Mains Cutoff: ~741 marks.",
      recommendedBooks: "Indian Polity by M. Laxmikanth, History of Modern India by Rajiv Ahir (Spectrum), Indian Economy by Ramesh Singh, Certificate Physical and Human Geography by G.C. Leong.",
      preparationStrategy: "1. Focus on core conceptual clarity. 2. Read daily newspapers (The Hindu/Indian Express). 3. Practice answer writing regularly. 4. Solve past 10 years papers and take timed mock tests.",
      resources: "Official Website: upsc.gov.in, PIB news feeds, PRS Legislative Research reports."
    },
    {
      id: "ssc-cgl",
      name: "SSC Combined Graduate Level",
      category: "SSC",
      description: "Recruits staff for various posts in ministries, departments, and organizations of the Government of India, including Inspectors, Assistants, and Officers.",
      eligibility: "Bachelor's degree in any discipline. Age limit: 18 to 32 years (post-specific).",
      selectionProcess: "Tier-I (Computer Based Exam - Qualifying) followed by Tier-II (Computer Based Exam - Merit scoring).",
      salary: "₹25,500 to ₹1,51,100 per month depending on the post grade pay (Level 4 to Level 8).",
      difficultyLevel: "High",
      successRate: 1.5,
      syllabus: "Quantitative Aptitude, General Intelligence & Reasoning, English Language & Comprehension, General Awareness. Tier II includes specialized Computer Knowledge and Data Entry speed tests.",
      pattern: "Tier I: 100 questions, 200 marks, 60 minutes. Tier II: Sectional assessment of Math, Reasoning, English, General Awareness, and Computers.",
      previousYearCutoffs: "2023 Tier I Cutoff: ~150 marks for general posts. 2022 Tier I Cutoff: ~114 marks.",
      recommendedBooks: "Quantitative Aptitude by R.S. Aggarwal, Plinth to Paramount (English) by Neetu Singh, Word Power Made Easy by Norman Lewis, General Knowledge by Lucent Publications.",
      preparationStrategy: "1. Memorize formulas, square/cube tables, and shortcuts for quantitative aptitude. 2. Work on reading speed for English. 3. Regularly practice mock tests to improve speed and accuracy.",
      resources: "Official Website: ssc.gov.in, SSC online portal updates."
    },
    {
      id: "ssc-chsl",
      name: "SSC Combined Higher Secondary Level",
      category: "SSC",
      description: "Recruits candidates for lower divisional clerk (LDC), junior secretariat assistant (JSA), and data entry operators (DEO) across Central Government ministries.",
      eligibility: "12th Class pass or equivalent from a recognized board. Age limit: 18 to 27 years.",
      selectionProcess: "Two tiers: Tier-I (Objective MCQ) and Tier-II (Objective MCQ + Typing/Skill Test).",
      salary: "₹19,900 to ₹81,100 per month depending on the designated post.",
      difficultyLevel: "Medium",
      successRate: 2.0,
      syllabus: "Basic English, General Intelligence, Quantitative Aptitude (Basic Arithmetic), General Awareness.",
      pattern: "Tier I: 100 questions of 2 marks each, total 200 marks, time 1 hour. Tier II: Section I (Math & Reasoning), Section II (English & GA), Section III (Skill/Typing Test).",
      previousYearCutoffs: "2023 Cutoff Tier I: ~153.9 (General). 2022 Cutoff: ~157.7.",
      recommendedBooks: "Lucent's General Knowledge, R.S. Aggarwal Arithmetic, Kiran Publications Chapterwise Solved Papers.",
      preparationStrategy: "1. Focus heavily on speed arithmetic. 2. Practice computer typing daily to reach 35 words per minute. 3. Keep current affairs updated.",
      resources: "Official Website: ssc.gov.in"
    },
    {
      id: "ssc-mts",
      name: "SSC Multi Tasking Staff",
      category: "SSC",
      description: "Recruitment for non-technical, general central service group 'C' non-gazetted, non-ministerial posts in various central ministries and departments.",
      eligibility: "10th Class pass (Matriculation) from a recognized board. Age limit: 18 to 27 years.",
      selectionProcess: "Single Computer Based Examination divided into two sessions (Session-I is qualifying, Session-II decides merit).",
      salary: "₹18,000 to ₹22,000 basic pay plus allowances.",
      difficultyLevel: "Easy",
      successRate: 3.0,
      syllabus: "Session I: Numerical & Mathematical Ability, Reasoning Ability. Session II: General Awareness, English Language & Comprehension.",
      pattern: "Session I: 40 questions (120 marks), no negative marking. Session II: 50 questions (150 marks), negative marking applicable.",
      previousYearCutoffs: "Varies state-wise; General cutoff usually ranges between 80% to 90% of total Session II marks.",
      recommendedBooks: "MTS Guide by Arihant Experts, Fast Track Objective Arithmetic by Rajesh Verma.",
      preparationStrategy: "1. Clear English grammar basics. 2. Read Lucent GK thoroughly. 3. Solve previous year papers.",
      resources: "Official ssc.gov.in web notification."
    },
    {
      id: "banking-exams",
      name: "IBPS / SBI PO & Clerk Exams",
      category: "Banking",
      description: "Entrance exams for recruiting Probationary Officers (PO) and Clerical cadres in Public Sector Banks and State Bank of India.",
      eligibility: "Graduation in any stream from a recognized university. Age: 20-30 years for PO, 20-28 years for Clerk.",
      selectionProcess: "Three stages for PO: Prelims (MCQ), Mains (MCQ + Descriptive Essay/Letter), and Group Discussion/Interview. Two stages for Clerk (no Interview).",
      salary: "PO: ₹52,000 - ₹65,000 gross per month. Clerk: ₹30,000 - ₹40,000.",
      difficultyLevel: "High",
      successRate: 0.8,
      syllabus: "English Language, Quantitative Aptitude (Data Interpretation heavy), Reasoning Ability, General/Economy/Banking Awareness, and Computer Aptitude.",
      pattern: "Prelims: 100 marks (60 mins, sectional timings). Mains: 200 marks objective + 25 marks descriptive (for PO).",
      previousYearCutoffs: "SBI PO Prelims Cutoff 2023: 59.5/100. Clerk Cutoffs vary by state (usually 70-80).",
      recommendedBooks: "Analytical Reasoning by M.K. Pandey, Quantitative Aptitude for Competitive Examinations by R.S. Aggarwal, Banking Awareness by Arihant Experts.",
      preparationStrategy: "1. Speed and calculation tricks are crucial. 2. Build strong command over Data Interpretation and Logical Puzzles. 3. Study banking terminology and current financial news daily.",
      resources: "ibps.in, sbi.co.in/careers"
    },
    {
      id: "railways-rrb",
      name: "RRB NTPC & Group D Exams",
      category: "Railways",
      description: "Recruitment conducted by Railway Recruitment Boards for non-technical popular categories (NTPC) and track maintainer, assistant helper posts.",
      eligibility: "NTPC: Under-graduates (12th) or Graduates. Group D: 10th pass or ITI.",
      selectionProcess: "Computer Based Test Stage-I, Stage-II, Typing Skill Test/Computer Based Aptitude Test, and Document Verification.",
      salary: "₹19,900 to ₹35,400 starting basic salary depending on level pay grades.",
      difficultyLevel: "Medium",
      successRate: 1.0,
      syllabus: "General Awareness (Science heavy), Mathematics, General Intelligence and Reasoning.",
      pattern: "Stage-I: 100 questions (General Awareness 40, Maths 30, Reasoning 30), time 90 minutes. Stage-II: 120 questions, 90 minutes.",
      previousYearCutoffs: "Normalised cutoffs range between 65 to 80 depending on the applied zone.",
      recommendedBooks: "RRB NTPC Guide by Disha Experts, General Science by Lucent.",
      preparationStrategy: "1. Practice basic general science from NCERT books (Class 6-10). 2. Revise formula sheets for math. 3. Give 2 mock tests weekly.",
      resources: "rrbcdg.gov.in and regional RRB websites."
    },
    {
      id: "nda-exam",
      name: "National Defence Academy Examination",
      category: "Defence",
      description: "Entrance exam conducted by UPSC for admission to the Army, Navy, and Air Force wings of the NDA, leading to commissioned officer ranks.",
      eligibility: "12th Class pass (Physics and Math required for Navy & Air Force). Unmarried male/female candidates. Age: 16.5 to 19.5 years.",
      selectionProcess: "Written Examination followed by Services Selection Board (SSB) Interview testing intelligence and personality.",
      salary: "Stipend of ₹56,100 during training, rising to higher lieutenant scales on commissioning.",
      difficultyLevel: "High",
      successRate: 0.5,
      syllabus: "Mathematics (Algebra, Trigonometry, Calculus, Statistics) and General Ability Test (English, Physics, Chemistry, GK, History, Geography).",
      pattern: "Math Paper: 120 questions (300 marks). GAT Paper: 150 questions (600 marks). SSB Interview: 900 marks.",
      previousYearCutoffs: "Written exam cutoff: ~350-380 out of 900 marks. Final cutoff: ~700 out of 1800 marks.",
      recommendedBooks: "Pathfinder for NDA & NA by Arihant Experts, Mathematics for NDA/NA by R.S. Aggarwal.",
      preparationStrategy: "1. Master Class 11 and 12 mathematics concepts. 2. Work on physical fitness and basic communication. 3. Read general science and historical timelines.",
      resources: "upsc.gov.in, joinindianarmy.nic.in"
    },
    {
      id: "cds-exam",
      name: "Combined Defence Services Examination",
      category: "Defence",
      description: "Conducted by UPSC for recruiting officers into the Indian Military Academy (IMA), Officers Training Academy (OTA), Indian Naval Academy (INA), and Indian Air Force Academy (AFA).",
      eligibility: "Graduate degree. Physics and Math in 12th required for Navy/AFA. Unmarried. Age limit: 19 to 25 years.",
      selectionProcess: "Written exam followed by SSB Interview (intelligence, fitness, psychological testing).",
      salary: "₹56,100 base scale rising to Lieutenant Colonel and General ranks.",
      difficultyLevel: "High",
      successRate: 0.6,
      syllabus: "English, General Knowledge, and Elementary Mathematics (for AFA, IMA, INA only; OTA requires only English and GK).",
      pattern: "IMA/INA/AFA: 3 papers of 100 marks each (total 300). OTA: 2 papers of 100 marks each (total 200).",
      previousYearCutoffs: "IMA: ~135-145, INA: ~125-135, AFA: ~145-155, OTA: ~100-110 marks.",
      recommendedBooks: "CDS Chapterwise Solved Papers by Arihant, Wren & Martin for English Grammar.",
      preparationStrategy: "1. Gain proficiency in English grammar and comprehension. 2. Keep track of military current affairs. 3. Improve physical stamina for SSB evaluation.",
      resources: "upsc.gov.in"
    },
    {
      id: "afcat-exam",
      name: "Air Force Common Admission Test",
      category: "Defence",
      description: "Conducted by the Indian Air Force for recruiting officers in Flying and Ground Duty (Technical and Non-Technical) branches.",
      eligibility: "Graduation with minimum 60% marks. Physics and Maths compulsory at 10+2 level. Age: 20 to 24 years (flying).",
      selectionProcess: "AFCAT Written Exam, followed by AFSB (Air Force Selection Board) interview rounds.",
      salary: "₹56,100 basic plus flying pay, transport allowances, and other benefits.",
      difficultyLevel: "Medium",
      successRate: 1.2,
      syllabus: "General Awareness, Verbal Ability in English, Numerical Ability, Reasoning and Military Aptitude.",
      pattern: "100 questions, 300 marks, time 2 hours. Negative marking: 1 mark deducted per wrong answer.",
      previousYearCutoffs: "Usually ranges between 150 to 165 out of 300 marks.",
      recommendedBooks: "AFCAT Self Study Guide by Arihant, Quantitative Aptitude by R.S. Aggarwal.",
      preparationStrategy: "1. Excel in English reading and logic puzzles. 2. Solve previous years question patterns. 3. Maintain good eyesight and spatial orientation.",
      resources: "afcat.cdac.in"
    },
    {
      id: "jee-advanced",
      name: "JEE Advanced",
      category: "Engineering",
      description: "The sole gateway for admission to Bachelor's, Integrated Master's, and Dual Degree programs in all 23 IITs.",
      eligibility: "Must qualify JEE Main and rank in the top 2,50,000 candidates. Maximum of 2 attempts in consecutive years.",
      selectionProcess: "Qualify JEE Main -> Pass JEE Advanced with requisite cutoffs -> Participate in JoSAA Counseling.",
      salary: "Average placements from IITs range from ₹12 LPA to ₹25+ LPA depending on the branch.",
      difficultyLevel: "Extreme",
      successRate: 0.5,
      syllabus: "Advanced conceptual Physics, Physical & Organic Chemistry, and analytical Mathematics (Class 11 and 12 syllabus).",
      pattern: "Two compulsory papers of 3 hours each. Dynamic pattern with multi-correct, integer type, and passage-based questions, including negative marking.",
      previousYearCutoffs: "Subject cutoff: ~5-10%. Aggregate cutoff: ~20-25% of total marks.",
      recommendedBooks: "Concepts of Physics by H.C. Verma, Organic Chemistry by Morrison & Boyd, IIT Mathematics by M.L. Khanna.",
      preparationStrategy: "1. Build deep physical intuition instead of memorization. 2. Solve Irodov physics problems and complex mathematics derivations. 3. Practice multi-correct options to perfection.",
      resources: "jeeadv.ac.in"
    },
    {
      id: "neet-ug",
      name: "National Eligibility cum Entrance Test (UG)",
      category: "Medical",
      description: "All-India pre-medical entrance exam for students wishing to pursue MBBS, BDS, AYUSH, and other medical courses.",
      eligibility: "Completed 10+2 with Physics, Chemistry, Biology/Biotechnology, and English. Minimum age: 17 years.",
      selectionProcess: "Single National MCQ exam -> All India/State NEET Counseling rounds.",
      salary: "MBBS Interns receive basic stipends; post-graduation salaries range from ₹80,000 to ₹3,000,000 per month.",
      difficultyLevel: "High",
      successRate: 5.0,
      syllabus: "Biology (Botany & Zoology), Physics, Chemistry based on CBSE/NCERT curriculum.",
      pattern: "200 questions (attempt 180), 720 marks, time 200 minutes. 4 marks awarded for correct answers, -1 for incorrect.",
      previousYearCutoffs: "General category qualifying percentile is 50th, but secure government seats require scoring 610+ marks out of 720.",
      recommendedBooks: "NCERT Biology (Class 11 & 12) is the Holy Grail. Physical Chemistry by O.P. Tandon, Concepts of Physics by H.C. Verma.",
      preparationStrategy: "1. Read NCERT Biology word-by-word. 2. Build quick numerical solving speed in Physics and Chemistry. 3. Practice error notebook maintenance.",
      resources: "neet.nta.nic.in"
    },
    {
      id: "cuet-ug",
      name: "Common University Entrance Test (UG)",
      category: "Management",
      description: "Gateway for admission to undergraduate programs in central, state, and private universities in India (including DU, BHU, JNU).",
      eligibility: "Class 12 pass from any recognized stream. No age bar for appearing.",
      selectionProcess: "CBT exam assessing languages, domain subjects, and general test, followed by university-wise merit allocation.",
      salary: "Varies widely based on course and university placements.",
      difficultyLevel: "Medium",
      successRate: 10.0,
      syllabus: "Section IA & IB (Languages), Section II (Domain-specific subjects based on Class 12 CBSE), Section III (General Test - GK, Math, Logic).",
      pattern: "Section-based MCQ tests with negative marking (+5 for correct, -1 for wrong).",
      previousYearCutoffs: "Normalized percentile system. Top colleges in DU require 98-99 percentile.",
      recommendedBooks: "CBSE Textbooks, General Knowledge guides by Arihant.",
      preparationStrategy: "1. Stay aligned to CBSE Class 12 textbook syllabus. 2. Practice comprehension and logical reasoning. 3. Take NTA mock drills.",
      resources: "cuet.samarth.ac.in"
    },
    {
      id: "cat-exam",
      name: "Common Admission Test",
      category: "Management",
      description: "Premium computer-based test for admission to post-graduate management programs (MBA/PGDM) in IIMs and other top B-schools.",
      eligibility: "Bachelor's degree with at least 50% marks or equivalent CGPA.",
      selectionProcess: "CAT score -> Group Discussion & Writing Ability Test (GD-WAT) -> Personal Interview (PI) based on profile score.",
      salary: "IIM average packages range from ₹18 LPA to ₹35+ LPA.",
      difficultyLevel: "High",
      successRate: 2.0,
      syllabus: "Verbal Ability & Reading Comprehension (VARC), Data Interpretation & Logical Reasoning (DILR), Quantitative Ability (QA).",
      pattern: "66 questions, 198 marks, 120 minutes with sectional limit of 40 minutes each. Includes MCQs and TITA (Type In The Answer) questions.",
      previousYearCutoffs: "IIM calls start at 95 to 99+ percentile depending on category and academic profile.",
      recommendedBooks: "How to Prepare for Quantitative Aptitude for CAT by Arun Sharma, Word Power Made Easy.",
      preparationStrategy: "1. Focus heavily on reading comprehension speed. 2. Master mental calculation and logical puzzle structures. 3. Learn to filter out hard questions early.",
      resources: "iimcat.ac.in"
    },
    {
      id: "gate-exam",
      name: "Graduate Aptitude Test in Engineering",
      category: "Engineering",
      description: "Gateway for master's programs (M.Tech/Ph.D.) and entry-level recruitment in major Public Sector Undertakings (PSUs) like ONGC, IOCL, NTPC.",
      eligibility: "Candidates in 3rd year or higher of undergraduate degree in engineering, technology, architecture, science, or commerce.",
      selectionProcess: "Computer Based Test -> COAP/CCMT counseling for post-grad or PSU interview calls.",
      salary: "PSU starting pay packages range from ₹8 LPA to ₹18 LPA with outstanding job security.",
      difficultyLevel: "High",
      successRate: 15.0,
      syllabus: "Engineering Mathematics, General Aptitude, and branch-specific core technical subjects.",
      pattern: "65 questions, 100 marks, 3 hours. Mix of Multiple Choice (MCQ), Multiple Select (MSQ), and Numerical Answer Type (NAT) questions.",
      previousYearCutoffs: "Qualifying marks range from 25 to 35 out of 100 depending on the engineering branch.",
      recommendedBooks: "Standard university textbooks for core subjects, Made Easy or Ace Academy postal packages.",
      preparationStrategy: "1. Establish a strong grasp of core engineering theory. 2. Solve previous 20-year papers. 3. Focus on Numerical Answer Type accuracy. 4. Master scientific calculator shortcuts.",
      resources: "gate.iitkgp.ac.in"
    },
    {
      id: "state-psc-exams",
      name: "State Public Service Commission Exams",
      category: "UPSC",
      description: "Recruits state administration officers (SDM, DSP, Tehsildar) for provincial civil services (PCS) in states like UP, Bihar, Maharashtra, Rajasthan.",
      eligibility: "Graduate degree. State domicile restrictions/benefits often apply. Age limit: 21 to 40 years.",
      selectionProcess: "Similar to UPSC: Prelims (Objective), Mains (Descriptive/Objective), and Personal Interview.",
      salary: "₹56,100 to ₹1,77,500 basic pay plus state allowances.",
      difficultyLevel: "High",
      successRate: 0.3,
      syllabus: "General Studies (similar to UPSC) plus comprehensive questions on history, geography, economy, polity, and culture of the specific state.",
      pattern: "Varies by state (e.g., UPPCS has descriptive mains, BPSC has mixed mains format).",
      previousYearCutoffs: "Varies widely. Usually ~60% of total prelims marks are required to qualify.",
      recommendedBooks: "State-specific boards books, UPSC core books, monthly current affairs booklets.",
      preparationStrategy: "1. Balance GS prep with dedicated focus on state-specific geography and administrative structures. 2. Learn the regional state language if required.",
      resources: "Respective state PSC websites (e.g. uppsc.up.nic.in, bpsc.bih.nic.in)."
    }
  ];

  for (const exam of examsData) {
    await prisma.exam.create({ data: exam });
  }
  console.log("Exams Seeded Successfully.");

  // 3. Seed Careers
  console.log("Seeding Careers...");
  const careersData = [
    {
      id: "engineering",
      title: "Engineering",
      industry: "Technology & Infrastructure",
      description: "Designing, building, and maintaining engines, machines, structures, software, and systems.",
      demandLevel: "High",
      averageSalary: "₹4 LPA - ₹30 LPA",
      futureScope: "Continuous expansion due to rapid digitization, smart city developments, automation, and green energy transformations.",
      requiredSkills: "Problem Solving, Analytical Thinking, Mathematics, Programming, Project Management, Teamwork.",
      overview: "Engineering spans multiple domains like Computer Science, Mechanical, Civil, Electrical, Aerospace, and Biotechnology. It is the application of scientific principles to build real-world systems.",
      eligibility: "10+2 with Physics, Chemistry, and Mathematics. Clear engineering entrance examinations.",
      topColleges: "IIT Bombay, IIT Delhi, BITS Pilani, NIT Trichy, VIT Vellore.",
      entranceExams: "JEE Main, JEE Advanced, BITSAT, VITEEE, MHTCET.",
      roadmap: "1. Complete 10+2. 2. Excel in JEE/BITSAT. 3. Earn a B.Tech/B.E. degree. 4. Build projects and do summer internships. 5. Secure placement or pursue M.Tech/MS.",
      recommendedResources: "Coursera, edX, NPTEL Lectures, standard university textbooks."
    },
    {
      id: "medical",
      title: "Medical Practitioner",
      industry: "Healthcare",
      description: "Diagnosing, treating, and managing patient health, performing surgeries, and working in medical research.",
      demandLevel: "High",
      averageSalary: "₹6 LPA - ₹50 LPA",
      futureScope: "Critical demand globally. The rise of telemedicine, robotic surgeries, and personalized gene therapies is reshaping healthcare.",
      requiredSkills: "Empathy, Clinical Knowledge, Resiliency, Attention to Detail, Decision Making.",
      overview: "Practicing medicine involves extensive study and training to become an MBBS doctor, dentist, surgeon, or clinical specialist dedicated to patient well-being.",
      eligibility: "10+2 with Physics, Chemistry, and Biology. Secure a high score in NEET-UG.",
      topColleges: "AIIMS New Delhi, JIPMER Puducherry, Maulana Azad Medical College, KGMU Lucknow.",
      entranceExams: "NEET UG, NEET PG (for specialization).",
      roadmap: "1. Pass Class 12 with PCB. 2. Clear NEET-UG. 3. Complete MBBS (4.5 years + 1 year internship). 4. Clear NEET-PG. 5. Earn MD/MS specialization.",
      recommendedResources: "Marrow, Prepladder, Robbins Pathology, Gray's Anatomy."
    },
    {
      id: "law",
      title: "Law & Legal Services",
      industry: "Legal",
      description: "Representing clients in courts, advising on legal matters, drafting contracts, and working in corporate compliance.",
      demandLevel: "Medium",
      averageSalary: "₹5 LPA - ₹40 LPA",
      futureScope: "Growth in corporate law, IP law, cyber security law, and environmental law fields.",
      requiredSkills: "Critical Reasoning, Public Speaking, Analytical Writing, Research, Negotiation.",
      overview: "Legal professionals advocate for clients, interpret statutes, draft agreements, and mediate disputes in courts or corporate settings.",
      eligibility: "Class 12 pass for 5-year integrated BA LLB, or Graduation for 3-year LLB. Clear CLAT/LSAT.",
      topColleges: "NLSIU Bangalore, NALSAR Hyderabad, NUJS Kolkata, Faculty of Law (Delhi University).",
      entranceExams: "CLAT, AILET, LSAT India, DU LLB.",
      roadmap: "1. Excel in CLAT. 2. Pursue 5-year integrated LLB. 3. Participate in moot courts and intern under advocates. 4. Pass the All India Bar Exam (AIBE). 5. Join a corporate firm or start litigating.",
      recommendedResources: "LiveLaw, Bar and Bench, Constitution of India bare act."
    },
    {
      id: "management",
      title: "Management Consultant / Manager",
      industry: "Corporate Business",
      description: "Structuring business operations, strategizing corporate growth, managing human resources, and advising executives.",
      demandLevel: "High",
      averageSalary: "₹8 LPA - ₹50 LPA",
      futureScope: "Sustained high demand for agile managers, strategy consultants, and product leaders in global firms.",
      requiredSkills: "Leadership, Strategic Planning, Business Communication, Financial Analysis, Problem Solving.",
      overview: "Managers organize teams and resources to optimize productivity, increase revenue, and navigate complex commercial environments.",
      eligibility: "Bachelor's degree in any field. MBA from a reputable business school is highly recommended.",
      topColleges: "IIM Ahmedabad, IIM Bangalore, IIM Calcutta, ISB Hyderabad, XLRI Jamshedpur.",
      entranceExams: "CAT, GMAT, XAT, SNAP.",
      roadmap: "1. Earn any undergraduate degree. 2. Gain 1-3 years of work experience (optional but helpful). 3. Score high in CAT/GMAT. 4. Complete MBA/PGDM. 5. Join strategy firms or corporate leadership tracks.",
      recommendedResources: "Harvard Business Review, McKinsey Insights, Wall Street Journal."
    },
    {
      id: "design",
      title: "Design (UI/UX, Product, Fashion)",
      industry: "Creative Industries",
      description: "Designing user interfaces, consumer products, apparel, and communication assets.",
      demandLevel: "High",
      averageSalary: "₹4 LPA - ₹25 LPA",
      futureScope: "UI/UX design is expanding exponentially due to app developments. Product designers are key for tech and physical items.",
      requiredSkills: "Creativity, Visual Empathy, Wireframing, Adobe Suite, Figma, Prototyping.",
      overview: "Designing is a user-centric discipline combining aesthetics, psychology, and functionality to improve product interactions.",
      eligibility: "Class 12 in any stream. Clear entrance exams like UCEED, NID, NIFT.",
      topColleges: "NID Ahmedabad, IDC School of Design (IIT Bombay), NIFT Delhi, Srishti Institute.",
      entranceExams: "UCEED, CEED, NID DAT, NIFT Entrance.",
      roadmap: "1. Complete 10+2. 2. Clear UCEED/NID exam. 3. Complete B.Des/M.Des. 4. Build a strong design portfolio on Behance/Dribbble. 5. Intern and join design agencies or product companies.",
      recommendedResources: "Figma tutorials, NN Group UX articles, Interaction Design Foundation."
    },
    {
      id: "government-jobs",
      title: "Government Jobs (Civil Administration)",
      industry: "Public Service",
      description: "Administrative governance, policy implementation, law enforcement, and municipal administration.",
      demandLevel: "High",
      averageSalary: "₹6 LPA - ₹20 LPA",
      futureScope: "High security, social prestige, and direct public impact. Moving towards digital e-governance systems.",
      requiredSkills: "Public Administration, Ethics, Policy Formulation, Leadership, Crisis Management.",
      overview: "Administrative officers represent the executive arm of state and central governments, managing public offices, security, and welfare policies.",
      eligibility: "Graduation in any stream. Clear state or central civil services tests.",
      topColleges: "LBSNAA Mussoorie (for training), public universities for degree.",
      entranceExams: "UPSC CSE, State PSC (UPPCS, BPSC, etc.).",
      roadmap: "1. Complete Graduation. 2. Prepare comprehensively for Civil Services. 3. Pass Prelims, Mains, and Interview. 4. Complete foundation training. 5. Take charge as Assistant Commissioner/SDM.",
      recommendedResources: "Yojana Magazine, Kurukshetra Magazine, PRS India."
    },
    {
      id: "banking",
      title: "Banking & Financial Services",
      industry: "Finance",
      description: "Retail banking, loan management, investment advisory, risk assessment, and financial auditing.",
      demandLevel: "Medium",
      averageSalary: "₹4 LPA - ₹22 LPA",
      futureScope: "Strong growth driven by fintech integrations, digital payment systems, and micro-financing.",
      requiredSkills: "Numerical Ability, Accounting, Customer Relations, Risk Management.",
      overview: "Bankers manage monetary deposits, evaluate creditworthiness, offer investment products, and manage compliance guidelines.",
      eligibility: "Graduation. Cleared IBPS/SBI bank exams.",
      topColleges: "National Institute of Bank Management, Delhi University, NMIMS.",
      entranceExams: "IBPS PO, SBI PO, IBPS Clerk.",
      roadmap: "1. Obtain a graduate degree. 2. Prepare for bank entrance exams. 3. Clear Prelims and Mains. 4. Complete training program. 5. Get posted as Assistant Manager.",
      recommendedResources: "Economic Times, CAclubindia, RBI bulletins."
    },
    {
      id: "defence",
      title: "Defence Services (Armed Forces)",
      industry: "Military",
      description: "Defending national borders, tactical combat operations, intelligence gathering, and disaster relief.",
      demandLevel: "High",
      averageSalary: "₹8 LPA - ₹25 LPA",
      futureScope: "Technological modernization of military forces (cyber warfare, drone systems) creates high-end tech-defence openings.",
      requiredSkills: "Patriotism, Leadership, Physical Fitness, Mental Toughness, Team Coordination.",
      overview: "Serving in the Indian Army, Navy, or Air Force offers a life of discipline, adventure, high honor, and leadership.",
      eligibility: "12th standard (for NDA) or Graduation (for CDS/AFCAT). Must qualify physical and medical fitness test.",
      topColleges: "NDA Khadakwasla, IMA Dehradun, INA Ezhimala, AFA Dundigal.",
      entranceExams: "NDA, CDS, AFCAT, INET.",
      roadmap: "1. Apply during 12th or graduation. 2. Clear written exams (NDA/CDS). 3. Pass 5-day SSB interview. 4. Pass medical exams. 5. Undergo training at academy.",
      recommendedResources: "SSBCrack, joinindiannavy.gov.in."
    },
    {
      id: "data-science",
      title: "Data Scientist",
      industry: "Technology",
      description: "Extracting actionable insights from structured/unstructured data using statistical modeling and programming.",
      demandLevel: "High",
      averageSalary: "₹6 LPA - ₹35 LPA",
      futureScope: "Extremely high. Data-driven decision making is now the standard across all industries (retail, healthcare, finance).",
      requiredSkills: "Python, SQL, Statistics, Machine Learning, Data Visualization (Tableau/PowerBI).",
      overview: "Data scientists clean and analyze massive datasets, building predictive models to forecast trends and optimize performance.",
      eligibility: "Graduation in Computer Science, Statistics, Mathematics, or related field.",
      topColleges: "IIT Madras (BSc Data Science), ISI Kolkata, IIIT Bangalore.",
      entranceExams: "GATE, JEE, or direct university selection.",
      roadmap: "1. Learn Python and SQL. 2. Master Probability and Statistics. 3. Build data analysis projects. 4. Learn machine learning algorithms. 5. Apply for junior analyst or scientist roles.",
      recommendedResources: "Kaggle, Towards Data Science, Fast.ai."
    },
    {
      id: "ai-ml",
      title: "AI/ML Engineer",
      industry: "Artificial Intelligence",
      description: "Designing, training, and deploying neural networks and machine learning models for natural language, vision, and recommendation.",
      demandLevel: "High",
      averageSalary: "₹8 LPA - ₹45 LPA",
      futureScope: "Explosive growth due to LLMs, generative AI, autonomous systems, and advanced robotics.",
      requiredSkills: "Deep Learning, PyTorch/TensorFlow, Linear Algebra, Python, Model Deployment (M LOps).",
      overview: "AI/ML Engineers build systems that learn from data to make decisions, translate speech, recognize images, and generate text.",
      eligibility: "B.Tech/M.Tech in CSE/IT or Mathematics, or strong self-taught machine learning portfolio.",
      topColleges: "IIT Hyderabad, IIIT Hyderabad, IIT Delhi.",
      entranceExams: "JEE Advanced, GATE.",
      roadmap: "1. Learn core software engineering. 2. Dive into Calculus, Linear Algebra, and Statistics. 3. Master PyTorch and TensorFlow. 4. Implement paper research models. 5. Deploy models on cloud (AWS/GCP).",
      recommendedResources: "Deeplearning.ai, Stanford CS231n / CS224n courses."
    },
    {
      id: "cyber-security",
      title: "Cyber Security Analyst / Engineer",
      industry: "Information Security",
      description: "Protecting organization networks, databases, and application systems from cyber threats, hacking, and leaks.",
      demandLevel: "High",
      averageSalary: "₹5 LPA - ₹30 LPA",
      futureScope: "Critical need as financial transactions, healthcare records, and cloud computing grow more vulnerable to cyber espionage.",
      requiredSkills: "Ethical Hacking, Network Security, Cryptography, Linux, Pen-Testing, Splunk.",
      overview: "Cybersecurity professionals prevent attacks, detect system breaches, perform vulnerability tests, and respond to security emergencies.",
      eligibility: "Bachelor's degree in CS/IT, or certifications like CEH, CISSP, CompTIA Security+.",
      topColleges: "National Forensic Sciences University (NFSU), IIIT Allahabad.",
      entranceExams: "GATE, JEE.",
      roadmap: "1. Learn Networking fundamentals (TCP/IP). 2. Learn Linux and bash scripting. 3. Practice on TryHackMe/HackTheBox. 4. Earn CEH/Security+ certification. 5. Seek SOC analyst positions.",
      recommendedResources: "PortSwigger Web Security Academy, TryHackMe."
    },
    {
      id: "software-development",
      title: "Software Engineer",
      industry: "Software Industry",
      description: "Writing clean, scalable code to build web, mobile, and system-level applications.",
      demandLevel: "High",
      averageSalary: "₹4 LPA - ₹40 LPA",
      futureScope: "Fundamental role driving global tech ecosystems. Continuous shift toward cloud, serverless, and mobile systems.",
      requiredSkills: "Data Structures & Algorithms, Java/C++/JS, System Design, Git, Database Management.",
      overview: "Software development is the architecture and creation of software systems that power businesses, mobile apps, websites, and infrastructure.",
      eligibility: "Graduate degree in engineering or computer applications, or coding bootcamp graduates.",
      topColleges: "IITs, NITs, IIITs, BITS Pilani, DTU.",
      entranceExams: "JEE Main, JEE Advanced, GATE, NIMCET.",
      roadmap: "1. Learn programming logic (Java/Python/C++). 2. Master Data Structures and Algorithms. 3. Build full-stack web/mobile projects. 4. Practice competitive coding on LeetCode. 5. Apply for internships/jobs.",
      recommendedResources: "LeetCode, FreeCodeCamp, GeeksforGeeks."
    },
    {
      id: "commerce",
      title: "Commerce & Trade Professional",
      industry: "Commerce",
      description: "Overseeing trade operations, supply chain flows, business accounting, and tax management.",
      demandLevel: "Medium",
      averageSalary: "₹3 LPA - ₹18 LPA",
      futureScope: "Solid growth supported by global e-commerce logistics and corporate supply chains.",
      requiredSkills: "Taxation, Commercial Law, Supply Chain Management, Auditing.",
      overview: "Commerce professionals manage retail structures, export-import legalities, bookkeeping, and trading systems.",
      eligibility: "B.Com/M.Com degree, or specialized logistics diplomas.",
      topColleges: "SRCC Delhi, LSR College, Loyola College Chennai.",
      entranceExams: "CUET, university direct admissions.",
      roadmap: "1. Complete B.Com. 2. Specialise in Supply Chain or taxation modules. 3. Learn ERP tools like SAP/Tally. 4. Work in logistics or audit firms.",
      recommendedResources: "Commerce Academy, ICAI updates."
    },
    {
      id: "finance",
      title: "Financial Analyst / Investment Banker",
      industry: "Financial Services",
      description: "Guiding investments, valuing companies, managing mergers and acquisitions (M&A), and capital restructuring.",
      demandLevel: "High",
      averageSalary: "₹8 LPA - ₹45 LPA",
      futureScope: "Growth driven by the rise of capital markets, retail investments, and venture capital flows in start-ups.",
      requiredSkills: "Financial Modeling, Valuation, Excel, Macroeconomics, Communication.",
      overview: "Finance professionals analyze corporate statements, manage risk portfolios, structure IPOs, and advise clients on capital allocation.",
      eligibility: "B.Com, BBA (Finance), CFA certification, or MBA (Finance) from top colleges.",
      topColleges: "IIMs, SRCC, NMIMS, JBIMS Mumbai.",
      entranceExams: "CAT, CFA program examinations.",
      roadmap: "1. Pursue B.Com/BBA. 2. Clear CFA Level 1. 3. Practice Excel modeling. 4. Secure corporate finance internship. 5. Clear CFA Level 2 & 3.",
      recommendedResources: "Investopedia, CFA Institute, Corporate Finance Institute."
    },
    {
      id: "ca",
      title: "Chartered Accountant (CA)",
      industry: "Accounting & Auditing",
      description: "Auditing company accounts, assessing tax returns, financial planning, and legal financial advisory.",
      demandLevel: "High",
      averageSalary: "₹7 LPA - ₹30 LPA",
      futureScope: "Guaranteed demand. CAs are mandatory for every registered business to file tax sheets and audit books.",
      requiredSkills: "Taxation, Auditing, Analytical Precision, Integrity, Indian Accounting Standards.",
      overview: "Chartered Accountants handle financial reports, tax regulations, auditing systems, and corporate corporate accounting.",
      eligibility: "Registered with ICAI. Pass Foundation, Intermediate, and Final exams.",
      topColleges: "The Institute of Chartered Accountants of India (ICAI) is the licensing body.",
      entranceExams: "CA Foundation, CA Intermediate, CA Final.",
      roadmap: "1. Register with ICAI after 12th. 2. Clear CA Foundation. 3. Clear CA Intermediate. 4. Complete 3-year articleship training. 5. Clear CA Final to obtain license.",
      recommendedResources: "ICAI study material, CA club portals."
    },
    {
      id: "cs",
      title: "Company Secretary (CS)",
      industry: "Corporate Governance",
      description: "Managing corporate law compliance, filing regulatory reports, and advising directors on legal guidelines.",
      demandLevel: "Medium",
      averageSalary: "₹5 LPA - ₹20 LPA",
      futureScope: "Increasing demand due to stricter government mandates on corporate compliance and ESG requirements.",
      requiredSkills: "Company Law, Corporate Governance, Legal Drafting, Board Room Management.",
      overview: "A Company Secretary is the principal officer ensuring that corporate actions adhere to all statutory regulations.",
      eligibility: "Passed CS Foundation (now CSEET), Executive, and Professional examinations.",
      topColleges: "Institute of Company Secretaries of India (ICSI).",
      entranceExams: "CSEET, CS Executive, CS Professional.",
      roadmap: "1. Register for CSEET after 10+2. 2. Clear CS Executive. 3. Complete articleship training. 4. Clear CS Professional. 5. Gain ICSI membership.",
      recommendedResources: "ICSI Journals and manuals."
    },
    {
      id: "digital-marketing",
      title: "Digital Marketer / Growth Hacker",
      industry: "Marketing & Advertising",
      description: "Managing online advertisement campaigns, SEO optimization, social media marketing, and customer acquisition funnels.",
      demandLevel: "High",
      averageSalary: "₹3 LPA - ₹18 LPA",
      futureScope: "High growth as ad spends shift completely from print/TV to digital platforms (Google, Meta, TikTok).",
      requiredSkills: "SEO, Copywriting, Google Ads, Meta Pixel, Web Analytics (GA4), A/B Testing.",
      overview: "Digital marketers analyze user acquisition channels and write campaigns to grow product sales and brand visibility.",
      eligibility: "Degree in marketing/communications, or self-taught portfolio with verified campaign results.",
      topColleges: "MICA Ahmedabad, Delhi University, digital training institutes.",
      entranceExams: "CUET, CAT.",
      roadmap: "1. Learn copywriting and visual design. 2. Certify in Google Ads/SEO. 3. Build a personal brand or run small budgets. 4. Scale client campaigns. 5. Get hired in tech startups.",
      recommendedResources: "Backlinko, HubSpot Academy, Google Skillshop."
    },
    {
      id: "civil-services",
      title: "Civil Services Officer (IAS/IPS)",
      industry: "Public Administration",
      description: "Managing district administration, maintain law and order, and designing policy blueprints at state/national levels.",
      demandLevel: "High",
      averageSalary: "₹56,100 starting basic (with elite perks, housing, transport).",
      futureScope: "Highly prestigious. Core leadership roles inside the Indian administrative fabric.",
      requiredSkills: "Leadership, Public Policy, Analytical Reasoning, Crisis Response.",
      overview: "Civil servants manage government departments, supervise state welfare programs, and maintain municipal stability.",
      eligibility: "Any graduation degree. Age limit 21-32 years.",
      topColleges: "Lal Bahadur Shastri National Academy of Administration (LBSNAA).",
      entranceExams: "UPSC CSE.",
      roadmap: "1. Graduate. 2. Clear UPSC Prelims. 3. Excel in Mains descriptive. 4. Clear interview. 5. Undergo training and get posted as Sub-Divisional Magistrate.",
      recommendedResources: "Press Information Bureau, PRS India bulletins."
    },
    {
      id: "teaching",
      title: "Educator / School Teacher",
      industry: "Education",
      description: "Teaching elementary, secondary, or high-school students, designing curriculums, and mentoring.",
      demandLevel: "Medium",
      averageSalary: "₹3 LPA - ₹10 LPA",
      futureScope: "Steady demand. Expansion in digital/hybrid education models and international IB board curriculums in India.",
      requiredSkills: "Patience, Lesson Planning, Classroom Management, Child Psychology.",
      overview: "Educators cultivate academic skills, values, and knowledge in students inside school settings.",
      eligibility: "Graduation + B.Ed (Bachelor of Education). Cleared Teacher Eligibility Test (TET).",
      topColleges: "Delhi University (CIE), Banaras Hindu University.",
      entranceExams: "CTET, State TETs.",
      roadmap: "1. Complete Graduation. 2. Complete B.Ed program. 3. Clear CTET exam. 4. Apply to public or private schools.",
      recommendedResources: "NCERT books, CBSE circulars."
    },
    {
      id: "research",
      title: "Research Scientist / Academician",
      industry: "R&D / Academia",
      description: "Conducting scientific lab experiments, writing research papers, and lecturing at universities.",
      demandLevel: "Medium",
      averageSalary: "₹5 LPA - ₹25 LPA",
      futureScope: "Crucial for tech innovation, medicine discovery, space ventures, and sustainable energy development.",
      requiredSkills: "Scientific Inquiry, Lab Practice, Statistical Tools, Technical Writing.",
      overview: "Scientists discover new concepts, test hypotheses, and document breakthroughs to push the boundaries of knowledge.",
      eligibility: "Postgraduate degree followed by a Ph.D. Cleared CSIR NET / UGC NET.",
      topColleges: "IISc Bangalore, TIFR Mumbai, IITs, JNU.",
      entranceExams: "CSIR NET, UGC NET, GATE.",
      roadmap: "1. Complete B.Sc / B.Tech. 2. Complete M.Sc / M.Tech. 3. Clear NET exam. 4. Pursue Ph.D. with fellowship. 5. Apply for post-doc or assistant professorship.",
      recommendedResources: "Google Scholar, ResearchGate, Nature Journal."
    },
    {
      id: "entrepreneurship",
      title: "Entrepreneur / Startup Founder",
      industry: "Business startups",
      description: "Ideating new products, raising venture capital, scaling operations, and launching companies.",
      demandLevel: "High",
      averageSalary: "Highly variable (Equity driven).",
      futureScope: "Supported heavily by 'Startup India' programs, venture capital availability, and digital markets.",
      requiredSkills: "Risk Appetite, Resilience, Product Vision, Fundraising, Hiring, Sales.",
      overview: "Entrepreneurs define a market problem, build a viable solution, assemble teams, and navigate financial risks to scale a company.",
      eligibility: "No formal degree qualification required. Passion and market understanding are core.",
      topColleges: "IITs, IIMs, BITS (incubators), Y-Combinator.",
      entranceExams: "None.",
      roadmap: "1. Identify customer pain point. 2. Build MVP (Minimum Viable Product). 3. Launch to first 100 users. 4. Raise seed funds. 5. Scale team and marketing.",
      recommendedResources: "Paul Graham Essays, Y-Combinator Startup School."
    },
    {
      id: "agriculture",
      title: "Agricultural Scientist / Agronomist",
      industry: "Agriculture",
      description: "Developing high-yielding seed variants, consulting on soil health, and introducing modern farming tech.",
      demandLevel: "Medium",
      averageSalary: "₹3 LPA - ₹12 LPA",
      futureScope: "Growing focus on sustainable farming, vertical farming, precision agriculture, and organic exports.",
      requiredSkills: "Botany, Soil Science, Climate Modeling, Agribusiness.",
      overview: "Agronomists study crop cultivation and soil chemistry to improve agricultural productivity while conserving resource health.",
      eligibility: "10+2 PCB/PCM. Bachelor's in Agriculture Science.",
      topColleges: "IARI Pusa, GBPUAT Pantnagar, Punjab Agricultural University.",
      entranceExams: "ICAR AIEEA.",
      roadmap: "1. Take PCB in 12th. 2. Pass ICAR exam. 3. Pursue B.Sc. in Agriculture (4 years). 4. Pursue M.Sc / Ph.D. 5. Work in agro-chemical firms or research setups.",
      recommendedResources: "ICAR publications, FAO reports."
    },
    {
      id: "hotel-management",
      title: "Hotel Manager / Hospitality Executive",
      industry: "Hospitality & Tourism",
      description: "Managing resort operations, food & beverage services, customer relations, and event planning.",
      demandLevel: "Medium",
      averageSalary: "₹3 LPA - ₹15 LPA",
      futureScope: "Strong bounce-back in global leisure travel, premium luxury stays, and destination events.",
      requiredSkills: "Interpersonal Skills, Multitasking, Culinary Management, Guest Relations.",
      overview: "Hospitality managers ensure operations in resorts, restaurants, and hotels run smoothly to maintain customer delight.",
      eligibility: "10+2 in any stream. Clear NCHMCT JEE.",
      topColleges: "IHM Pusa, IHM Mumbai, Oberoi Step program, Welcomgroup Academy.",
      entranceExams: "NCHMCT JEE.",
      roadmap: "1. Clear 10+2. 2. Crack NCHMCT JEE. 3. Study B.Sc Hospitality & Hotel Administration. 4. Undergo industrial training. 5. Join hotel chains in management trainee programs.",
      recommendedResources: "Hospitality Net, Cornell Hospitality Quarterly."
    },
    {
      id: "aviation",
      title: "Commercial Pilot",
      industry: "Aviation",
      description: "Operating commercial passenger or cargo aircraft, navigating flight routes, and overseeing cabin safety.",
      demandLevel: "High",
      averageSalary: "₹15 LPA - ₹60 LPA",
      futureScope: "Strong growth in domestic and international airlines ordering massive fleets in India.",
      requiredSkills: "Spatial Orientation, Split-Second Decisions, Physics, Stress Management.",
      overview: "Pilots fly transport aircraft under strict flight schedules, adhering to severe weather navigation rules.",
      eligibility: "10+2 with Physics and Mathematics. Obtain Class 2 and Class 1 Medical Fitness certificate.",
      topColleges: "Indira Gandhi Rashtriya Uran Akademi (IGRUA), NFTC Gondia.",
      entranceExams: "IGRUA Entrance Exam, DGCA Licensing Exams.",
      roadmap: "1. Pass Class 12 with Math & Physics. 2. Secure class 2 medical certificate. 3. Join a flying school. 4. Log 200 flying hours to earn Commercial Pilot License (CPL). 5. Complete type rating for commercial jets.",
      recommendedResources: "DGCA India guidelines, Jeppesen manuals."
    },
    {
      id: "journalism",
      title: "Journalist / News Anchor",
      industry: "Media & Broadcasting",
      description: "Reporting news stories, writing articles, conducting interviews, and hosting broadcast shows.",
      demandLevel: "Medium",
      averageSalary: "₹3 LPA - ₹15 LPA",
      futureScope: "Transformation into digital journalism, podcasts, independent news portals, and social media reporting.",
      requiredSkills: "Investigative Research, Writing, Communication, Video Editing, Ethics.",
      overview: "Journalists report stories of public concern, checking facts to provide unbiased news feeds to community channels.",
      eligibility: "B.J.M.C. (Bachelor of Journalism and Mass Communication) or Graduation in English/History.",
      topColleges: "IIMC New Delhi, AJK MCRC Jamia Millia, Asian College of Journalism Chennai.",
      entranceExams: "IIMC Entrance, Jamia Entrance.",
      roadmap: "1. Complete 10+2. 2. Pursue BJMC. 3. Write articles for university blogs. 4. Intern in print or television channels. 5. Secure reporting beats.",
      recommendedResources: "Columbia Journalism Review, Poynter Institute."
    },
    {
      id: "psychology",
      title: "Clinical Psychologist / Counselor",
      industry: "Mental Health Care",
      description: "Diagnosing emotional disorders, conducting therapy sessions, counseling couples, and child psychology.",
      demandLevel: "High",
      averageSalary: "₹3 LPA - ₹12 LPA",
      futureScope: "Extremely high awareness around mental health, corporate wellness, and childhood learning counseling.",
      requiredSkills: "Empathy, Active Listening, Psychological Assessment, Confidentiality.",
      overview: "Psychologists treat emotional and behavioral distress using talk therapy, diagnostics, and counseling blueprints.",
      eligibility: "B.A./B.Sc. in Psychology, M.A./M.Sc. in Clinical Psychology. M.Phil (for Clinical Psychologist license from RCI).",
      topColleges: "TISS Mumbai, NIMHANS Bangalore, Delhi University.",
      entranceExams: "NIMHANS M.Phil Entrance, university entrance exams.",
      roadmap: "1. Study Psychology in B.A. 2. Complete Masters in Clinical/Counseling Psychology. 3. Complete RCI-approved M.Phil/Psy.D. 4. Register with RCI. 5. Start clinical practice.",
      recommendedResources: "American Psychological Association (APA), Psychology Today."
    },
    {
      id: "pharmacy",
      title: "Pharmacist / Pharmacologist",
      industry: "Pharmaceuticals",
      description: "Dispensing medicines, research and development of new chemical formulas, drug safety evaluation.",
      demandLevel: "Medium",
      averageSalary: "₹3 LPA - ₹10 LPA",
      futureScope: "Consistent expansion. India is the 'Pharmacy of the world', driving massive production in generics and vaccines.",
      requiredSkills: "Chemistry knowledge, Quality Control, Lab safety, Regulatory guidelines.",
      overview: "Pharmacists work in retail dispensing or industrial research, ensuring drugs are manufactured safely and distributed ethically.",
      eligibility: "10+2 PCB/PCM. B.Pharm (Bachelor of Pharmacy) degree.",
      topColleges: "NIPER Mohali, Jamia Hamdard, BITS Pilani.",
      entranceExams: "GPAT, NIPER JEE.",
      roadmap: "1. Pass Class 12 with science. 2. Secure admission in B.Pharm. 3. Complete GPAT exam. 4. Pursue M.Pharm. 5. Join pharmaceutical labs or hospitals.",
      recommendedResources: "Indian Pharmacopoeia Commission, GPAT portals."
    },
    {
      id: "architecture",
      title: "Architect",
      industry: "Real Estate & Construction",
      description: "Designing layout schematics for houses, commercial buildings, parks, and planning city structures.",
      demandLevel: "Medium",
      averageSalary: "₹4 LPA - ₹18 LPA",
      futureScope: "Smart city initiatives, green energy-friendly buildings, and modular structures drive high innovation.",
      requiredSkills: "3D Drawing, AutoCAD/Revit, Physics, Material Selection, Creativity.",
      overview: "Architects blend aesthetic layouts with engineering safety, drafting construction blueprints for real-world projects.",
      eligibility: "10+2 with Mathematics. Clear NATA or JEE Main Paper 2.",
      topColleges: "IIT Roorkee, SPA Delhi, CEPT Ahmedabad, Sir JJ College of Architecture.",
      entranceExams: "NATA, JEE Main Paper 2.",
      roadmap: "1. Take Mathematics in 12th. 2. Pass NATA/JEE. 3. Complete B.Arch (5 years). 4. Register with Council of Architecture (CoA). 5. Practice in architectural firms.",
      recommendedResources: "ArchDaily, Council of Architecture guidelines."
    },
    {
      id: "biotechnology",
      title: "Biotechnologist",
      industry: "Biosciences",
      description: "Utilizing biological systems and organisms to design medical drugs, agricultural seed variants, and industrial chemicals.",
      demandLevel: "High",
      averageSalary: "₹4 LPA - ₹18 LPA",
      futureScope: "CRISPR gene editing, vaccine discovery, biofuel optimization, and eco-friendly waste management solutions.",
      requiredSkills: "Cell Biology, Genetics, Lab Instrumentation, Data Analysis, Bio-Informatics.",
      overview: "Biotechnologists study cellular structures and chemical processes to create bio-based products for medical, industrial, and agricultural fields.",
      eligibility: "10+2 with Biology, Chemistry, Physics. Pursue B.Tech/B.Sc. in Biotechnology.",
      topColleges: "IIT Kharagpur, DTU, VIT, JNU.",
      entranceExams: "JEE, GAT-B, GATE.",
      roadmap: "1. Complete 12th in PCB. 2. Secure B.Tech/B.Sc. in Biotechnology. 3. Gain experience in lab internships. 4. Complete M.Tech/M.Sc. 5. Join R&D labs.",
      recommendedResources: "Nature Biotech, BioTecNika."
    }
  ];

  for (const career of careersData) {
    await prisma.career.create({ data: career });
  }
  console.log("Careers Seeded Successfully.");

  // 4. Seed Colleges
  console.log("Seeding Colleges...");
  const collegesData = [
    {
      id: "iit-bombay",
      name: "Indian Institute of Technology, Bombay",
      location: "Powai, Mumbai, Maharashtra",
      type: "Public",
      ranking: 1,
      accreditation: "NIRF #1 Engineering",
      description: "Established in 1958, IIT Bombay is one of the premier engineering and research institutions globally, known for its brilliant academic culture, stellar placements, and robust entrepreneurial ecosystem.",
      avgPlacement: "₹21.8 LPA",
      highestPlacement: "₹3.67 Crore PA",
      officialWebsite: "www.iitb.ac.in",
      cutoffs: "JEE Advanced rank in top 50-60 for Computer Science. Top 3000 for other core branches.",
      admissionProcess: "1. Qualify JEE Main. 2. Crack JEE Advanced with high merit. 3. Participate in JoSAA Counselling.",
      reviews: "Outstanding campus life around Powai lake. Unmatched placement opportunities and peer network. Heavy workload but massive exposure."
    },
    {
      id: "iit-delhi",
      name: "Indian Institute of Technology, Delhi",
      location: "Hauz Khas, New Delhi",
      type: "Public",
      ranking: 2,
      accreditation: "NIRF #2 Engineering",
      description: "A prominent engineering university in India, IIT Delhi is renowned for its technology research, startup incubation, and location in India's capital.",
      avgPlacement: "₹20.5 LPA",
      highestPlacement: "₹2.4 Crore PA",
      officialWebsite: "www.iitd.ac.in",
      cutoffs: "JEE Advanced rank in top 100 for CSE. Top 4000 for others.",
      admissionProcess: "JEE Main -> JEE Advanced -> JoSAA Counselling allocation.",
      reviews: "Brilliant research labs. Excellent connectivity. Hauz Khas surroundings are vibrant. Internships are abundant."
    },
    {
      id: "nit-trichy",
      name: "National Institute of Technology, Tiruchirappalli",
      location: "Trichy, Tamil Nadu",
      type: "Public",
      ranking: 9,
      accreditation: "NIRF #9 Engineering, NBA Accredited",
      description: "Established in 1964, NIT Trichy is widely regarded as the top NIT in India, offering world-class infrastructure and top-tier placements.",
      avgPlacement: "₹12.5 LPA",
      highestPlacement: "₹52 LPA",
      officialWebsite: "www.nitt.edu",
      cutoffs: "JEE Main percentile 99.5+ for CSE, 98+ for core branches.",
      admissionProcess: "1. Appear for JEE Main. 2. Participate in CSAB/JoSAA counselling.",
      reviews: "Massive campus. Culturally diverse student crowd. Great computer center facility. Placement records rival the newer IITs."
    },
    {
      id: "iiit-hyderabad",
      name: "International Institute of Information Technology, Hyderabad",
      location: "Gachibowli, Hyderabad, Telangana",
      type: "Private-Public",
      ranking: 15,
      accreditation: "Grade A by NAAC",
      description: "Famous for its specialized research in Computer Science, AI, Robotics, and Software Engineering. It has a research-focused curriculum right from undergraduate years.",
      avgPlacement: "₹30.0 LPA (CSE)",
      highestPlacement: "₹1.02 Crore PA",
      officialWebsite: "www.iiit.ac.in",
      cutoffs: "JEE Main percentile 99.9+ for CSE, 99.7+ for ECE.",
      admissionProcess: "Admission through JEE Main score, DASA (for NRIs), or UGEE (Undergraduate Entrance Exam).",
      reviews: "Intense coding culture. Academic curriculum is demanding but rewarding. Placements are among the best in the nation."
    },
    {
      id: "aiims-delhi",
      name: "All India Institute of Medical Sciences",
      location: "Ansari Nagar, New Delhi",
      type: "Public",
      ranking: 1,
      accreditation: "NIRF #1 Medical",
      description: "The premier medical college and public hospital in India. Established in 1956, it is known for providing subsidised elite medical care and cutting-edge research.",
      avgPlacement: "Internships stipend of ₹30,000/month. Superb PG prospects.",
      highestPlacement: "Highly variable (Post-Graduate specialties earn upwards of 50 LPA).",
      officialWebsite: "www.aiims.edu",
      cutoffs: "NEET rank under top 50 (General Category).",
      admissionProcess: "Crack NEET-UG with 700+ score and apply through MCC counseling.",
      reviews: "World-class faculty. Unbelievable clinical exposure. Extremely affordable fees (under ₹6000 for MBBS complete course)."
    },
    {
      id: "jipmer-puducherry",
      name: "Jawaharlal Institute of Postgraduate Medical Education & Research",
      location: "Puducherry",
      type: "Public",
      ranking: 3,
      accreditation: "Institute of National Importance",
      description: "An institution of national importance under the Ministry of Health, offering top-tier medical training, nursing, and healthcare services.",
      avgPlacement: "Interns receive monthly stipends, 100% internship placement.",
      highestPlacement: "Excellent PG selection rate.",
      officialWebsite: "www.jipmer.edu.in",
      cutoffs: "NEET rank in top 200-300.",
      admissionProcess: "Direct NEET-UG ranking-based counselling.",
      reviews: "Beautiful campus in Puducherry. Great clinical teaching. Excellent library and sports facilities."
    },
    {
      id: "delhi-university",
      name: "University of Delhi",
      location: "New Delhi (North & South Campuses)",
      type: "Public",
      ranking: 11,
      accreditation: "NAAC A+ Grade",
      description: "One of the most famous central universities in India. Known for its prestigious colleges like SRCC, St. Stephen's, and Hindu College.",
      avgPlacement: "₹6 LPA - ₹15 LPA (varies by college)",
      highestPlacement: "₹36 LPA (SRCC)",
      officialWebsite: "www.du.ac.in",
      cutoffs: "CUET scores in top percentiles (99%+ for top courses at top colleges).",
      admissionProcess: "Appear for CUET-UG and register on the CSAS portal.",
      reviews: "Excellent crowd. Vibrant extracurricular activities. Great faculty, especially for economics, commerce, and humanities."
    },
    {
      id: "banaras-hindu-university",
      name: "Banaras Hindu University",
      location: "Varanasi, Uttar Pradesh",
      type: "Public",
      ranking: 5,
      accreditation: "NAAC A Grade",
      description: "Established in 1916 by Pt. Madan Mohan Malaviya, BHU is one of the largest residential universities in Asia, covering medicine, law, engineering, and arts.",
      avgPlacement: "₹5 LPA - ₹12 LPA",
      highestPlacement: "₹32 LPA",
      officialWebsite: "www.bhu.ac.in",
      cutoffs: "CUET scores vary by course (usually 85-95 percentile).",
      admissionProcess: "Admission through CUET counselling process.",
      reviews: "Huge, green, peaceful campus. Highly historical significance. Affordable hostels and rich culture."
    },
    {
      id: "jnu-delhi",
      name: "Jawaharlal Nehru University",
      location: "New Delhi",
      type: "Public",
      ranking: 2,
      accreditation: "NAAC A++ Grade",
      description: "Renowned for its excellence in social sciences, humanities, languages, and international studies. It is famous for its vibrant debate culture.",
      avgPlacement: "₹5 LPA - ₹10 LPA",
      highestPlacement: "₹24 LPA",
      officialWebsite: "www.jnu.ac.in",
      cutoffs: "CUET-PG / CUET-UG score requirements are high (90+ percentile).",
      admissionProcess: "CUET-based score rankings followed by counselling registration.",
      reviews: "Highly intellectual discussions. Democratic campus. Subsidised mess food. Amazing library assets."
    },
    {
      id: "vit-vellore",
      name: "Vellore Institute of Technology",
      location: "Vellore, Tamil Nadu",
      type: "Private",
      ranking: 11,
      accreditation: "NAAC A++ Grade",
      description: "A major private engineering institute in South India, known for modern labs, foreign exchanges, and massive placement drives.",
      avgPlacement: "₹8.5 LPA",
      highestPlacement: "₹1.02 Crore PA",
      officialWebsite: "www.vit.ac.in",
      cutoffs: "VITEEE rank under 1000 for CSE Category 1. Under 20,000 for Category 5.",
      admissionProcess: "Appear for VITEEE computer exam -> Participate in VIT Counselling.",
      reviews: "Excellent infrastructure. Strict rules. Hundreds of companies visit for placements, providing massive opportunities."
    },
    {
      id: "srm-chennai",
      name: "SRM Institute of Science and Technology",
      location: "Kattankulathur, Chennai, Tamil Nadu",
      type: "Private",
      ranking: 30,
      accreditation: "NAAC A++ Grade",
      description: "SRM is a popular private university offering diverse courses in engineering, medicine, and management with a massive student intake.",
      avgPlacement: "₹6.8 LPA",
      highestPlacement: "₹45 LPA",
      officialWebsite: "www.srmist.edu.in",
      cutoffs: "SRMJEEE rank criteria.",
      admissionProcess: "Appear for SRMJEEE and attend counseling slots.",
      reviews: "Very large campus. Excellent coding clubs. High opportunities for mediocre students to get placement."
    },
    {
      id: "bits-pilani",
      name: "BITS Pilani",
      location: "Pilani, Rajasthan (also Goa & Hyderabad campuses)",
      type: "Private",
      ranking: 20,
      accreditation: "NAAC A Grade",
      description: "One of the most prestigious private engineering universities in India. Known for its 'No Attendance Policy' and high-standard alumni startup networks.",
      avgPlacement: "₹17.0 LPA",
      highestPlacement: "₹1.33 Crore PA",
      officialWebsite: "www.bits-pilani.ac.in",
      cutoffs: "BITSAT score of 320+ for CSE Pilani campus.",
      admissionProcess: "Clear BITSAT online entrance examination.",
      reviews: "Zero attendance policy offers amazing freedom to build products. Excellent startup support. Premium crowd."
    },
    {
      id: "manipal-academy",
      name: "Manipal Academy of Higher Education",
      location: "Manipal, Karnataka",
      type: "Private",
      ranking: 16,
      accreditation: "NAAC A++ Grade",
      description: "A prestigious private university town in Karnataka, known for excellent clinical medical and engineering facilities and vibrant campus town environment.",
      avgPlacement: "₹8.0 LPA",
      highestPlacement: "₹43 LPA",
      officialWebsite: "www.manipal.edu",
      cutoffs: "MET (Manipal Entrance Test) score requirements.",
      admissionProcess: "Admission through MET ranks.",
      reviews: "Beautiful coastal town setting. Extremely modern campus design. Student life is outstanding."
    },
    {
      id: "kiit-bhubaneswar",
      name: "Kalinga Institute of Industrial Technology",
      location: "Bhubaneswar, Odisha",
      type: "Private",
      ranking: 29,
      accreditation: "NAAC A++ Grade",
      description: "An extensive campus offering engineering, medical, law, and management fields with record placements every year.",
      avgPlacement: "₹6.5 LPA",
      highestPlacement: "₹38 LPA",
      officialWebsite: "www.kiit.ac.in",
      cutoffs: "KIITEE rank-based counseling.",
      admissionProcess: "Apply for KIITEE (which has no application fee).",
      reviews: "Excellent sports complexes. Food is good. Placement department is very active."
    },
    {
      id: "amity-noida",
      name: "Amity University, Noida",
      location: "Noida, Uttar Pradesh",
      type: "Private",
      ranking: 35,
      accreditation: "NAAC A+ Grade",
      description: "Known for its massive high-tech infrastructure, global campuses, and extensive corporate connections.",
      avgPlacement: "₹5.5 LPA",
      highestPlacement: "₹30 LPA",
      officialWebsite: "www.amity.edu",
      cutoffs: "12th board marks above 80% for direct entry, or AMCAT entrance.",
      admissionProcess: "Based on 12th board marks + video interview process.",
      reviews: "Luxury infrastructure, nice cafeterias, strict 75% attendance rule, decent corporate placements."
    },
    {
      id: "lpu-phagwara",
      name: "Lovely Professional University",
      location: "Phagwara, Punjab",
      type: "Private",
      ranking: 38,
      accreditation: "NAAC A++ Grade",
      description: "India's largest single-campus private university, hosting thousands of students from multiple states and countries.",
      avgPlacement: "₹5.8 LPA",
      highestPlacement: "₹64 LPA",
      officialWebsite: "www.lpu.in",
      cutoffs: "LPUNEST entrance exam.",
      admissionProcess: "Appear for LPUNEST and participate in online admission allocation.",
      reviews: "Huge campus with mall, hospital, and high-security structures. Diverse culture. Decent placements."
    },
    {
      id: "sage-university",
      name: "Sage University",
      location: "Indore, Madhya Pradesh",
      type: "Private",
      ranking: 120,
      accreditation: "UGC Approved",
      description: "A prominent private institution in central India, offering technical, agricultural, design, and commerce programs.",
      avgPlacement: "₹4.2 LPA",
      highestPlacement: "₹12 LPA",
      officialWebsite: "www.sageuniversity.in",
      cutoffs: "SAGE Entrance Exam (SEE) score.",
      admissionProcess: "Apply online, clear SEE test, and complete counselling registration.",
      reviews: "Nice campus located on a hill. Friendly teachers and good focus on practical sessions."
    },
    {
      id: "parul-university",
      name: "Parul University",
      location: "Vadodara, Gujarat",
      type: "Private",
      ranking: 85,
      accreditation: "NAAC A++ Grade",
      description: "A fast-growing private university in Gujarat, famous for its cultural diversity, large campus, and strong industry linkages.",
      avgPlacement: "₹4.5 LPA",
      highestPlacement: "₹30 LPA",
      officialWebsite: "www.paruluniversity.ac.in",
      cutoffs: "12th board marks-based merit.",
      admissionProcess: "Direct application and verification based on board marks.",
      reviews: "Amazing cultural fests. Highly diverse campus with international students. Good clinical ties for healthcare courses."
    },
    {
      id: "chandigarh-university",
      name: "Chandigarh University",
      location: "Gharuan, Mohali, Punjab",
      type: "Private",
      ranking: 27,
      accreditation: "NAAC A+ Grade",
      description: "A highly popular private university in Punjab, providing diverse technical and non-technical fields with massive placement volumes.",
      avgPlacement: "₹7.2 LPA",
      highestPlacement: "₹54.7 LPA",
      officialWebsite: "www.cuchd.in",
      cutoffs: "CUCET entrance exam scores.",
      admissionProcess: "Appear for CUCET exam and apply through university score counseling.",
      reviews: "Excellent hostels. High-tech labs. Coding culture is solid, with a dedicated placement cell."
    }
  ];

  for (const col of collegesData) {
    const createdCollege = await prisma.college.create({ data: col });
    
    // Seed standard courses for each college
    await prisma.course.createMany({
      data: [
        {
          collegeId: createdCollege.id,
          name: "Bachelor of Technology (B.Tech) - Computer Science",
          duration: "4 Years",
          fees: createdCollege.type === "Public" ? "₹2,00,000 per year" : "₹4,50,000 per year",
          seats: 120
        },
        {
          collegeId: createdCollege.id,
          name: "Bachelor of Technology (B.Tech) - Electronics",
          duration: "4 Years",
          fees: createdCollege.type === "Public" ? "₹2,00,000 per year" : "₹4,20,000 per year",
          seats: 90
        },
        {
          collegeId: createdCollege.id,
          name: "Master of Business Administration (MBA)",
          duration: "2 Years",
          fees: createdCollege.type === "Public" ? "₹8,00,000 complete" : "₹12,00,000 complete",
          seats: 60
        }
      ]
    });
  }
  console.log("Colleges & Courses Seeded Successfully.");

  // 5. Seed Mentors
  console.log("Seeding Mentors...");
  
  // We need to create User accounts for mentors first
  const mentorUsers = [
    { name: "Ananya Sharma", email: "ananya.sharma@example.com", password: "Password@123", role: "MENTOR" },
    { name: "Rajesh Iyer", email: "rajesh.iyer@example.com", password: "Password@123", role: "MENTOR" },
    { name: "Dr. Sandeep Patel", email: "sandeep.patel@example.com", password: "Password@123", role: "MENTOR" },
    { name: "Vikram Malhotra", email: "vikram.malhotra@example.com", password: "Password@123", role: "MENTOR" },
    { name: "Nisha Goel", email: "nisha.goel@example.com", password: "Password@123", role: "MENTOR" },
    { name: "Siddharth Sen", email: "siddharth.sen@example.com", password: "Password@123", role: "MENTOR" },
    { name: "Karan Johar", email: "karan.johar@example.com", password: "Password@123", role: "MENTOR" },
    { name: "Meera Nair", email: "meera.nair@example.com", password: "Password@123", role: "MENTOR" },
    { name: "Pankaj Tripathi", email: "pankaj.tripathi@example.com", password: "Password@123", role: "MENTOR" },
    { name: "Amit Verma", email: "amit.verma@example.com", password: "Password@123", role: "MENTOR" }
  ];

  const mentorsProfileData = [
    {
      expertise: "Software Engineering, Frontend Systems, Web Architecture",
      experienceYears: 8,
      rating: 4.9,
      totalSessions: 142,
      hourlyRateCoins: 120,
      education: "B.Tech in Computer Science, NIT Trichy",
      skills: "React, Next.js, System Design, Javascript",
      guidanceAreas: "Software Engineering, Web Development, Resume Review",
      availability: "Mon, Wed, Fri (4:00 PM - 7:00 PM)",
      bio: "Ex-SDE at Google. Passionate about mentoring students in DSA, building robust web systems, and crafting job application strategies.",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
    },
    {
      expertise: "AI/ML, Natural Language Processing, MLOps",
      experienceYears: 6,
      rating: 4.8,
      totalSessions: 98,
      hourlyRateCoins: 150,
      education: "MS in Machine Learning, IIIT Hyderabad",
      skills: "Python, PyTorch, TensorFlow, LLMs",
      guidanceAreas: "AI/ML, Data Science, Academic Research",
      availability: "Tue, Thu (6:00 PM - 9:00 PM)",
      bio: "Research Scientist working on generative models. Helping students shift into AI research and model deployment careers.",
      photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150"
    },
    {
      expertise: "Data Science, Business Intelligence, Data Engineering",
      experienceYears: 7,
      rating: 4.7,
      totalSessions: 110,
      hourlyRateCoins: 130,
      education: "M.Sc. in Statistics, Delhi University",
      skills: "Python, SQL, Tableau, Pandas",
      guidanceAreas: "Data Science, Analytics roles, SQL practice",
      availability: "Sat (10:00 AM - 2:00 PM)",
      bio: "Senior Data Scientist at a major analytics firm. Expert in statistical modeling, SQL query tuning, and business visualization dashboards.",
      photo: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150"
    },
    {
      expertise: "UPSC CSE preparation, Ethics, Essay Writing",
      experienceYears: 10,
      rating: 4.9,
      totalSessions: 320,
      hourlyRateCoins: 200,
      education: "MA in Public Administration, BHU",
      skills: "Polity, History, Answer Writing, Optional Strategy",
      guidanceAreas: "UPSC, Civil Services preparation, Interview tips",
      availability: "Sunday (11:00 AM - 5:00 PM)",
      bio: "Former civil services applicant who reached Mains/Interview multiple times. Mentored hundreds of current IAS/IPS officers in General Studies and writing tips.",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
    },
    {
      expertise: "SSC CGL / Govt Exams Prep, quantitative shortcuts",
      experienceYears: 5,
      rating: 4.6,
      totalSessions: 215,
      hourlyRateCoins: 100,
      education: "B.Sc Mathematics, Banaras Hindu University",
      skills: "Fast Math, Logical Reasoning, General Awareness",
      guidanceAreas: "SSC CGL, Banking Exams, Railway Exams",
      availability: "Mon, Tue (5:00 PM - 8:00 PM)",
      bio: "Cleared SSC CGL with top rank. Helping aspirants crack government jobs using smart calculation shortcuts and structured GK templates.",
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150"
    },
    {
      expertise: "Banking Exams, IBPS, Financial Awareness",
      experienceYears: 9,
      rating: 4.8,
      totalSessions: 180,
      hourlyRateCoins: 110,
      education: "B.Com, Delhi University",
      skills: "Banking Terms, Data Interpretation, Logical Puzzles",
      guidanceAreas: "Banking, Finance positions, Clerical training",
      availability: "Wed, Thu (7:00 PM - 9:00 PM)",
      bio: "Manager at a public sector bank. Dedicated to teaching candidates the core concepts of banking awareness and cracking bank PO/Clerk tests.",
      photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150"
    },
    {
      expertise: "Medical Entrance (NEET), Biology concepts",
      experienceYears: 12,
      rating: 4.9,
      totalSessions: 420,
      hourlyRateCoins: 180,
      education: "MD in Pediatrics, AIIMS Delhi",
      skills: "Anatomy, Physiology, Chemistry tips, MCQ strategy",
      guidanceAreas: "NEET UG, MBBS advice, MD pathways",
      availability: "Saturday (4:00 PM - 8:00 PM)",
      bio: "Practicing Pediatrician and biology mentor. Helping medical aspirants digest complex physiology topics and structure mock test routines.",
      photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150"
    },
    {
      expertise: "Corporate Law, Litigations, Contract drafting",
      experienceYears: 8,
      rating: 4.7,
      totalSessions: 85,
      hourlyRateCoins: 140,
      education: "BA LLB (Hons), NLSIU Bangalore",
      skills: "Corporate compliance, Contract law, IP filing",
      guidanceAreas: "Law, CLAT preparation, Firm placements",
      availability: "Friday (5:00 PM - 8:00 PM)",
      bio: "Associate Partner at a law firm. Guiding law students on choosing corporate vs litigation, finding internships, and preparing for CLAT.",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
    },
    {
      expertise: "MBA Prep, CAT Strategy, Business Communication",
      experienceYears: 6,
      rating: 4.8,
      totalSessions: 165,
      hourlyRateCoins: 160,
      education: "MBA, IIM Ahmedabad",
      skills: "DILR, VARC, Interview grooming, Group discussions",
      guidanceAreas: "MBA admissions, CAT prep, Consulting careers",
      availability: "Sunday (10:00 AM - 1:00 PM)",
      bio: "Senior Strategy Manager. Specializes in guiding MBA aspirants through DILR tricks, resume building, and crushing B-school interviews.",
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150"
    },
    {
      expertise: "UI/UX, Product Design, Portfolio drafting",
      experienceYears: 7,
      rating: 4.9,
      totalSessions: 130,
      hourlyRateCoins: 130,
      education: "B.Des, National Institute of Design (NID)",
      skills: "Figma, Wireframing, Visual Design, Typography",
      guidanceAreas: "Design careers, Portfolio Review, UCEED prep",
      availability: "Mon, Fri (6:00 PM - 8:00 PM)",
      bio: "Lead UI/UX Designer. Focused on helping students structure design portfolios, understand user-centric models, and break into design firms.",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
    }
  ];

  for (let i = 0; i < mentorUsers.length; i++) {
    const user = await prisma.user.create({
      data: {
        name: mentorUsers[i].name,
        email: mentorUsers[i].email,
        password: mentorUsers[i].password,
        role: mentorUsers[i].role
      }
    });

    await prisma.mentorProfile.create({
      data: {
        userId: user.id,
        name: mentorUsers[i].name,
        photo: mentorsProfileData[i].photo,
        expertise: mentorsProfileData[i].expertise,
        experienceYears: mentorsProfileData[i].experienceYears,
        rating: mentorsProfileData[i].rating,
        totalSessions: mentorsProfileData[i].totalSessions,
        hourlyRateCoins: mentorsProfileData[i].hourlyRateCoins,
        education: mentorsProfileData[i].education,
        skills: mentorsProfileData[i].skills,
        guidanceAreas: mentorsProfileData[i].guidanceAreas,
        availability: mentorsProfileData[i].availability,
        bio: mentorsProfileData[i].bio
      }
    });
  }

  console.log("Mentors Seeded Successfully.");

  // 6. Seed a Default Student User for local testing
  console.log("Seeding Default Student User...");
  const defaultStudent = await prisma.user.create({
    data: {
      name: "Test Student",
      email: "student@example.com",
      password: "Password@123",
      role: "STUDENT",
      eduCoins: 2450,
      level: 4
    }
  });

  const studentProfile = await prisma.studentProfile.create({
    data: {
      userId: defaultStudent.id,
      currentClass: "Class 12",
      targetExams: "upsc-cse,jee-advanced",
      targetCareers: "software-development,ai-ml",
      skills: "HTML, CSS, Python",
      learningStyle: "Visual",
      studyStreak: 5,
      longestStreak: 12
    }
  });

  // Seed default Study Plan
  console.log("Seeding default study planner items...");
  const defaultPlan = await prisma.studyPlan.create({
    data: {
      userId: defaultStudent.id,
      targetExamId: "jee-advanced",
      startDate: new Date(),
      endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
      dailyHours: 6
    }
  });

  await prisma.studyTask.createMany({
    data: [
      { planId: defaultPlan.id, title: "Revision of Organic Chemistry basics", date: new Date(), durationMins: 90, isCompleted: true },
      { planId: defaultPlan.id, title: "Practice Mathematics Integration MCQs", date: new Date(), durationMins: 120, isCompleted: false },
      { planId: defaultPlan.id, title: "Physics Mock Test - Electrostatics", date: new Date(Date.now() + 24 * 60 * 60 * 1000), durationMins: 180, isCompleted: false }
    ]
  });

  // Seed default Habits
  await prisma.habit.createMany({
    data: [
      { userId: defaultStudent.id, title: "Daily Coding practice (1 hour)", streak: 4, lastCompleted: new Date() },
      { userId: defaultStudent.id, title: "Read News (Editorial page)", streak: 7, lastCompleted: new Date() },
      { userId: defaultStudent.id, title: "Review Mistakes notebook", streak: 2, lastCompleted: null }
    ]
  });

  // Seed default Goals
  await prisma.goal.createMany({
    data: [
      { userId: defaultStudent.id, title: "Complete Physics Mechanics syllabus", targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), isCompleted: false, category: "STUDY" },
      { userId: defaultStudent.id, title: "Score above 80% in next full JEE mock test", targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), isCompleted: false, category: "EXAM" }
    ]
  });

  // Seed default Reminders
  await prisma.reminder.createMany({
    data: [
      { userId: defaultStudent.id, title: "Math online class at 5 PM", dateTime: new Date(Date.now() + 8 * 60 * 60 * 1000) },
      { userId: defaultStudent.id, title: "Submit chemistry assignment", dateTime: new Date(Date.now() + 32 * 60 * 60 * 1000) }
    ]
  });

  // Seed Mock Test Attempt data for performance graph
  console.log("Seeding Mock Tests & attempts...");
  const mockTest = await prisma.mockTest.create({
    data: {
      examId: "jee-advanced",
      title: "JEE Advanced Full Syllabus Mock-1",
      type: "Full",
      durationMinutes: 180,
      totalQuestions: 60,
      totalMarks: 300,
      rewardCoins: 50
    }
  });

  const dates = [
    new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  ];

  await prisma.mockTestAttempt.create({ data: { userId: defaultStudent.id, mockTestId: mockTest.id, score: 185, timeTakenMins: 175, accuracy: 78.5, weakAreas: "Organic Chemistry, Integration", createdAt: dates[0] } });
  await prisma.mockTestAttempt.create({ data: { userId: defaultStudent.id, mockTestId: mockTest.id, score: 205, timeTakenMins: 172, accuracy: 80.2, weakAreas: "Electrostatics, Coordinate Geometry", createdAt: dates[1] } });
  await prisma.mockTestAttempt.create({ data: { userId: defaultStudent.id, mockTestId: mockTest.id, score: 215, timeTakenMins: 180, accuracy: 82.0, weakAreas: "Optics, P-Block Elements", createdAt: dates[2] } });
  await prisma.mockTestAttempt.create({ data: { userId: defaultStudent.id, mockTestId: mockTest.id, score: 235, timeTakenMins: 168, accuracy: 84.5, weakAreas: "Mechanics, Thermodynamics", createdAt: dates[3] } });
  await prisma.mockTestAttempt.create({ data: { userId: defaultStudent.id, mockTestId: mockTest.id, score: 255, timeTakenMins: 160, accuracy: 86.8, weakAreas: "Probability, Inorganic Chemistry", createdAt: dates[4] } });

  console.log("Database Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
