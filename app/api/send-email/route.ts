import { type NextRequest, NextResponse } from "next/server"

// Fallback email handler - in production, you'd want to use a service like Resend, SendGrid, etc.
async function sendEmail(data: any) {
  // For now, we'll log the email and return success
  // In production, replace this with your preferred email service
  console.log("Email would be sent:", data);

  // You can integrate with any email service here:
  // - Resend: npm install resend
  // - SendGrid: npm install @sendgrid/mail
  // - Nodemailer: npm install nodemailer
  // - Or use your own SMTP service

  return { success: true, message: "Email logged" };
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, projectDetails, submittedValue, detectedType, type } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const subject = type === "roast" ? "🔥 New Roast Request" : "🚀 New Project Inquiry"

    const emailContent = `
      Subject: ${subject}

      Contact Information:
      - Name: ${name || "Not provided"}
      - Email: ${email}

      Request Type: ${type === "roast" ? "Roast Request" : "Project Help"}

      ${submittedValue
        ? `
      Submitted ${detectedType === "github" ? "GitHub Repository" : detectedType === "url" ? "Website URL" : detectedType === "email" ? "Email" : "Message"}:
      ${submittedValue}
      `
        : ""
      }

      ${projectDetails
        ? `
      Project Details:
      ${projectDetails}
      `
        : ""
      }

      ---
      Sent from Vibe Rehab contact form
    `

    // Use fallback email handler
    const result = await sendEmail({
      from: "Vibe Rehab <noreply@vibe.rehab>",
      to: ["hello@vibe.rehab"],
      subject,
      content: emailContent,
      replyTo: email,
    });

    if (!result.success) {
      console.error("Email sending failed:", result);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been received. We'll get back to you soon!"
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
