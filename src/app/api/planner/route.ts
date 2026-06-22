import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';
import { cookies } from 'next/headers';

// Helper to get authenticated user
async function getAuthUser() {
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get('session_user_id')?.value;
  if (!sessionUserId) return null;
  return prisma.user.findUnique({ where: { id: sessionUserId } });
}

// GET: Load all planner items
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ authenticated: false, error: 'Unauthorized' }, { status: 401 });
    }

    const tasks = await prisma.studyTask.findMany({
      orderBy: { date: 'asc' }
    });

    const habits = await prisma.habit.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    const goals = await prisma.goal.findMany({
      where: { userId: user.id },
      orderBy: { targetDate: 'asc' }
    });

    const reminders = await prisma.reminder.findMany({
      where: { userId: user.id },
      orderBy: { dateTime: 'asc' }
    });

    // Fetch user study plans
    const studyPlans = await prisma.studyPlan.findMany({
      where: { userId: user.id },
      include: { tasks: true }
    });

    return NextResponse.json({
      authenticated: true,
      tasks,
      habits,
      goals,
      reminders,
      studyPlans
    });
  } catch (error: any) {
    console.error('Planner GET error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

// POST: Add a new item (task, habit, goal, reminder)
export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, title, date, durationMins, targetDate, category, dateTime } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (type === 'task') {
      // Find or create default study plan for user
      let plan = await prisma.studyPlan.findFirst({ where: { userId: user.id } });
      if (!plan) {
        plan = await prisma.studyPlan.create({
          data: {
            userId: user.id,
            targetExamId: 'general',
            startDate: new Date(),
            endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            dailyHours: 4
          }
        });
      }

      const task = await prisma.studyTask.create({
        data: {
          planId: plan.id,
          title: title.trim(),
          date: date ? new Date(date) : new Date(),
          durationMins: parseInt(durationMins) || 60,
          isCompleted: false
        }
      });
      return NextResponse.json({ success: true, item: task });

    } else if (type === 'habit') {
      const habit = await prisma.habit.create({
        data: {
          userId: user.id,
          title: title.trim(),
          streak: 0
        }
      });
      return NextResponse.json({ success: true, item: habit });

    } else if (type === 'goal') {
      const goal = await prisma.goal.create({
        data: {
          userId: user.id,
          title: title.trim(),
          targetDate: targetDate ? new Date(targetDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          category: category || 'STUDY',
          isCompleted: false
        }
      });
      return NextResponse.json({ success: true, item: goal });

    } else if (type === 'reminder') {
      const reminder = await prisma.reminder.create({
        data: {
          userId: user.id,
          title: title.trim(),
          dateTime: dateTime ? new Date(dateTime) : new Date(Date.now() + 24 * 60 * 60 * 1000),
          isCompleted: false
        }
      });
      return NextResponse.json({ success: true, item: reminder });
    }

    return NextResponse.json({ error: 'Invalid planner item type' }, { status: 400 });
  } catch (error: any) {
    console.error('Planner POST error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

// PUT: Toggle completion or update streak
export async function PUT(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, id, isCompleted, incrementStreak } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    if (type === 'task') {
      const task = await prisma.studyTask.update({
        where: { id },
        data: { isCompleted: !!isCompleted }
      });

      // Reward student with 10 EduCoins on task completion!
      if (isCompleted) {
        await prisma.user.update({
          where: { id: user.id },
          data: { eduCoins: { increment: 10 } }
        });
        await prisma.coinTransaction.create({
          data: {
            userId: user.id,
            amount: 10,
            type: 'EARNED',
            source: 'PLANNER',
            description: `Earned 10 coins for completing task: ${task.title}`
          }
        });
      }

      return NextResponse.json({ success: true, item: task });

    } else if (type === 'habit') {
      if (incrementStreak) {
        const habit = await prisma.habit.update({
          where: { id },
          data: {
            streak: { increment: 1 },
            lastCompleted: new Date()
          }
        });

        // Reward 5 EduCoins for completing a habit
        await prisma.user.update({
          where: { id: user.id },
          data: { eduCoins: { increment: 5 } }
        });
        await prisma.coinTransaction.create({
          data: {
            userId: user.id,
            amount: 5,
            type: 'EARNED',
            source: 'PLANNER',
            description: `Earned 5 coins for logging habit: ${habit.title}`
          }
        });

        return NextResponse.json({ success: true, item: habit });
      }
    } else if (type === 'goal') {
      const goal = await prisma.goal.update({
        where: { id },
        data: { isCompleted: !!isCompleted }
      });

      // Reward 25 EduCoins for completing a goal
      if (isCompleted) {
        await prisma.user.update({
          where: { id: user.id },
          data: { eduCoins: { increment: 25 } }
        });
        await prisma.coinTransaction.create({
          data: {
            userId: user.id,
            amount: 25,
            type: 'EARNED',
            source: 'PLANNER',
            description: `Earned 25 coins for achieving goal: ${goal.title}`
          }
        });
      }

      return NextResponse.json({ success: true, item: goal });

    } else if (type === 'reminder') {
      const reminder = await prisma.reminder.update({
        where: { id },
        data: { isCompleted: !!isCompleted }
      });
      return NextResponse.json({ success: true, item: reminder });
    }

    return NextResponse.json({ error: 'Invalid update action' }, { status: 400 });
  } catch (error: any) {
    console.error('Planner PUT error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

// DELETE: Delete planner items
export async function DELETE(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    if (type === 'task') {
      await prisma.studyTask.delete({ where: { id } });
      return NextResponse.json({ success: true });
    } else if (type === 'habit') {
      await prisma.habit.delete({ where: { id } });
      return NextResponse.json({ success: true });
    } else if (type === 'goal') {
      await prisma.goal.delete({ where: { id } });
      return NextResponse.json({ success: true });
    } else if (type === 'reminder') {
      await prisma.reminder.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid planner item type' }, { status: 400 });
  } catch (error: any) {
    console.error('Planner DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
