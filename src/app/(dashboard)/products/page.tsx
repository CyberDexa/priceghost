import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProductsClient } from "./products-client";

export default async function ProductsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch products and user preferences in parallel
  const [productsResult, preferencesResult] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("user_preferences")
      .select("currency")
      .eq("user_id", user.id)
      .single(),
  ]);

  const currency = preferencesResult.data?.currency || "USD";

  return <ProductsClient products={productsResult.data || []} currency={currency} />;
}
