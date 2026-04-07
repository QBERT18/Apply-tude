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
import { cn } from "~/lib/utils";
import type { SerializedApplication } from "~/lib/models/application.types";
import {
  APPLICATION_STATUSES,
  STATUS_BADGE_CLASSES,
  type ApplicationStatus,
} from "~/lib/schemas/application.schema";

export function ApplicationCard({ app }: { app: SerializedApplication }) {
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
        <CardAction>
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
        </CardAction>
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
      </CardContent>
      <CardFooter className="justify-between border-t pt-6">
        <Link
          to={`/edit/${app.id}`}
          className={buttonVariants({ size: "sm", variant: "outline" })}
        >
          Edit
        </Link>
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
                This will permanently remove "{app.jobName}" at{" "}
                {app.companyName}.
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
      </CardFooter>
    </Card>
  );
}
