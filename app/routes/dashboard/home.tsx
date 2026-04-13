import { Link } from "react-router";
import { BarChart3, Plus } from "lucide-react";

import type { Route } from "./+types/home";
import { requireUserId } from "~/lib/auth.server";
import { getDashboardStats } from "~/lib/models/application.queries.server";
import { Card, CardContent } from "~/components/ui/card";
import { buttonVariants } from "~/components/ui/button";
import { StatusDistributionChart } from "~/components/charts/status-distribution-chart";
import { ApplicationsOverTimeChart } from "~/components/charts/applications-over-time-chart";
import { SuccessFunnelChart } from "~/components/charts/success-funnel-chart";
import { CategoryDistributionChart } from "~/components/charts/category-distribution-chart";
import { ActivityHeatmap } from "~/components/charts/activity-heatmap";
import type { ApplicationStatus } from "~/lib/constants/application.constants";
import type { DashboardChartData } from "~/components/charts/charts.types";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Overview — Apply-tude" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await requireUserId(request);

  const stats = await getDashboardStats(userId);

  const statusDistribution = stats.statusDistribution.map((d) => ({
    status: d.status as ApplicationStatus,
    count: d.count,
    fill: `var(--color-${d.status})`,
  }));

  const totalApplications = statusDistribution.reduce(
    (sum, d) => sum + d.count,
    0
  );

  const funnelColors: Record<string, string> = {
    applied: `var(--color-applied)`,
    interviewing: `var(--color-interviewing)`,
    offer: `var(--color-offer)`,
    accepted: `var(--color-accepted)`,
  };

  const successFunnel = stats.successFunnel.map((d) => ({
    ...d,
    fill: funnelColors[d.stage] ?? "var(--color-applied)",
  }));

  return {
    statusDistribution,
    applicationsOverTime: stats.applicationsOverTime,
    successFunnel,
    categoryDistribution: stats.categoryDistribution,
    activityHeatmap: stats.activityHeatmap,
    totalApplications,
  } satisfies DashboardChartData;
}

export default function Overview({ loaderData }: Route.ComponentProps) {
  const {
    statusDistribution,
    applicationsOverTime,
    successFunnel,
    categoryDistribution,
    activityHeatmap,
    totalApplications,
  } = loaderData;

  if (totalApplications === 0) {
    return (
      <div className="space-y-4">
        <h1 className="font-heading text-2xl font-bold">Overview</h1>
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <BarChart3 className="size-12 text-muted-foreground" />
            <h2 className="font-heading text-xl font-semibold">
              Welcome to your dashboard
            </h2>
            <p className="max-w-md text-muted-foreground">
              Charts and insights will appear here once you start tracking your
              job applications.
            </p>
            <Link
              to="/dashboard/new"
              className={buttonVariants()}
            >
              <Plus className="size-4" />
              Add your first application
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Overview</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <StatusDistributionChart data={statusDistribution} total={totalApplications} />
        <SuccessFunnelChart data={successFunnel} />
      </div>

      <ApplicationsOverTimeChart data={applicationsOverTime} />

      <CategoryDistributionChart data={categoryDistribution} />

      <ActivityHeatmap data={activityHeatmap} />
    </div>
  );
}
