import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Metadata } from "next"
import { Poppins as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import { SupabaseProvider } from "@/app/supabase-provider"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from 'sonner'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { SkipLink } from "@/components/skip-link"
import { ErrorBoundary } from "@/components/error-boundary"
import { ScrollToTop } from "@/components/scroll-to-top"

const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Fit Tracker - Your Ultimate Fitness Companion",
  description: "Track your workouts, nutrition, and fitness progress with Fit Tracker.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <SkipLink targetId="main-content" />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SupabaseProvider>
            <ErrorBoundary>
              <main id="main-content">
                {children}
              </main>
            </ErrorBoundary>
            <Toaster />
            <SonnerToaster position="top-right" />
            <Analytics />
            <SpeedInsights />
            <ScrollToTop />
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}