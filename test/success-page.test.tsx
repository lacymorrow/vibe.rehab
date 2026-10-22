// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { metadata } from "@/app/success/layout";
import SuccessPage from "@/app/success/page";

const { params } = vi.hoisted(() => ({ params: { current: new URLSearchParams() } }));

vi.mock("next/navigation", () => ({
  useSearchParams: () => params.current,
}));

const fetchMock = vi.fn();

const renderWith = (query: string) => {
  params.current = new URLSearchParams(query);
  return render(<SuccessPage />);
};

describe("/success", () => {
  beforeEach(() => {
    params.current = new URLSearchParams();
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        service_name: "Complete Rehab",
        customer_email: "buyer@example.com",
        amount_total: 29900,
        currency: "usd",
        payment_status: "paid",
      }),
    });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("does not claim a payment when the URL carries no session id", async () => {
    renderWith("");

    expect(await screen.findByRole("heading", { level: 1 })).toHaveProperty(
      "textContent",
      expect.stringMatching(/find that order/i),
    );
    expect(screen.queryByText(/payment successful/i)).toBeNull();
    expect(screen.queryByText(/thank you for choosing/i)).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not offer the intake form when the URL carries no session id", async () => {
    renderWith("");

    await screen.findByRole("heading", { level: 1 });
    expect(screen.queryByLabelText(/repo or project url/i)).toBeNull();
    expect(screen.queryByRole("button", { name: /send intake/i })).toBeNull();
  });

  it("treats a malformed session id as no order", async () => {
    renderWith("?session_id=garbage");

    await screen.findByText(/find that order/i);
    expect(screen.queryByText(/payment successful/i)).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("points a visitor without an order back to the site and to support", async () => {
    renderWith("");

    expect(await screen.findByRole("link", { name: /back to vibe rehab/i })).toBeDefined();
    expect(screen.getByRole("link", { name: /vibe@shipkit\.io/i })).toHaveProperty(
      "href",
      "mailto:vibe@shipkit.io",
    );
  });

  it("never claims a payment in the page metadata", () => {
    expect(String(metadata.title)).not.toMatch(/payment|confirmed/i);
    expect(String(metadata.description)).not.toMatch(/payment confirmed/i);
    expect(metadata.robots).toMatchObject({ index: false });
  });

  it("still confirms the order and asks for intake with a session id from a receipt", async () => {
    renderWith("?session_id=cs_test_a1B2c3");

    expect(await screen.findByText(/payment successful/i)).toBeDefined();
    expect(fetchMock).toHaveBeenCalledWith("/api/checkout-session?session_id=cs_test_a1B2c3");
    expect(screen.getByLabelText(/repo or project url/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /send intake/i })).toBeDefined();
    await waitFor(() => expect(screen.getByText(/complete rehab/i)).toBeDefined());
    expect(screen.getByText(/\$299\.00/)).toBeDefined();
  });
});
