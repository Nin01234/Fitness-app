import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createClient()
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }
    
    // Get request body
    const { plan, paymentMethod, simulatedPayment } = await request.json()
    
    if (!plan) {
      return NextResponse.json(
        { error: "Subscription plan is required" },
        { status: 400 }
      )
    }
    
    // Determine plan pricing
    let price = 0
    let planLabel = ""
    
    switch (plan) {
      case "monthly":
        price = 9.99
        planLabel = "Monthly"
        break
      case "quarterly":
        price = 24.99
        planLabel = "Quarterly"
        break
      case "annual":
        price = 89.99
        planLabel = "Annual"
        break
      default:
        return NextResponse.json(
          { error: "Invalid subscription plan" },
          { status: 400 }
        )
    }
    
    // Calculate expiration date based on plan
    const now = new Date()
    const premiumExpires = new Date(now)
    
    switch (plan) {
      case "monthly":
        premiumExpires.setMonth(premiumExpires.getMonth() + 1)
        break
      case "quarterly":
        premiumExpires.setMonth(premiumExpires.getMonth() + 3)
        break
      case "annual":
        premiumExpires.setFullYear(premiumExpires.getFullYear() + 1)
        break
    }
    
    // For simulated payment, don't actually update the user's profile
    if (simulatedPayment) {
      return NextResponse.json({
        success: true,
        message: "Simulated premium subscription activated",
        plan: planLabel,
        expires: premiumExpires.toISOString(),
      })
    }
    
    // In a real application, this would interact with a payment processor
    // and only set premium status after payment confirmation
    
    // For now, we'll just update the user's profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        is_premium: true,
        premium_plan: plan,
        premium_since: now.toISOString(),
        premium_expires: premiumExpires.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq("id", user.id)
    
    if (updateError) {
      console.error("Error updating premium status:", updateError)
      return NextResponse.json(
        { error: "Failed to update subscription status" },
        { status: 500 }
      )
    }
    
    // Record subscription history
    const { error: historyError } = await supabase
      .from("premium_subscription_history")
      .insert({
        user_id: user.id,
        action: "subscribed",
        plan: plan,
        payment_method: paymentMethod || "unknown",
        price: price,
        transaction_id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`
      })
    
    if (historyError) {
      console.error("Error recording subscription history:", historyError)
      // Continue processing even if history recording fails
    }
    
    return NextResponse.json({
      success: true,
      message: "Premium subscription activated",
      plan: planLabel,
      expires: premiumExpires.toISOString(),
    })
    
  } catch (error) {
    console.error("Error processing subscription upgrade:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 