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

  // Get all products grouped by similar names
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  return <CompareClient products={products || []} />;
}
