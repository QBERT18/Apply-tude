import { useMemo } from "react";
import {
  addDays,
  eachDayOfInterval,
  format,
  getDay,
  startOfWeek,
  subWeeks,
} from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { ChartEmptyState } from "./chart-empty-state";
import type { ActivityHeatmapDatum } from "./charts.types";

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const WEEKS = 52;

function getIntensity(count: number, max: number): string {
  if (count === 0) return "bg-muted";
  const low = Math.ceil(max / 3);
  const mid = Math.ceil((max * 2) / 3);
  if (count <= low) return "bg-chart-1/30";
  if (count <= mid) return "bg-chart-1/60";
  return "bg-chart-1";
}

export function ActivityHeatmap({
  data,
}: {
  data: ActivityHeatmapDatum[];
}) {
  const { grid, months, max } = useMemo(() => {
    const lookup = new Map(data.map((d) => [d.date, d.count]));
    const today = new Date();
    const start = startOfWeek(subWeeks(today, WEEKS - 1), {
      weekStartsOn: 0,
    });

    const days = eachDayOfInterval({ start, end: today });
    const maxCount = Math.max(1, ...data.map((d) => d.count));

    const weeks: { date: Date; count: number; key: string }[][] = [];
    let currentWeek: { date: Date; count: number; key: string }[] = [];

    for (const day of days) {
      const key = format(day, "yyyy-MM-dd");
      const dayOfWeek = getDay(day);
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push({ date: day, count: lookup.get(key) ?? 0, key });
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);

    const monthLabels: { label: string; col: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, i) => {
      const firstDay = week[0];
      const m = firstDay.date.getMonth();
      if (m !== lastMonth) {
        monthLabels.push({
          label: format(firstDay.date, "MMM"),
          col: i,
        });
        lastMonth = m;
      }
    });

    return { grid: weeks, months: monthLabels, max: maxCount };
  }, [data]);

  const hasActivity = data.length > 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-heading">Activity</CardTitle>
        <CardDescription>Application submissions over the past year</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasActivity ? (
          <ChartEmptyState />
        ) : (
          <div className="overflow-x-auto">
            {/* Month labels */}
            <div
              className="mb-1 grid gap-0.75 text-xs text-muted-foreground"
              style={{
                gridTemplateColumns: `24px repeat(${grid.length}, 1fr)`,
              }}
            >
              <div />
              {grid.map((_, i) => {
                const month = months.find((m) => m.col === i);
                return (
                  <div key={i} className="truncate text-center">
                    {month?.label ?? ""}
                  </div>
                );
              })}
            </div>

            {/* Grid: 7 rows (Sun–Sat) × N columns (weeks) */}
            <div className="flex gap-0.75">
              {/* Day labels */}
              <div className="flex flex-col gap-0.75">
                {DAY_LABELS.map((label, i) => (
                  <div
                    key={i}
                    className="flex h-3.5 w-5 items-center justify-end pr-1 text-[10px] text-muted-foreground"
                  >
                    {label}
                  </div>
                ))}
              </div>

              {/* Weeks */}
              {grid.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-0.75">
                  {Array.from({ length: 7 }).map((_, di) => {
                    const cell = week.find(
                      (c) => getDay(c.date) === di
                    );
                    if (!cell) {
                      return (
                        <div key={di} className="size-3.5" />
                      );
                    }
                    return (
                      <Tooltip key={cell.key}>
                        <TooltipTrigger
                          render={<div />}
                          className={`size-3.5 rounded-sm ${getIntensity(cell.count, max)}`}
                        />
                        <TooltipContent>
                          <p className="text-xs">
                            {cell.count} application
                            {cell.count !== 1 ? "s" : ""} on{" "}
                            {format(cell.date, "EEE, MMM d")}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-2 flex items-center justify-end gap-1 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="size-2.5 rounded-sm bg-muted" />
              <div className="size-2.5 rounded-sm bg-chart-1/30" />
              <div className="size-2.5 rounded-sm bg-chart-1/60" />
              <div className="size-2.5 rounded-sm bg-chart-1" />
              <span>More</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
