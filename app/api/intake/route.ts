import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";
import { TIERS, type TierKey } from "@/lib/pricing";
import { fileIntakeIssue } from "@/lib/paperclip";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BOARD_RECIPIENTS = ["vibe@shipkit.io"];
const EMAIL_FROM = "Vibe Rehab <noreply@shipkit.io>";

const MAX_REPO_URL_LEN = 500;
const MAX_WHAT_BROKEN_LEN = 5000;
const MIN_WHAT_BROKEN_LEN = 10;

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY environment variable is not set");
  return new Stripe(key, { apiVersion: "2024-06-20" });
}

function resolveTierFromPriceId(priceId: string | null | undefined): {
  key: TierKey | "unknown";
  name: string;
} {
  if (!priceId) return { key: "unknown", name: "Unknown tier" };
  for (const tier of Object.values(TIERS)) {
    if (tier.priceId && tier.priceId === priceId) {
      return { key: tier.key, name: tier.name };
    }
  }
  return { key: "unknown", name: "Unknown tier" };
}

function isValidRepoUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

async function notifyBoardByEmail(args: {
  tierName: string;
  customerEmail: string;
  repoUrl: string;
  whatBroken: string;
  stripeSessionId: string;
  livemode: boolean;
  paperclipIdentifier?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "RESEND_API_KEY not configured" };
  const resend = new Resend(apiKey);
  const modeTag = args.livemode ? "LIVE" : "TEST";
  const subject = `[vibe.rehab ${modeTag}] INTAKE: ${args.customerEmail} — ${args.tierName}`;
  const paperclipLine = args.paperclipIdentifier
    ? `Paperclip issue: ${args.paperclipIdentifier}`
    : "Paperclip issue: (not filed — see logs)";
  const text = [
    `Post-purchase intake submitted on vibe.rehab (${modeTag} mode).`,
    "",
    `Tier: ${args.tierName}`,
    `Customer: ${args.customerEmail}`,
    `Repo / project URL: ${args.repoUrl}`,
    `Stripe session: ${args.stripeSessionId} (matches SALE notification)`,
    paperclipLine,
    "",
    "What's broken (customer words):",
    args.whatBroken,
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

export async function POST(request: NextRequest): Promise<NextResponse> {
  let payload: {
    session_id?: unknown;
    repo_url?: unknown;
    what_broken?: unknown;
  };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const sessionId = typeof payload.session_id === "string" ? payload.session_id.trim() : "";
  const repoUrl = typeof payload.repo_url === "string" ? payload.repo_url.trim() : "";
  const whatBroken = typeof payload.what_broken === "string" ? payload.what_broken.trim() : "";

  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "Missing or invalid session_id" }, { status: 400 });
  }
  if (!repoUrl || repoUrl.length > MAX_REPO_URL_LEN || !isValidRepoUrl(repoUrl)) {
    return NextResponse.json(
      { error: "Repo URL must be a valid http(s) URL under 500 characters" },
      { status: 400 },
    );
  }
  if (
    !whatBroken ||
    whatBroken.length < MIN_WHAT_BROKEN_LEN ||
    whatBroken.length > MAX_WHAT_BROKEN_LEN
  ) {
    return NextResponse.json(
      { error: `Description must be ${MIN_WHAT_BROKEN_LEN}-${MAX_WHAT_BROKEN_LEN} characters` },
      { status: 400 },
    );
  }

  let stripe: Stripe;
  try {
    stripe = getStripe();
  } catch (error) {
    console.error("[intake] stripe init failed", error);
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price"],
    });
  } catch (error) {
    console.warn("[intake] session lookup failed", {
      sessionId,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.payment_status !== "paid") {
    return NextResponse.json(
      { error: "Session is not paid — intake requires a completed checkout" },
      { status: 402 },
    );
  }

  const firstItem = session.line_items?.data?.[0];
  const price = firstItem?.price;
  const priceId = typeof price === "string" ? price : price?.id ?? null;
  const { key: tierKey, name: tierName } = resolveTierFromPriceId(priceId);
  const customerEmail =
    session.customer_details?.email ||
    session.customer_email ||
    (session.metadata?.customer_email as string | undefined) ||
    "unknown@unknown";
  const livemode = session.livemode === true;

  const paperclipResult = await fileIntakeIssue({
    tierName,
    tierKey,
    customerEmail,
    stripeSessionId: sessionId,
    livemode,
    repoUrl,
    whatBroken,
  });
  if (!paperclipResult.ok) {
    console.error("[intake] paperclip issue file failed", paperclipResult);
  } else {
    console.log("[intake] paperclip issue filed", {
      identifier: paperclipResult.identifier,
      id: paperclipResult.id,
    });
  }

  const emailResult = await notifyBoardByEmail({
    tierName,
    customerEmail,
    repoUrl,
    whatBroken,
    stripeSessionId: sessionId,
    livemode,
    paperclipIdentifier: paperclipResult.identifier,
  });
  if (!emailResult.ok) {
    console.error("[intake] board email failed", emailResult);
  }

  const anyDelivery = paperclipResult.ok || emailResult.ok;
  if (!anyDelivery) {
    return NextResponse.json(
      { error: "Failed to route intake — try again or email vibe@shipkit.io" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
