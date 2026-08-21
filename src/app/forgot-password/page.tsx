"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, MailCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setIsSubmitted(true)
      } else {
        const data = await res.json()
        setError(data.error || "Failed to send reset email")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-2xl shadow-sm border border-border/50">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Reset Password</h2>
          <p className="text-muted-foreground mt-2">
            {!isSubmitted 
              ? "Enter your email and we'll send you a reset link."
              : "Check your inbox for the reset link."}
          </p>
        </div>

        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
              <MailCheck className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-center text-muted-foreground">
              We've sent an email to <strong>{email}</strong>. Please check your inbox and spam folder.
            </p>
            <Link href="/login" className="w-full mt-4">
              <Button className="w-full" variant="outline">Return to login</Button>
            </Link>
          </div>
        ) : (
          <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Send Reset Link"}
            </Button>

            <div className="text-center">
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground inline-flex items-center transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
