import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
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

    const body = await request.json();
    const { url, name, price, image_url, retailer, target_price } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, error: "URL is required" },
        { status: 400 }
      );
    }

    // Check if product already exists for this user
    const { data: existingProduct } = await supabase
      .from("products")
      .select("id, name")
      .eq("user_id", user.id)
      .eq("url", url)
      .single();

    if (existingProduct) {
      // Update existing product
      const { error: updateError } = await supabase
        .from("products")
        .update({
          name: name || existingProduct.name,
          current_price: price,
          image_url: image_url,
          target_price: target_price,
          last_checked: new Date().toISOString(),
        })
        .eq("id", existingProduct.id);

      if (updateError) {
        throw updateError;
      }

      // Add price history
      if (price) {
        await supabase.from("price_history").insert({
          product_id: existingProduct.id,
          price: price,
        });
      }

      return NextResponse.json({
        success: true,
        message: "Product updated",
        product_id: existingProduct.id,
      });
    }

    // Create new product
    const { data: newProduct, error: insertError } = await supabase
      .from("products")
      .insert({
        user_id: user.id,
        url: url,
        name: name || "Unknown Product",
        current_price: price,
        original_price: price,
        lowest_price: price,
        highest_price: price,
        image_url: image_url,
        retailer: retailer || "unknown",
        target_price: target_price,
        is_active: true,
        last_checked: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Add initial price history
    if (price && newProduct) {
      await supabase.from("price_history").insert({
        product_id: newProduct.id,
        price: price,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Product added",
      product_id: newProduct?.id,
    });
  } catch (error) {
    console.error("Add product error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add product" },
      { status: 500 }
    );
  }
}
