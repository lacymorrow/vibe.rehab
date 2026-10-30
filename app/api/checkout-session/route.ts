import type { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { jsonNoStore } from "@/lib/api-response";
import { isCheckoutSessionId } from "@/lib/checkout-session-id";
import { summarizeCheckoutSession } from "@/lib/checkout-session-summary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY environment variable is not set");
  return new Stripe(key, { apiVersion: "2024-06-20" });
}

// An id we cannot look up is the caller's problem, not ours. Anything else
// (auth, connectivity, a Stripe outage) is still a 500.
function isUnknownSession(error: unknown): boolean {
  if (!(error instanceof Stripe.errors.StripeInvalidRequestError)) return false;
  return error.code === "resource_missing" || error.statusCode === 404;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!isCheckoutSessionId(sessionId)) {
    return jsonNoStore({ error: "Missing or invalid session_id" }, { status: 400 });
  }

  let stripe: Stripe;
  try {
    stripe = getStripe();
  } catch (error) {
    console.error("[checkout-session] stripe init failed", error);
    return jsonNoStore({ error: "Stripe not configured" }, { status: 500 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price"],
    });
    return jsonNoStore(summarizeCheckoutSession(session));
  } catch (error) {
    if (isUnknownSession(error)) {
      console.warn("[checkout-session] session lookup failed", {
        sessionId,
        error: error instanceof Error ? error.message : String(error),
      });
      return jsonNoStore({ error: "Session not found" }, { status: 404 });
    }
    console.error("[checkout-session] session retrieve failed", error);
    return jsonNoStore({ error: "Error retrieving session" }, { status: 500 });
  }
}
