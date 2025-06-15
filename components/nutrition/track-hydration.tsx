"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Droplets, Plus, Minus, Clock, Save, RefreshCw, Trash } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useSupabase } from "@/app/supabase-provider"
import { Progress } from "@/components/ui/progress"

interface HydrationEntry {
  id: string
  amount: number
  time: string
  created_at: string
}

export function TrackHydration() {
  const [isOpen, setIsOpen] = useState(false)
  const [waterAmount, setWaterAmount] = useState(0.25)
  const [time, setTime] = useState(getCurrentTime())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [goalAmount, setGoalAmount] = useState(2.5) // Default goal in liters
  const [currentAmount, setCurrentAmount] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)
  const [recentEntries, setRecentEntries] = useState<HydrationEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = useSupabase()

  function getCurrentTime() {
    const now = new Date()
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
  }

  // Fetch user and their hydration data
  useEffect(() => {
    async function fetchUserData() {
      try {
        setIsLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          setUserId(user.id)
          
          // Get user's hydration goal from profile if available
          const { data: profile } = await supabase
            .from('profiles')
            .select('hydration_goal')
            .eq('id', user.id)
            .single()
          
          if (profile && profile.hydration_goal) {
            setGoalAmount(profile.hydration_goal)
          }
          
          // Get today's hydration entries
          const todayDate = new Date().toISOString().split('T')[0]
          const { data: entries, error: entriesError } = await supabase
            .from('hydration_tracking')
            .select('*')
            .eq('user_id', user.id)
            .gte('created_at', `${todayDate}T00:00:00`)
            .lte('created_at', `${todayDate}T23:59:59`)
            .order('created_at', { ascending: false })
          
          if (entriesError) {
            if (entriesError.code === '42P01') {
              // Table doesn't exist yet, we'll create it later on first submission
              console.info('Hydration table does not exist yet')
            } else {
              console.error('Error fetching hydration data:', entriesError)
            }
          } else if (entries) {
            setRecentEntries(entries)
            
            // Calculate today's total
            const total = entries.reduce((sum, entry) => sum + entry.amount, 0)
            setCurrentAmount(total)
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUserData()
  }, [supabase])

  const handleSubmit = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to track hydration",
        variant: "destructive",
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Format time properly as ISO
      const todayDateString = new Date().toISOString().split('T')[0]
      const timeString = `${todayDateString}T${time}:00`
      
      // Insert into database
      const { data, error } = await supabase
        .from('hydration_tracking')
        .insert({
          user_id: userId,
          amount: waterAmount,
          time: timeString,
          created_at: new Date().toISOString()
        })
        .select()
      
      if (error) {
        if (error.code === '42P01') {
          // Table doesn't exist, create it
          console.log('Creating hydration tracking table...')
          await supabase.rpc('create_hydration_table')
          
          // Try inserting again
          const { error: retryError } = await supabase
            .from('hydration_tracking')
            .insert({
              user_id: userId,
              amount: waterAmount,
              time: timeString,
              created_at: new Date().toISOString()
            })
          
          if (retryError) throw retryError
        } else {
          throw error
        }
      }
      
      // Update daily total
      setCurrentAmount(prev => prev + waterAmount)
      
      // Refresh entries
      const currentDate = new Date().toISOString().split('T')[0]
      const { data: entries } = await supabase
        .from('hydration_tracking')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', `${currentDate}T00:00:00`)
        .lte('created_at', `${currentDate}T23:59:59`)
        .order('created_at', { ascending: false })
      
      if (entries) {
        setRecentEntries(entries)
      }
      
      // Show success message
      toast({
        title: "Hydration tracked",
        description: `Added ${waterAmount}L of water at ${time}`,
      })
      
      // Check if goal met
      if (currentAmount + waterAmount >= goalAmount) {
        toast({
          title: "Goal achieved! 🎉",
          description: `You've reached your daily hydration goal of ${goalAmount}L`,
        })
      }
      
      // Close dialog
      setIsOpen(false)
    } catch (error) {
      console.error('Error tracking hydration:', error)
      toast({
        title: "Error",
        description: "Failed to save hydration data",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const deleteEntry = async (id: string, amount: number) => {
    if (!userId) return
    
    try {
      const { error } = await supabase
        .from('hydration_tracking')
        .delete()
        .eq('id', id)
        .eq('user_id', userId) // Safety check
      
      if (error) throw error
      
      // Update UI
      setRecentEntries(prevEntries => prevEntries.filter(entry => entry.id !== id))
      setCurrentAmount(prev => Math.max(0, prev - amount))
      
      toast({
        title: "Entry deleted",
        description: `Removed ${amount}L from your daily total`,
      })
    } catch (error) {
      console.error('Error deleting entry:', error)
      toast({
        title: "Error",
        description: "Failed to delete hydration entry",
        variant: "destructive",
      })
    }
  }
  
  // Calculate progress percentage
  const progressPercentage = Math.min(100, Math.round((currentAmount / goalAmount) * 100))

  return (
    <>
      {/* Progress indicators */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{currentAmount.toFixed(2)}L / {goalAmount}L</span>
          <span className="text-sm font-medium">{progressPercentage}%</span>
        </div>
        <Progress 
          value={progressPercentage} 
          className="h-2.5 bg-blue-100 dark:bg-blue-950" 
        />
      </div>
      
      {/* Recent entries */}
      {recentEntries.length > 0 && (
        <div className="space-y-2 mb-4">
          <h4 className="text-sm font-medium">Today's entries:</h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {recentEntries.map(entry => (
              <div key={entry.id} className="flex justify-between items-center text-xs border rounded-md p-1.5 bg-blue-50/50 dark:bg-blue-950/50">
                <div>
                  <span className="font-semibold">{entry.amount}L</span>
                  <span className="text-muted-foreground ml-2">
                    <Clock className="inline h-3 w-3 mr-0.5" />
                    {new Date(entry.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 text-muted-foreground"
                  onClick={() => deleteEntry(entry.id, entry.amount)}
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline"
            className="w-full"
            data-action="track-water"
          >
            <Droplets className="mr-2 h-4 w-4" />
            Track Water
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Track Water Intake</DialogTitle>
            <DialogDescription>Record your water consumption to stay hydrated</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Amount (Liters)</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setWaterAmount(Math.max(0, waterAmount - 0.25))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                  <Slider
                    min={0}
                    max={1}
                    step={0.05}
                    value={[waterAmount]}
                    onValueChange={(vals) => setWaterAmount(vals[0])}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setWaterAmount(Math.min(1, waterAmount + 0.25))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <div className="w-16 text-center font-medium">{waterAmount.toFixed(2)}L</div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0L</span>
                <span>0.25L</span>
                <span>0.5L</span>
                <span>0.75L</span>
                <span>1L</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center">
                <Clock className="mr-2 h-4 w-4" /> Time
              </Label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Quick Add</Label>
              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setWaterAmount(0.25)}
                  className={waterAmount === 0.25 ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : ""}
                >
                  Cup (0.25L)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setWaterAmount(0.5)}
                  className={waterAmount === 0.5 ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : ""}
                >
                  Bottle (0.5L)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setWaterAmount(0.75)}
                  className={waterAmount === 0.75 ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : ""}
                >
                  Large (0.75L)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setWaterAmount(1)}
                  className={waterAmount === 1 ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : ""}
                >
                  XL (1L)
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? (
                <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

