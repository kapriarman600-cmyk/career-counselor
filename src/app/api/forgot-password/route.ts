import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (!user) {
      // Don't leak that the user doesn't exist for security reasons
      return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        resetTokenExpiry,
      }
    });

    await sendPasswordResetEmail(user.email, resetToken);

    return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
