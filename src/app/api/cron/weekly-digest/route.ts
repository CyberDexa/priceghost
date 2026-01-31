import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendWeeklyDigestEmail } from "@/lib/email/send";

// Create Supabase client lazily (not at module load time)
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET(request: Request) {
  // Verify cron secret for security
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();

  try {
    const results = {
      processed: 0,
      sent: 0,
      skipped: 0,
      errors: [] as string[],
    };

    // Get current day of week
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get users who want weekly digests on this day
    const { data: users, error: usersError } = await supabase
      .from("user_preferences")
      .select(`
        user_id,
        weekly_digest_enabled,
        weekly_digest_day,
        last_digest_sent
      `)
      .eq("weekly_digest_enabled", true)
      .eq("weekly_digest_day", dayOfWeek);

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ 
        message: `No users scheduled for digest on ${dayOfWeek}`,
        results 
      });
    }

    // Process each user
    for (const userPref of users) {
      results.processed++;

      try {
        // Get user email
        const { data: authUser } = await supabase.auth.admin.getUserById(userPref.user_id);
        
        if (!authUser?.user?.email) {
          results.skipped++;
          continue;
        }

        // Check if we already sent a digest this week
        if (userPref.last_digest_sent) {
          const lastSent = new Date(userPref.last_digest_sent);
          if (lastSent > oneWeekAgo) {
            results.skipped++;
            continue;
          }
        }

        // Get user's products with price history
        const { data: products } = await supabase
          .from("products")
          .select(`
            id,
            name,
            url,
            image_url,
            current_price,
            original_price,
            is_active
          `)
          .eq("user_id", userPref.user_id)
          .eq("is_active", true);

        if (!products || products.length === 0) {
          results.skipped++;
          continue;
        }

        // Get price history for the past week
        const { data: priceHistory } = await supabase
          .from("price_history")
          .select("product_id, price, checked_at")
          .in("product_id", products.map(p => p.id))
          .gte("checked_at", oneWeekAgo.toISOString())
          .order("checked_at", { ascending: true });

        // Calculate price changes for each product
        const productChanges: {
          priceDrops: Array<{
            name: string;
            url: string;
            imageUrl?: string;
            currentPrice: number;
            weekStartPrice: number;
            priceChange: number;
            percentChange: number;
          }>;
          priceIncreases: Array<{
            name: string;
            url: string;
            imageUrl?: string;
            currentPrice: number;
            weekStartPrice: number;
            priceChange: number;
            percentChange: number;
          }>;
        } = {
          priceDrops: [],
          priceIncreases: [],
        };

        let totalSavings = 0;

        for (const product of products) {
          // Get oldest price in the week for this product
          const productHistory = (priceHistory || [])
            .filter(h => h.product_id === product.id)
            .sort((a, b) => new Date(a.checked_at).getTime() - new Date(b.checked_at).getTime());

          const weekStartPrice = productHistory.length > 0 
            ? productHistory[0].price 
            : product.original_price || product.current_price;
          
          const currentPrice = product.current_price;

          if (!weekStartPrice || !currentPrice) continue;

          const priceChange = currentPrice - weekStartPrice;
          const percentChange = (priceChange / weekStartPrice) * 100;

          if (Math.abs(priceChange) < 0.01) continue; // Ignore tiny changes

          const productData = {
            name: product.name,
            url: product.url,
            imageUrl: product.image_url || undefined,
            currentPrice,
            weekStartPrice,
            priceChange,
            percentChange,
          };

          if (priceChange < 0) {
            productChanges.priceDrops.push(productData);
            totalSavings += Math.abs(priceChange);
          } else {
            productChanges.priceIncreases.push(productData);
          }
        }

        // Sort by biggest savings first
        productChanges.priceDrops.sort((a, b) => 
          Math.abs(b.priceChange) - Math.abs(a.priceChange)
        );

        // Find top deal
        const topDeal = productChanges.priceDrops[0] || undefined;

        // Send digest email
        const emailResult = await sendWeeklyDigestEmail({
          to: authUser.user.email,
          totalProducts: products.length,
          totalSavings,
          priceDrops: productChanges.priceDrops,
          priceIncreases: productChanges.priceIncreases,
          topDeal,
        });

        if (emailResult.success) {
          results.sent++;

          // Update last digest sent
          await supabase
            .from("user_preferences")
            .update({ last_digest_sent: new Date().toISOString() })
            .eq("user_id", userPref.user_id);

          // Log the email
          await supabase
            .from("email_logs")
            .insert({
              user_id: userPref.user_id,
              email_type: "weekly_digest",
              subject: `Weekly Price Report: ${productChanges.priceDrops.length} drops`,
              status: "sent",
            });
        } else {
          results.errors.push(`User ${userPref.user_id}: ${emailResult.error}`);
        }

      } catch (error) {
        results.errors.push(`User ${userPref.user_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      message: "Weekly digest completed",
      results,
    });

  } catch (error) {
    console.error("Weekly digest error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
