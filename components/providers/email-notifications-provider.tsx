"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SupabaseClient } from "@supabase/supabase-js";

interface EmailNotificationsContextType {
  isEmailEnabled: boolean;
  toggleEmailNotifications: (enabled: boolean) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const EmailNotificationsContext = createContext<EmailNotificationsContextType | undefined>(undefined);

interface EmailNotificationsProviderProps {
  children: ReactNode;
  supabase: SupabaseClient;
  userId: string;
  email: string | undefined;
}

export function EmailNotificationsProvider({
  children,
  supabase,
  userId,
  email
}: EmailNotificationsProviderProps) {
  const [isEmailEnabled, setIsEmailEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmailPreferences = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("email_notifications_enabled")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error fetching email preferences:", error);
          setError(error.message);
        } else {
          setIsEmailEnabled(data?.email_notifications_enabled || false);
        }
      } catch (e) {
        console.error("Error in fetching email preferences:", e);
        setError("Failed to load email preferences");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchEmailPreferences();
    }
  }, [supabase, userId]);

  const toggleEmailNotifications = async (enabled: boolean) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from("profiles")
        .update({
          email_notifications_enabled: enabled,
          email_preferences_set: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) {
        console.error("Error updating email preferences:", error);
        setError(error.message);
      } else {
        setIsEmailEnabled(enabled);
      }
    } catch (e) {
      console.error("Error in updating email preferences:", e);
      setError("Failed to update email preferences");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EmailNotificationsContext.Provider
      value={{
        isEmailEnabled,
        toggleEmailNotifications,
        isLoading,
        error,
      }}
    >
      {children}
    </EmailNotificationsContext.Provider>
  );
}

export const useEmailNotifications = () => {
  const context = useContext(EmailNotificationsContext);
  if (context === undefined) {
    throw new Error("useEmailNotifications must be used within an EmailNotificationsProvider");
  }
  return context;
}; 