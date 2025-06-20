import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)

async function sendEmail(data: {
	from: string
	to: string[]
	subject: string
	content: string
	replyTo: string
}) {
	try {
		const result = await resend.emails.send({
			from: data.from,
			to: data.to,
			subject: data.subject,
			text: data.content,
			replyTo: data.replyTo,
		})

		return { success: true, message: "Email sent successfully", id: result.data?.id }
	} catch (error) {
		console.error("Resend error:", error)
		return { success: false, message: "Failed to send email", error }
	}
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

		// Send email using Resend
		const result = await sendEmail({
			from: "Vibe Rehab <noreply@shipkit.io>",
			to: ["vibe@shipkit.io"],
			subject,
			content: emailContent,
			replyTo: email,
		});

		if (!result.success) {
			console.error("Email sending failed:", result);
			return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
		}

		console.log("Email sent successfully:", result.id)

		return NextResponse.json({
			success: true,
			message: "Your message has been received. We'll get back to you soon!"
		})
	} catch (error) {
		console.error("API error:", error)
		return NextResponse.json({ error: "Internal server error" }, { status: 500 })
	}
}
