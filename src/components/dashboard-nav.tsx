"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Flame, Bell, User as UserIcon, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "next-auth/react"

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Roadmap", href: "/roadmap" },
  { name: "Logical Reasoning", href: "/logical-reasoning" },
  { name: "Aptitude", href: "/aptitude" },
  { name: "Verbal", href: "/verbal" },
  { name: "DSA", href: "/dsa" },
  { name: "Progress", href: "/progress" },
  { name: "Resources", href: "/resources" },
]

export function DashboardNav({ streak = 0, userInitials = "U", isAdmin = false }: { streak?: number, userInitials?: string, isAdmin?: boolean }) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 md:px-8 flex h-16 items-center">
        <div className="mr-8 flex items-center">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tighter">90D</span>
          </Link>
        </div>
        
        <div className="hidden md:flex flex-1 items-center space-x-1 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors hover:text-foreground/80 px-3 py-2 rounded-md ${
                pathname === item.href || pathname.startsWith(item.href + '/')
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground/60"
              }`}
            >
              {item.name}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className={`transition-colors hover:text-foreground/80 px-3 py-2 rounded-md ${
                pathname.startsWith('/admin')
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "text-primary/80 border border-primary/20"
              }`}
            >
              Admin
            </Link>
          )}
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 font-bold text-sm">
            <Flame className="w-4 h-4 fill-orange-500" />
            <span>{streak}</span>
          </div>
          
          <Button variant="ghost" size="icon" className="text-muted-foreground relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-destructive"></span>
            <span className="sr-only">Notifications</span>
          </Button>

          <Link href="/profile">
            <Avatar className="h-8 w-8 border border-border">
              <AvatarImage src="" alt="@user" />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">{userInitials}</AvatarFallback>
            </Avatar>
          </Link>

          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground ml-2" 
            onClick={() => signOut({ callbackUrl: '/login' })}
            title="Log out"
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
