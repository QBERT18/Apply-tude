import type { ApplicationStatus } from "~/lib/constants/application.constants";

export type StatusDistributionDatum = {
  status: ApplicationStatus;
  count: number;
  fill: string;
};

export type ApplicationsOverTimeDatum = {
  month: string;
  count: number;
};

export type FunnelStageDatum = {
  stage: string;
  count: number;
  fill: string;
};

export type CategoryDistributionDatum = {
  category: string;
  count: number;
};

export type ActivityHeatmapDatum = {
  date: string;
  count: number;
};

export type ChartEmptyStateProps = {
  message?: string;
};

export type DashboardChartData = {
  statusDistribution: StatusDistributionDatum[];
  applicationsOverTime: ApplicationsOverTimeDatum[];
  successFunnel: FunnelStageDatum[];
  categoryDistribution: CategoryDistributionDatum[];
  activityHeatmap: ActivityHeatmapDatum[];
  totalApplications: number;
};
