import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get('session_user_id')?.value;

    if (!sessionUserId) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionUserId },
      include: {
        profile: true,
        mentorProfile: true
      }
    });

    if (!user) {
      // Clear cookie if user not found in database
      const response = NextResponse.json({ authenticated: false }, { status: 200 });
      response.cookies.delete('session_user_id');
      return response;
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        eduCoins: user.eduCoins,
        level: user.level,
        profile: user.profile,
        mentorProfile: user.mentorProfile
      }
    });
  } catch (error: any) {
    console.error('Session API error:', error);
    return NextResponse.json({ error: 'Internal server error', authenticated: false }, { status: 500 });
  }
}
