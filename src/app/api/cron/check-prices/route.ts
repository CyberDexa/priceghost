import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { scrapeProduct } from "@/lib/scrapers";

// Use service role for cron jobs (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const runtime = "edge";
export const maxDuration = 300; // 5 minutes max

// Vercel Cron configuration
export async function GET(request: Request) {
  // Verify cron secret in production
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all active products
    const { data: products, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true);

    if (fetchError) {
      console.error("Failed to fetch products:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!products || products.length === 0) {
      return NextResponse.json({ message: "No products to check", checked: 0 });
    }

    const results = {
      checked: 0,
      updated: 0,
      priceDrops: 0,
      errors: 0,
    };

    // Process products in batches to avoid timeout
    const batchSize = 10;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (product) => {
          try {
            const scrapeResult = await scrapeProduct(product.url);
            results.checked++;

            if (scrapeResult.success && scrapeResult.price) {
              const newPrice = scrapeResult.price;
              const oldPrice = product.current_price;

              // Insert price history
              await supabase.from("price_history").insert({
                product_id: product.id,
                price: newPrice,
              });

              // Update product if price changed
              if (newPrice !== oldPrice) {
                const updateData: Record<string, unknown> = {
                  current_price: newPrice,
                  last_checked: new Date().toISOString(),
                };

                // Track lowest price
                if (!product.lowest_price || newPrice < product.lowest_price) {
                  updateData.lowest_price = newPrice;
                }

                // Track highest price
                if (!product.highest_price || newPrice > product.highest_price) {
                  updateData.highest_price = newPrice;
                }

                await supabase
                  .from("products")
                  .update(updateData)
                  .eq("id", product.id);

                results.updated++;

                // Check for price drop
                if (oldPrice && newPrice < oldPrice) {
                  results.priceDrops++;

                  // Create alert
                  await supabase.from("alerts").insert({
                    user_id: product.user_id,
                    product_id: product.id,
                    alert_type: "price_drop",
                    message: `Price dropped from $${oldPrice.toFixed(2)} to $${newPrice.toFixed(2)} for ${product.name}`,
                    old_price: oldPrice,
                    new_price: newPrice,
                  });

                  // Check if below target price
                  if (product.target_price && newPrice <= product.target_price) {
                    await supabase.from("alerts").insert({
                      user_id: product.user_id,
                      product_id: product.id,
                      alert_type: "target_reached",
                      message: `Target price reached! ${product.name} is now $${newPrice.toFixed(2)} (target: $${product.target_price.toFixed(2)})`,
                      old_price: oldPrice,
                      new_price: newPrice,
                    });
                  }
                }
              } else {
                // Just update last_checked
                await supabase
                  .from("products")
                  .update({ last_checked: new Date().toISOString() })
                  .eq("id", product.id);
              }
            }
          } catch (error) {
            console.error(`Error checking product ${product.id}:`, error);
            results.errors++;
          }
        })
      );
    }

    return NextResponse.json({
      success: true,
      ...results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Cron job failed" },
      { status: 500 }
    );
  }
}
