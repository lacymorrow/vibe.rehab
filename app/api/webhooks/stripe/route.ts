import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";
import { TIERS, type TierKey } from "@/lib/pricing";
import { fileSaleIssue } from "@/lib/paperclip";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BOARD_RECIPIENTS = ["vibe@shipkit.io"];
const EMAIL_FROM = "Vibe Rehab <noreply@shipkit.io>";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY environment variable is not set");
  return new Stripe(key, { apiVersion: "2024-06-20" });
}

function formatAmount(amountTotal: number | null | undefined, currency: string | null | undefined): string {
  if (typeof amountTotal !== "number") return "unknown amount";
  const code = (currency ?? "usd").toUpperCase();
  const value = amountTotal / 100;
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: code }).format(value);
  } catch {
    return `${value.toFixed(2)} ${code}`;
  }
}

function resolveTierFromPriceId(priceId: string | null | undefined): { key: TierKey | "unknown"; name: string } {
  if (!priceId) return { key: "unknown", name: "Unknown tier" };
  for (const tier of Object.values(TIERS)) {
    if (tier.priceId && tier.priceId === priceId) {
      return { key: tier.key, name: tier.name };
    }
  }
  return { key: "unknown", name: "Unknown tier" };
}

async function notifyBoardByEmail(args: {
  tierName: string;
  amountLabel: string;
  customerEmail: string;
  stripeSessionId: string;
  livemode: boolean;
  paperclipIdentifier?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "RESEND_API_KEY not configured" };
  const resend = new Resend(apiKey);
  const modeTag = args.livemode ? "LIVE" : "TEST";
  const subject = `[vibe.rehab ${modeTag}] SALE: ${args.tierName} — ${args.amountLabel}`;
  const paperclipLine = args.paperclipIdentifier
    ? `Paperclip issue: ${args.paperclipIdentifier}`
    : "Paperclip issue: (not filed — see logs)";
  const text = [
    `A sale completed on vibe.rehab (${modeTag} mode).`,
    "",
    `Tier: ${args.tierName}`,
    `Amount: ${args.amountLabel}`,
    `Customer: ${args.customerEmail}`,
    `Stripe session: ${args.stripeSessionId}`,
    paperclipLine,
    "",
    "Reach out to the customer within 24h.",
  ].join("\n");
  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: BOARD_RECIPIENTS,
      subject,
      text,
      replyTo: args.customerEmail,
    });
    if (result.error) return { ok: false, error: JSON.stringify(result.error).slice(0, 500) };
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

async function handleCheckoutCompleted(stripe: Stripe, event: Stripe.Event): Promise<void> {
  const session = event.data.object as Stripe.Checkout.Session;
  const sessionId = session.id;

  // Line items are not on the session by default; expand explicitly.
  let priceId: string | null = null;
  try {
    const expanded = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price"],
    });
    const firstItem = expanded.line_items?.data?.[0];
    const price = firstItem?.price;
    priceId = typeof price === "string" ? price : price?.id ?? null;
  } catch (error) {
    console.error("[stripe webhook] failed to expand line items", { sessionId, error });
  }

  const { key: tierKey, name: tierName } = resolveTierFromPriceId(priceId);
  const customerEmail =
    session.customer_details?.email ||
    session.customer_email ||
    (session.metadata?.customer_email as string | undefined) ||
    "unknown@unknown";
  const amountLabel = formatAmount(session.amount_total, session.currency);
  const livemode = event.livemode === true;

  console.log("[stripe webhook] checkout.session.completed", {
    sessionId,
    tierKey,
    tierName,
    amountLabel,
    customerEmail,
    livemode,
  });

  const paperclipResult = await fileSaleIssue({
    tierName,
    tierKey,
    amountLabel,
    customerEmail,
    stripeSessionId: sessionId,
    livemode,
  });
  if (!paperclipResult.ok) {
    console.error("[stripe webhook] paperclip issue file failed", paperclipResult);
  } else {
    console.log("[stripe webhook] paperclip issue filed", {
      identifier: paperclipResult.identifier,
      id: paperclipResult.id,
    });
  }

  const emailResult = await notifyBoardByEmail({
    tierName,
    amountLabel,
    customerEmail,
    stripeSessionId: sessionId,
    livemode,
    paperclipIdentifier: paperclipResult.identifier,
  });
  if (!emailResult.ok) {
    console.error("[stripe webhook] board email failed", emailResult);
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[stripe webhook] STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const rawBody = await request.text();

  let stripe: Stripe;
  try {
    stripe = getStripe();
  } catch (error) {
    console.error("[stripe webhook] stripe client init failed", error);
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn("[stripe webhook] signature verification failed", { message });
    return NextResponse.json({ error: `Invalid signature: ${message}` }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      await handleCheckoutCompleted(stripe, event);
    } else {
      console.log("[stripe webhook] ignoring event", { type: event.type, id: event.id });
    }
  } catch (error) {
    console.error("[stripe webhook] handler error", { type: event.type, id: event.id, error });
    // Ack the event so Stripe does not spin on us; sales telemetry is logged for retry.
    return NextResponse.json({ received: true, handled: false }, { status: 200 });
  }

  return NextResponse.json({ received: true, handled: true });
}
