import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

const EXAM_STATS_MAP: Record<string, { exam: string, applicants: number, selections: number, cutoffs: { year: string, score: number }[] }> = {
  "upsc-cse": {
    exam: "UPSC GS",
    applicants: 1000000,
    selections: 1056,
    cutoffs: [
      { year: "2020", score: 92.51 },
      { year: "2021", score: 87.54 },
      { year: "2022", score: 88.22 },
      { year: "2023", score: 75.41 },
      { year: "2024", score: 78.50 }
    ]
  },
  "jee-advanced": {
    exam: "JEE Adv",
    applicants: 250000,
    selections: 17385,
    cutoffs: [
      { year: "2020", score: 115.0 },
      { year: "2021", score: 101.0 },
      { year: "2022", score: 95.0 },
      { year: "2023", score: 118.0 },
      { year: "2024", score: 109.0 }
    ]
  },
  "neet-ug": {
    exam: "NEET UG",
    applicants: 2000000,
    selections: 109000,
    cutoffs: [
      { year: "2020", score: 610.0 },
      { year: "2021", score: 615.0 },
      { year: "2022", score: 608.0 },
      { year: "2023", score: 620.0 },
      { year: "2024", score: 650.0 }
    ]
  },
  "cat-exam": {
    exam: "CAT (IIM)",
    applicants: 250000,
    selections: 5500,
    cutoffs: [
      { year: "2020", score: 99.0 },
      { year: "2021", score: 99.0 },
      { year: "2022", score: 99.0 },
      { year: "2023", score: 99.0 },
      { year: "2024", score: 99.0 }
    ]
  },
  "gate-exam": {
    exam: "GATE",
    applicants: 700000,
    selections: 15000,
    cutoffs: [
      { year: "2020", score: 28.5 },
      { year: "2021", score: 26.1 },
      { year: "2022", score: 25.0 },
      { year: "2023", score: 32.5 },
      { year: "2024", score: 30.0 }
    ]
  },
  "ssc-cgl": {
    exam: "SSC CGL",
    applicants: 1500000,
    selections: 8500,
    cutoffs: [
      { year: "2020", score: 132.5 },
      { year: "2021", score: 130.1 },
      { year: "2022", score: 114.2 },
      { year: "2023", score: 150.0 },
      { year: "2024", score: 142.0 }
    ]
  },
  "banking-exams": {
    exam: "IBPS PO",
    applicants: 800000,
    selections: 6500,
    cutoffs: [
      { year: "2020", score: 58.75 },
      { year: "2021", score: 50.50 },
      { year: "2022", score: 49.75 },
      { year: "2023", score: 54.25 },
      { year: "2024", score: 56.50 }
    ]
  }
};

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get('session_user_id')?.value;

    if (!sessionUserId) {
      return NextResponse.json({ authenticated: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionUserId },
      include: {
        mockTests: {
          orderBy: { createdAt: 'asc' }
        },
        profile: true
      }
    });

    if (!user) {
      return NextResponse.json({ authenticated: false, error: 'User not found' }, { status: 404 });
    }

    // 1. User Progress Graph (mock test scores)
    const progressData = user.mockTests.length > 0 
      ? user.mockTests.map((attempt: any, index: number) => ({
          label: `Mock ${index + 1}`,
          score: attempt.score,
          accuracy: attempt.accuracy,
          date: new Date(attempt.createdAt).toLocaleDateString()
        }))
      : [];

    // 2. Study Time Analytics (Hours per day over last 7 days from completed planner tasks)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const completedTasks = await prisma.studyTask.findMany({
      where: {
        plan: {
          userId: user.id
        },
        isCompleted: true,
        date: {
          gte: sevenDaysAgo
        }
      }
    });

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const studyHoursData = [];

    // Compile dynamic study hours for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = daysOfWeek[d.getDay()];

      const startOfDay = new Date(d);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(d);
      endOfDay.setHours(23, 59, 59, 999);

      const dailyTasks = completedTasks.filter(t => {
        const taskDate = new Date(t.date);
        return taskDate >= startOfDay && taskDate <= endOfDay;
      });

      const totalMins = dailyTasks.reduce((sum, task) => sum + task.durationMins, 0);
      const hours = parseFloat((totalMins / 60).toFixed(1));

      studyHoursData.push({
        day: dayName,
        hours: hours
      });
    }

    // 3. Applications vs Selections and Cutoff Trends (from user targeted exams)
    const targetExamsList = user.profile?.targetExams 
      ? user.profile.targetExams.split(',').map(id => id.trim()).filter(Boolean) 
      : [];

    const appVsSelData: { exam: string, applicants: number, selections: number }[] = [];
    const cutoffTrendsData: { year: string, score: number }[] = [];

    for (const examId of targetExamsList) {
      const examStats = EXAM_STATS_MAP[examId];
      if (examStats) {
        // Avoid duplicate exam listings
        if (!appVsSelData.some(e => e.exam === examStats.exam)) {
          appVsSelData.push({
            exam: examStats.exam,
            applicants: examStats.applicants,
            selections: examStats.selections
          });
        }
        
        // Load cutoff trends for the first targeted exam
        if (cutoffTrendsData.length === 0) {
          cutoffTrendsData.push(...examStats.cutoffs);
        }
      }
    }

    // 4. Career Growth Trajectories (based on targeted careers)
    const targetCareersList = user.profile?.targetCareers
      ? user.profile.targetCareers.split(',').map(id => id.trim()).filter(Boolean)
      : [];

    const hasTech = targetCareersList.some(c => c.includes('software') || c.includes('ai') || c.includes('cs') || c.includes('tech'));
    const hasFinance = targetCareersList.some(c => c.includes('finance') || c.includes('bank') || c.includes('corporate') || c.includes('business') || c.includes('manage'));
    const hasCivil = targetCareersList.some(c => c.includes('civil') || c.includes('upsc') || c.includes('ias') || c.includes('ips') || c.includes('gov'));

    const showGrowthData = hasTech || hasFinance || hasCivil;
    const careerGrowthData = showGrowthData 
      ? [
          { years: "1 Yr", tech: hasTech ? 7.5 : 0, finance: hasFinance ? 6.5 : 0, civil: hasCivil ? 8.5 : 0 },
          { years: "3 Yrs", tech: hasTech ? 13.0 : 0, finance: hasFinance ? 11.0 : 0, civil: hasCivil ? 9.5 : 0 },
          { years: "5 Yrs", tech: hasTech ? 22.0 : 0, finance: hasFinance ? 18.0 : 0, civil: hasCivil ? 12.0 : 0 },
          { years: "8 Yrs", tech: hasTech ? 35.0 : 0, finance: hasFinance ? 28.0 : 0, civil: hasCivil ? 16.0 : 0 },
          { years: "12 Yrs", tech: hasTech ? 55.0 : 0, finance: hasFinance ? 45.0 : 0, civil: hasCivil ? 24.0 : 0 }
        ]
      : [];

    // Aggregate real statistics
    const totalMocks = user.mockTests.length;
    const avgScore = user.mockTests.length > 0 
      ? Math.round(user.mockTests.reduce((acc: number, curr: any) => acc + curr.score, 0) / user.mockTests.length) 
      : 0;
    const maxAccuracy = user.mockTests.length > 0 
      ? Math.max(...user.mockTests.map((m: any) => m.accuracy)) 
      : 0;

    return NextResponse.json({
      authenticated: true,
      stats: {
        progressData,
        studyHoursData,
        appVsSelData,
        cutoffTrendsData,
        careerGrowthData,
        kpis: {
          totalMocks,
          avgScore,
          maxAccuracy,
          eduCoins: user.eduCoins,
          level: user.level
        }
      }
    });
  } catch (error: any) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
