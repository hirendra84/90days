import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 lg:px-14 h-16 flex items-center border-b border-border/40 backdrop-blur-md fixed top-0 w-full z-50">
        <Link className="flex items-center justify-center font-bold text-xl tracking-tighter" href="/">
          90D
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary/80 transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-primary/80 transition-colors" href="#roadmap">
            Roadmap
          </Link>
          <Link href="/login">
            <Button variant="ghost" className="text-sm font-medium">Log in</Button>
          </Link>
          <Link href="/register">
            <Button className="text-sm font-medium">Start Sprint</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-48 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
          
          <div className="container px-4 md:px-6 text-center max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Your Placement Preparation System
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter sm:text-6xl text-balance">
              90 Days.<br />
              4 Skills.<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-500">One Streak.</span>
            </h1>
            
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-2xl/relaxed text-balance">
              Build the consistency you need to crack your next placement.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 rounded-full text-base font-semibold group">
                  Start My 90-Day Sprint
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/roadmap">
                <Button size="lg" variant="outline" className="h-12 px-8 rounded-full text-base font-semibold">
                  Explore Roadmap
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Mockup */}
          <div className="container px-4 md:px-6 mt-20 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
            <div className="relative mx-auto w-full max-w-5xl rounded-2xl border border-border/50 bg-card p-2 shadow-2xl overflow-hidden ring-1 ring-white/10">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10 point-events-none"></div>
              
              {/* Mockup Top Bar */}
              <div className="flex items-center px-4 py-3 border-b border-border/50 bg-muted/30">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="mx-auto bg-background/50 rounded-md px-24 py-1 text-xs text-muted-foreground border border-border/50">90d.placement.app</div>
              </div>

              {/* Mockup Dashboard Area */}
              <div className="p-6 md:p-10 grid gap-6 grid-cols-1 md:grid-cols-[1fr_300px]">
                <div className="space-y-6 opacity-90 blur-[1px]">
                  <div>
                    <h2 className="text-3xl font-semibold tracking-tight">Good morning, Hirendra.</h2>
                    <p className="text-muted-foreground">Day 18 of your 90-Day Placement Sprint.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
                      <div className="text-sm font-medium text-muted-foreground">Today's Progress</div>
                      <div className="mt-2 text-2xl font-bold">3 / 4</div>
                      <div className="mt-4 flex gap-2">
                        <CheckCircle2 className="text-purple-500 w-5 h-5" />
                        <CheckCircle2 className="text-blue-500 w-5 h-5" />
                        <CheckCircle2 className="text-orange-500 w-5 h-5" />
                        <div className="w-5 h-5 rounded-full border-2 border-green-500/30"></div>
                      </div>
                    </div>
                    
                    <div className="rounded-xl border border-border/50 bg-muted/20 p-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 blur-2xl rounded-full"></div>
                      <div className="text-sm font-medium text-muted-foreground">Current Streak</div>
                      <div className="mt-2 text-2xl font-bold flex items-center">
                        17 Days <span className="ml-2 text-orange-500">🔥</span>
                      </div>
                      <div className="mt-1 text-xs text-orange-400 font-medium">
                        Complete DSA to protect your streak.
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="hidden md:block opacity-90 blur-[1px]">
                  <div className="rounded-xl border border-border/50 bg-muted/20 p-4 h-full">
                    <div className="text-sm font-medium text-muted-foreground mb-4">90 Day Roadmap</div>
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${i <= 3 ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                            {i}
                          </div>
                          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-primary w-full" style={{ width: i <= 3 ? '100%' : '0%' }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
