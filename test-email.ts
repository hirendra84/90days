import nodemailer from "nodemailer"
import dotenv from "dotenv"
import dns from "dns"

dns.setDefaultResultOrder("ipv4first")
dotenv.config()

async function main() {
  console.log("Testing email using credentials from .env...")
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.error("❌ Error: EMAIL_USER or EMAIL_APP_PASSWORD is not set in .env")
    return
  }
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  })

  try {
    const mailOptions = {
      from: `"90 Days Sprint" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // send to themselves
      subject: "Test Email from 90 Days Sprint",
      html: `<h1>Success!</h1><p>If you are reading this, your Nodemailer setup is perfectly configured.</p>`
    }

    console.log(`Attempting to send test email to ${process.env.EMAIL_USER}...`)
    await transporter.sendMail(mailOptions)
    console.log("✅ Email sent successfully!")
  } catch (error) {
    console.error("❌ Failed to send email. Error details:")
    console.error(error)
  }
}

main().catch(console.error)
