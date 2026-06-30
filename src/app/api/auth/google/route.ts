import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(request: Request) {
  try {
    const { credential } = await request.json();

    if (!credential) {
      return NextResponse.json({ error: 'No credential provided' }, { status: 400 });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.sub) {
      return NextResponse.json({ error: 'Invalid Google payload' }, { status: 400 });
    }

    const { email, name, sub: googleId } = payload;
    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (user) {
      // If user exists but doesn't have a googleId, update it
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId, isEmailVerified: true }, // We trust Google's email verification
        });
      }
    } else {
      // Create User and Profile in a transaction
      user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            name: name || 'Google User',
            email: cleanEmail,
            role: 'STUDENT',
            googleId,
            isEmailVerified: true, // Auto verify since it's from Google
            eduCoins: 100, // Reward 100 coins for signing up!
            level: 1
          },
        });

        await tx.studentProfile.create({
          data: {
            userId: newUser.id,
            currentClass: 'Class 12', // default
            targetExams: '',
            targetCareers: '',
            skills: '',
            learningStyle: 'Visual',
            studyStreak: 0,
            longestStreak: 0
          }
        });

        // Add a registration reward coin transaction
        await tx.coinTransaction.create({
          data: {
            userId: newUser.id,
            amount: 100,
            type: 'EARNED',
            source: 'SIGNUP',
            description: 'Welcome reward for joining CareerVerse AI via Google!'
          }
        });

        return newUser;
      });
    }

    // Set Session Cookie
    const cookieStore = await cookies();
    cookieStore.set('session_user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({
      message: 'Logged in successfully with Google',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        eduCoins: user.eduCoins,
        level: user.level
      }
    });
  } catch (error: any) {
    console.error('Google Auth error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
