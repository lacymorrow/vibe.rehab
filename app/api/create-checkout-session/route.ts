import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY environment variable is not set");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
  });
}

export async function POST(request: NextRequest) {
  try {
    const { priceId, email, serviceName } = await request.json();

    // Basic input validation
    if (!priceId || typeof priceId !== "string" || !priceId.startsWith("price_")) {
      return NextResponse.json({ error: "Invalid priceId" }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    // Determine a safe base URL
    const inferredBaseUrl = (() => {
      const proto = request.headers.get("x-forwarded-proto") ?? "https";
      const host = request.headers.get("host");
      return host ? `${proto}://${host}` : "";
    })();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || inferredBaseUrl;
    if (!baseUrl) {
      return NextResponse.json(
        { error: "Base URL not configured" },
        { status: 500 },
      );
    }

    // In production, only allow known, configured Price IDs to prevent tampering
    if (process.env.NODE_ENV === "production") {
      const allowedPriceIds = [
        process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PROJECT,
        process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_REVIEW,
      ].filter(Boolean) as string[];

      if (!allowedPriceIds.includes(priceId)) {
        console.warn("Rejected request with an allowed Stripe priceId", { priceId });
        return NextResponse.json({ error: "The provided price ID is not allowed" }, { status: 403 });
      }
    }

    const stripe = getStripe();
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
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/`,
      metadata: {
        service_name: serviceName,
        customer_email: email,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 },
    );
  }
}
