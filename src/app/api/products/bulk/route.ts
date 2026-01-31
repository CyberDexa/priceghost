import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { scrapeProduct } from "@/lib/scrapers";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, productIds } = body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: "Product IDs are required" },
        { status: 400 }
      );
    }

    // Verify products belong to user
    const { data: products, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", user.id)
      .in("id", productIds);

    if (fetchError) throw fetchError;

    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: "No valid products found" },
        { status: 404 }
      );
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    switch (action) {
      case "delete":
        // Bulk delete
        const { error: deleteError } = await supabase
          .from("products")
          .delete()
          .in("id", productIds)
          .eq("user_id", user.id);

        if (deleteError) {
          results.failed = productIds.length;
          results.errors.push(deleteError.message);
        } else {
          results.success = products.length;
        }
        break;

      case "refresh":
        // Bulk refresh prices
        for (const product of products) {
          try {
            const scrapeResult = await scrapeProduct(product.url);

            if (scrapeResult.success && scrapeResult.price) {
              const newPrice = scrapeResult.price;
              const updateData: Record<string, unknown> = {
                current_price: newPrice,
                last_checked: new Date().toISOString(),
              };

              if (!product.lowest_price || newPrice < product.lowest_price) {
                updateData.lowest_price = newPrice;
              }
              if (!product.highest_price || newPrice > product.highest_price) {
                updateData.highest_price = newPrice;
              }

              await supabase
                .from("products")
                .update(updateData)
                .eq("id", product.id);

              // Add to price history
              await supabase.from("price_history").insert({
                product_id: product.id,
                price: newPrice,
              });

              // Create alert if price dropped
              if (product.current_price && newPrice < product.current_price) {
                await supabase.from("alerts").insert({
                  user_id: user.id,
                  product_id: product.id,
                  alert_type: "price_drop",
                  message: `Price dropped from $${product.current_price.toFixed(2)} to $${newPrice.toFixed(2)} for ${product.name}`,
                  old_price: product.current_price,
                  new_price: newPrice,
                });
              }

              results.success++;
            } else {
              results.failed++;
              results.errors.push(
                `${product.name}: ${scrapeResult.error || "Failed to get price"}`
              );
            }
          } catch (error) {
            results.failed++;
            results.errors.push(
              `${product.name}: ${error instanceof Error ? error.message : "Unknown error"}`
            );
          }
        }
        break;

      case "rescrape":
        // Full re-scrape - update all product details including name, image, retailer
        for (const product of products) {
          try {
            const scrapeResult = await scrapeProduct(product.url);

            if (scrapeResult.success) {
              const updateData: Record<string, unknown> = {
                last_checked: new Date().toISOString(),
              };

              // Update name if we got a better one (not generic)
              if (scrapeResult.name && 
                  scrapeResult.name !== "Product" && 
                  scrapeResult.name.length > 3 &&
                  (product.name === "Product" || !product.name)) {
                updateData.name = scrapeResult.name;
              }

              // Update image if we got one and product doesn't have one
              if (scrapeResult.image_url && (!product.image_url || product.image_url === "")) {
                updateData.image_url = scrapeResult.image_url;
              }

              // Update retailer if we detected one and current is unknown
              if (scrapeResult.retailer && 
                  scrapeResult.retailer !== "unknown" && 
                  (product.retailer === "unknown" || product.retailer === "Unknown")) {
                updateData.retailer = scrapeResult.retailer;
              }

              // Update currency if detected
              if (scrapeResult.currency) {
                updateData.currency = scrapeResult.currency;
              }

              // Update price if available
              if (scrapeResult.price) {
                updateData.current_price = scrapeResult.price;
                
                if (!product.original_price) {
                  updateData.original_price = scrapeResult.price;
                }
                if (!product.lowest_price || scrapeResult.price < product.lowest_price) {
                  updateData.lowest_price = scrapeResult.price;
                }
                if (!product.highest_price || scrapeResult.price > product.highest_price) {
                  updateData.highest_price = scrapeResult.price;
                }

                // Add to price history
                await supabase.from("price_history").insert({
                  product_id: product.id,
                  price: scrapeResult.price,
                });
              }

              await supabase
                .from("products")
                .update(updateData)
                .eq("id", product.id);

              results.success++;
            } else {
              results.failed++;
              results.errors.push(
                `${product.name || product.url}: ${scrapeResult.error || "Failed to scrape"}`
              );
            }
          } catch (error) {
            results.failed++;
            results.errors.push(
              `${product.name || product.url}: ${error instanceof Error ? error.message : "Unknown error"}`
            );
          }
        }
        break;

      case "activate":
        // Bulk activate
        const { error: activateError } = await supabase
          .from("products")
          .update({ is_active: true })
          .in("id", productIds)
          .eq("user_id", user.id);

        if (activateError) {
          results.failed = productIds.length;
          results.errors.push(activateError.message);
        } else {
          results.success = products.length;
        }
        break;

      case "deactivate":
        // Bulk deactivate (pause tracking)
        const { error: deactivateError } = await supabase
          .from("products")
          .update({ is_active: false })
          .in("id", productIds)
          .eq("user_id", user.id);

        if (deactivateError) {
          results.failed = productIds.length;
          results.errors.push(deactivateError.message);
        } else {
          results.success = products.length;
        }
        break;

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      action,
      results,
    });
  } catch (error) {
    console.error("Bulk action error:", error);
    return NextResponse.json(
      { error: "Failed to perform bulk action" },
      { status: 500 }
    );
  }
}
