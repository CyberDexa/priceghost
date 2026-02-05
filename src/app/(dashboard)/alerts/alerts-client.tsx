"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { getValidImageUrl } from "@/lib/utils/image";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  TrendingDown,
  Target,
  Package,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

interface Alert {
  id: string;
  alert_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
  old_price: number | null;
  new_price: number | null;
  products: {
    id: string;
    name: string;
    image_url: string | null;
    url: string;
    retailer: string;
  } | null;
}

interface AlertsClientProps {
  alerts: Alert[];
}

export function AlertsClient({ alerts: initialAlerts }: AlertsClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const [alerts, setAlerts] = useState(initialAlerts);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const unreadCount = alerts.filter((a) => !a.is_read).length;

  const markAsRead = async (alertId: string) => {
    await supabase.from("alerts").update({ is_read: true }).eq("id", alertId);
    setAlerts(
      alerts.map((a) => (a.id === alertId ? { ...a, is_read: true } : a))
    );
  };

  const markAllAsRead = async () => {
    setIsMarkingAll(true);
    await supabase
      .from("alerts")
      .update({ is_read: true })
      .eq("is_read", false);
    setAlerts(alerts.map((a) => ({ ...a, is_read: true })));
    setIsMarkingAll(false);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "price_drop":
        return <TrendingDown className="h-5 w-5 text-emerald-400" />;
      case "target_reached":
        return <Target className="h-5 w-5 text-blue-400" />;
      default:
        return <Bell className="h-5 w-5 text-zinc-400" />;
    }
  };

  const getAlertBg = (type: string, isRead: boolean) => {
    if (isRead) return "bg-zinc-900/50";
    switch (type) {
      case "price_drop":
        return "bg-emerald-500/10 border-emerald-500/20";
      case "target_reached":
        return "bg-blue-500/10 border-blue-500/20";
      default:
        return "bg-zinc-800/50";
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Alerts</h1>
          <p className="text-zinc-400">
            {unreadCount > 0
              ? `${unreadCount} unread alert${unreadCount !== 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            onClick={markAllAsRead}
            disabled={isMarkingAll}
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {alerts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BellOff className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No alerts yet
            </h3>
            <p className="text-zinc-400 mb-4">
              We&apos;ll notify you when prices drop on your tracked products.
            </p>
            <Link href="/dashboard">
              <Button>View Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card
              key={alert.id}
              className={`transition-colors ${getAlertBg(alert.alert_type, alert.is_read)}`}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative w-16 h-16 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                    {getValidImageUrl(alert.products?.image_url) ? (
                      <Image
                        src={getValidImageUrl(alert.products?.image_url)!}
                        alt={alert.products?.name || "Product"}
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-6 w-6 text-zinc-600" />
                      </div>
                    )}
                  </div>

                  {/* Alert Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getAlertIcon(alert.alert_type)}
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            alert.alert_type === "price_drop"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : alert.alert_type === "target_reached"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-zinc-700 text-zinc-300"
                          }`}
                        >
                          {alert.alert_type === "price_drop"
                            ? "Price Drop"
                            : alert.alert_type === "target_reached"
                              ? "Target Reached"
                              : "Alert"}
                        </span>
                      </div>

                      {!alert.is_read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(alert.id)}
                          className="text-zinc-400"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <p className="text-sm text-white mt-2">{alert.message}</p>

                    {alert.products && (
                      <p className="text-xs text-zinc-500 mt-1 truncate">
                        {alert.products.name}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-zinc-500">
                        {format(
                          new Date(alert.created_at),
                          "MMM d, yyyy h:mm a"
                        )}
                      </span>

                      <div className="flex gap-2">
                        {alert.products && (
                          <>
                            <Link href={`/products/${alert.products.id}`}>
                              <Button variant="ghost" size="sm">
                                View Details
                              </Button>
                            </Link>
                            <a
                              href={alert.products.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="glass" size="sm">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Buy Now
                              </Button>
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
