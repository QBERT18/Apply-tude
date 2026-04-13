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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { statusChartConfig } from "./chart-configs";
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
    [total]
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
          <ChartContainer
            config={statusChartConfig}
            className="mx-auto aspect-square max-h-[300px]"
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
                            y={(viewBox.cy ?? 0) - 8}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalLabel}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) + 16}
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
              <ChartLegend
                content={<ChartLegendContent nameKey="status" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
