import { Link, useSearchParams } from "react-router";
import { Plus } from "lucide-react";

import type { Route } from "./+types/home";
import { ApplicationCard } from "~/components/application-card";
import { ViewToggle } from "~/components/view-toggle";
import { buttonVariants } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { useViewMode } from "~/hooks/use-view-mode";
import {
  deleteApplication,
  listApplications,
  updateApplicationStatus,
} from "~/lib/models/application.queries.server";
import { applicationStatusValues } from "~/lib/constants/application.constants";
import type {
  ApplicationSortField,
  ApplicationStatus,
} from "~/lib/models/application.types";

const SORT_FIELDS: readonly ApplicationSortField[] = [
  "updatedAt",
  "createdAt",
  "jobName",
  "companyName",
  "contactName",
];

function parseSortField(value: string | null): ApplicationSortField | undefined {
  return SORT_FIELDS.includes(value as ApplicationSortField)
    ? (value as ApplicationSortField)
    : undefined;
}

export function meta(_: Route.MetaArgs) {
  return [{ title: "Apply-tude — Your applications" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const sp = url.searchParams;

  const applications = await listApplications({
    categories: sp.getAll("category"),
    statuses: sp.getAll("status") as ApplicationStatus[],
    sort: parseSortField(sp.get("sort")),
    direction: sp.get("dir") === "asc" ? "asc" : "desc",
  });

  return { applications };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "delete") {
    const id = String(formData.get("id") ?? "");
    if (id) {
      await deleteApplication(id);
    }
    return { ok: true };
  }

  if (intent === "update-status") {
    const id = String(formData.get("id") ?? "");
    const status = String(formData.get("status") ?? "");
    if (
      id &&
      (applicationStatusValues as readonly string[]).includes(status)
    ) {
      await updateApplicationStatus(id, status as ApplicationStatus);
      return { ok: true };
    }
    return { ok: false, error: "Invalid status" };
  }

  return { ok: false };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { applications } = loaderData;
  const [searchParams] = useSearchParams();
  const isFiltered = searchParams.size > 0;
  const { view, setView } = useViewMode();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <ViewToggle value={view} onChange={setView} />
        <Link to="/new" className={buttonVariants()}>
          <Plus /> New application
        </Link>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <h2 className="font-heading text-xl font-semibold">
              {isFiltered
                ? "No applications match your filters"
                : "No applications yet"}
            </h2>
            <p className="text-muted-foreground">
              {isFiltered
                ? "Try adjusting or clearing the filters in the sidebar."
                : "Track your first job application to get started."}
            </p>
            {isFiltered ? (
              <Link
                to="/"
                className={buttonVariants({ variant: "outline" })}
              >
                Clear filters
              </Link>
            ) : null}
          </CardContent>
        </Card>
      ) : view === "list" ? (
        <div className="flex flex-col gap-3">
          {applications.map((app) => (
            <ApplicationCard key={app.id} app={app} variant="list" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]">
          {applications.map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}
