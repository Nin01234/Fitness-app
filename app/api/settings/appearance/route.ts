import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Check content type to determine how to parse the request
    const contentType = request.headers.get('content-type') || ""
    
    let settings: any = {}
    
    if (contentType.includes('application/json')) {
      // Handle JSON format
      try {
        settings = await request.json()
      } catch (e) {
        console.error("JSON parsing error:", e)
        return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
      }
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      // Handle form data format
      const formData = await request.formData()
      for (const [key, value] of formData.entries()) {
        settings[key] = value
      }
    } else {
      // Fallback to text and try to parse
      try {
        const text = await request.text()
        
        // Try to parse as URL-encoded form data
        const params = new URLSearchParams(text)
        for (const [key, value] of params.entries()) {
          settings[key] = value
        }
      } catch (e) {
        console.error("Form data parsing error:", e)
        return NextResponse.json({ error: "Unsupported content type or invalid format" }, { status: 400 })
      }
    }
    
    // Validate the settings
    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ error: "Invalid settings data" }, { status: 400 })
    }
    
    // Update or insert settings in the database
    const { data, error } = await supabase
      .from("user_settings")
      .upsert({
        user_id: user.id,
        appearance: settings,
        updated_at: new Date().toISOString(),
      })
      .select()
    
    if (error) {
      console.error("Error updating appearance settings:", error)
      return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
    }
    
    return NextResponse.json({ 
      message: "Appearance settings updated successfully", 
      data 
    })
  } catch (error) {
    console.error("Error in appearance settings route:", error)
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Fetch the user's appearance settings
    const { data, error } = await supabase
      .from("user_settings")
      .select("appearance")
      .eq("user_id", user.id)
      .single()
    
    if (error && error.code !== "PGRST116") { // PGRST116 is "no rows returned" error
      console.error("Error fetching appearance settings:", error)
      return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
    }
    
    // Return default settings if none are found
    const appearanceSettings = data?.appearance || {
      theme: "system",
      colorScheme: "default",
      fontSize: "medium",
      reducedMotion: false,
      highContrast: false,
    }
    
    return NextResponse.json({ settings: appearanceSettings })
  } catch (error) {
    console.error("Error in appearance settings route:", error)
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    )
  }
} 