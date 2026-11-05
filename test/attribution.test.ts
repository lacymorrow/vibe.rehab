import { describe, expect, it } from "vitest";
import { sanitizeSrc } from "@/lib/attribution";

describe("sanitizeSrc", () => {
  it("accepts roast slugs", () => {
    expect(sanitizeSrc("roast-my-site")).toBe("roast-my-site");
  });
  it("trims and lowercases", () => {
    expect(sanitizeSrc("  Roast-Foo ")).toBe("roast-foo");
  });
  it("rejects non-strings", () => {
    expect(sanitizeSrc(null)).toBeNull();
    expect(sanitizeSrc(42)).toBeNull();
  });
  it("rejects empty, leading dash, bad chars, and over-length", () => {
    expect(sanitizeSrc("")).toBeNull();
    expect(sanitizeSrc("-x")).toBeNull();
    expect(sanitizeSrc("a b")).toBeNull();
    expect(sanitizeSrc("a;b=c")).toBeNull();
    expect(sanitizeSrc("a".repeat(65))).toBeNull();
  });
});
