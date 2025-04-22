"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/app/supabase-provider"

export function usePremiumStatus() {
  const [isPremium, setIsPremium] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = useSupabase()

  useEffect(() => {
    async function checkPremiumStatus() {
      try {
        setIsLoading(true)
        
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setIsLoading(false)
          return { isPremium: false, isLoading: false, userId: null }
        }
        
        setUserId(user.id)
        
        // Get the user's profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_premium, premium_plan, premium_since")
          .eq("id", user.id)
          .single()
        
        // Check if the user has premium status
        const userIsPremium = profile?.is_premium === true
        setIsPremium(userIsPremium)
        
        return { isPremium: userIsPremium, isLoading: false, userId: user.id }
      } catch (error) {
        console.error("Error checking premium status:", error)
        return { isPremium: false, isLoading: false, userId: null }
      } finally {
        setIsLoading(false)
      }
    }
    
    checkPremiumStatus()
  }, [supabase])

  return { isPremium, isLoading, userId }
} 