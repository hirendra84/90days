import Link from "next/link"
import { redirect } from "next/navigation"
import { CheckCircle2, PlayCircle, BookOpen, Calculator, Lightbulb, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  const userId = session.user.id!

  // Fetch streak
  const streak = await prisma.streak.findUnique({ where: { userId } })
  const currentStreak = streak?.currentStreak || 0

  // Calculate Current Day based on total DailyProgress records that have allCompleted = true
  const completedDays = await prisma.dailyProgress.count({
    where: { userId, allCompleted: true }
  })
  const currentDay = completedDays + 1 <= 90 ? completedDays + 1 : 90
  const totalDays = 90

  // Fetch today's progress
  const today = new Date()
  today.setHours(0,0,0,0)
  
  let todayProgress = await prisma.dailyProgress.findUnique({
    where: { userId_date: { userId, date: today } }
  })

  if (!todayProgress) {
    todayProgress = await prisma.dailyProgress.create({
      data: { userId, date: today }
    })
  }

  const completedCount = [
    todayProgress.logicalReasoningCompleted,
    todayProgress.aptitudeCompleted,
    todayProgress.verbalCompleted,
    todayProgress.dsaCompleted
  ].filter(Boolean).length

  // Fetch syllabus for the current day
  const topics = await prisma.topic.findMany({
    where: { order: currentDay },
    include: { subject: true, sessions: true }
  })
  
  const getTopicForSubject = (slug: string) => {
    return topics.find(t => t.subject.slug === slug)
  }

  const lrTopic = getTopicForSubject('logical-reasoning')
  const aptTopic = getTopicForSubject('aptitude')
  const verbalTopic = getTopicForSubject('verbal')
  const dsaTopic = getTopicForSubject('dsa')

  // Subject completion component
  const SubjectCard = ({ 
    title, 
    topic, 
    colorVar, 
    icon: Icon, 
    isCompleted, 
    slug 
  }: { 
    title: string, 
    topic: any, 
    colorVar: string, 
    icon: any, 
    isCompleted: boolean, 
    slug: string 
  }) => (
    <div className={`group rounded-2xl border border-border/50 bg-card p-6 shadow-sm hover:shadow-md transition-all hover:border-[var(${colorVar})]/50 relative overflow-hidden flex flex-col h-full`}>
      <div className={`absolute top-0 right-0 w-32 h-32 bg-[var(${colorVar})]/10 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none transition-opacity opacity-50 group-hover:opacity-100`}></div>
      
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-[var(${colorVar})]/10 flex items-center justify-center border border-[var(${colorVar})]/20`}>
          <Icon className={`w-5 h-5 text-[var(${colorVar})]`} />
        </div>
        <div className={`px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${isCompleted ? 'bg-green-500/10 border-green-500/20' : 'bg-muted border-border'}`}>
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs font-semibold text-green-500">Completed</span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></span>
              <span className="text-xs font-semibold text-muted-foreground">Not Started</span>
            </>
          )}
        </div>
      </div>
      
      <div className="mb-6 flex-1">
        <h3 className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">{title}</h3>
        <p className="text-lg font-bold leading-tight">{topic?.title || "No Topic Scheduled"}</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">45 mins</span>
          <span className="font-medium text-foreground">{isCompleted ? '1 / 1' : '0 / 1'}</span>
        </div>
        <Progress value={isCompleted ? 100 : 0} className={`h-1.5 bg-[var(${colorVar})]/20`} indicatorClassName={`bg-[var(${colorVar})]`} />
        
        {isCompleted ? (
          <Button variant="outline" className={`w-full rounded-xl border-[var(${colorVar})]/30 text-[var(${colorVar})] hover:bg-[var(${colorVar})]/10 hover:text-[var(${colorVar})]`}>
            Review Session
          </Button>
        ) : (
          <Link href={`/session/${slug}/day-${currentDay}`} className="block w-full">
            <Button className={`w-full rounded-xl bg-[var(${colorVar})] hover:bg-[var(${colorVar})]/90 text-white`}>
              <PlayCircle className="w-4 h-4 mr-2" />
              Start Session
            </Button>
          </Link>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-10 pb-12 animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden border border-border/50 bg-card shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background pointer-events-none"></div>
        <div className="relative p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Good morning, {session.user.name?.split(' ')[0] || 'Student'}.</h1>
              <p className="text-muted-foreground mt-1 text-lg">Day {currentDay} of your 90-Day Placement Sprint.</p>
            </div>
            
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                <span className="text-orange-500 text-xl">🔥</span>
                <div className="flex flex-col">
                  <span className="text-orange-500 font-bold leading-none">{currentStreak} Day Streak</span>
                </div>
              </div>
              <p className="text-muted-foreground text-sm font-medium">Keep going. You're building consistency.</p>
            </div>
          </div>
          
          <div className="hidden md:flex flex-col items-center justify-center bg-background/50 rounded-full w-40 h-40 relative shadow-inner">
             {/* Background Circle */}
             <svg className="w-full h-full absolute inset-0 -rotate-90 transform" viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" className="text-primary/20" />
               {/* Progress Circle */}
               <circle 
                 cx="50" 
                 cy="50" 
                 r="46" 
                 fill="none" 
                 stroke="currentColor" 
                 strokeWidth="8" 
                 className="text-primary transition-all duration-1000 ease-in-out" 
                 strokeDasharray="289.026" 
                 strokeDashoffset={289.026 - (289.026 * (currentDay / totalDays))}
                 strokeLinecap="round"
               />
             </svg>
             <div className="flex flex-col items-center justify-center z-10">
               <span className="text-3xl font-bold text-foreground">{currentDay}</span>
               <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">/ {totalDays}</span>
             </div>
          </div>
        </div>
      </section>

      {/* Today's Missions */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Today's Missions</h2>
            <p className="text-muted-foreground">Complete all four to protect your streak.</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{completedCount} <span className="text-muted-foreground text-lg font-medium">/ 4 completed</span></div>
            <div className="text-sm text-muted-foreground mt-1">{completedCount === 4 ? "All Done!" : "Keep pushing!"}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <SubjectCard 
            title="Logical Reasoning" 
            topic={lrTopic} 
            colorVar="--color-lr" 
            icon={Lightbulb} 
            isCompleted={todayProgress.logicalReasoningCompleted} 
            slug="logical-reasoning"
          />
          <SubjectCard 
            title="Quant Aptitude" 
            topic={aptTopic} 
            colorVar="--color-aptitude" 
            icon={Calculator} 
            isCompleted={todayProgress.aptitudeCompleted} 
            slug="aptitude"
          />
          <SubjectCard 
            title="Verbal Ability" 
            topic={verbalTopic} 
            colorVar="--color-verbal" 
            icon={BookOpen} 
            isCompleted={todayProgress.verbalCompleted} 
            slug="verbal"
          />
          <SubjectCard 
            title="Data Structures" 
            topic={dsaTopic} 
            colorVar="--color-dsa" 
            icon={Code2} 
            isCompleted={todayProgress.dsaCompleted} 
            slug="dsa"
          />
        </div>
      </section>

      {/* User Guide & SEO Info */}
      <section className="bg-card border border-border/50 rounded-3xl p-8 md:p-10 shadow-sm mt-4">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight mb-4">How to Maximize Your 90-Day Sprint</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Welcome to your dedicated placement preparation hub. The 90-Day Sprint is scientifically designed to build consistency and mastery across the four core pillars of tech placements: <strong>Logical Reasoning, Quantitative Aptitude, Verbal Ability, and Data Structures & Algorithms (DSA)</strong>.
            </p>
            <p>
              <strong>Daily Missions:</strong> Every single day, a new set of topics is unlocked. You must complete all four sessions to protect your streak. A higher streak proves your consistency to recruiters.
            </p>
            <p>
              <strong>Using the Roadmap:</strong> If you want to see what's coming up or review past topics, head over to the <Link href="/roadmap" className="text-primary hover:underline font-medium">Roadmap</Link>. We've broken down complex subjects into bite-sized, 45-minute daily sessions.
            </p>
            <p>
              <strong>Resources & Practice:</strong> After completing your daily videos, check the <Link href="/resources" className="text-primary hover:underline font-medium">Resources</Link> tab for curated practice questions, cheat sheets, and interview experiences from top product-based companies.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
