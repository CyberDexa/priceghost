import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { ProductDetailClient } from "./product-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch product with price history
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !product) {
    notFound();
  }

  // Fetch price history
  const { data: priceHistory } = await supabase
    .from("price_history")
    .select("*")
    .eq("product_id", id)
    .order("created_at", { ascending: false })
    .limit(100);

  // Fetch alerts for this product
  const { data: alerts } = await supabase
    .from("alerts")
    .select("*")
    .eq("product_id", id)
    .order("created_at", { ascending: false })
    .limit(10);

  // Fetch user currency preference
  const { data: preferences } = await supabase
    .from("user_preferences")
    .select("currency")
    .eq("user_id", user.id)
    .single();

  const currency = preferences?.currency || "USD";

  return (
    <Suspense
      fallback={
        <div className="animate-pulse p-8">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      }
    >
      <ProductDetailClient
        product={product}
        priceHistory={priceHistory || []}
        alerts={alerts || []}
        currency={currency}
      />
    </Suspense>
  );
}
