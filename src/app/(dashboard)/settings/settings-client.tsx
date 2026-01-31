"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Bell, 
  Mail, 
  Shield, 
  LogOut, 
  Clock,
  Calendar,
  Moon,
  Globe,
  Download,
  Trash2,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

interface UserPreferences {
  id?: string;
  email_notifications: boolean;
  price_drop_threshold: number;
  check_frequency: string;
  notification_frequency: string;
  weekly_digest_enabled: boolean;
  weekly_digest_day: string;
  quiet_hours_start: number | null;
  quiet_hours_end: number | null;
  timezone: string;
  currency: string;
}

interface SettingsClientProps {
  user: {
    id: string;
    email: string;
  };
  preferences: UserPreferences | null;
}

const daysOfWeek = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

const timezones = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Central European (CET)" },
  { value: "Asia/Tokyo", label: "Japan (JST)" },
  { value: "Asia/Shanghai", label: "China (CST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
];

const currencies = [
  { value: "USD", label: "US Dollar ($)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GBP", label: "British Pound (£)" },
  { value: "CAD", label: "Canadian Dollar (CA$)" },
  { value: "AUD", label: "Australian Dollar (A$)" },
  { value: "JPY", label: "Japanese Yen (¥)" },
];

export function SettingsClient({ user, preferences }: SettingsClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [settings, setSettings] = useState<UserPreferences>({
    email_notifications: preferences?.email_notifications ?? true,
    price_drop_threshold: preferences?.price_drop_threshold ?? 5,
    check_frequency: preferences?.check_frequency ?? "6h",
    notification_frequency: preferences?.notification_frequency ?? "instant",
    weekly_digest_enabled: preferences?.weekly_digest_enabled ?? true,
    weekly_digest_day: preferences?.weekly_digest_day ?? "monday",
    quiet_hours_start: preferences?.quiet_hours_start ?? null,
    quiet_hours_end: preferences?.quiet_hours_end ?? null,
    timezone: preferences?.timezone ?? "UTC",
    currency: preferences?.currency ?? "USD",
  });

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      if (preferences?.id) {
        await supabase
          .from("user_preferences")
          .update(settings)
          .eq("id", preferences.id);
      } else {
        await supabase.from("user_preferences").insert({
          user_id: user.id,
          ...settings,
        });
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      router.refresh();
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Export all user data
      const response = await fetch("/api/export?type=products");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `priceghost-data-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.")) {
      return;
    }
    if (!confirm("This is your last chance to cancel. Are you absolutely sure?")) {
      return;
    }
    
    setIsDeleting(true);
    try {
      // Delete user data (products, preferences, etc.)
      await supabase.from("products").delete().eq("user_id", user.id);
      await supabase.from("user_preferences").delete().eq("user_id", user.id);
      await supabase.from("alerts").delete().eq("user_id", user.id);
      
      // Sign out
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Delete account failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-emerald-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-500" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <Input value={user.email} disabled className="mt-1 bg-gray-50" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    <Globe className="h-4 w-4 inline mr-1" />
                    Timezone
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {timezones.map((tz) => (
                      <option key={tz.value} value={tz.value}>{tz.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Currency
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {currencies.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-gray-500" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Email Notifications Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email Notifications
                  </label>
                  <p className="text-xs text-gray-500">
                    Receive email alerts when prices drop
                  </p>
                </div>
                <Toggle 
                  enabled={settings.email_notifications}
                  onToggle={() => setSettings({ ...settings, email_notifications: !settings.email_notifications })}
                />
              </div>

              {settings.email_notifications && (
                <>
                  {/* Notification Frequency */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      <Mail className="h-4 w-4 inline mr-1" />
                      Alert Frequency
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      How often you want to receive price drop alerts
                    </p>
                    <select
                      value={settings.notification_frequency}
                      onChange={(e) => setSettings({ ...settings, notification_frequency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="instant">Instant (as they happen)</option>
                      <option value="daily">Daily digest</option>
                      <option value="weekly">Weekly digest only</option>
                      <option value="none">No emails</option>
                    </select>
                  </div>

                  {/* Price Drop Threshold */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Price Drop Threshold
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      Only notify when price drops by at least this percentage
                    </p>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        max="50"
                        value={settings.price_drop_threshold}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            price_drop_threshold: parseInt(e.target.value) || 5,
                          })
                        }
                        className="w-24"
                      />
                      <span className="text-sm text-gray-500">%</span>
                    </div>
                  </div>

                  {/* Quiet Hours */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      <Moon className="h-4 w-4 inline mr-1" />
                      Quiet Hours (Optional)
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      Don't send notifications during these hours
                    </p>
                    <div className="flex items-center gap-2">
                      <select
                        value={settings.quiet_hours_start ?? ""}
                        onChange={(e) => setSettings({ 
                          ...settings, 
                          quiet_hours_start: e.target.value ? parseInt(e.target.value) : null 
                        })}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">No quiet hours</option>
                        {Array.from({ length: 24 }, (_, i) => (
                          <option key={i} value={i}>
                            {i === 0 ? "12:00 AM" : i < 12 ? `${i}:00 AM` : i === 12 ? "12:00 PM" : `${i - 12}:00 PM`}
                          </option>
                        ))}
                      </select>
                      <span className="text-gray-500">to</span>
                      <select
                        value={settings.quiet_hours_end ?? ""}
                        onChange={(e) => setSettings({ 
                          ...settings, 
                          quiet_hours_end: e.target.value ? parseInt(e.target.value) : null 
                        })}
                        disabled={settings.quiet_hours_start === null}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
                      >
                        <option value="">--</option>
                        {Array.from({ length: 24 }, (_, i) => (
                          <option key={i} value={i}>
                            {i === 0 ? "12:00 AM" : i < 12 ? `${i}:00 AM` : i === 12 ? "12:00 PM" : `${i - 12}:00 PM`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Digest */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              Weekly Digest
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Weekly Summary Email
                  </label>
                  <p className="text-xs text-gray-500">
                    Receive a weekly summary of all price changes
                  </p>
                </div>
                <Toggle 
                  enabled={settings.weekly_digest_enabled}
                  onToggle={() => setSettings({ ...settings, weekly_digest_enabled: !settings.weekly_digest_enabled })}
                />
              </div>

              {settings.weekly_digest_enabled && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Delivery Day
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Which day do you want to receive your weekly digest?
                  </p>
                  <select
                    value={settings.weekly_digest_day}
                    onChange={(e) => setSettings({ ...settings, weekly_digest_day: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {daysOfWeek.map((day) => (
                      <option key={day.value} value={day.value}>{day.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Price Checking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              Price Checking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Check Frequency
              </label>
              <p className="text-xs text-gray-500 mb-2">
                How often we check prices for your products
              </p>
              <select
                value={settings.check_frequency}
                onChange={(e) => setSettings({ ...settings, check_frequency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="1h">Every hour</option>
                <option value="6h">Every 6 hours</option>
                <option value="12h">Every 12 hours</option>
                <option value="24h">Once a day</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Preferences"}
          </Button>
          {saveSuccess && (
            <span className="text-emerald-600 text-sm flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              Saved successfully!
            </span>
          )}
        </div>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-gray-500" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Export Your Data</h4>
              <p className="text-xs text-gray-500 mb-3">
                Download all your tracked products and price history
              </p>
              <Button variant="outline" onClick={handleExportData} disabled={isExporting}>
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Exporting..." : "Export Data (CSV)"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security & Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Shield className="h-5 w-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Button
                variant="outline"
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isSigningOut ? "Signing out..." : "Sign Out"}
              </Button>
            </div>
            
            <div className="pt-4 border-t border-red-100">
              <h4 className="text-sm font-medium text-red-700 mb-2">Delete Account</h4>
              <p className="text-xs text-gray-500 mb-3">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button
                variant="outline"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete Account"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
