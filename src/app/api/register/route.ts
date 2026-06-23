import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    // Field Validation
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!email || !email.trim() || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
    }
    if (!password || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json({ 
        error: 'Password must include at least one letter, one number, and one special character.' 
      }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanRole = (role || 'STUDENT').toUpperCase();

    if (cleanRole !== 'STUDENT' && cleanRole !== 'PROFESSIONAL' && cleanRole !== 'MENTOR') {
      return NextResponse.json({ error: 'Invalid user role selected' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Create User and Profile in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: name.trim(),
          email: cleanEmail,
          password: password, // In a real production app, hash this using bcrypt
          role: cleanRole,
          eduCoins: 100, // Reward 100 coins for signing up!
          level: 1
        },
      });

      if (cleanRole === 'MENTOR') {
        await tx.mentorProfile.create({
          data: {
            userId: newUser.id,
            name: name.trim(),
            expertise: 'General Guidance',
            rating: 5.0,
            experienceYears: 0
          }
        });
      } else {
        await tx.studentProfile.create({
          data: {
            userId: newUser.id,
            currentClass: 'Class 12',
            targetExams: '',
            targetCareers: '',
            skills: '',
            learningStyle: 'Visual',
            studyStreak: 0,
            longestStreak: 0
          }
        });
      }

      // Add a registration reward coin transaction
      await tx.coinTransaction.create({
        data: {
          userId: newUser.id,
          amount: 100,
          type: 'EARNED',
          source: 'SIGNUP',
          description: 'Welcome reward for joining CareerVerse AI!'
        }
      });

      return newUser;
    });

    // Set Session Cookie
    const cookieStore = await cookies();
    cookieStore.set('session_user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json(
      { 
        message: 'Account created successfully', 
        user: { id: user.id, email: user.email, name: user.name, role: user.role } 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
