"use client";

import { useEffect } from "react";

export function WebVitals() {
  useEffect(() => {
    // Only run in production and if web-vitals is available
    if (process.env.NODE_ENV === "production" && typeof window !== "undefined") {
      import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
      });
    }
  }, []);

  return null;
}
