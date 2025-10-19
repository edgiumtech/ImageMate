"use client";

import { memo, useEffect, useState } from "react";
import packageJson from "../../package.json";

const FRONTEND_VERSION = packageJson.version;

export const Footer = memo(function Footer() {
  const [backendVersion, setBackendVersion] = useState<string>("...");

  useEffect(() => {
    fetch("/api/version")
      .then((res) => res.json())
      .then((data) => {
        setBackendVersion(data.imaginary || "unavailable");
      })
      .catch(() => {
        setBackendVersion("unavailable");
      });
  }, []);

  return (
    <div className="text-center mt-8 space-y-2">
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span>
          Frontend <span className="font-mono">v{FRONTEND_VERSION}</span>
        </span>
        <span>•</span>
        <span>
          Backend <span className="font-mono">v{backendVersion}</span>
        </span>
      </div>
      <p className="text-sm text-muted-foreground">
        Powered by{" "}
        <a
          href="https://github.com/h2non/imaginary"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          imaginary
        </a>{" "}
        • Open source & free to use
      </p>
    </div>
  );
});

Footer.displayName = "Footer";
