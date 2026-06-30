import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Verify password
    if (!user.password) {
      return NextResponse.json({ error: 'Please login using Google' }, { status: 401 });
    }

    let passwordMatch = false;
    
    // Fallback for unhashed passwords (for testing purposes, old accounts)
    if (!user.password.startsWith('$2b$') && !user.password.startsWith('$2a$')) {
      passwordMatch = user.password === password;
      if (passwordMatch) {
         // Auto hash their password on first successful login
         await prisma.user.update({
           where: { id: user.id },
           data: { password: await bcrypt.hash(password, 10) }
         });
      }
    } else {
      passwordMatch = await bcrypt.compare(password, user.password);
    }

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Check email verification
    if (!user.isEmailVerified) {
      return NextResponse.json({ error: 'Please verify your email before logging in.' }, { status: 403 });
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
      message: 'Logged in successfully',
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
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
