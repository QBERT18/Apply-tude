export const APPLICATION_STATUSES = [
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
  { value: "ghosted", label: "Ghosted" },
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]["value"];

export const APPLICATION_SORT_OPTIONS = [
  { value: "updatedAt", label: "Last updated" },
  { value: "createdAt", label: "Created" },
  { value: "jobName", label: "Job name" },
  { value: "companyName", label: "Company" },
  { value: "contactName", label: "Contact" },
] as const;

export const applicationStatusValues = APPLICATION_STATUSES.map(
  (s) => s.value
) as [ApplicationStatus, ...ApplicationStatus[]];

export const DEFAULT_APPLICATION_STATUS: ApplicationStatus = "applied";

export function getStatusLabel(value: ApplicationStatus): string {
  return (
    APPLICATION_STATUSES.find((s) => s.value === value)?.label ?? value
  );
}

/**
 * Tailwind class snippets per status — used by both the homepage card
 * select trigger and the detail page badge to keep colors in sync.
 */
export const STATUS_BADGE_CLASSES: Record<ApplicationStatus, string> = {
  saved:
    "bg-muted text-muted-foreground ring-1 ring-foreground/10",
  applied:
    "bg-blue-100 text-blue-700 ring-1 ring-blue-700/20 dark:bg-blue-500/20 dark:text-blue-200 dark:ring-blue-400/30",
  interviewing:
    "bg-amber-100 text-amber-800 ring-1 ring-amber-700/20 dark:bg-amber-500/20 dark:text-amber-200 dark:ring-amber-400/30",
  offer:
    "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-700/20 dark:bg-emerald-500/20 dark:text-emerald-200 dark:ring-emerald-400/30",
  accepted:
    "bg-green-600 text-white ring-1 ring-green-700/30 dark:bg-green-500 dark:text-white dark:ring-green-400/40",
  rejected:
    "bg-destructive/15 text-destructive ring-1 ring-destructive/30",
  withdrawn:
    "bg-muted text-muted-foreground ring-1 ring-foreground/10",
  ghosted:
    "bg-muted text-muted-foreground italic ring-1 ring-foreground/10",
};
