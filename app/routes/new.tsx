import { redirect, useActionData } from "react-router";
import { flattenError } from "zod";

import type { Route } from "./+types/new";
import { ApplicationForm } from "~/components/application-form";
import { connectDB } from "~/lib/db.server";
import { ApplicationModel } from "~/lib/models/application.model.server";
import {
  applicationSchema,
  type ApplicationInput,
} from "~/lib/schemas/application.schema";
import { generateApplicationSlug } from "~/lib/utils/slug";

export function meta(_: Route.MetaArgs) {
  return [{ title: "New application — Apply-tude" }];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const raw = Object.fromEntries(formData);
  const parsed = applicationSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      errors: flattenError(parsed.error).fieldErrors,
      values: raw as Partial<ApplicationInput>,
    };
  }
  await connectDB();
  const slug = generateApplicationSlug(
    parsed.data.jobName,
    parsed.data.companyName
  );
  await ApplicationModel.create({ ...parsed.data, slug });
  return redirect(`/applications/${slug}`);
}

export default function NewApplication() {
  const actionData = useActionData<typeof action>();
  return (
    <ApplicationForm
      submitLabel="Create"
      errors={actionData?.errors}
      defaultValues={actionData?.values}
    />
  );
}
