"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  if (!token) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold mb-2">Invalid Link</h3>
        <p className="text-muted-foreground mb-6">This password reset link is invalid or has expired.</p>
        <Link href="/forgot-password">
          <Button>Request a new link</Button>
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      if (res.ok) {
        setIsSuccess(true)
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else {
        const data = await res.json()
        setError(data.error || "Failed to reset password")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-6 space-y-4">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold">Password Updated</h3>
        <p className="text-center text-muted-foreground">
          Your password has been successfully reset. Redirecting to login...
        </p>
        <Link href="/login" className="w-full mt-4">
          <Button className="w-full">Log in now</Button>
        </Link>
      </div>
    )
  }

  return (
    <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Reset Password"}
      </Button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-2xl shadow-sm border border-border/50">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Create New Password</h2>
          <p className="text-muted-foreground mt-2">
            Please enter your new password below.
          </p>
        </div>

        <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
