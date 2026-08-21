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
        streaks: true, // Fetch streak data
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
          const currentStreak = user.streaks?.[0]?.currentStreak || 0
          
          // Send reminder via Gmail
          const mailOptions = {
            from: `"90dayPrep" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "⚠️ Don't let your streak die! Keep the momentum going.",
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-w-xl; margin: 0 auto; background-color: #f9fafb; padding: 40px 20px; border-radius: 12px;">
                <div style="background-color: #ffffff; padding: 40px 30px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); text-align: center;">
                  
                  <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                    <span style="font-size: 32px;">🔥</span>
                  </div>
                  
                  <h1 style="color: #111827; font-size: 24px; font-weight: 800; margin-bottom: 10px; letter-spacing: -0.5px;">Keep Your Streak Alive!</h1>
                  <p style="color: #4b5563; font-size: 16px; margin-bottom: 30px; line-height: 1.5;">Hi <strong>${user.name || "there"}</strong>,</p>
                  
                  ${currentStreak > 0 ? `
                  <div style="background-color: #fff7ed; border: 1px solid #fdba74; padding: 15px; border-radius: 8px; margin-bottom: 30px; display: inline-block;">
                    <p style="color: #c2410c; font-weight: 700; margin: 0; font-size: 18px;">Current Streak: ${currentStreak} Days</p>
                  </div>
                  ` : ''}

                  <p style="color: #4b5563; font-size: 16px; margin-bottom: 30px; line-height: 1.6;">
                    We noticed you haven't completed your daily plan for today. Consistency is the secret to landing your dream placement. Don't break the momentum you've built!
                  </p>
                  
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://90dayprep.vercel.app"}/dashboard" style="display: inline-block; padding: 14px 28px; background: linear-gradient(to right, #ea580c, #f97316); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(234, 88, 12, 0.25);">
                    Complete Today's Tasks
                  </a>
                  
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 40px 0 20px;" />
                  
                  <p style="color: #9ca3af; font-size: 14px; margin: 0;">
                    <em>"Success is the sum of small efforts, repeated day in and day out."</em>
                  </p>
                </div>
                
                <div style="text-align: center; margin-top: 20px;">
                  <p style="color: #9ca3af; font-size: 12px;">© 90dayPrep. All rights reserved.</p>
                </div>
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
