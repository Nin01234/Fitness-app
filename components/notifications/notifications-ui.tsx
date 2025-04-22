"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useNotifications } from "./notification-provider"
import { AnimatePresence, motion } from "framer-motion"
import { 
  Bell, 
  Dumbbell, 
  Award, 
  Clock, 
  Info, 
  MessageSquare, 
  Utensils, 
  ChevronRight,
  X,
  Check,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function NotificationsUI() {
  const { notifications, unreadCount, markAsRead, clearNotifications } = useNotifications()
  const [showNotifications, setShowNotifications] = useState(false)
  const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0)
  const [activeNotifications, setActiveNotifications] = useState(notifications)
  const notificationRef = useRef<HTMLDivElement>(null)

  // Filter to only show unread notifications by default
  useEffect(() => {
    setActiveNotifications(notifications.filter(n => !n.read))
  }, [notifications])

  // Close notifications panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Reset index when notifications change
  useEffect(() => {
    setCurrentNotificationIndex(0)
  }, [activeNotifications])

  // Handle marking notification as read and showing next notification
  const handleNext = useCallback(() => {
    if (activeNotifications.length > 0 && currentNotificationIndex < activeNotifications.length) {
      const currentNotification = activeNotifications[currentNotificationIndex]
      markAsRead(currentNotification.id)
      
      if (currentNotificationIndex < activeNotifications.length - 1) {
        setCurrentNotificationIndex(prev => prev + 1)
      } else {
        // If this is the last notification, close the panel after marking as read
        setTimeout(() => {
          setShowNotifications(false)
          setCurrentNotificationIndex(0)
        }, 300)
      }
    }
  }, [activeNotifications, currentNotificationIndex, markAsRead])

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
    <div className="relative" ref={notificationRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 px-1.5 min-w-[1.2rem] h-5 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 z-50 origin-top-right"
          >
            <Card className="border shadow-lg overflow-hidden">
              <div className="flex items-center justify-between border-b p-3 bg-muted/30">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {activeNotifications.length > 0 ? 
                      `Notifications (${currentNotificationIndex + 1}/${activeNotifications.length})` : 
                      'Notifications'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={() => {
                      clearNotifications()
                      setShowNotifications(false)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={() => setShowNotifications(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-3">
                {activeNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <Bell className="h-10 w-10 text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">You don't have any notifications yet.</p>
                    <Button 
                      variant="link" 
                      asChild
                      className="mt-2 text-xs"
                    >
                      <Link href="/notifications">
                        View notification settings
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeNotifications[currentNotificationIndex]?.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      <div className="flex gap-3 p-3 border rounded-lg bg-card transition-colors hover:bg-muted/30">
                        <div className="mt-0.5">
                          {getNotificationIcon(activeNotifications[currentNotificationIndex]?.type || "info")}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium">{activeNotifications[currentNotificationIndex]?.title}</h4>
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(activeNotifications[currentNotificationIndex]?.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{activeNotifications[currentNotificationIndex]?.message}</p>
                          {activeNotifications[currentNotificationIndex]?.action && (
                            <div className="pt-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={activeNotifications[currentNotificationIndex]?.action?.url || '#'}>
                                  {activeNotifications[currentNotificationIndex]?.action?.text}
                                  <ChevronRight className="ml-1 h-3 w-3" />
                                </Link>
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => setShowNotifications(false)}
                        >
                          Close
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="text-xs"
                          onClick={handleNext}
                        >
                          {currentNotificationIndex < activeNotifications.length - 1 ? "Next" : "Mark as Read"}
                        </Button>
                      </div>
                      
                      {activeNotifications.length > 1 && (
                        <div className="flex justify-center gap-1 pt-2">
                          {activeNotifications.map((_, idx) => (
                            <div 
                              key={idx} 
                              className={`h-1.5 rounded-full ${
                                idx === currentNotificationIndex ? 'w-4 bg-primary' : 'w-1.5 bg-muted'
                              } transition-all`}
                            />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
              
              <div className="border-t p-2 bg-muted/30 text-center">
                <Button variant="link" size="sm" asChild className="text-xs">
                  <Link href="/notifications">
                    View all notifications
                  </Link>
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 