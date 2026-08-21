import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 mt-auto">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tighter">90 Days Placement</span>
          </Link>
          <p className="text-sm text-muted-foreground mt-2 text-center md:text-left max-w-sm">
            Your daily companion for crushing placement prep. Master Logical Reasoning, Aptitude, Verbal, and DSA step-by-step.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
          <Link href="/roadmap" className="text-muted-foreground hover:text-foreground transition-colors">Roadmap</Link>
          <Link href="/resources" className="text-muted-foreground hover:text-foreground transition-colors">Resources</Link>
          <Link href="/user-guide" className="text-muted-foreground hover:text-foreground transition-colors">User Guide</Link>
          <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Report an Issue</Link>
        </div>
        
        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} 90D Sprint. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
