import { Heart } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <Heart className="h-3.5 w-3.5 text-primary-foreground" fill="currentColor" />
          </div>
          <span className="text-sm font-semibold text-foreground">Fair Donation</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Home
          </Link>
          <Link href="/discover" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Discover
          </Link>
        </nav>
        <p className="text-xs text-muted-foreground">
          Built with love for Myanmar.
        </p>
      </div>
    </footer>
  );
}
