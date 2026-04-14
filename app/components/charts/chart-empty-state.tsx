import { BarChart3 } from "lucide-react";

import type { ChartEmptyStateProps } from "./charts.types";

export function ChartEmptyState({
  message = "No data to display yet.",
}: ChartEmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
      <BarChart3 className="size-8" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
