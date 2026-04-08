import { redirect, useActionData } from "react-router";
import { flattenError } from "zod";

import type { Route } from "./+types/edit.$id";
import { ApplicationForm } from "~/components/application-form";
import {
  getApplicationById,
  updateApplication,
} from "~/lib/models/application.queries.server";
import {
  applicationSchema,
  type ApplicationInput,
} from "~/lib/schemas/application.schema";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Edit application — Apply-tude" }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const application = await getApplicationById(params.id);
  if (!application)
    throw new Response("Application not found", { status: 404 });
  return { application };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const raw = Object.fromEntries(formData);
  const parsed = applicationSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      errors: flattenError(parsed.error).fieldErrors,
      values: raw as Partial<ApplicationInput>,
    };
  }
  const updated = await updateApplication(params.id, parsed.data);
  if (!updated) throw new Response("Application not found", { status: 404 });
  return redirect(`/applications/${updated.slug}`);
}

export default function EditApplication({ loaderData }: Route.ComponentProps) {
  const actionData = useActionData<typeof action>();
  const { application } = loaderData;
  return (
    <ApplicationForm
      submitLabel="Save changes"
      defaultValues={actionData?.values ?? application}
      errors={actionData?.errors}
      cancelHref={`/applications/${application.slug}`}
    />
  );
}
