"use client";

import { EmailNotificationBanner } from "@/components/notifications/email-notification-banner";

interface EmailBannerWrapperProps {
  userId: string;
  showBanner: boolean;
}

export function ClientEmailBannerWrapper({ userId, showBanner }: EmailBannerWrapperProps) {
  return (
    <EmailNotificationBanner
      userId={userId}
      showBanner={showBanner}
    />
  );
} 