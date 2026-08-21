"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

async function checkAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required")
  }
  return session.user
}

export async function getAdminStats() {
  await checkAdmin()

  const totalUsers = await prisma.user.count()
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const activeToday = await prisma.dailyProgress.count({
    where: {
      date: today,
    }
  })

  const streaks = await prisma.streak.aggregate({
    _avg: {
      currentStreak: true,
    },
    _max: {
      longestStreak: true
    }
  })

  const completions = await prisma.sessionCompletion.count()

  return {
    totalUsers,
    activeToday,
    avgStreak: streaks._avg.currentStreak ? Math.round(streaks._avg.currentStreak) : 0,
    maxStreak: streaks._max.longestStreak || 0,
    totalCompletions: completions
  }
}

export async function getUsers() {
  await checkAdmin()

  const users = await prisma.user.findMany({
    include: {
      streaks: true,
      _count: {
        select: {
          dailyProgress: {
            where: { allCompleted: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return users.map(user => ({
    id: user.id,
    name: user.name || "Unknown",
    email: user.email || "No email",
    role: user.role,
    createdAt: user.createdAt,
    currentStreak: user.streaks[0]?.currentStreak || 0,
    longestStreak: user.streaks[0]?.longestStreak || 0,
    completedDays: user._count.dailyProgress
  }))
}

export async function toggleAdminRole(userId: string, currentRole: string) {
  await checkAdmin()

  const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN"
  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole }
  })

  revalidatePath("/admin/users")
  return { success: true }
}

export async function deleteUser(userId: string) {
  const currentUser = await checkAdmin()
  
  if (currentUser.id === userId) {
    throw new Error("Cannot delete yourself")
  }

  await prisma.user.delete({
    where: { id: userId }
  })

  revalidatePath("/admin/users")
  return { success: true }
}

export async function resetUserStreak(userId: string) {
  await checkAdmin()

  await prisma.streak.update({
    where: { userId },
    data: { currentStreak: 0 }
  })

  revalidatePath("/admin/users")
  return { success: true }
}

export async function forceCompleteToday(userId: string) {
  await checkAdmin()
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  await prisma.dailyProgress.upsert({
    where: { userId_date: { userId, date: today } },
    update: {
      logicalReasoningCompleted: true,
      aptitudeCompleted: true,
      verbalCompleted: true,
      dsaCompleted: true,
      allCompleted: true,
      completedAt: new Date()
    },
    create: {
      userId,
      date: today,
      logicalReasoningCompleted: true,
      aptitudeCompleted: true,
      verbalCompleted: true,
      dsaCompleted: true,
      allCompleted: true,
      completedAt: new Date()
    }
  })

  revalidatePath("/admin/users")
  return { success: true }
}
