"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function RoastViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    // Umami loads afterInteractive; retry briefly if it is not up yet.
    let tries = 0;
    const fire = () => {
      const w = window as Window & { umami?: unknown };
      if (w.umami || tries >= 10) {
        trackEvent("roast_view", { slug });
        return;
      }
      tries += 1;
      timer = window.setTimeout(fire, 300);
    };
    let timer = window.setTimeout(fire, 0);
    return () => window.clearTimeout(timer);
  }, [slug]);
  return null;
}
