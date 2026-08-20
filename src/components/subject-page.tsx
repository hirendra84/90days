import Link from "next/link"
import { PlayCircle, CheckCircle2, Lock, FileText, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface SubjectPageProps {
  title: string;
  slug: string;
  color: string;
  totalDays: number;
  currentDay: number;
}

export function SubjectPage({ title, slug, color, totalDays, currentDay }: SubjectPageProps) {
  const percentComplete = Math.round((currentDay / totalDays) * 100);

  const daysList = Array.from({ length: 10 }, (_, i) => {
    const dayNum = i + 15; // Mock starting from day 15
    const isCompleted = dayNum < currentDay;
    const isCurrent = dayNum === currentDay;
    const isLocked = dayNum > currentDay;
    
    return {
      day: dayNum,
      topic: `${title} Topic ${dayNum}`,
      status: isCompleted ? "completed" : isCurrent ? "current" : "locked"
    };
  });

  return (
    <div className="flex flex-col gap-10 pb-12 animate-in fade-in duration-500">
      {/* Hero */}
      <section className="relative rounded-3xl overflow-hidden border border-border/50 bg-card shadow-sm p-8 md:p-12">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: `linear-gradient(135deg, ${color}, transparent)` }}></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-current blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none opacity-10" style={{ color }}></div>
        
        <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/50 border border-border text-sm font-medium">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
              Subject Mastery
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="text-muted-foreground mt-2 text-lg max-w-xl">
              Master the concepts, practice extensively, and build a solid foundation for your placement interviews.
            </p>
          </div>
          
          <div className="bg-background/80 backdrop-blur border border-border/50 rounded-2xl p-6 w-full md:w-64 shadow-sm shrink-0">
            <div className="text-sm font-medium text-muted-foreground mb-2">Overall Progress</div>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-4xl font-bold">{percentComplete}%</span>
              <span className="text-sm text-muted-foreground pb-1">{currentDay}/{totalDays} Days</span>
            </div>
            <Progress value={percentComplete} className="h-2" style={{ '--primary': color } as React.CSSProperties} indicatorClassName="bg-[var(--primary)]" />
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Curriculum</h2>
          <Button variant="outline">View Full Syllabus</Button>
        </div>

        <div className="space-y-4">
          {daysList.map((item) => (
            <div 
              key={item.day} 
              className={`flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border transition-all ${
                item.status === 'current' 
                  ? 'border-[var(--subject-color)]/50 bg-card shadow-md ring-1 ring-[var(--subject-color)]/10' 
                  : item.status === 'completed'
                    ? 'border-border/50 bg-card/50'
                    : 'border-border/30 bg-muted/10 opacity-70'
              }`}
              style={{ '--subject-color': color } as React.CSSProperties}
            >
              <div className="flex items-start md:items-center gap-4 mb-4 md:mb-0">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  item.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                  item.status === 'current' ? 'bg-[var(--subject-color)]/10 text-[var(--subject-color)]' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {item.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : 
                   item.status === 'locked' ? <Lock className="w-5 h-5" /> : 
                   <span className="font-bold text-lg">{item.day}</span>}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Day {item.day}</span>
                    {item.status === 'current' && <span className="px-2 py-0.5 rounded-full bg-[var(--subject-color)]/10 text-[var(--subject-color)] text-xs font-bold">UP NEXT</span>}
                  </div>
                  <h3 className="text-lg font-bold">{item.topic}</h3>
                </div>
              </div>
              
              <div className="flex items-center gap-3 md:ml-auto pl-16 md:pl-0">
                <div className="hidden lg:flex items-center gap-6 mr-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><PlayCircle className="w-4 h-4" /> Video</div>
                  <div className="flex items-center gap-2"><FileText className="w-4 h-4" /> Notes</div>
                  <div className="flex items-center gap-2"><Target className="w-4 h-4" /> Practice</div>
                </div>
                
                {item.status === 'locked' ? (
                  <Button disabled variant="outline" className="w-full md:w-auto">Locked</Button>
                ) : (
                  <Link href={`/session/${slug}/day-${item.day}`} className="w-full md:w-auto block">
                    <Button 
                      className={`w-full md:w-auto ${item.status === 'current' ? '' : ''}`}
                      variant={item.status === 'completed' ? 'secondary' : 'default'}
                      style={item.status === 'current' ? { backgroundColor: color, color: '#fff' } : {}}
                    >
                      {item.status === 'completed' ? 'Review Session' : 'Start Session'}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
