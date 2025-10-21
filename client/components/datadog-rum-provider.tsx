"use client";

import { useEffect } from "react";
import { initDatadogRum } from "@/lib/datadog-rum";

export function DatadogRumProvider() {
  useEffect(() => {
    initDatadogRum();
  }, []);

  return null;
}
