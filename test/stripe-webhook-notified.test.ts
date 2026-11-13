import type { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/webhooks/stripe/route";

const { constructEvent, retrieve, fileSaleIssue, send } = vi.hoisted(() => ({
  constructEvent: vi.fn(),
  retrieve: vi.fn(),
  fileSaleIssue: vi.fn(),
  send: vi.fn(),
}));

vi.mock("stripe", () => ({
  default: class {
    webhooks = { constructEvent };
    checkout = { sessions: { retrieve } };
  },
}));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));
vi.mock("@/lib/paperclip", () => ({ fileSaleIssue }));
vi.mock("@/lib/umami-server", () => ({ trackServerEvent: vi.fn() }));
// after() needs a request scope that does not exist under vitest.
vi.mock("next/server", async (importOriginal) => ({
  ...((await importOriginal()) as typeof import("next/server")),
  after: (task: () => unknown) => void task(),
}));

const post = (): Promise<Response> =>
  POST(
    new Request("https://vibe.rehab/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "t=1,v1=x" },
      body: "{}",
    }) as unknown as NextRequest,
  );

describe("POST /api/webhooks/stripe notification reporting", () => {
  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = "sk_test_vitest";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_vitest";
    process.env.RESEND_API_KEY = "re_vitest";
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
    constructEvent.mockReset().mockReturnValue({
      id: "evt_1",
      type: "checkout.session.completed",
      livemode: false,
      data: { object: { id: "cs_test_1", amount_total: 29900, currency: "usd" } },
    });
    retrieve.mockReset().mockResolvedValue({ line_items: { data: [] } });
    fileSaleIssue.mockReset().mockResolvedValue({ ok: true, identifier: "LAC-1", id: "i1", status: 201 });
    send.mockReset().mockResolvedValue({ data: { id: "m1" }, error: null });
  });

  it("reports both legs true when both succeed", async () => {
    const res = await post();
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({
      received: true,
      handled: true,
      notified: { email: true, paperclip: true },
    });
  });

  it("reports email:false with a 2xx when Resend rejects the key", async () => {
    send.mockResolvedValue({ data: null, error: { name: "validation_error", message: "API key is invalid" } });
    const res = await post();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ received: true, handled: true });
    expect(body.notified).toEqual({ email: false, paperclip: true });
  });

  it("reports paperclip:false with a 2xx when the issue filing fails", async () => {
    fileSaleIssue.mockResolvedValue({ ok: false, status: 500, error: "boom" });
    const res = await post();
    expect(res.status).toBe(200);
    expect((await res.json()).notified).toEqual({ email: true, paperclip: false });
  });

  it("reports email:false when RESEND_API_KEY is missing", async () => {
    delete process.env.RESEND_API_KEY;
    const res = await post();
    expect(res.status).toBe(200);
    expect((await res.json()).notified).toEqual({ email: false, paperclip: true });
  });

  it("acks with 200 and handled:false when fileSaleIssue throws, so Stripe does not retry", async () => {
    fileSaleIssue.mockRejectedValue(new Error("paperclip down"));
    const res = await post();
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ received: true, handled: false });
  });
});
