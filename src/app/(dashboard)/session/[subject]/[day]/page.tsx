import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, PlayCircle, CheckCircle2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { completeSession } from "@/app/actions"

export default async function SessionPage({
  params,
}: {
  params: Promise<{ subject: string; day: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const { subject, day } = await params
  
  const dayNumber = parseInt(day.replace("day-", ""), 10)
  
  // Format subject nicely
  const subjectMap: Record<string, { name: string, color: string }> = {
    "logical-reasoning": { name: "Logical Reasoning", color: "var(--color-lr)" },
    "aptitude": { name: "Quantitative Aptitude", color: "var(--color-aptitude)" },
    "verbal": { name: "Verbal Ability", color: "var(--color-verbal)" },
    "dsa": { name: "Data Structures & Algorithms", color: "var(--color-dsa)" }
  }
  
  const subjectInfo = subjectMap[subject] || { name: subject, color: "var(--primary)" }

  const subjectData = await prisma.subject.findUnique({
    where: { slug: subject }
  })

  if (!subjectData) redirect('/dashboard')

  const topic = await prisma.topic.findFirst({
    where: { subjectId: subjectData.id, order: dayNumber },
    include: { sessions: true, resources: true }
  })

  if (!topic || topic.sessions.length === 0) redirect('/dashboard')

  const sessionData = topic.sessions[0]
  const resource = topic.resources && topic.resources.length > 0 ? topic.resources[0] : null

  let videoId = null;
  if (resource) {
    if (resource.url.includes("watch?v=")) {
      try {
        const url = new URL(resource.url);
        videoId = url.searchParams.get("v");
      } catch (e) {}
    } else if (resource.url.includes("search_query")) {
      try {
        const url = new URL(resource.url);
        const query = url.searchParams.get("search_query") || resource.title;
        const apiKey = process.env.YOUTUBE_API_KEY;
        
        if (apiKey) {
          const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1&key=${apiKey}`, {
            next: { revalidate: 86400 * 30 } // Cache for 30 days
          });
          
          if (res.ok) {
            const data = await res.json();
            if (data.items && data.items.length > 0) {
              videoId = data.items[0].id.videoId;
            }
          }
        }
      } catch (e) {
        console.error("Failed to fetch YouTube video", e);
      }
    }
  }

  // Check if completed
  const completion = await prisma.sessionCompletion.findUnique({
    where: {
      userId_sessionId: {
        userId: session.user.id!,
        sessionId: sessionData.id
      }
    }
  })

  const isCompleted = !!completion

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="px-3 py-1 rounded-full bg-muted text-xs font-semibold tracking-widest uppercase">Day {dayNumber}</div>
          <div className="px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase" style={{ backgroundColor: `color-mix(in srgb, ${subjectInfo.color} 15%, transparent)`, color: subjectInfo.color }}>
            {subjectInfo.name}
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {sessionData.title}
        </h1>
        <p className="text-muted-foreground mt-2">Estimated time: 45 minutes</p>
      </div>

      <div className="grid gap-8">
        {/* 1. Learn & Watch */}
        <div className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-border/50">
            <h2 className="text-xl font-bold mb-4">1. Learn</h2>
            
            {videoId ? (
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-border/50 relative">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`} 
                  title={resource?.title || "YouTube video player"} 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
            ) : resource ? (
              <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block relative group cursor-pointer">
                <div className="aspect-video w-full rounded-xl bg-muted relative overflow-hidden flex flex-col items-center justify-center border border-border/50">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors z-10"></div>
                  <PlayCircle className="w-16 h-16 text-white z-20 opacity-90 group-hover:scale-110 group-hover:opacity-100 transition-all mb-4" />
                  <div className="z-20 text-white font-medium flex items-center gap-2">
                    {resource.title} <ExternalLink className="w-4 h-4" />
                  </div>
                  {/* Fallback pattern for video placeholder */}
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                </div>
              </a>
            ) : (
              <div className="aspect-video w-full rounded-xl bg-muted relative overflow-hidden flex items-center justify-center group border border-border/50">
                <div className="absolute inset-0 bg-black/20 z-10"></div>
                <PlayCircle className="w-16 h-16 text-white z-20 opacity-50" />
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
              </div>
            )}
          </div>
          
          <div className="p-6 md:p-8 bg-muted/20">
            <h2 className="text-xl font-bold mb-4">2. Practice</h2>
            <div className="prose prose-invert max-w-none text-muted-foreground">
              <p>Complete the following practice problems to test your understanding of {topic.title}.</p>
              <ul className="mt-4 space-y-2">
                <li className="flex gap-2 items-start">
                  <div className="w-5 h-5 rounded-full border border-border mt-0.5 flex-shrink-0"></div>
                  <span>Review the provided examples.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <div className="w-5 h-5 rounded-full border border-border mt-0.5 flex-shrink-0"></div>
                  <span>Solve 3-5 practice problems independently.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-2xl border border-border/50 bg-card p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6">3. Notes</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Personal Notes</label>
              <textarea 
                className="w-full min-h-[150px] rounded-xl border border-border bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Jot down formulas, tricks, or key takeaways..."
              />
            </div>
          </div>
        </div>

        {/* Complete Action */}
        <div className="flex items-center justify-end pt-4 gap-4 border-b border-border/50 pb-8">
          {isCompleted ? (
            <Button size="lg" disabled className="h-12 px-8 rounded-full text-base font-semibold bg-green-500/20 text-green-500 hover:bg-green-500/20">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Completed
            </Button>
          ) : (
            <form action={async () => {
              "use server"
              await completeSession(sessionData.id, subjectData.slug)
            }}>
              <Button type="submit" size="lg" className="h-12 px-8 rounded-full text-base font-semibold text-white hover:opacity-90" style={{ backgroundColor: subjectInfo.color }}>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Complete Session
              </Button>
            </form>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          {dayNumber > 1 ? (
            <Link href={`/session/${subjectData.slug}/day-${dayNumber - 1}`}>
              <Button variant="outline" className="h-10 rounded-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous Session
              </Button>
            </Link>
          ) : <div></div>}
          
          {dayNumber < 90 && (
            <Link href={`/session/${subjectData.slug}/day-${dayNumber + 1}`}>
              <Button variant="outline" className="h-10 rounded-full">
                Next Session
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
