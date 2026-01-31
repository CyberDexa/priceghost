import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "products";

    if (type === "products") {
      // Export all products
      const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Convert to CSV
      const headers = [
        "Name",
        "URL",
        "Retailer",
        "Current Price",
        "Original Price",
        "Lowest Price",
        "Highest Price",
        "Target Price",
        "Currency",
        "Created At",
        "Last Checked",
      ];

      const rows = (products || []).map((p) => [
        `"${(p.name || "").replace(/"/g, '""')}"`,
        `"${p.url}"`,
        p.retailer,
        p.current_price || "",
        p.original_price || "",
        p.lowest_price || "",
        p.highest_price || "",
        p.target_price || "",
        p.currency || "USD",
        p.created_at,
        p.last_checked || "",
      ]);

      const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join(
        "\n"
      );

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="priceghost-products-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    } else if (type === "history") {
      // Export price history for all products
      const { data: products } = await supabase
        .from("products")
        .select("id, name, retailer")
        .eq("user_id", user.id);

      if (!products || products.length === 0) {
        return new NextResponse("No products found", { status: 404 });
      }

      const productIds = products.map((p) => p.id);
      const productMap = Object.fromEntries(
        products.map((p) => [p.id, p])
      );

      const { data: history, error } = await supabase
        .from("price_history")
        .select("*")
        .in("product_id", productIds)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const headers = ["Product Name", "Retailer", "Price", "Date"];

      const rows = (history || []).map((h) => {
        const product = productMap[h.product_id];
        return [
          `"${(product?.name || "Unknown").replace(/"/g, '""')}"`,
          product?.retailer || "unknown",
          h.price,
          h.created_at,
        ];
      });

      const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join(
        "\n"
      );

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="priceghost-history-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    } else if (type === "alerts") {
      // Export alerts
      const { data: alerts, error } = await supabase
        .from("alerts")
        .select(
          `
          *,
          products (name, retailer)
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const headers = [
        "Product Name",
        "Alert Type",
        "Message",
        "Old Price",
        "New Price",
        "Date",
        "Read",
      ];

      const rows = (alerts || []).map((a) => [
        `"${((a.products as any)?.name || "Unknown").replace(/"/g, '""')}"`,
        a.alert_type,
        `"${(a.message || "").replace(/"/g, '""')}"`,
        a.old_price || "",
        a.new_price || "",
        a.created_at,
        a.is_read ? "Yes" : "No",
      ]);

      const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join(
        "\n"
      );

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="priceghost-alerts-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    return NextResponse.json({ error: "Invalid export type" }, { status: 400 });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
