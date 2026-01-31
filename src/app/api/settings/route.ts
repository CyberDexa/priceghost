import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: preferences, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows returned
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ preferences });
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    email_notifications,
    price_drop_threshold,
    check_frequency,
    notification_frequency,
    weekly_digest_enabled,
    weekly_digest_day,
    quiet_hours_start,
    quiet_hours_end,
    timezone,
    currency,
  } = body;

  // Check if preferences exist
  const { data: existing } = await supabase
    .from("user_preferences")
    .select("id")
    .eq("user_id", user.id)
    .single();

  const preferences = {
    email_notifications,
    price_drop_threshold,
    check_frequency,
    notification_frequency,
    weekly_digest_enabled,
    weekly_digest_day,
    quiet_hours_start,
    quiet_hours_end,
    timezone,
    currency,
    updated_at: new Date().toISOString(),
  };

  let result;
  if (existing) {
    // Update existing
    result = await supabase
      .from("user_preferences")
      .update(preferences)
      .eq("user_id", user.id)
      .select()
      .single();
  } else {
    // Insert new
    result = await supabase
      .from("user_preferences")
      .insert({
        user_id: user.id,
        ...preferences,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
  }

  if (result.error) {
    console.error("Settings save error:", result.error);
    return NextResponse.json(
      { error: result.error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ 
    success: true, 
    preferences: result.data 
  });
}
