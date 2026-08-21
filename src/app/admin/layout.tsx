import { redirect } from "next/navigation"
import Link from "next/link"
import { Users, LayoutDashboard, Settings, ArrowLeft } from "lucide-react"
import { auth } from "@/lib/auth"
import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <ArrowLeft className="h-5 w-5" />
          <span className="">Back to App</span>
        </Link>
        <div className="w-full flex-1">
          <div className="flex justify-center">
            <span className="font-bold tracking-tight text-xl text-primary">ADMIN CONSOLE</span>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        <aside className="hidden w-[200px] flex-col border-r bg-background md:flex">
          <nav className="grid items-start px-2 py-4 text-sm font-medium">
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
            >
              <Users className="h-4 w-4" />
              Users
            </Link>
          </nav>
        </aside>
        
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
