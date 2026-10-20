import type Stripe from "stripe";
import { resolveTierFromPriceId } from "@/lib/pricing";

// The only fields /success renders. Everything else Stripe returns about a
// session (buyer address, metadata, account branding) stays server-side.
export interface CheckoutSessionSummary {
  service_name: string | null;
  customer_email: string | null;
  amount_total: number | null;
  currency: string | null;
  payment_status: string | null;
}

const firstPriceId = (session: Stripe.Checkout.Session): string | null => {
  const price = session.line_items?.data?.[0]?.price;
  if (!price) return null;
  return typeof price === "string" ? price : price.id;
};

// Older sessions carry an underscored tier name in metadata, so prefer our own
// tier table and fall back to a readable version of whatever Stripe stored.
const displayServiceName = (session: Stripe.Checkout.Session): string | null => {
  const tier = resolveTierFromPriceId(firstPriceId(session));
  if (tier) return tier.name;
  const stored = session.metadata?.service_name;
  if (typeof stored !== "string") return null;
  const readable = stored.replace(/[_-]+/g, " ").trim();
  return readable || null;
};

export const summarizeCheckoutSession = (
  session: Stripe.Checkout.Session,
): CheckoutSessionSummary => ({
  service_name: displayServiceName(session),
  customer_email: session.customer_details?.email ?? session.customer_email ?? null,
  amount_total: session.amount_total ?? null,
  currency: session.currency ?? null,
  payment_status: session.payment_status ?? null,
});
