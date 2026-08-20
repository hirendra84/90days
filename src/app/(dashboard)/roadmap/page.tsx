import { CheckCircle2, Lock } from "lucide-react"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function RoadmapPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  const userId = session.user.id!

  // Calculate Current Day based on total DailyProgress records that have allCompleted = true
  const completedDays = await prisma.dailyProgress.count({
    where: { userId, allCompleted: true }
  })
  
  const currentDay = completedDays + 1 <= 90 ? completedDays + 1 : 90

  // Fetch all topics to build the roadmap
  const allTopics = await prisma.topic.findMany({
    include: { subject: true },
    orderBy: { order: 'asc' }
  })
  
  // Group by day (order)
  const roadmapDays = Array.from({ length: 90 }, (_, i) => {
    const day = i + 1;
    
    // Find topics for this day
    const dayTopics = allTopics.filter(t => t.order === day);
    
    const lrTopic = dayTopics.find(t => t.subject.slug === 'logical-reasoning')?.title || "Weekly Revision / Off"
    const aptTopic = dayTopics.find(t => t.subject.slug === 'aptitude')?.title || "Weekly Revision / Off"
    const verbalTopic = dayTopics.find(t => t.subject.slug === 'verbal')?.title || "Weekly Revision / Off"
    const dsaTopic = dayTopics.find(t => t.subject.slug === 'dsa')?.title || "Weekly Revision / Off"
    
    return {
      day,
      status: day < currentDay ? "completed" : day === currentDay ? "current" : "locked",
      progress: day < currentDay ? 100 : day === currentDay ? 0 : 0,
      topics: {
        lr: lrTopic,
        aptitude: aptTopic,
        verbal: verbalTopic,
        dsa: dsaTopic
      }
    }
  });

  return (
    <div className="max-w-3xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">90-Day Roadmap</h1>
        <p className="text-muted-foreground text-lg">Your journey to consistency and mastery.</p>
      </div>

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[19px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:via-border/50 before:to-transparent">
        {roadmapDays.map((dayData, idx) => (
          <div key={dayData.day} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
            
            {/* Timeline dot */}
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm
              ${dayData.status === 'completed' ? 'bg-primary text-primary-foreground' : 
                dayData.status === 'current' ? 'bg-background border-primary text-primary' : 
                'bg-muted text-muted-foreground border-muted-foreground/20'}`}
            >
              {dayData.status === 'completed' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : dayData.status === 'locked' ? (
                <Lock className="w-4 h-4" />
              ) : (
                <span className="font-bold text-sm">{dayData.day}</span>
              )}
            </div>
            
            {/* Card */}
            <div className={`w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl border ${
              dayData.status === 'current' 
                ? 'border-primary/50 bg-card shadow-md ring-1 ring-primary/10' 
                : dayData.status === 'completed'
                  ? 'border-border/50 bg-card shadow-sm opacity-80'
                  : 'border-border/30 bg-muted/20 opacity-50'
            }`}>
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-lg">Day {dayData.day}</span>
                {dayData.status === 'current' && (
                  <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full">Today</span>
                )}
                {dayData.status === 'completed' && (
                  <span className="text-xs font-semibold px-2 py-1 bg-green-500/10 text-green-500 rounded-full">Completed</span>
                )}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Logical Reasoning</span>
                  <span className="font-medium truncate max-w-[120px]" title={dayData.topics.lr}>{dayData.topics.lr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Aptitude</span>
                  <span className="font-medium truncate max-w-[120px]" title={dayData.topics.aptitude}>{dayData.topics.aptitude}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Verbal</span>
                  <span className="font-medium truncate max-w-[120px]" title={dayData.topics.verbal}>{dayData.topics.verbal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">DSA</span>
                  <span className="font-medium truncate max-w-[120px]" title={dayData.topics.dsa}>{dayData.topics.dsa}</span>
                </div>
              </div>
              
              {dayData.status === 'current' && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-primary">Progress</span>
                    <span>0%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '0%' }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center text-muted-foreground text-sm">
        Showing all 90 days. Complete today to unlock tomorrow.
      </div>
    </div>
  )
}
