import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendPriceDropEmail } from "@/lib/email/send";

// Test endpoint to create a sample alert and send email
export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get a product to create alert for
  const { data: product } = await supabase
    .from("products")
    .select("id, name, current_price, url, image_url")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!product) {
    return NextResponse.json({ error: "No products found" }, { status: 404 });
  }

  // Create a test alert
  const oldPrice = (product.current_price || 100) * 1.2;
  const newPrice = product.current_price || 100;

  const { data: alert, error } = await supabase
    .from("alerts")
    .insert({
      user_id: user.id,
      product_id: product.id,
      alert_type: "price_drop",
      message: `Price dropped from $${oldPrice.toFixed(2)} to $${newPrice.toFixed(2)} for ${product.name}`,
      old_price: oldPrice,
      new_price: newPrice,
      is_triggered: true,
      triggered_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating test alert:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send the email
  const emailResult = await sendPriceDropEmail({
    to: user.email!,
    productName: product.name,
    productUrl: product.url,
    oldPrice: oldPrice,
    newPrice: newPrice,
    imageUrl: product.image_url || undefined,
  });

  return NextResponse.json({ 
    success: true, 
    alert,
    email: emailResult 
  });
}
