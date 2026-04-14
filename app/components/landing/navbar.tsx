import { Link } from "react-router";
import { Globe } from "lucide-react";

import { buttonVariants } from "~/components/ui/button";

import type { NavItem } from "./navbar.types";

const navItems: NavItem[] = [
  { label: "Product", href: "#product" },
  { label: "Docs", href: "#docs" },
  { label: "Blog", href: "#blog" },
  { label: "Community", href: "#community" },
  { label: "Company", href: "#company" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex h-fit w-40 items-center overflow-hidden">
          <img
            src="/logo.png"
            alt="Apply-tude"
            className="h-auto w-full object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Language"
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <Globe />
          </button>
          <Link to="/login" className={buttonVariants({ variant: "ghost" })}>
            Sign In
          </Link>
          <Link to="/signup" className={buttonVariants()}>
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
