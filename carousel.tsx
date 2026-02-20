"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Heart, Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover" },
];

const roleLabels = {
  GUEST: "Guest",
  DONOR: "Donor",
  HOSTEL_ADMIN: "Hostel Admin",
  ADMIN: "System Admin",
};

export function Navbar() {
  const { user, role, switchRole, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const dashboardLink =
    role === "HOSTEL_ADMIN"
      ? "/dashboard/hostel"
      : role === "ADMIN"
        ? "/dashboard/admin"
        : null;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Fair Donation
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary",
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          {dashboardLink && (
            <Link
              href={dashboardLink}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary",
                pathname.startsWith("/dashboard")
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Role Switcher (for demo) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <User className="h-4 w-4" />
                <span className="text-xs">{roleLabels[role]}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => switchRole("GUEST")}>
                Guest (Public)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchRole("DONOR")}>
                Donor (Ko Aung)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchRole("HOSTEL_ADMIN")}>
                Hostel Admin (Ma Hnin)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchRole("ADMIN")}>
                System Admin (U Kyaw)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-normal">
                {user.name}
              </Badge>
              <Button variant="ghost" size="icon" onClick={logout} className="h-8 w-8">
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Log out</span>
              </Button>
            </div>
          ) : (
            <Link href="/discover">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Donate Now
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col gap-6 pt-6">
              <nav className="flex flex-col gap-1">
                {publicLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary",
                      pathname === link.href
                        ? "bg-secondary text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                {dashboardLink && (
                  <Link
                    href={dashboardLink}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary",
                      pathname.startsWith("/dashboard")
                        ? "bg-secondary text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    Dashboard
                  </Link>
                )}
              </nav>

              <div className="border-t border-border pt-4">
                <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Switch Role (Demo)
                </p>
                <div className="flex flex-col gap-1">
                  {(Object.entries(roleLabels) as [keyof typeof roleLabels, string][]).map(
                    ([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          switchRole(key);
                          setOpen(false);
                        }}
                        className={cn(
                          "rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-secondary",
                          role === key
                            ? "bg-primary/10 font-medium text-primary"
                            : "text-muted-foreground"
                        )}
                      >
                        {label}
                      </button>
                    )
                  )}
                </div>
              </div>

              {user && (
                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between px-3">
                    <span className="text-sm text-foreground">{user.name}</span>
                    <Button variant="ghost" size="sm" onClick={() => { logout(); setOpen(false); }}>
                      <LogOut className="mr-1 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
