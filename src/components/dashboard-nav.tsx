"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Flame, Bell, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "next-auth/react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Roadmap", href: "/roadmap" },
  { name: "Logical Reasoning", href: "/logical-reasoning" },
  { name: "Aptitude", href: "/aptitude" },
  { name: "Verbal", href: "/verbal" },
  { name: "DSA", href: "/dsa" },
  { name: "Progress", href: "/progress" },
  { name: "Resources", href: "/resources" },
  { name: "User Guide", href: "/user-guide" },
]

export function DashboardNav({ streak = 0, userInitials = "U", isAdmin = false }: { streak?: number, userInitials?: string, isAdmin?: boolean }) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 md:px-8 flex h-16 items-center">
        {/* Mobile Menu (Hamburger) */}
        <div className="flex md:hidden mr-4">
          <Sheet>
            <SheetTrigger className="md:hidden p-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left font-bold tracking-tighter">90D Sprint</SheetTitle>
              </SheetHeader>
              <div className="grid gap-2 py-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-3 py-2 rounded-md text-base transition-colors ${
                      pathname === item.href || pathname.startsWith(item.href + '/')
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className={`block px-3 py-2 rounded-md text-base transition-colors ${
                      pathname.startsWith('/admin')
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-primary/80 hover:bg-primary/10"
                    }`}
                  >
                    Admin Panel
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="mr-8 flex items-center">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tighter">90D</span>
          </Link>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex flex-1 items-center space-x-1 text-sm font-medium overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors hover:text-foreground/80 px-3 py-2 rounded-md whitespace-nowrap ${
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

        <div className="flex items-center justify-end space-x-2 md:space-x-4 ml-auto">
          <div className="flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 font-bold text-sm">
            <Flame className="w-4 h-4 fill-orange-500" />
            <span>{streak}</span>
          </div>
          
          <Button variant="ghost" size="icon" className="text-muted-foreground relative hidden sm:flex">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-destructive"></span>
            <span className="sr-only">Notifications</span>
          </Button>

          <Link href="/profile" className="hidden sm:block">
            <Avatar className="h-8 w-8 border border-border">
              <AvatarImage src="" alt="@user" />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">{userInitials}</AvatarFallback>
            </Avatar>
          </Link>

          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground ml-1" 
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
