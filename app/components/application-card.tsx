import { useState } from "react";
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
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { SerializedApplication } from "~/lib/models/application.types";

export function ApplicationCard({ app }: { app: SerializedApplication }) {
  const fetcher = useFetcher();
  const [open, setOpen] = useState(false);
  const isDeleting = fetcher.state !== "idle";

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
                  fetcher.submit(
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
