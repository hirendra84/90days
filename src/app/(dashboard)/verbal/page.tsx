import { SubjectPage } from "@/components/subject-page"

export default function VerbalPage() {
  return (
    <SubjectPage 
      title="Verbal Ability" 
      slug="verbal" 
      color="var(--color-verbal)" 
      totalDays={90} 
      currentDay={18} 
    />
  )
}
