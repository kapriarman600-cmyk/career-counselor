import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { isPasswordValid } from '@/lib/auth-validation';
import { sendVerificationEmail } from '@/lib/mailer';

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
    if (!password || !isPasswordValid(password)) {
      return NextResponse.json({ 
        error: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.' 
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

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create User and Profile in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: name.trim(),
          email: cleanEmail,
          password: hashedPassword,
          role: cleanRole,
          eduCoins: 100, // Reward 100 coins for signing up!
          level: 1,
          emailVerificationToken: verificationToken,
          isEmailVerified: false,
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

    // Send verification email
    await sendVerificationEmail(user.email, verificationToken);

    // Note: We don't set the session cookie here anymore because they need to verify their email first.
    
    return NextResponse.json(
      { 
        message: 'Account created successfully. Please check your email to verify your account.', 
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
