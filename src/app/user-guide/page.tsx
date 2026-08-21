import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, CheckCircle2, Trophy, Clock, Target } from "lucide-react";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "User Guide | 90 Days Placement Sprint",
  description: "Learn how to maximize your placement preparation with the 90 Days Sprint platform.",
};

export default function UserGuidePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 lg:px-14 h-16 flex items-center border-b border-border/40 backdrop-blur-md fixed top-0 w-full z-50 bg-background/80">
        <Link className="flex items-center justify-center font-bold text-xl tracking-tighter" href="/">
          90D
        </Link>
        <nav className="ml-auto flex gap-4 items-center">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="sm">Go to Dashboard</Button>
          </Link>
        </nav>
      </header>
      
      <main className="flex-1 pt-24 pb-16 px-4 md:px-6 container mx-auto max-w-4xl">
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
              <BookOpen className="w-4 h-4 mr-2" />
              Official Documentation
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Platform User Guide</h1>
            <p className="text-xl text-muted-foreground">Everything you need to know to get the most out of the 90-Day Placement Sprint.</p>
          </div>

          <div className="grid gap-8 mt-12">
            
            {/* Section 1 */}
            <section className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center shrink-0">
                  <Trophy className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">1. The Daily Streak System</h2>
                  <p className="text-muted-foreground mb-4">
                    The core of this platform is consistency. Every day, 4 new topics are unlocked for you: Logical Reasoning, Aptitude, Verbal, and DSA. 
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Complete all 4 daily missions to extend your streak.</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Missing even one mission will reset your streak to 0.</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> A high streak proves to recruiters that you are dedicated and consistent.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">2. Daily Time Commitment</h2>
                  <p className="text-muted-foreground mb-4">
                    The 90-Day Sprint is designed to be manageable alongside college classes or a full-time job. 
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Each of the 4 sections is designed to take roughly <strong>45 minutes</strong> to complete, including video lessons and practice questions. We recommend setting aside exactly 3 hours a day, preferably at the same time each day, to build an unbreakable habit.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">3. Using the Roadmap</h2>
                  <p className="text-muted-foreground mb-4">
                    Curious about what topics are coming up in Day 45? 
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Navigate to the <strong>Roadmap</strong> tab from your dashboard. It gives you a bird's-eye view of the entire 90-day syllabus. While you cannot skip ahead and complete future days (to prevent burnout and cheating), you can always review previous days' materials to brush up on older concepts.
                  </p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
