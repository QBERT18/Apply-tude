import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { useTheme } from "~/hooks/use-theme";
import { Button } from "~/components/ui/button";
import type { ThemeToggleProps } from "~/lib/models/application.types";

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Render a placeholder with the same dimensions during SSR to avoid layout shift
  if (!mounted) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-hidden
        className={className}
      >
        <span className="size-4" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className={className}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
}
