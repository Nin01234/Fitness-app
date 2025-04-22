"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle, Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface EmailNotificationBannerProps {
  userId: string;
  showBanner: boolean;
}

export function EmailNotificationBanner({ userId, showBanner }: EmailNotificationBannerProps) {
  const [isVisible, setIsVisible] = useState(showBanner);
  const supabase = createClient();

  if (!isVisible) return null;

  const handleEnableNotifications = async () => {
    try {
      await supabase
        .from("profiles")
        .update({
          email_preferences_set: true,
          email_notifications_enabled: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
      
      setIsVisible(false);
    } catch (error) {
      console.error("Error updating email preferences:", error);
    }
  };

  const handleDeclineNotifications = async () => {
    try {
      await supabase
        .from("profiles")
        .update({
          email_preferences_set: true,
          email_notifications_enabled: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
      
      setIsVisible(false);
    } catch (error) {
      console.error("Error updating email preferences:", error);
    }
  };

  return (
    <div className="w-full bg-primary/5 border-b border-primary/10 py-2">
      <Card className="container flex flex-col sm:flex-row items-center justify-between gap-4 py-2 px-4 bg-background/50 backdrop-blur">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-primary" />
          <p className="text-sm">
            <span className="font-medium">Enable email notifications</span> to receive workout reminders, progress updates, and achievement alerts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="h-8 gap-1"
            onClick={handleEnableNotifications}
          >
            <Bell className="h-4 w-4" />
            <span>Enable</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={handleDeclineNotifications}
          >
            No thanks
          </Button>
        </div>
      </Card>
    </div>
  );
} 