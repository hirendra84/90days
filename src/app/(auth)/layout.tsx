import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-8 bg-background">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
      
      <div className="hidden md:flex flex-col justify-center items-center p-12 bg-muted/30 border-l border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-orange-500/10"></div>
        <div className="relative z-10 max-w-md space-y-6 text-center">
          <Link href="/" className="inline-block font-bold text-4xl tracking-tighter mb-4">
            90D
          </Link>
          <h2 className="text-3xl font-bold">The 90-Day Sprint</h2>
          <p className="text-muted-foreground text-lg text-balance">
            Consistency beats intensity. Build your streak, master 4 core skills, and ace your placement interviews.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mt-12 pt-8 border-t border-border/50">
            <div className="p-4 rounded-xl bg-card border border-border/50 shadow-sm">
              <div className="text-2xl mb-1">🔥</div>
              <div className="font-bold">Protect the Streak</div>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border/50 shadow-sm">
              <div className="text-2xl mb-1">🧠</div>
              <div className="font-bold">Master 4 Skills</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
