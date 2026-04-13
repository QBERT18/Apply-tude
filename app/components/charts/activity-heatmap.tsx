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
          <div className="overflow-hidden">
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
            <div
              className="grid gap-0.75"
              style={{
                gridTemplateColumns: `24px repeat(${grid.length}, 1fr)`,
                gridTemplateRows: "repeat(7, 1fr)",
              }}
            >
              {/* Day labels */}
              {DAY_LABELS.map((label, i) => (
                <div
                  key={`label-${i}`}
                  className="flex items-center justify-end pr-1 text-[10px] text-muted-foreground"
                  style={{ gridColumn: 1, gridRow: i + 1 }}
                >
                  {label}
                </div>
              ))}

              {/* Week cells */}
              {grid.map((week, wi) =>
                Array.from({ length: 7 }).map((_, di) => {
                  const cell = week.find((c) => getDay(c.date) === di);
                  if (!cell) {
                    return (
                      <div
                        key={`empty-${wi}-${di}`}
                        style={{ gridColumn: wi + 2, gridRow: di + 1 }}
                      />
                    );
                  }
                  return (
                    <div
                      key={cell.key}
                      title={`${cell.count} application${cell.count !== 1 ? "s" : ""} on ${format(cell.date, "EEE, MMM d")}`}
                      className={`aspect-square w-full rounded-sm ${getIntensity(cell.count, max)}`}
                      style={{ gridColumn: wi + 2, gridRow: di + 1 }}
                    />
                  );
                })
              )}
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
