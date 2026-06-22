import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

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
      : [
          { label: "Mock 1", score: 185, accuracy: 78.5 },
          { label: "Mock 2", score: 205, accuracy: 80.2 },
          { label: "Mock 3", score: 215, accuracy: 82.0 },
          { label: "Mock 4", score: 235, accuracy: 84.5 },
          { label: "Mock 5", score: 255, accuracy: 86.8 }
        ];

    // 2. Study Time Analytics (Hours per day over last 7 days)
    const studyHoursData = [
      { day: "Mon", hours: 4.5 },
      { day: "Tue", hours: 5.2 },
      { day: "Wed", hours: 6.0 },
      { day: "Thu", hours: 4.0 },
      { day: "Fri", hours: 7.5 },
      { day: "Sat: Mock", hours: 8.0 },
      { day: "Sun: Rev", hours: 3.5 }
    ];

    // 3. Applications vs Selections (UPSC, JEE, NEET, CAT, GATE)
    const appVsSelData = [
      { exam: "UPSC", applicants: 1000000, selections: 1056 },
      { exam: "JEE Adv", applicants: 250000, selections: 17385 },
      { exam: "NEET UG", applicants: 2000000, selections: 109000 },
      { exam: "CAT (IIM)", applicants: 250000, selections: 5500 },
      { exam: "GATE", applicants: 700000, selections: 15000 }
    ];

    // 4. Cutoff Trends (UPSC Prelims General Cutoff over last 5 years)
    const cutoffTrendsData = [
      { year: "2020", score: 92.51 },
      { year: "2021", score: 87.54 },
      { year: "2022", score: 88.22 },
      { year: "2023", score: 75.41 },
      { year: "2024", score: 78.50 }
    ];

    // 5. Career Growth Analytics (Salary growth in Tech vs Finance vs Civil Services over years of experience)
    const careerGrowthData = [
      { years: "1 Yr", tech: 7.5, finance: 6.5, civil: 8.5 },
      { years: "3 Yrs", tech: 13.0, finance: 11.0, civil: 9.5 },
      { years: "5 Yrs", tech: 22.0, finance: 18.0, civil: 12.0 },
      { years: "8 Yrs", tech: 35.0, finance: 28.0, civil: 16.0 },
      { years: "12 Yrs", tech: 55.0, finance: 45.0, civil: 24.0 }
    ];

    // Aggregate statistics
    const totalMocks = user.mockTests.length || 5;
    const avgScore = user.mockTests.length > 0 
      ? Math.round(user.mockTests.reduce((acc: number, curr: any) => acc + curr.score, 0) / user.mockTests.length) 
      : 220;
    const maxAccuracy = user.mockTests.length > 0 
      ? Math.max(...user.mockTests.map((m: any) => m.accuracy)) 
      : 86.8;

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
