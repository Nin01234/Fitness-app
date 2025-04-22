"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Bell, Edit, MoreVertical, Plus, Trash, Calendar, Clock, AlarmClock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { formatDistanceToNow } from "date-fns"

interface Reminder {
  id: number
  title: string
  description?: string
  reminder_type?: string
  time_of_day?: string
  days?: string[]
  created_at: string
  user_id: string
  active: boolean
}

interface RemindersListProps {
  reminders?: Reminder[]
  initialData?: boolean
}

export function RemindersList({ reminders: initialReminders, initialData }: RemindersListProps) {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders || [])
  const [isLoading, setIsLoading] = useState(!initialData)
  const supabase = createClient()

  useEffect(() => {
    if (!initialData) {
      fetchReminders()
    }
  }, [initialData])

  const fetchReminders = async () => {
    try {
      setIsLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', user.id)
        .eq('active', true)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      setReminders(data || [])
    } catch (error) {
      console.error('Error fetching reminders:', error)
      toast({
        title: "Error",
        description: "Failed to load your reminders",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteReminder = async (id: number) => {
    try {
      const { error } = await supabase
        .from('reminders')
        .update({ active: false })
        .eq('id', id)
      
      if (error) throw error
      
      setReminders(prev => prev.filter(reminder => reminder.id !== id))
      
      toast({
        title: "Reminder deleted",
        description: "Your reminder has been deleted successfully."
      })
    } catch (error) {
      console.error('Error deleting reminder:', error)
      toast({
        title: "Error",
        description: "Failed to delete the reminder",
        variant: "destructive"
      })
    }
  }

  const getReminderIcon = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'workout':
        return <Bell className="h-4 w-4 text-primary" />
      case 'meal':
        return <Clock className="h-4 w-4 text-accent" />
      case 'sleep':
        return <AlarmClock className="h-4 w-4 text-warning-500" />
      case 'water':
        return <Calendar className="h-4 w-4 text-info" />
      default:
        return <Bell className="h-4 w-4 text-primary" />
    }
  }

  const renderReminderList = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-40" />
                  <div className="mt-2 flex space-x-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          ))}
        </div>
      )
    }

    if (reminders.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Bell className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mt-4 text-sm font-semibold">No reminders</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Add reminders to stay on track with your fitness goals.
          </p>
          <Button size="sm" className="mt-4" asChild>
            <Link href="/reminders/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Reminder
            </Link>
          </Button>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {reminders.map((reminder) => (
          <div key={reminder.id} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-primary/10 p-2">
                {getReminderIcon(reminder.reminder_type)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium leading-none">{reminder.title}</p>
                  {reminder.created_at && (
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(reminder.created_at), { addSuffix: true })}
                    </span>
                  )}
                </div>
                {reminder.description && (
                  <p className="mt-1 text-xs text-muted-foreground">{reminder.description}</p>
                )}
                <div className="mt-1 flex flex-wrap gap-2">
                  {reminder.reminder_type && (
                    <Badge variant="outline" className="capitalize">{reminder.reminder_type}</Badge>
                  )}
                  {reminder.time_of_day && (
                    <Badge variant="outline">{reminder.time_of_day}</Badge>
                  )}
                  {reminder.days && reminder.days.length > 0 && (
                    <Badge variant="outline">{reminder.days.join(', ')}</Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href={`/reminders/edit/${reminder.id}`} className="flex cursor-pointer items-center">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit reminder
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive focus:bg-destructive/10 cursor-pointer" 
                    onClick={() => handleDeleteReminder(reminder.id)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete reminder
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Active Reminders</CardTitle>
          <CardDescription>Stay on track with notification reminders</CardDescription>
        </div>
        <Button size="sm" asChild className="bg-primary hover:bg-primary/90">
          <Link href="/reminders/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Reminder
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {renderReminderList()}
      </CardContent>
    </Card>
  )
}

