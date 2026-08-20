import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  const userId = session.user.id!
  
  const user = await prisma.user.findUnique({ where: { id: userId } })
  const streak = await prisma.streak.findUnique({ where: { userId } })
  const currentStreak = streak?.currentStreak || 0
  
  const name = user?.name || "Student"
  const email = user?.email || ""
  const initials = name.substring(0, 2).toUpperCase()

  return (
    <div className="max-w-3xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Profile & Settings</h1>
        <p className="text-muted-foreground text-lg">Manage your account and preferences.</p>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 rounded-2xl border border-border/50 bg-card shadow-sm">
          <Avatar className="h-24 w-24 border-2 border-primary/20">
            <AvatarImage src="" alt="@user" />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h2 className="text-2xl font-bold">{name}</h2>
            <p className="text-muted-foreground">{email}</p>
            <div className="pt-2 flex gap-4 text-sm font-medium">
              <span className="px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full border border-orange-500/20">🔥 {currentStreak} Day Streak</span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">🎯 Top 15%</span>
            </div>
          </div>
          <Button variant="outline">Change Avatar</Button>
        </div>

        <div className="p-6 md:p-8 rounded-2xl border border-border/50 bg-card shadow-sm">
          <h2 className="text-xl font-bold mb-6">Account Information</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={name} className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={email} disabled className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target-company">Target Company / Tier</Label>
                <Input id="target-company" defaultValue="Tier 1 (MAANG+)" className="bg-muted/50" />
              </div>
            </div>
            <Button>Save Changes</Button>
          </form>
        </div>

        <div className="p-6 md:p-8 rounded-2xl border border-border/50 bg-card shadow-sm">
          <h2 className="text-xl font-bold mb-6">Security</h2>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" className="bg-muted/50 max-w-md" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" className="bg-muted/50 max-w-md" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" className="bg-muted/50 max-w-md" />
            </div>
            <Button variant="secondary">Update Password</Button>
          </form>
        </div>

        <div className="p-6 md:p-8 rounded-2xl border border-destructive/20 bg-destructive/5 shadow-sm">
          <h2 className="text-xl font-bold mb-2 text-destructive">Danger Zone</h2>
          <p className="text-muted-foreground text-sm mb-6">Once you delete your account, there is no going back. Please be certain.</p>
          <div className="flex gap-4">
            <Button variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive">Log Out</Button>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
