import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

async function main() {
  console.log("Testing Streak Reminder Email using credentials from .env...")
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  })

  // We'll send the test to the user's own email so they can see it!
  const targetEmail = process.env.EMAIL_USER

  const mailOptions = {
    from: `"90 Days Sprint" <${process.env.EMAIL_USER}>`,
    to: targetEmail,
    subject: "Keep your 90 Days Sprint streak alive! 🔥",
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Don't break your streak!</h2>
        <p>We noticed you haven't completed your daily plan for today. Consistency is key to crushing your placements!</p>
        <p>Log in now to update your progress and keep your momentum going.</p>
        <a href="http://localhost:3000/dashboard" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 15px;">
          Go to Dashboard
        </a>
      </div>
    `,
  }

  console.log(`Attempting to send streak reminder test email to ${targetEmail}...`)
  
  try {
    const info = await transporter.sendMail(mailOptions)
    console.log("✅ Streak reminder email sent successfully!")
  } catch (error) {
    console.error("❌ Failed to send email:", error)
  }
}

main()
