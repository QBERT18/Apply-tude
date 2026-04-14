import { Form, Link, redirect, useActionData } from "react-router";
import { flattenError } from "zod";

import type { Route } from "./+types/signup";
import { createUserSession, getUserId } from "~/lib/auth.server";
import {
  createUser,
  findUserByEmail,
} from "~/lib/models/user.queries.server";
import { signupSchema } from "~/lib/schemas/auth.schema";
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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Sign up — Apply-tude" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) throw redirect("/dashboard");
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const raw = Object.fromEntries(formData);
  const parsed = signupSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      errors: flattenError(parsed.error).fieldErrors as AuthFieldErrors,
    };
  }

  const existing = await findUserByEmail(parsed.data.email);
  if (existing) {
    return {
      errors: {
        email: ["An account with this email already exists"],
      } as AuthFieldErrors,
    };
  }

  const user = await createUser(
    parsed.data.name,
    parsed.data.email,
    parsed.data.password
  );

  return createUserSession(user.id, "/dashboard");
}

export default function Signup() {
  const actionData = useActionData<typeof action>();
  const errors = actionData?.errors;

  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-background px-4">
      <ThemeToggle className="absolute top-4 right-4" />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Signup Form</CardTitle>
          <CardDescription>
            User registration form with email and password
          </CardDescription>
        </CardHeader>
        <Form method="post" noValidate>
          <CardContent className="space-y-6">
            <Field>
              <FieldLabel htmlFor="name">
                Full Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                required
                aria-invalid={errors?.name?.length ? true : undefined}
              />
              <FieldError
                errors={errors?.name?.map((e) => ({ message: e })) ?? []}
              />
            </Field>

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
              <FieldDescription>
                Must be at least 8 characters
              </FieldDescription>
              <FieldError
                errors={errors?.password?.map((e) => ({ message: e })) ?? []}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                aria-invalid={
                  errors?.confirmPassword?.length ? true : undefined
                }
              />
              <FieldError
                errors={
                  errors?.confirmPassword?.map((e) => ({ message: e })) ?? []
                }
              />
            </Field>

            <div className="flex items-center gap-2">
              <Checkbox id="terms" name="terms" />
              <label
                htmlFor="terms"
                className="text-sm text-muted-foreground"
              >
                I agree to the terms and conditions
              </label>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-4 pt-6">
            <Button type="submit" className="w-full">
              Submit
            </Button>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
}
