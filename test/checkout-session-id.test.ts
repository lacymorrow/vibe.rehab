import { describe, expect, it } from "vitest";
import { isCheckoutSessionId } from "@/lib/checkout-session-id";

describe("isCheckoutSessionId", () => {
  it("accepts a Stripe checkout session id", () => {
    expect(isCheckoutSessionId("cs_test_a1B2c3_d4E5")).toBe(true);
    expect(isCheckoutSessionId("cs_live_a1B2c3")).toBe(true);
  });

  it("rejects anything that is not one", () => {
    for (const value of [null, undefined, "", "garbage", "cs_", "pi_123", "cs_test_a1 b2", "cs_test_<script>"]) {
      expect(isCheckoutSessionId(value)).toBe(false);
    }
  });
});
