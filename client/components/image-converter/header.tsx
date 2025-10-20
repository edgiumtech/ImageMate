import { memo } from "react";
import { Github } from "lucide-react";
import Image from "next/image";
import logo from "@/public/logo.png";

export const Header = memo(function Header() {
  return (
    <div className="relative text-center mb-8">
      <a
        href="https://github.com/edgiumtech/ImageMate"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-0 top-0 p-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="View on GitHub"
      >
        <Github className="w-6 h-6" />
      </a>

      <div className="flex items-center justify-center gap-3 mb-4">
        <Image src={logo} alt="ImageMate" width={50} height={50} />
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent pb-1">
          ImageMate
        </h1>
      </div>
      <p className="text-lg text-muted-foreground">
        Fast, private image conversion
      </p>
    </div>
  );
});

Header.displayName = "Header";
