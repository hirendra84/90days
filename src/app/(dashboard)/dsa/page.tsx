import { SubjectPage } from "@/components/subject-page"

export default function DSAPage() {
  return (
    <SubjectPage 
      title="Data Structures & Algorithms" 
      slug="dsa" 
      color="var(--color-dsa)" 
      totalDays={90} 
      currentDay={18} 
    />
  )
}
