import { useEffect, useState } from "react";
import { Link, useFetcher } from "react-router";
import { Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  APPLICATION_STATUSES,
  STATUS_BADGE_CLASSES,
} from "~/lib/constants/application.constants";
import type {
  ApplicationCardProps,
  ApplicationStatus,
} from "~/lib/models/application.types";
import { cn } from "~/lib/utils";
import { formatDate } from "~/lib/utils/date";

export function ApplicationCard({
  app,
  variant = "grid",
}: ApplicationCardProps) {
  const deleteFetcher = useFetcher();
  const statusFetcher = useFetcher();
  const [open, setOpen] = useState(false);
  const isDeleting = deleteFetcher.state !== "idle";
  const isUpdatingStatus = statusFetcher.state !== "idle";

  // Controlled status value seeded from the loader. Optimistically updated on
  // user selection and re-synced from the loader after revalidation.
  // Initialised eagerly so it is never `undefined` on first render — base-ui's
  // useControlled locks the controlled/uncontrolled mode on the first value
  // and warns if it ever changes.
  const [statusValue, setStatusValue] = useState<ApplicationStatus>(app.status);
  useEffect(() => {
    if (statusFetcher.state === "idle") {
      setStatusValue(app.status);
    }
  }, [app.status, statusFetcher.state]);

  const statusSelect = (
    <Select
      value={statusValue}
      onValueChange={(value) => {
        const next = value as ApplicationStatus;
        setStatusValue(next);
        statusFetcher.submit(
          { intent: "update-status", id: app.id, status: next },
          { method: "post", action: "/?index" }
        );
      }}
      disabled={isUpdatingStatus}
    >
      <SelectTrigger
        size="sm"
        aria-label="Change status"
        className={cn(
          "rounded-full border-0 px-3 text-xs font-medium",
          STATUS_BADGE_CLASSES[statusValue]
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {APPLICATION_STATUSES.map((s) => (
          <SelectItem key={s.value} value={s.value}>
            {s.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const deleteDialog = (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            variant="destructive"
            size="icon-sm"
            disabled={isDeleting}
            aria-label="Delete application"
          />
        }
      >
        <Trash2 />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete application?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove "{app.jobName}" at {app.companyName}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              deleteFetcher.submit(
                { intent: "delete", id: app.id },
                { method: "post", action: "/?index" }
              );
              setOpen(false);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  if (variant === "list") {
    return (
      <Card className="flex flex-row items-center gap-4 p-4">
        <div className="min-w-0 flex-1">
          <Link
            to={`/applications/${app.slug}`}
            className="block truncate font-heading text-base font-semibold hover:underline underline-offset-4"
          >
            {app.jobName}
          </Link>
          <div className="truncate text-sm text-muted-foreground">
            {app.companyName}
          </div>
        </div>
        {app.categories.length > 0 ? (
          <div className="hidden min-w-0 max-w-56 flex-wrap gap-1 md:flex">
            {app.categories.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground ring-1 ring-foreground/10"
              >
                {cat}
              </span>
            ))}
          </div>
        ) : null}
        <div className="hidden text-xs whitespace-nowrap text-muted-foreground lg:block">
          {formatDate(app.updatedAt)}
        </div>
        <div className="shrink-0">{statusSelect}</div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            to={`/applications/${app.slug}`}
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            View
          </Link>
          {deleteDialog}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link
            to={`/applications/${app.slug}`}
            className="hover:underline underline-offset-4"
          >
            {app.jobName}
          </Link>
        </CardTitle>
        <CardDescription>{app.companyName}</CardDescription>
        <CardAction>{statusSelect}</CardAction>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <a
          href={app.companyWebpage}
          target="_blank"
          rel="noreferrer"
          className="block truncate text-primary underline-offset-4 hover:underline"
        >
          {app.companyWebpage}
        </a>
        <div className="text-muted-foreground">{app.applicationEmail}</div>
        <div className="space-y-1 border-t pt-3">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Contact
          </div>
          <div className="font-medium">{app.contactName}</div>
          <div className="text-muted-foreground">{app.contactPhone}</div>
          <div className="text-muted-foreground">{app.contactEmail}</div>
        </div>
        {app.categories.length > 0 ? (
          <div className="flex flex-wrap gap-2 border-t pt-3">
            {app.categories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-foreground/10"
              >
                {cat}
              </span>
            ))}
          </div>
        ) : null}
        <div className="flex gap-x-4 border-t pt-3 text-xs whitespace-nowrap text-muted-foreground">
          <div>Created {formatDate(app.createdAt)}</div>
          <div>Last updated {formatDate(app.updatedAt)}</div>
        </div>
      </CardContent>
      <CardFooter className="justify-between border-t pt-6">
        <Link
          to={`/applications/${app.slug}`}
          className={buttonVariants({ size: "sm", variant: "outline" })}
        >
          View
        </Link>
        {deleteDialog}
      </CardFooter>
    </Card>
  );
}
