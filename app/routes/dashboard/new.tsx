import { data, redirect, useActionData } from "react-router";
import { flattenError } from "zod";

import type { Route } from "./+types/new";
import { commitSession, getSession, requireUserId } from "~/lib/auth.server";
import { ApplicationForm } from "~/components/application-form";
import {
  createApplication,
  listAllCategories,
} from "~/lib/models/application.queries.server";
import {
  applicationSchema,
  type ApplicationInput,
} from "~/lib/schemas/application.schema";
import { generateApplicationSlug } from "~/lib/utils/slug";

export function meta(_: Route.MetaArgs) {
  return [{ title: "New application — Apply-tude" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await requireUserId(request);
  const session = await getSession(request);
  const flashData = session.get("generatedApplication");
  const generatedDefaults = flashData
    ? (JSON.parse(flashData as string) as Partial<ApplicationInput>)
    : null;

  return data(
    {
      allCategories: await listAllCategories(userId),
      generatedDefaults,
    },
    { headers: { "Set-Cookie": await commitSession(session) } }
  );
}

export async function action({ request }: Route.ActionArgs) {
  const userId = await requireUserId(request);
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
  const slug = generateApplicationSlug(
    parsed.data.jobName,
    parsed.data.companyName
  );
  await createApplication(userId, { ...parsed.data, slug });
  return redirect(`/dashboard/applications/${slug}`);
}

export default function NewApplication({ loaderData }: Route.ComponentProps) {
  const actionData = useActionData<typeof action>();
  return (
    <ApplicationForm
      submitLabel="Create"
      cancelHref="/dashboard/applications"
      errors={actionData?.errors}
      defaultValues={actionData?.values ?? loaderData.generatedDefaults ?? undefined}
      allCategories={loaderData.allCategories}
    />
  );
}
