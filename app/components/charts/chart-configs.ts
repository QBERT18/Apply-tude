import type { ChartConfig } from "~/components/ui/chart";

export const STATUS_CHART_COLORS: Record<string, string> = {
  saved: "oklch(0.637 0.025 286)",
  applied: "oklch(0.623 0.214 259)",
  interviewing: "oklch(0.702 0.183 86)",
  offer: "oklch(0.696 0.17 162)",
  accepted: "oklch(0.627 0.194 149)",
  rejected: "oklch(0.637 0.237 25)",
  withdrawn: "oklch(0.553 0.013 286)",
  ghosted: "oklch(0.480 0.010 286)",
};

export const statusChartConfig = {
  count: { label: "Applications" },
  saved: { label: "Saved", color: STATUS_CHART_COLORS.saved },
  applied: { label: "Applied", color: STATUS_CHART_COLORS.applied },
  interviewing: {
    label: "Interviewing",
    color: STATUS_CHART_COLORS.interviewing,
  },
  offer: { label: "Offer", color: STATUS_CHART_COLORS.offer },
  accepted: { label: "Accepted", color: STATUS_CHART_COLORS.accepted },
  rejected: { label: "Rejected", color: STATUS_CHART_COLORS.rejected },
  withdrawn: { label: "Withdrawn", color: STATUS_CHART_COLORS.withdrawn },
  ghosted: { label: "Ghosted", color: STATUS_CHART_COLORS.ghosted },
} satisfies ChartConfig;

export const funnelChartConfig = {
  count: { label: "Applications" },
  applied: { label: "Applied", color: STATUS_CHART_COLORS.applied },
  interviewing: {
    label: "Interviewing",
    color: STATUS_CHART_COLORS.interviewing,
  },
  offer: { label: "Offer", color: STATUS_CHART_COLORS.offer },
  accepted: { label: "Accepted", color: STATUS_CHART_COLORS.accepted },
} satisfies ChartConfig;

export const timelineChartConfig = {
  count: { label: "Applications", color: "var(--chart-1)" },
} satisfies ChartConfig;

export const categoryChartConfig = {
  count: { label: "Applications", color: "var(--chart-2)" },
} satisfies ChartConfig;
