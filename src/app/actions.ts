"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function completeSession(sessionId: string, subjectSlug: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  
  const userId = session.user.id
  
  // Create SessionCompletion
  await prisma.sessionCompletion.upsert({
    where: {
      userId_sessionId: {
        userId,
        sessionId
      }
    },
    update: {},
    create: {
      userId,
      sessionId
    }
  })
  
  // Track daily progress
  const today = new Date()
  today.setHours(0,0,0,0) // Normalize to start of day
  
  const progress = await prisma.dailyProgress.upsert({
    where: { userId_date: { userId, date: today } },
    update: {
      logicalReasoningCompleted: subjectSlug === 'logical-reasoning' ? true : undefined,
      aptitudeCompleted: subjectSlug === 'aptitude' ? true : undefined,
      verbalCompleted: subjectSlug === 'verbal' ? true : undefined,
      dsaCompleted: subjectSlug === 'dsa' ? true : undefined,
    },
    create: {
      userId,
      date: today,
      logicalReasoningCompleted: subjectSlug === 'logical-reasoning',
      aptitudeCompleted: subjectSlug === 'aptitude',
      verbalCompleted: subjectSlug === 'verbal',
      dsaCompleted: subjectSlug === 'dsa',
    }
  })
  
  // Check if all 4 subjects are completed today
  if (
    progress.logicalReasoningCompleted && 
    progress.aptitudeCompleted && 
    progress.verbalCompleted && 
    progress.dsaCompleted && 
    !progress.allCompleted
  ) {
    // Mark today as allCompleted
    await prisma.dailyProgress.update({
      where: { id: progress.id },
      data: { allCompleted: true, completedAt: new Date() }
    })
    
    // Update streak
    const userStreak = await prisma.streak.findUnique({ where: { userId } })
    
    if (userStreak) {
      // Basic streak logic (needs to check if last update was yesterday)
      const isConsecutive = userStreak.lastUpdateDate 
        ? (today.getTime() - userStreak.lastUpdateDate.getTime()) <= 86400000 
        : true
        
      const newCurrentStreak = isConsecutive ? userStreak.currentStreak + 1 : 1
      const newLongestStreak = Math.max(userStreak.longestStreak, newCurrentStreak)
      
      await prisma.streak.update({
        where: { userId },
        data: {
          currentStreak: newCurrentStreak,
          longestStreak: newLongestStreak,
          lastUpdateDate: today
        }
      })
    } else {
      await prisma.streak.create({
        data: {
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastUpdateDate: today
        }
      })
    }
  }

  revalidatePath("/dashboard")
  revalidatePath(`/${subjectSlug}`)
  return { success: true }
}

export async function saveJournalEntry(content: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  
  const userId = session.user.id
  const today = new Date()
  today.setHours(0,0,0,0)
  
  await prisma.journalEntry.upsert({
    where: { userId_date: { userId, date: today } },
    update: { content },
    create: { userId, date: today, content }
  })
  
  revalidatePath("/journal")
  return { success: true }
}
