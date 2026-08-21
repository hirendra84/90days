import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const { name, email, issueType, message, captchaToken } = await request.json()

    if (!name || !email || !issueType || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (!captchaToken) {
      return NextResponse.json({ error: "reCAPTCHA verification failed." }, { status: 400 })
    }

    // Verify reCAPTCHA token
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`
    const recaptchaResponse = await fetch(verifyUrl, { method: "POST" })
    const recaptchaData = await recaptchaResponse.json()

    if (!recaptchaData.success) {
      return NextResponse.json({ error: "Failed reCAPTCHA validation. Are you a robot?" }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    })

    const mailOptions = {
      from: `"90dayPrep Support" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send it to yourself
      replyTo: email, // If you hit "Reply" it will go to the user's email
      subject: `New Support Request: ${issueType}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>New Support Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Issue Type:</strong> ${issueType}</p>
          <hr />
          <h3>Message:</h3>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true, message: "Report submitted successfully!" })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Failed to send message. Please try again later." }, { status: 500 })
  }
}
