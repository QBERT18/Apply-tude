import { Form, Link, useNavigation } from "react-router";
import { Mail, Phone, User } from "lucide-react";

import { CategoryInput } from "~/components/form/category-input";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "~/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import {
  APPLICATION_STATUSES,
  DEFAULT_APPLICATION_STATUS,
} from "~/lib/constants/application.constants";
import type {
  ApplicationFieldErrors,
  ApplicationInput,
} from "~/lib/schemas/application.schema";
import { cn } from "~/lib/utils";

type ApplicationFormProps = {
  defaultValues?: Partial<ApplicationInput>;
  submitLabel: string;
  errors?: ApplicationFieldErrors;
  cancelHref?: string;
  allCategories?: string[];
};

function toFieldErrors(messages?: string[]) {
  return messages?.map((message) => ({ message }));
}

function stripProtocol(url?: string) {
  if (!url) return "";
  return url.replace(/^https?:\/\//, "");
}

export function ApplicationForm({
  defaultValues,
  submitLabel,
  errors,
  cancelHref = "/",
  allCategories = [],
}: ApplicationFormProps) {
  const navigation = useNavigation();
  const submitting = navigation.state !== "idle";

  return (
    <Form method="post" noValidate={false}>
      <Card>
        <CardHeader>
          <CardTitle>
            {submitLabel === "Create" ? "New application" : "Edit application"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="jobName">Job name</FieldLabel>
              <Input
                id="jobName"
                name="jobName"
                defaultValue={defaultValues?.jobName ?? ""}
                required
                aria-invalid={errors?.jobName?.length ? true : undefined}
              />
              <FieldError errors={toFieldErrors(errors?.jobName)} />
            </Field>

            <Field>
              <FieldLabel htmlFor="companyName">Company name</FieldLabel>
              <Input
                id="companyName"
                name="companyName"
                defaultValue={defaultValues?.companyName ?? ""}
                required
                aria-invalid={errors?.companyName?.length ? true : undefined}
              />
              <FieldError errors={toFieldErrors(errors?.companyName)} />
            </Field>

            <Field>
              <FieldLabel htmlFor="companyWebpage">Company webpage</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>https://</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="companyWebpage"
                  name="companyWebpage"
                  type="text"
                  placeholder="example.com"
                  defaultValue={stripProtocol(defaultValues?.companyWebpage)}
                  required
                  aria-invalid={
                    errors?.companyWebpage?.length ? true : undefined
                  }
                />
              </InputGroup>
              <FieldError errors={toFieldErrors(errors?.companyWebpage)} />
            </Field>

            <Field>
              <FieldLabel htmlFor="applicationEmail">
                Application email
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="applicationEmail"
                  name="applicationEmail"
                  type="email"
                  defaultValue={defaultValues?.applicationEmail ?? ""}
                  required
                  aria-invalid={
                    errors?.applicationEmail?.length ? true : undefined
                  }
                />
                <InputGroupAddon align="inline-end">
                  <Mail />
                </InputGroupAddon>
              </InputGroup>
              <FieldError errors={toFieldErrors(errors?.applicationEmail)} />
            </Field>

            <Field>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <Select
                name="status"
                defaultValue={
                  defaultValues?.status ?? DEFAULT_APPLICATION_STATUS
                }
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  {APPLICATION_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={toFieldErrors(errors?.status)} />
            </Field>
          </div>

          <CategoryInput
            defaultValues={defaultValues?.categories}
            allCategories={allCategories}
          />

          <Separator />

          <div className="space-y-4">
            <div>
              <h3 className="font-heading text-base font-medium">
                Hiring contact
              </h3>
              <p className="text-xs text-muted-foreground">
                Person responsible for this vacancy.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="contactName">Name</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="contactName"
                    name="contactName"
                    defaultValue={defaultValues?.contactName ?? ""}
                    required
                    aria-invalid={
                      errors?.contactName?.length ? true : undefined
                    }
                  />
                  <InputGroupAddon align="inline-end">
                    <User />
                  </InputGroupAddon>
                </InputGroup>
                <FieldError errors={toFieldErrors(errors?.contactName)} />
              </Field>

              <Field>
                <FieldLabel htmlFor="contactPhone">Phone</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="contactPhone"
                    name="contactPhone"
                    type="tel"
                    defaultValue={defaultValues?.contactPhone ?? ""}
                    required
                    aria-invalid={
                      errors?.contactPhone?.length ? true : undefined
                    }
                  />
                  <InputGroupAddon align="inline-end">
                    <Phone />
                  </InputGroupAddon>
                </InputGroup>
                <FieldError errors={toFieldErrors(errors?.contactPhone)} />
              </Field>

              <Field>
                <FieldLabel htmlFor="contactEmail">Email</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    defaultValue={defaultValues?.contactEmail ?? ""}
                    required
                    aria-invalid={
                      errors?.contactEmail?.length ? true : undefined
                    }
                  />
                  <InputGroupAddon align="inline-end">
                    <Mail />
                  </InputGroupAddon>
                </InputGroup>
                <FieldError errors={toFieldErrors(errors?.contactEmail)} />
              </Field>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col-reverse gap-2 border-t pt-6 sm:flex-row sm:justify-end">
          <Link
            to={cancelHref}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full sm:w-auto"
            )}
          >
            Cancel
          </Link>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto"
          >
            {submitting ? "Saving…" : submitLabel}
          </Button>
        </CardFooter>
      </Card>
    </Form>
  );
}
