import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

// Vercel cron jobs use a secure token, but for local testing we can use a secret header or just allow it.
// We'll require a Bearer token matching CRON_SECRET if it exists.
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // Basic security for the cron endpoint
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return NextResponse.json({ error: 'RESEND_API_KEY is not configured' }, { status: 500 });
    }

    const resend = new Resend(resendApiKey);

    // Get today's date at midnight UTC for matching DailyProgress
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Get all users who have dailyReminder set to true (by default it's true, so we can check their profile)
    // Or just fetch all users who are not ADMIN to keep it simple, and then check their progress.
    const users = await prisma.user.findMany({
      where: {
        role: 'USER',
        email: { not: null }, // must have email
      },
      include: {
        dailyProgress: {
          where: {
            date: today
          }
        },
        streaks: true
      }
    });

    const emailsSent = [];

    for (const user of users) {
      const email = user.email!;
      const progress = user.dailyProgress[0]; // will be undefined if no progress today
      const streakCount = user.streaks[0]?.currentStreak || 0;

      // Check if they are missing any subject
      const isCompleted = progress?.allCompleted;

      if (!isCompleted) {
        // Construct the personalized HTML message
        const missingSubjects = [];
        if (!progress || !progress.logicalReasoningCompleted) missingSubjects.push('Logical Reasoning');
        if (!progress || !progress.aptitudeCompleted) missingSubjects.push('Quantitative Aptitude');
        if (!progress || !progress.verbalCompleted) missingSubjects.push('Verbal Ability');
        if (!progress || !progress.dsaCompleted) missingSubjects.push('DSA');

        const motivations = [
          {
            title: "Don't Lose Your Momentum! 🚀",
            body: "Remember, consistency is the key to cracking your dream placement. Even 20 minutes of focused effort today counts towards your 90-day goal.",
            color: "#f97316" // Orange
          },
          {
            title: "Your Future Self Will Thank You 💼",
            body: "Top tech companies don't just look for smarts; they look for grit. Finishing today's tasks is proof that you have what it takes to push through.",
            color: "#3b82f6" // Blue
          },
          {
            title: "The Code Doesn't Write Itself! 💻",
            body: "You're one step closer to that offer letter. Don't let today be the day you break your streak. Let's finish strong!",
            color: "#8b5cf6" // Purple
          },
          {
            title: "Stay Relentless 🔥",
            body: "Greatness is a lot of small things done well every single day. Log in now and clear out your remaining tasks for today!",
            color: "#10b981" // Emerald
          }
        ];

        const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];

        const htmlMessage = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            <div style="background-color: ${randomMotivation.color}; padding: 30px 20px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">${randomMotivation.title}</h1>
            </div>
            <div style="padding: 40px 30px; background-color: #ffffff; color: #333333;">
              <p style="font-size: 18px; margin-top: 0;">Hi <strong>${user.name || 'Achiever'}</strong>,</p>
              
              <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                We noticed you haven't completed your daily placement prep for today. You're currently on an impressive <strong>${streakCount}-day streak</strong>! Don't let it slip away!
              </p>
              
              <div style="background-color: #f8fafc; border-left: 4px solid ${randomMotivation.color}; padding: 20px; border-radius: 0 8px 8px 0; margin: 30px 0;">
                <h3 style="margin-top: 0; color: #1e293b; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Remaining for today:</h3>
                <ul style="margin-bottom: 0; padding-left: 20px; color: #475569; font-size: 16px;">
                  ${missingSubjects.map(sub => `<li style="margin-bottom: 8px;">${sub}</li>`).join('')}
                </ul>
              </div>

              <p style="font-size: 16px; line-height: 1.6; color: #4b5563; font-style: italic;">
                "${randomMotivation.body}"
              </p>

              <div style="text-align: center; margin-top: 40px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" style="background-color: ${randomMotivation.color}; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; transition: opacity 0.2s;">
                  Continue My Streak Now
                </a>
              </div>
            </div>
            <div style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 13px;">
              <p style="margin: 0; font-weight: 600;">90 Days Placement Sprint</p>
              <p style="margin: 5px 0 0 0;">You're receiving this because you signed up to crush your placement goals.</p>
            </div>
          </div>
        `;

        try {
          const { data, error } = await resend.emails.send({
            from: '90 Days Sprint <onboarding@resend.dev>',
            to: email,
            subject: `🔥 Keep your ${streakCount}-day streak alive!`,
            html: htmlMessage,
          });
          
          if (error) {
            console.error(`Resend API error for ${email}:`, error);
          } else {
            emailsSent.push(email);
          }
        } catch (err: any) {
          console.error(`Exception sending email to ${email}:`, err);
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Sent reminders to ${emailsSent.length} users.`,
      emails: emailsSent 
    });
  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
