import { useCallback, useEffect, useState } from "react";

import { THEME_STORAGE_KEY } from "~/lib/theme";
import type { Theme } from "~/lib/models/application.types";

function readInitialTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function useTheme() {
  // Initialise from the DOM, which was already set by the inline script in
  // root.tsx before hydration. This keeps SSR and first client render in sync.
  const [theme, setThemeState] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore storage errors (private mode, quota, etc.)
    }
  }, [theme]);

  const setTheme = useCallback((next: Theme) => setThemeState(next), []);
  const toggle = useCallback(
    () => setThemeState((prev) => (prev === "dark" ? "light" : "dark")),
    []
  );

  return { theme, setTheme, toggle };
}
