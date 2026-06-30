import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcrypt';
import { isPasswordValid } from '@/lib/auth-validation';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    if (!isPasswordValid(password)) {
      return NextResponse.json({ 
        error: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.' 
      }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { passwordResetToken: token }
    });

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        resetTokenExpiry: null,
      }
    });

    return NextResponse.json({ message: 'Password has been successfully reset' });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
