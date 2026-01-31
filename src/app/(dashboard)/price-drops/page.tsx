import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PriceDropsClient } from "./price-drops-client";

export default async function PriceDropsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch products with price drops (current < original)
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", user.id)
    .not("original_price", "is", null)
    .not("current_price", "is", null)
    .order("created_at", { ascending: false });

  // Filter products where current price is lower than original
  const priceDrops = (products || []).filter(
    (p) => p.current_price && p.original_price && p.current_price < p.original_price
  );

  // Calculate total savings
  const totalSavings = priceDrops.reduce((sum, p) => {
    return sum + (p.original_price - p.current_price);
  }, 0);

  return (
    <PriceDropsClient
      products={priceDrops}
      totalSavings={totalSavings}
    />
  );
}
