import { CheckCircle2, Circle } from "lucide-react"

export default function JournalPage() {
  // Generate mock past 30 days data
  const today = new Date()
  const days = Array.from({ length: 35 }, (_, i) => {
    const date = new Date()
    date.setDate(today.getDate() - (34 - i))
    
    // Random completion for demo purposes (mostly completed if in the last 17 days for the streak)
    let completedCount = 0;
    if (i >= 34 - 17) {
      completedCount = 4;
    } else if (i > 10) {
      completedCount = Math.floor(Math.random() * 5); // 0 to 4
    }
    
    return {
      date,
      completedCount,
      isFuture: date > today
    }
  })

  const getIntensityColor = (count: number) => {
    if (count === 4) return "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
    if (count === 3) return "bg-green-500/60"
    if (count === 2) return "bg-green-500/40"
    if (count === 1) return "bg-green-500/20"
    return "bg-muted border border-border/50"
  }

  return (
    <div className="flex flex-col gap-10 pb-12 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Daily Journal</h1>
        <p className="text-muted-foreground text-lg">Your learning history and DSA notes.</p>
      </div>

      {/* Contribution Graph */}
      <section className="rounded-2xl border border-border/50 bg-card p-6 md:p-8 shadow-sm overflow-x-auto">
        <h2 className="text-xl font-bold mb-6">Activity Map</h2>
        
        <div className="flex gap-2">
          {Array.from({ length: 7 }).map((_, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-2">
              {days.slice(weekIdx * 5, (weekIdx + 1) * 5).map((day, dayIdx) => (
                <div 
                  key={dayIdx} 
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-xl transition-transform hover:scale-110 cursor-pointer flex items-center justify-center ${day.isFuture ? 'opacity-20 bg-muted border border-border/20 cursor-not-allowed' : getIntensityColor(day.completedCount)}`}
                  title={day.isFuture ? "Future" : `${day.date.toDateString()}: ${day.completedCount}/4 completed`}
                >
                  {day.completedCount === 4 && <CheckCircle2 className="w-5 h-5 text-white/80" />}
                </div>
              ))}
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-2 mt-6 text-sm text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded-sm bg-muted border border-border/50"></div>
            <div className="w-4 h-4 rounded-sm bg-green-500/20"></div>
            <div className="w-4 h-4 rounded-sm bg-green-500/40"></div>
            <div className="w-4 h-4 rounded-sm bg-green-500/60"></div>
            <div className="w-4 h-4 rounded-sm bg-green-500"></div>
          </div>
          <span>More</span>
        </div>
      </section>

      {/* Selected Day View */}
      <section className="rounded-2xl border border-border/50 bg-card p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/50">
          <div>
            <h2 className="text-2xl font-bold">{today.toDateString()}</h2>
            <div className="text-muted-foreground mt-1 flex items-center gap-2">
              <span className="text-green-500 font-bold">4 / 4 Completed</span>
              <span>•</span>
              <span>3h 15m Study Time</span>
            </div>
          </div>
          <div className="px-4 py-2 bg-orange-500/10 text-orange-500 font-bold rounded-xl border border-orange-500/20">
            Day 18 of 90
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="font-bold text-lg mb-4">Subject Status</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/20">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Logical Reasoning</span>
                </div>
                <span className="text-sm text-muted-foreground">Syllogism</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/20">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Quant Aptitude</span>
                </div>
                <span className="text-sm text-muted-foreground">Percentage</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/20">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Verbal Ability</span>
                </div>
                <span className="text-sm text-muted-foreground">Reading Comprehension</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/20">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Data Structures</span>
                </div>
                <span className="text-sm text-muted-foreground">Arrays</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="font-bold text-lg mb-4">DSA Journal</h3>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Learned</span>
                <p className="text-sm bg-muted/20 p-3 rounded-xl border border-border/50">Two pointer technique for finding pairs in a sorted array. It's much more efficient than O(N^2) nested loops.</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Solved</span>
                <p className="text-sm bg-muted/20 p-3 rounded-xl border border-border/50">LeetCode #167 (Two Sum II) - Medium</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Stuck</span>
                <p className="text-sm bg-muted/20 p-3 rounded-xl border border-border/50">Off by one errors when moving the left and right pointers simultaneously.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
