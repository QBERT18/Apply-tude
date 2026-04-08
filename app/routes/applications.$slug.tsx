import { Link } from "react-router";
import { ArrowLeft, Mail, Phone, User } from "lucide-react";

import type { Route } from "./+types/applications.$slug";
import { buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { getApplicationBySlug } from "~/lib/models/application.queries.server";
import {
  getStatusLabel,
  STATUS_BADGE_CLASSES,
} from "~/lib/schemas/application.schema";
import { cn } from "~/lib/utils";
import { formatDate } from "~/lib/utils/date";

export function meta({ data: loaderData }: Route.MetaArgs) {
  const title = loaderData?.application
    ? `${loaderData.application.jobName} — Apply-tude`
    : "Application — Apply-tude";
  return [{ title }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const application = await getApplicationBySlug(params.slug);
  if (!application)
    throw new Response("Application not found", { status: 404 });
  return { application };
}

export default function ApplicationDetail({
  loaderData,
}: Route.ComponentProps) {
  const { application } = loaderData;
  const created = formatDate(application.createdAt);
  const updated = formatDate(application.updatedAt);

  return (
    <div className="space-y-4">
      <Link
        to="/"
        className={buttonVariants({ variant: "ghost", size: "sm" })}
      >
        <ArrowLeft /> Back to applications
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">
            {application.jobName}
          </CardTitle>
          <CardDescription className="text-base">
            {application.companyName}
          </CardDescription>
          <CardAction>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                STATUS_BADGE_CLASSES[application.status]
              )}
            >
              {getStatusLabel(application.status)}
            </span>
          </CardAction>
        </CardHeader>

        <CardContent className="space-y-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Company webpage
              </dt>
              <dd>
                <a
                  href={application.companyWebpage}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all text-primary underline-offset-4 hover:underline"
                >
                  {application.companyWebpage}
                </a>
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Application email
              </dt>
              <dd>
                <a
                  href={`mailto:${application.applicationEmail}`}
                  className="break-all text-primary underline-offset-4 hover:underline"
                >
                  {application.applicationEmail}
                </a>
              </dd>
            </div>
          </dl>

          <Separator />

          <div className="space-y-3">
            <h3 className="font-heading text-base font-medium">
              Hiring contact
            </h3>
            <dl className="grid gap-3 sm:grid-cols-3">
              <div className="flex items-start gap-2">
                <User className="mt-0.5 text-muted-foreground" />
                <div className="min-w-0">
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                    Name
                  </dt>
                  <dd className="wrap-break-word">{application.contactName}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="mt-0.5 text-muted-foreground" />
                <div className="min-w-0">
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                    Phone
                  </dt>
                  <dd>
                    <a
                      href={`tel:${application.contactPhone}`}
                      className="break-all text-primary underline-offset-4 hover:underline"
                    >
                      {application.contactPhone}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="mt-0.5 text-muted-foreground" />
                <div className="min-w-0">
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                    Email
                  </dt>
                  <dd>
                    <a
                      href={`mailto:${application.contactEmail}`}
                      className="break-all text-primary underline-offset-4 hover:underline"
                    >
                      {application.contactEmail}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
          </div>

          <Separator />

          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
            <div>Created {created}</div>
            <div>Last updated {updated}</div>
          </div>
        </CardContent>

        <CardFooter className="flex-col-reverse gap-2 border-t pt-6 sm:flex-row sm:justify-end">
          <Link
            to="/"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full sm:w-auto"
            )}
          >
            Back
          </Link>
          <Link
            to={`/edit/${application.id}`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full sm:w-auto"
            )}
          >
            Edit
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
