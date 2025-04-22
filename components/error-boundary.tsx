"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, RefreshCcw } from "lucide-react"
import Link from "next/link"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [errorInfo, setErrorInfo] = useState<React.ErrorInfo | null>(null)

  useEffect(() => {
    // Create error handler
    const errorHandler = (error: ErrorEvent) => {
      console.error("Caught client-side error:", error)
      setHasError(true)
      setError(error.error)
    }

    // Subscribe to error events
    window.addEventListener("error", errorHandler)

    // Unsubscribe from error events
    return () => {
      window.removeEventListener("error", errorHandler)
    }
  }, [])

  // Reset the error state
  const resetErrorBoundary = () => {
    setHasError(false)
    setError(null)
    setErrorInfo(null)
  }

  if (hasError) {
    return (
      <div className="min-h-[400px] p-6 flex flex-col items-center justify-center text-center">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          We encountered an unexpected error. You can try refreshing the page or returning to the home page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={resetErrorBoundary} className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Try again
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Return home
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export class ErrorBoundaryClass extends React.Component<
  ErrorBoundaryProps,
  { hasError: boolean; error: Error | null; errorInfo: React.ErrorInfo | null }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Caught error in component:", error, errorInfo)
    this.setState({ error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] p-6 flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-destructive/10 p-4 mb-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            We encountered an unexpected error. You can try refreshing the page or returning to the home page.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })} className="gap-2">
              <RefreshCcw className="h-4 w-4" />
              Try again
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                Return home
              </Link>
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 