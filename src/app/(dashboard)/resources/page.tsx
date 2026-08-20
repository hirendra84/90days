import { Card, CardContent } from "@/components/ui/card"
import { PlayCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ResourcesPage() {
  const categories = [
    {
      id: "logical-reasoning",
      title: "Logical Reasoning",
      color: "var(--color-lr)",
      resources: [
        { title: "Complete Logical Reasoning", provider: "Placement Grid", type: "Video", duration: "10h 30m" },
        { title: "Syllogism Tricks & Shortcuts", provider: "CareerRide", type: "Video", duration: "45m" },
        { title: "Logical Reasoning Practice", provider: "IndiaBIX", type: "Practice", url: "https://www.indiabix.com" },
      ]
    },
    {
      id: "aptitude",
      title: "Quantitative Aptitude",
      color: "var(--color-aptitude)",
      resources: [
        { title: "TCS NQT Quant Mastery", provider: "TalentBattle", type: "Video", duration: "5h 15m" },
        { title: "Time, Speed & Distance", provider: "Study Smart", type: "Video", duration: "1h 20m" },
        { title: "Aptitude Full Questions Bank", provider: "GeeksforGeeks", type: "Practice", url: "https://www.geeksforgeeks.org/aptitude" },
      ]
    },
    {
      id: "verbal",
      title: "Verbal Ability",
      color: "var(--color-verbal)",
      resources: [
        { title: "English Grammar Rules", provider: "Unacademy", type: "Video", duration: "3h 40m" },
        { title: "Reading Comprehension Tips", provider: "WiFiStudy", type: "Video", duration: "55m" },
        { title: "Verbal Reasoning Test", provider: "AssessmentDay", type: "Practice", url: "https://www.assessmentday.com" },
      ]
    },
    {
      id: "dsa",
      title: "Data Structures & Algorithms",
      color: "var(--color-dsa)",
      resources: [
        { title: "Striver's A2Z DSA Course", provider: "Take U Forward", type: "Video", duration: "60h+" },
        { title: "Top 100 Interview Questions", provider: "LeetCode", type: "Practice", url: "https://leetcode.com" },
        { title: "Company Wise Coding Questions", provider: "PrepInsta", type: "Practice", url: "https://prepinsta.com" },
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-10 pb-12 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Learning Resources</h1>
        <p className="text-muted-foreground text-lg">Curated materials from the syllabus to help you master every topic.</p>
      </div>

      {categories.map(category => (
        <section key={category.id} className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: category.color }}></div>
            <h2 className="text-2xl font-bold">{category.title}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.resources.map((resource, i) => (
              <Card key={i} className="bg-card overflow-hidden group hover:border-[var(--color)]/50 transition-colors" style={{ '--color': category.color } as React.CSSProperties}>
                <div className="h-32 bg-muted relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors z-10"></div>
                  {resource.type === "Video" ? (
                    <PlayCircle className="w-10 h-10 text-white/80 z-20" />
                  ) : (
                    <ExternalLink className="w-10 h-10 text-white/80 z-20" />
                  )}
                  {/* Subtle pattern */}
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px', color: category.color }}></div>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-bold leading-tight line-clamp-2">{resource.title}</h3>
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    {resource.provider} • {resource.type} {resource.duration && `• ${resource.duration}`}
                  </div>
                  <Button variant="secondary" className="w-full group-hover:bg-[var(--color)]/10 group-hover:text-[var(--color)] transition-colors">
                    {resource.type === "Video" ? "Watch Video" : "Start Practice"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
