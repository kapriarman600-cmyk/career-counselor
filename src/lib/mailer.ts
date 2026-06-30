import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'user',
    pass: process.env.SMTP_PASS || 'pass',
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || '"Career Counselor" <noreply@example.com>',
    to: email,
    subject: 'Verify your email address',
    html: `
      <h2>Welcome to Career Counselor!</h2>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || '"Career Counselor" <noreply@example.com>',
    to: email,
    subject: 'Reset your password',
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};
