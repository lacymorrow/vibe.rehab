import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, name, projectDetails, submittedValue, detectedType, type } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const subject = type === "roast" ? "🔥 New Roast Request" : "🚀 New Project Inquiry"

    const emailContent = `
      <h2>${type === "roast" ? "New Roast Request" : "New Project Inquiry"}</h2>
      
      <h3>Contact Information:</h3>
      <p><strong>Name:</strong> ${name || "Not provided"}</p>
      <p><strong>Email:</strong> ${email}</p>
      
      <h3>Request Type:</h3>
      <p><strong>${type === "roast" ? "Roast Request" : "Project Help"}</strong></p>
      
      ${
        submittedValue
          ? `
        <h3>Submitted ${detectedType === "github" ? "GitHub Repository" : detectedType === "url" ? "Website URL" : detectedType === "email" ? "Email" : "Message"}:</h3>
        <p>${submittedValue}</p>
      `
          : ""
      }
      
      ${
        projectDetails
          ? `
        <h3>Project Details:</h3>
        <p>${projectDetails.replace(/\n/g, "<br>")}</p>
      `
          : ""
      }
      
      <hr>
      <p><em>Sent from Vibe Rehab contact form</em></p>
    `

    const { data, error } = await resend.emails.send({
      from: "Vibe Rehab <noreply@shipkit.io>",
      to: ["vibe@shipkit.io"],
      subject,
      html: emailContent,
      replyTo: email,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
