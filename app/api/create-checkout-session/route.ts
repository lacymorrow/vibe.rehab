import { BASE_URL } from "@/lib/base-url"
import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-05-28.basil",
})

export async function POST(request: NextRequest) {
	try {
		const { priceId, email, serviceName } = await request.json()

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			customer_email: email,
			line_items: [
				{
					price: priceId,
					quantity: 1,
				},
			],
			mode: "payment",
			success_url: `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${BASE_URL}/`,
			metadata: {
				service_name: serviceName,
				customer_email: email,
			},
		})

		return NextResponse.json({ url: session.url })
	} catch (error) {
		console.error("Error creating checkout session:", error)
		return NextResponse.json({ error: "Error creating checkout session" }, { status: 500 })
	}
}
