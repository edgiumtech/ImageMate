import { memo } from "react";

export const Footer = memo(function Footer() {
  return (
    <div className="text-center mt-8 text-sm text-muted-foreground">
      <p>
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
