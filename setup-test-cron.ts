import { prisma } from "./src/lib/prisma"
import dotenv from "dotenv"
import dns from "dns"

dns.setDefaultResultOrder("ipv4first")
dotenv.config()

async function main() {
  const email = "demo@example.com"
  
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    console.log("Demo user not found!")
    return
  }

  // Create a plan for yesterday
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  await prisma.dailyPlan.create({
    data: {
      userId: user.id,
      date: yesterday,
      focusArea: "Testing Cron",
      goals: ["Make sure the cron works"],
      status: "COMPLETED"
    }
  })

  console.log("✅ Added a daily plan for yesterday to trigger the streak reminder!")
}

main().catch(console.error).finally(() => prisma.$disconnect())
