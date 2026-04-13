import { Bar, BarChart, XAxis, YAxis } from "recharts";

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
import { funnelChartConfig } from "./chart-configs";
import { ChartEmptyState } from "./chart-empty-state";
import type { FunnelStageDatum } from "./charts.types";

const stageLabels: Record<string, string> = {
  applied: "Applied",
  interviewing: "Interviewing",
  offer: "Offer",
  accepted: "Accepted",
};

export function SuccessFunnelChart({
  data,
}: {
  data: FunnelStageDatum[];
}) {
  const allZero = data.every((d) => d.count === 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-heading">Success Funnel</CardTitle>
        <CardDescription>Conversion through pipeline stages</CardDescription>
      </CardHeader>
      <CardContent>
        {allZero ? (
          <ChartEmptyState message="No applications in the pipeline yet." />
        ) : (
          <ChartContainer
            config={funnelChartConfig}
            className="aspect-auto h-62.5 w-full"
          >
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 0 }}
              accessibilityLayer
            >
              <YAxis
                dataKey="stage"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={100}
                tickFormatter={(v: string) => stageLabels[v] ?? v}
              />
              <XAxis dataKey="count" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" radius={5} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
