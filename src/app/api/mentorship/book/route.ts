import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { mentorId } = await request.json();

    if (!mentorId) {
      return NextResponse.json({ error: 'Mentor ID is required' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get('session_user_id')?.value;

    if (!sessionUserId) {
      return NextResponse.json({ error: 'You must be logged in to book a mentor' }, { status: 401 });
    }

    // Load user and mentor
    const user = await prisma.user.findUnique({ where: { id: sessionUserId } });
    const mentor = await prisma.mentorProfile.findUnique({ where: { id: mentorId } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (!mentor) {
      return NextResponse.json({ error: 'Mentor not found' }, { status: 404 });
    }

    if (user.id === mentor.userId) {
      return NextResponse.json({ error: 'You cannot book a session with yourself' }, { status: 400 });
    }

    const cost = mentor.hourlyRateCoins;

    if (user.eduCoins < cost) {
      return NextResponse.json({ 
        error: `Insufficient EduCoins. This session costs ${cost} coins, but you only have ${user.eduCoins} coins.` 
      }, { status: 400 });
    }

    // Run transaction
    const transaction = await prisma.$transaction(async (tx: any) => {
      // 1. Deduct coins
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          eduCoins: {
            decrement: cost
          }
        }
      });

      // 2. Add Coin Transaction record
      await tx.coinTransaction.create({
        data: {
          userId: user.id,
          amount: cost,
          type: 'SPENT',
          source: 'MENTORSHIP',
          description: `Booked 1-to-1 career guidance session with Mentor ${mentor.name || 'Expert'}`
        }
      });

      // 3. Increment session count on mentor
      await tx.mentorProfile.update({
        where: { id: mentor.id },
        data: {
          totalSessions: {
            increment: 1
          }
        }
      });

      return { userCoins: updatedUser.eduCoins };
    });

    return NextResponse.json({
      message: 'Session booked successfully!',
      userCoins: transaction.userCoins
    });
  } catch (error: any) {
    console.error('Mentorship booking error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
