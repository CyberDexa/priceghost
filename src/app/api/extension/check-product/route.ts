import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET(request: Request) {
  try {
    const supabase = getSupabase();
    // Get auth token from header
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Get URL from query params
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { success: false, error: "URL is required" },
        { status: 400 }
      );
    }

    // Check if user is tracking this product
    const { data: product } = await supabase
      .from("products")
      .select("id, name, current_price, target_price")
      .eq("user_id", user.id)
      .eq("url", url)
      .single();

    return NextResponse.json({
      success: true,
      isTracking: !!product,
      product: product || null,
    });
  } catch (error) {
    console.error("Check product error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check product" },
      { status: 500 }
    );
  }
}
