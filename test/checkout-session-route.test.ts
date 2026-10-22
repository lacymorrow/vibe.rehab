import type { NextRequest } from "next/server";
import Stripe from "stripe";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/checkout-session/route";

const { retrieve } = vi.hoisted(() => ({ retrieve: vi.fn() }));

// The route builds its own Stripe client, so the proxy swaps construction for
// a stub while every static (Stripe.errors, used for the instanceof check)
// still resolves to the real class.
vi.mock("stripe", async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import("stripe");
  return {
    ...actual,
    default: new Proxy(actual.default, {
      construct: () => ({ checkout: { sessions: { retrieve } } }),
    }),
  };
});

const get = (query: string): Promise<Response> =>
  GET(new Request(`https://vibe.rehab/api/checkout-session${query}`) as unknown as NextRequest);

describe("GET /api/checkout-session", () => {
  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = "sk_test_vitest";
    retrieve.mockReset();
  });

  it("answers 404 when Stripe does not know the session", async () => {
    retrieve.mockRejectedValue(
      new Stripe.errors.StripeInvalidRequestError({
        type: "invalid_request_error",
        code: "resource_missing",
        message: "No such checkout.session: 'cs_test_qa_probe_0000'",
      }),
    );

    const response = await get("?session_id=cs_test_qa_probe_0000");

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: "Session not found" });
  });

  it("keeps 500 for a real Stripe failure", async () => {
    retrieve.mockRejectedValue(new Stripe.errors.StripeConnectionError({ type: "api_error", message: "network down" }));

    const response = await get("?session_id=cs_test_qa_probe_0000");

    expect(response.status).toBe(500);
  });

  it("rejects a missing or malformed session id before calling Stripe", async () => {
    for (const query of ["", "?session_id=", "?session_id=garbage"]) {
      const response = await get(query);
      expect(response.status).toBe(400);
    }
    expect(retrieve).not.toHaveBeenCalled();
  });

  it("returns only the fields the page renders", async () => {
    retrieve.mockResolvedValue({
      id: "cs_test_ok",
      amount_total: 29900,
      currency: "usd",
      payment_status: "paid",
      customer_details: { email: "buyer@example.com", address: { line1: "1 Private St" } },
      metadata: { service_name: "Complete_Rehab", internal_note: "do not leak" },
    });

    const response = await get("?session_id=cs_test_ok");

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      service_name: "Complete Rehab",
      customer_email: "buyer@example.com",
      amount_total: 29900,
      currency: "usd",
      payment_status: "paid",
    });
  });
});
