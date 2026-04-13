import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
import { categoryChartConfig } from "./chart-configs";
import { ChartEmptyState } from "./chart-empty-state";
import type { CategoryDistributionDatum } from "./charts.types";

function truncateLabel(value: string) {
  return value.length > 12 ? value.slice(0, 11) + "\u2026" : value;
}

export function CategoryDistributionChart({
  data,
}: {
  data: CategoryDistributionDatum[];
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-heading">Category Distribution</CardTitle>
        <CardDescription>Top categories by application count</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <ChartEmptyState message="Add categories to your applications to see this chart." />
        ) : (
          <ChartContainer
            config={categoryChartConfig}
            className="aspect-auto h-62.5 w-full"
          >
            <BarChart data={data} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={truncateLabel}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
