import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CompareClient } from "./compare-client";

export default async function ComparePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get products and currency preference in parallel
  const [productsResult, preferencesResult] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("user_id", user.id)
      .order("name", { ascending: true }),
    supabase
      .from("user_preferences")
      .select("currency")
      .eq("user_id", user.id)
      .single(),
  ]);

  const currency = preferencesResult.data?.currency || "USD";

  return <CompareClient products={productsResult.data || []} currency={currency} />;
}
