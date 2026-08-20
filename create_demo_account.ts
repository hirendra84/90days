import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from "bcryptjs"

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = "demo@example.com"
  const password = "password123"
  const name = "Demo User"

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      name
    },
    create: {
      email,
      password: hashedPassword,
      name
    }
  })

  // Create a streak entry to avoid issues when logging in
  await prisma.streak.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      currentStreak: 0,
      longestStreak: 0
    }
  })

  console.log("-----------------------------------------")
  console.log("Demo Account Created successfully!")
  console.log(`Email: ${email}`)
  console.log(`Password: ${password}`)
  console.log("-----------------------------------------")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
