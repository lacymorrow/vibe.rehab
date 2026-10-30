// A Stripe checkout session id we can recognise without calling Stripe.
// The /success page uses it to tell a real receipt link from a bare URL, and
// the session route uses it to reject junk before spending an API call.
export const isCheckoutSessionId = (value: string | null | undefined): value is string =>
  typeof value === "string" && /^cs_[A-Za-z0-9_]+$/.test(value);
