import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import nodemailer from "nodemailer"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({ message: "If that email is in our database, we will send a link to reset your password." })
    }

    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    })

    const mailOptions = {
      from: `"90 Days Sprint" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your 90 Days Sprint password",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h1 style="color: #111;">Password Reset</h1>
          <p>You requested a password reset for your 90 Days Sprint account.</p>
          <p>Click the link below to set a new password. This link will expire in 1 hour.</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #f97316; color: white; text-decoration: none; border-radius: 6px; margin-top: 10px;">Reset Password</a>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ message: "If that email is in our database, we will send a link to reset your password." })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
