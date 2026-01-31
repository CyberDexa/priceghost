import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  // Fetch products and preferences in parallel
  const [productsResult, preferencesResult] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
    supabase
      .from("user_preferences")
      .select("currency")
      .eq("user_id", user.id)
      .single()
  ]);

  const products = productsResult.data;
  const currency = preferencesResult.data?.currency || "USD";

  // Calculate stats
  const totalProducts = products?.length || 0;
  const totalSavings = products?.reduce((acc, p) => {
    if (p.original_price && p.current_price && p.current_price < p.original_price) {
      return acc + (p.original_price - p.current_price);
    }
    return acc;
  }, 0) || 0;
  
  const priceDrops = products?.filter(p => 
    p.original_price && p.current_price && p.current_price < p.original_price
  ).length || 0;

  return (
    <DashboardClient 
      products={products || []}
      stats={{
        totalProducts,
        totalSavings,
        priceDrops,
      }}
      currency={currency}
    />
  );
}
