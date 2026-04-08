import { redirect, useActionData } from "react-router";
import { flattenError } from "zod";

import type { Route } from "./+types/edit.$id";
import { ApplicationForm } from "~/components/application-form";
import {
  getApplicationById,
  listAllCategories,
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
  const [application, allCategories] = await Promise.all([
    getApplicationById(params.id),
    listAllCategories(),
  ]);
  if (!application)
    throw new Response("Application not found", { status: 404 });
  return { application, allCategories };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const webpage = String(formData.get("companyWebpage") ?? "").trim();
  const raw = {
    ...Object.fromEntries(formData),
    companyWebpage:
      webpage && !/^https?:\/\//i.test(webpage) ? `https://${webpage}` : webpage,
    categories: formData.getAll("categories") as string[],
  };
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
  const { application, allCategories } = loaderData;
  return (
    <ApplicationForm
      submitLabel="Save changes"
      defaultValues={actionData?.values ?? application}
      errors={actionData?.errors}
      cancelHref={`/applications/${application.slug}`}
      allCategories={allCategories}
    />
  );
}
