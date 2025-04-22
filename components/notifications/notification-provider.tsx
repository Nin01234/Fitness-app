"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { toast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  timestamp: Date
  action?: {
    text: string
    url: string
  }
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "read" | "timestamp">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
  requestPermission: () => void
  hasPermission: boolean
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [hasPermission, setHasPermission] = useState(false)
  const supabase = createClient()

  // Request notification permission on mount if not granted
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        setHasPermission(true)
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          setHasPermission(permission === "granted")
        })
      }
    }
  }, [])

  // Load notifications from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedNotifications = localStorage.getItem("fitlife_notifications")
      if (savedNotifications) {
        try {
          const parsed = JSON.parse(savedNotifications).map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          }))
          setNotifications(parsed)
        } catch (error) {
          console.error("Error parsing saved notifications:", error)
        }
      }
    }
  }, [])

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined" && notifications.length > 0) {
      localStorage.setItem("fitlife_notifications", JSON.stringify(notifications))
    }
  }, [notifications])

  // Supabase Realtime subscription for notifications
  useEffect(() => {
    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          console.log('New notification received:', payload.new)
          // Ensure we convert the timestamp to a proper Date object
          const newNotification = {
            ...payload.new,
            timestamp: payload.new.timestamp ? new Date(payload.new.timestamp) : new Date(),
          } as Notification;
          
          // Add basic user filtering example (requires user context)
          // const { data: { user } } = useUser(); // hypothetical hook
          // if (newNotification.user_id === user?.id) { ... }

          if (!notifications.some(n => n.id === newNotification.id)) {
            showToastNotification(newNotification)
            setNotifications((prev) => [newNotification, ...prev])
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [supabase, notifications]) 

  const unreadCount = notifications.filter((n) => !n.read).length

  const requestPermission = useCallback(async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      try {
        const permission = await Notification.requestPermission()
        setHasPermission(permission === "granted")
        if (permission === "granted") {
          toast({
            title: "Notifications enabled",
            description: "You'll now receive push notifications from FitLife",
            duration: 3000,
          })
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error)
      }
    }
  }, [])

  const showToastNotification = (notification: Notification) => {
    // Show toast notification
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === "error" ? "destructive" : "default",
      duration: 5000, // Show for longer (5 seconds)
      action: notification.action ? (
        <a href={notification.action.url} className="font-medium underline ml-auto">
          {notification.action.text}
        </a>
      ) : undefined,
      className: "animate-bounce-once border-l-4 border-primary shadow-lg", // Add animation and styling
    })

    // Send browser notification if permission granted
    if (hasPermission && typeof window !== "undefined" && "Notification" in window) {
      try {
        const browserNotification = new window.Notification(notification.title, {
          body: notification.message,
          icon: "/logo.png", // Add your app logo path here
          badge: "/logo-badge.png", // Add a badge icon for mobile notifications
          tag: notification.id, // Tag to group similar notifications
          requireInteraction: true, // Keep notification visible until user interacts with it
        })
        
        // Handle notification click
        browserNotification.onclick = function() {
          window.focus();
          if (notification.action?.url) {
            window.location.href = notification.action.url;
          }
          browserNotification.close();
        };
      } catch (error) {
        console.error("Error sending browser notification:", error)
      }
    }
  }

  // This function can be used to manually add notifications (e.g., after user actions)
  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "read" | "timestamp">) => {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        read: false,
        timestamp: new Date(),
      }
      setNotifications((prev) => [newNotification, ...prev])
      showToastNotification(newNotification)
    },
    [hasPermission],
  )

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
    localStorage.removeItem("fitlife_notifications")
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        requestPermission,
        hasPermission,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

