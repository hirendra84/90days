import { DashboardNav } from "@/components/dashboard-nav"
import { Footer } from "@/components/footer"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  let currentStreak = 0
  let userInitials = "U"
  let isAdmin = false
  
  if (session?.user) {
    isAdmin = session.user.role === "ADMIN"
    const streak = await prisma.streak.findUnique({ where: { userId: session.user.id! } })
    currentStreak = streak?.currentStreak || 0
    userInitials = session.user.name ? session.user.name.substring(0, 2).toUpperCase() : "U"
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardNav streak={currentStreak} userInitials={userInitials} isAdmin={isAdmin} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}
