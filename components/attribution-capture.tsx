"use client";

import { useEffect } from "react";
import { captureSrc } from "@/lib/attribution";

export function AttributionCapture() {
  useEffect(() => {
    captureSrc();
  }, []);
  return null;
}
