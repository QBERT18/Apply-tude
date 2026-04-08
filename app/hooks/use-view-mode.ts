import { useCallback, useEffect, useState } from "react";

import type { ViewMode } from "~/lib/models/application.types";

export const VIEW_MODE_STORAGE_KEY = "view-mode";
const DEFAULT_VIEW_MODE: ViewMode = "grid";

function isViewMode(value: string | null): value is ViewMode {
  return value === "grid" || value === "list";
}

export function useViewMode() {
  // Start with the default on both server and first client render so the
  // SSR'd markup matches the client's initial hydration. The stored value is
  // applied in a post-hydrate effect, which accepts a brief flash for users
  // who prefer list view as a deliberate trade-off.
  const [view, setViewState] = useState<ViewMode>(DEFAULT_VIEW_MODE);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
      if (isViewMode(stored)) {
        setViewState(stored);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const setView = useCallback((next: ViewMode) => {
    setViewState(next);
    try {
      localStorage.setItem(VIEW_MODE_STORAGE_KEY, next);
    } catch {
      // ignore storage errors
    }
  }, []);

  return { view, setView };
}
