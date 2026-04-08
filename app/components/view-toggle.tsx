import { LayoutGrid, List } from "lucide-react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { ViewToggleProps } from "~/lib/models/application.types";

export function ViewToggle({ value, onChange, className }: ViewToggleProps) {
  return (
    <div
      role="group"
      aria-label="View mode"
      className={cn("inline-flex items-center gap-1", className)}
    >
      <Button
        type="button"
        variant={value === "grid" ? "secondary" : "ghost"}
        size="icon"
        aria-label="Grid view"
        aria-pressed={value === "grid"}
        onClick={() => onChange("grid")}
      >
        <LayoutGrid />
      </Button>
      <Button
        type="button"
        variant={value === "list" ? "secondary" : "ghost"}
        size="icon"
        aria-label="List view"
        aria-pressed={value === "list"}
        onClick={() => onChange("list")}
      >
        <List />
      </Button>
    </div>
  );
}
