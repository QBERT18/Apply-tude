import { Form, Link, redirect, useActionData } from "react-router";
import { flattenError } from "zod";

import type { Route } from "./+types/login";
import { createUserSession, getUserId } from "~/lib/auth.server";
import { verifyLogin } from "~/lib/models/user.queries.server";
import { loginSchema } from "~/lib/schemas/auth.schema";
import type { AuthFieldErrors } from "~/lib/schemas/auth.schema";
import { ThemeToggle } from "~/components/theme-toggle";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Log in — Apply-tude" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) throw redirect("/dashboard");
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const raw = Object.fromEntries(formData);
  const parsed = loginSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      errors: flattenError(parsed.error).fieldErrors as AuthFieldErrors,
    };
  }

  const user = await verifyLogin(parsed.data.email, parsed.data.password);
  if (!user) {
    return {
      errors: { form: ["Invalid email or password"] } as AuthFieldErrors,
    };
  }

  return createUserSession(user.id, "/dashboard");
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const errors = actionData?.errors;

  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-background px-4">
      <ThemeToggle className="absolute top-4 right-4" />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Login Form</CardTitle>
          <CardDescription>
            Simple email and password login form
          </CardDescription>
        </CardHeader>
        <Form method="post" noValidate>
          <CardContent className="space-y-6">
            {errors?.form ? (
              <p className="text-sm text-destructive">{errors.form[0]}</p>
            ) : null}

            <Field>
              <FieldLabel htmlFor="email">
                Email Address <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                aria-invalid={errors?.email?.length ? true : undefined}
              />
              <FieldError
                errors={errors?.email?.map((e) => ({ message: e })) ?? []}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">
                Password <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                aria-invalid={errors?.password?.length ? true : undefined}
              />
              <FieldError
                errors={errors?.password?.map((e) => ({ message: e })) ?? []}
              />
            </Field>

            <div className="flex items-center gap-2">
              <Checkbox id="remember" name="remember" />
              <label
                htmlFor="remember"
                className="text-sm text-muted-foreground"
              >
                Remember me
              </label>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-4 pt-6">
            <Button type="submit" className="w-full">
              Submit
            </Button>
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
}
