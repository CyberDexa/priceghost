import { createClient } from '@/lib/supabase/server';
import { sendWelcomeEmail } from '@/lib/email/send';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Create the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Send welcome email
    if (data.user) {
      const userName = email.split('@')[0];
      try {
        await sendWelcomeEmail({
          to: email,
          userName,
        });
      } catch (emailError) {
        // Log but don't fail the signup if email fails
        console.error('Failed to send welcome email:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Check your email to confirm your account',
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
