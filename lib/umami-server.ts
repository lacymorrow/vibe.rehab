const UMAMI_URL = process.env.UMAMI_URL || "https://analytics.lacy.sh";
const UMAMI_WEBSITE_ID =
  process.env.UMAMI_WEBSITE_ID || "7ea9eace-debb-4291-bc21-251a79dae897";

// Server-side Umami event (webhooks have no browser). Never throws.
export async function trackServerEvent(
  name: string,
  data: Record<string, string>,
): Promise<void> {
  try {
    const res = await fetch(`${UMAMI_URL}/api/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "vibe-rehab-server/1.0" },
      body: JSON.stringify({
        type: "event",
        payload: { website: UMAMI_WEBSITE_ID, hostname: "vibe.rehab", url: "/webhooks/stripe", name, data },
      }),
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) console.warn("[umami] server event rejected", { name, status: res.status });
  } catch (error) {
    console.warn("[umami] server event failed", { name, error });
  }
}
