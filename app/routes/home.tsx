import { Link } from "react-router";
import { Plus } from "lucide-react";

import type { Route } from "./+types/home";
import { ApplicationCard } from "~/components/application-card";
import { buttonVariants } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  deleteApplication,
  listApplications,
  updateApplicationStatus,
} from "~/lib/models/application.queries.server";
import { applicationStatusValues } from "~/lib/constants/application.constants";
import type { ApplicationStatus } from "~/lib/models/application.types";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Apply-tude — Your applications" }];
}

export async function loader(_: Route.LoaderArgs) {
  return { applications: await listApplications() };
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

  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <h2 className="font-heading text-xl font-semibold">
            No applications yet
          </h2>
          <p className="text-muted-foreground">
            Track your first job application to get started.
          </p>
          <Link to="/new" className={buttonVariants()}>
            <Plus /> New application
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]">
      {applications.map((app) => (
        <ApplicationCard key={app.id} app={app} />
      ))}
    </div>
  );
}
