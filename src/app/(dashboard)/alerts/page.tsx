import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AlertsClient } from "./alerts-client";

export default async function AlertsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch alerts with product info
  const { data: alerts } = await supabase
    .from("alerts")
    .select(
      `
      *,
      products (
        id,
        name,
        image_url,
        url,
        retailer
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return <AlertsClient alerts={alerts || []} />;
}
