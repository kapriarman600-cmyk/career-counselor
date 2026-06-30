import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Missing verification token' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { emailVerificationToken: token }
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired verification token' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
      }
    });

    return NextResponse.json({ message: 'Email verified successfully' });
  } catch (error: any) {
    console.error('Email verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
