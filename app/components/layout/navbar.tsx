import { Link, NavLink } from "react-router";
import { Plus } from "lucide-react";

import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-4">
        <Link
          to="/"
          className="font-heading text-base font-bold tracking-tight sm:text-lg"
        >
          Apply-tude
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                "hidden rounded-full px-3 py-1.5 text-sm hover:bg-muted sm:inline-flex",
                isActive && "bg-muted font-medium text-foreground"
              )
            }
          >
            Applications
          </NavLink>
          <Link to="/new" className={buttonVariants({ size: "sm" })}>
            <Plus /> New
          </Link>
        </nav>
      </div>
    </header>
  );
}
