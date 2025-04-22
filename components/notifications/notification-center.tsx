"use client"

import { useNotifications } from "./notification-provider"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, Clock, Info, MessageSquare, ChevronRight } from "lucide-react"
import { NotificationDemo } from "./notification-demo"

interface NotificationCenterProps {
  filter?: "all" | "unread" | "workouts" | "nutrition" | "achievements"
}

export function NotificationCenter({ filter = "all" }: NotificationCenterProps) {
  const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotifications()

  // Filter notifications based on the selected filter
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true
    if (filter === "unread") return !notification.read
    if (filter === "workouts") return notification.title.toLowerCase().includes("workout")
    if (filter === "nutrition") return notification.title.toLowerCase().includes("nutrition")
    if (filter === "achievements") return notification.title.toLowerCase().includes("achievement")
    return true
  })

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <Check className="h-5 w-5 text-green-500" />
      case "warning":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "error":
        return <Info className="h-5 w-5 text-red-500" />
      case "info":
      default:
        return <Bell className="h-5 w-5 text-blue-500" />
    }
  }

  // Format timestamp
  const formatTimestamp = (date: Date | undefined | null) => {
    if (!date) {
      return "Unknown time";
    }
    
    // Ensure the date is a Date object
    const timestamp = date instanceof Date ? date : new Date(date);
    
    // Check if the date is valid
    if (isNaN(timestamp.getTime())) {
      return "Invalid date";
    }
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">
              {filteredNotifications.length} {filter !== "all" ? filter : ""} notification
              {filteredNotifications.length !== 1 ? "s" : ""}
            </span>
            {filter === "unread" && filteredNotifications.filter((n) => !n.read).length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {filteredNotifications.filter((n) => !n.read).length} new
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
            <Button variant="outline" size="sm" onClick={clearNotifications}>
              Clear all
            </Button>
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No notifications</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {filter === "all"
                  ? "You don't have any notifications yet."
                  : `You don't have any ${filter === "workouts" ? "workout" : filter === "nutrition" ? "nutrition" : filter === "achievements" ? "achievement" : filter} notifications.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-colors ${!notification.read ? "bg-primary/5 border-primary/20" : ""}`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium">{notification.title}</h4>
                        <span className="text-xs text-muted-foreground">{formatTimestamp(notification.timestamp)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      {notification.action && (
                        <div className="pt-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={notification.action.url}>
                              {notification.action.text}
                              <ChevronRight className="ml-1 h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                    {!notification.read && (
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredNotifications.length > 0 && (
          <div className="flex justify-center pt-4">
            <Button variant="outline">Load More</Button>
          </div>
        )}
      </div>
      
      {/* Show notification demo at the bottom of the notification center for testing */}
      {filter === "all" && (
        <div className="pt-6 border-t">
          <NotificationDemo />
        </div>
      )}
    </div>
  )
}

