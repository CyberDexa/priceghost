import { createClient } from '@/lib/supabase/server';
import { sendWelcomeEmail } from '@/lib/email/send';
import { NextRequest, NextResponse } from 'next/server';

// This endpoint is called by Supabase Auth webhook when a new user signs up
// Configure in Supabase Dashboard > Authentication > Hooks > Insert new user
export async function POST(request: NextRequest) {
  try {
    // Verify the request is from Supabase (optional, use webhook secret)
    const authHeader = request.headers.get('authorization');
    const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;
    
    if (webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Supabase sends the user record in the body
    const { record } = body;
    
    if (!record || !record.email) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Extract user name from metadata or email
    const userName = record.raw_user_meta_data?.full_name || 
                     record.raw_user_meta_data?.name ||
                     record.email.split('@')[0];

    // Send welcome email
    await sendWelcomeEmail({
      to: record.email,
      userName,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in auth webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
