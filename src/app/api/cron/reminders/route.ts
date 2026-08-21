import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import nodemailer from "nodemailer"

// Ensure this route is dynamic so it's not cached
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    // 1. Verify the cron request is legitimate
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Fetch all users from the database
    const users = await prisma.user.findMany({
      include: {
        dailyPlans: {
          orderBy: { date: "desc" },
          take: 1, // Get their most recent plan
        },
      },
    })

    // 3. Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    })

    let emailsSent = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 4. Send emails to users who missed their streak
    for (const user of users) {
      if (user.dailyPlans.length > 0 && user.email) {
        const lastPlanDate = new Date(user.dailyPlans[0].date)
        lastPlanDate.setHours(0, 0, 0, 0)

        if (lastPlanDate.getTime() < today.getTime()) {
          // Send reminder via Gmail
          const mailOptions = {
            from: `"90 Days Sprint" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Keep your 90 Days Sprint streak alive! 🔥",
            html: `
              <div style="font-family: sans-serif; padding: 20px;">
                <h1 style="color: #f97316;">Don't break your streak!</h1>
                <p>Hi ${user.name || "there"},</p>
                <p>We noticed you haven't completed your daily plan for today. Consistency is key to landing that dream placement!</p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard" style="display: inline-block; padding: 10px 20px; background-color: #f97316; color: white; text-decoration: none; border-radius: 5px;">Complete your daily task</a>
              </div>
            `,
          }

          try {
            await transporter.sendMail(mailOptions)
            emailsSent++
          } catch (e) {
            console.error(`Failed to send email to ${user.email}:`, e)
          }
        }
      }
    }

    return NextResponse.json({ success: true, emailsSent })
  } catch (error) {
    console.error("Cron job error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
