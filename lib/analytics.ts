interface UmamiWindow extends Window {
  umami?: { track: (name: string, data?: Record<string, string>) => void };
}

export type AnalyticsData = Record<string, string | undefined>;

// Fire a custom Umami event. No-ops when the script is blocked or not loaded.
export function trackEvent(name: string, data: AnalyticsData = {}): void {
  if (typeof window === "undefined") return;
  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(data)) if (v) clean[k] = v;
  try {
    (window as UmamiWindow).umami?.track(name, clean);
  } catch {}
}
