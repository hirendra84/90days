"use client"

import { useState } from "react"
import { Loader2, CheckCircle2, AlertCircle, Bug, Mail, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import ReCAPTCHA from "react-google-recaptcha"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      issueType: formData.get("issueType"),
      message: formData.get("message"),
      captchaToken,
    }

    if (!captchaToken) {
      setError("Please verify that you are not a robot.")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        setIsSuccess(true)
      } else {
        setError(result.error || "Failed to submit form. Please try again later.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please check your network and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 bg-card border border-border/50 p-10 rounded-3xl shadow-sm">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Report Received!</h2>
            <p className="text-muted-foreground mt-2">
              Thank you for reaching out. We have received your message and will look into the problem right away.
            </p>
          </div>
          <Button onClick={() => setIsSuccess(false)} variant="outline" className="w-full">
            Submit another report
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16 px-4 md:px-8 bg-muted/20">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">Report a Problem</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Are you facing an issue with your streak emails, found a bug, or just need help? Let us know below and we'll fix it!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card p-6 rounded-2xl border border-border/50 text-center space-y-3">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Bug className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold">Found a Bug?</h3>
            <p className="text-sm text-muted-foreground">Report glitches so we can squash them quickly.</p>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border/50 text-center space-y-3">
            <div className="mx-auto w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-semibold">Email Issues?</h3>
            <p className="text-sm text-muted-foreground">Not getting streak reminders? We'll check your status.</p>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border/50 text-center space-y-3">
            <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="font-semibold">General Feedback</h3>
            <p className="text-sm text-muted-foreground">Have ideas to improve the platform? Share them!</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-card p-6 md:p-8 rounded-3xl border border-border/50 shadow-sm space-y-6">
          
          {/* Honeypot field to prevent spam (hidden) */}
          <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="john@example.com" required disabled={isSubmitting} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="issueType">What are you reporting?</Label>
            <select 
              id="issueType" 
              name="issueType" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
              disabled={isSubmitting}
            >
              <option value="">Select a category...</option>
              <option value="Not receiving Streak Emails">Not receiving Streak Emails</option>
              <option value="Website Bug / Error">Website Bug / Error</option>
              <option value="Account / Login Issue">Account / Login Issue</option>
              <option value="Feature Request / Feedback">Feature Request / Feedback</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Problem Details</Label>
            <Textarea 
              id="message" 
              name="message" 
              placeholder="Please describe the issue you are facing in detail..." 
              className="min-h-[150px]"
              required 
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div className="p-3 bg-destructive/15 text-destructive rounded-md flex items-center gap-2 text-sm font-medium">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                onChange={(token) => setCaptchaToken(token)}
              />
            </div>
          )}

          <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Submit Report"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            We will review your request and get back to you shortly.
          </p>
        </form>

      </div>
    </div>
  )
}
