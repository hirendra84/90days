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

        const htmlMessage = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #f97316; padding: 20px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 24px;">Don't Lose Your Momentum! 🚀</h1>
            </div>
            <div style="padding: 30px; background-color: #ffffff; color: #333333;">
              <p style="font-size: 16px;">Hi ${user.name || 'Achiever'},</p>
              
              <p style="font-size: 16px; line-height: 1.5;">
                We noticed you haven't completed your daily placement prep for today. You're currently on a <strong>${streakCount}-day streak</strong>! Don't let it slip away!
              </p>
              
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #111827;">Remaining for today:</h3>
                <ul style="margin-bottom: 0;">
                  ${missingSubjects.map(sub => `<li>${sub}</li>`).join('')}
                </ul>
              </div>

              <p style="font-size: 16px; line-height: 1.5;">
                Remember, consistency is the key to cracking your dream placement. Even 20 minutes of focused effort today counts towards your 90-day goal.
              </p>

              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Continue My Streak 🔥
                </a>
              </div>
            </div>
            <div style="background-color: #f9fafb; padding: 15px; text-align: center; color: #6b7280; font-size: 12px;">
              <p style="margin: 0;">90 Days Placement Sprint</p>
              <p style="margin: 5px 0 0 0;">You're receiving this because you signed up for placement preparation.</p>
            </div>
          </div>
        `;

        try {
          // Note: When testing locally without a verified domain, Resend requires you to send TO the email you registered with,
          // OR you can use 'onboarding@resend.dev' as the from address for testing.
          await resend.emails.send({
            from: '90 Days Sprint <onboarding@resend.dev>',
            to: email,
            subject: `🔥 Keep your ${streakCount}-day streak alive!`,
            html: htmlMessage,
          });
          
          emailsSent.push(email);
        } catch (err: any) {
          console.error(`Failed to send email to ${email}:`, err);
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
