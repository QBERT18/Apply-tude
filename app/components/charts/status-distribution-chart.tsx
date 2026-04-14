import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { statusChartConfig, STATUS_CHART_COLORS } from "./chart-configs";
import { ChartEmptyState } from "./chart-empty-state";
import type { StatusDistributionDatum } from "./charts.types";

export function StatusDistributionChart({
  data,
  total,
}: {
  data: StatusDistributionDatum[];
  total: number;
}) {
  const hasData = data.length > 0;

  const totalLabel = useMemo(
    () =>
      total.toLocaleString(undefined, {
        notation: total >= 10_000 ? "compact" : "standard",
      }),
    [total],
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-heading">Status Distribution</CardTitle>
        <CardDescription>Applications by current status</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <ChartEmptyState />
        ) : (
          <>
            <ChartContainer
              config={statusChartConfig}
              className="mx-auto aspect-square max-h-75"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {totalLabel}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy ?? 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Total
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-3">
              {data.map((d) => (
                <div key={d.status} className="flex items-center gap-1.5">
                  <div
                    className="size-2 shrink-0 rounded-xs"
                    style={{ backgroundColor: STATUS_CHART_COLORS[d.status] }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {statusChartConfig[d.status]?.label ?? d.status}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
