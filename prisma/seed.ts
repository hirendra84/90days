import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const subjects = [
  { name: 'Logical Reasoning', slug: 'logical-reasoning', channel: 'CareerRide' },
  { name: 'Quantitative Aptitude', slug: 'aptitude', channel: 'TalentBattle' },
  { name: 'Verbal Ability', slug: 'verbal', channel: 'Placement Grid' },
  { name: 'Data Structures & Algorithms', slug: 'dsa', channel: 'Striver TakeUForward' }
]

const lrTopics = [
  "Coding-Decoding", "Blood Relations", "Direction Sense Test", "Series (Number, Alphabet, Mixed)", 
  "Puzzles and Seating Arrangement", "Syllogism", "Analogies", "Data Sufficiency", 
  "Logical Sequence of Words", "Statement and Conclusion/Assumption", "Cause and Effect", 
  "Input-Output", "Clocks and Calendars", "Non-Verbal Reasoning (Patterns, Figures)"
]

const aptTopics = [
  "Number System", "HCF and LCM", "Ratio and Proportion", "Percentage and Averages", 
  "Profit and Loss", "Simple and Compound Interest", "Time, Speed, and Distance", 
  "Time and Work", "Permutation and Combination", "Probability", "Simplification and Approximation", 
  "Pipes and Cisterns", "Boats and Streams", "Mixtures and Allegations", 
  "Geometry, Mensuration, and Trigonometry", "Data Interpretation (Tables, Graphs, Charts)"
]

const verbalTopics = [
  "Vocabulary (Synonyms, Antonyms)", "Reading Comprehension", "Sentence Correction", 
  "Fill in the Blanks", "Spotting Errors", "Para Jumbles", "Sentence Completion and Improvement", 
  "Idioms and Phrases", "One Word Substitution", "Active and Passive Voice", 
  "Direct and Indirect Speech", "Cloze Test", "Grammar (Tenses, Articles, Prepositions)"
]

const dsaTopics = [
  "Arrays", "Strings", "Two Pointers", "Sliding Window", "Hashing", "Linked List", 
  "Stack and Queue", "Binary Search", "Greedy Algorithms", "Binary Trees", 
  "Binary Search Trees", "Heaps / Priority Queues", "Graphs - BFS & DFS", 
  "Dynamic Programming - 1D", "Dynamic Programming - 2D", "Backtracking", "Tries"
]

const getTopicForDay = (day: number, topicsArray: string[]) => {
  // Distribute the topics evenly across 90 days
  const index = Math.floor(((day - 1) / 90) * topicsArray.length)
  return topicsArray[index]
}

async function main() {
  console.log('Seeding full 90-day syllabus with YouTube resources...')
  
  // Clean existing syllabus
  await prisma.resource.deleteMany({})
  await prisma.sessionCompletion.deleteMany({})
  await prisma.session.deleteMany({})
  await prisma.topic.deleteMany({})
  await prisma.subject.deleteMany({})

  // Insert Subjects
  const createdSubjects = {} as Record<string, any>
  for (const sub of subjects) {
    createdSubjects[sub.slug] = await prisma.subject.create({
      data: { name: sub.name, slug: sub.slug }
    })
  }

  // Insert general topics and sessions for all 90 days
  for (let day = 1; day <= 90; day++) {
    for (const sub of subjects) {
      let topicTitle = ""
      if (sub.slug === 'logical-reasoning') topicTitle = getTopicForDay(day, lrTopics)
      if (sub.slug === 'aptitude') topicTitle = getTopicForDay(day, aptTopics)
      if (sub.slug === 'verbal') topicTitle = getTopicForDay(day, verbalTopics)
      if (sub.slug === 'dsa') topicTitle = getTopicForDay(day, dsaTopics)
      
      // Append day part to make it slightly varied
      const isReviewDay = day % 7 === 0;
      if (isReviewDay) {
        topicTitle = `Weekly Revision: ${topicTitle}`
      } else {
        topicTitle = `${topicTitle} (Part ${(day % 5) + 1})`
      }

      // Create topic
      const topic = await prisma.topic.create({
        data: {
          subjectId: createdSubjects[sub.slug].id,
          title: topicTitle,
          slug: `${sub.slug}-day-${day}`,
          order: day
        }
      })

      // Create Session
      await prisma.session.create({
        data: {
          topicId: topic.id,
          title: `Day ${day}: ${topicTitle}`,
          dayNumber: day,
          estimatedMins: 45
        }
      })
      
      // Create Resource (YouTube Search Link)
      const searchQuery = encodeURIComponent(`${topicTitle.split('(')[0]} ${sub.name} ${sub.channel} Placement Preparation`)
      await prisma.resource.create({
        data: {
          subjectId: createdSubjects[sub.slug].id,
          topicId: topic.id,
          title: `Watch ${sub.name} Video on ${sub.channel}`,
          provider: 'YouTube',
          url: `https://www.youtube.com/results?search_query=${searchQuery}`,
          type: 'Video'
        }
      })
    }
  }

  console.log('Syllabus seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

