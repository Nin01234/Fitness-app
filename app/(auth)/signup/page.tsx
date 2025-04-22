import type { Metadata } from "next"
import Link from "next/link"
import { SignUpForm } from "@/components/auth/signup-form"
import { Logo } from "@/components/logo"

export const metadata: Metadata = {
  title: "Sign Up - FitLife",
  description: "Create a FitLife account",
}

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Logo />
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-sm text-muted-foreground">Enter your information to get started</p>
        </div>
        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <SignUpForm />
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

