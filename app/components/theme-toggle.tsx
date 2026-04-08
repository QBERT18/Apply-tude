import { Moon, Sun } from "lucide-react";

import { useTheme } from "~/hooks/use-theme";
import { Button } from "~/components/ui/button";
import type { ThemeToggleProps } from "~/lib/models/application.types";

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();
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
