import { Form, Link, useNavigation } from "react-router";

import { cn } from "~/lib/utils";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
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
  type ApplicationFieldErrors,
  type ApplicationInput,
} from "~/lib/schemas/application.schema";

type ApplicationFormProps = {
  defaultValues?: Partial<ApplicationInput>;
  submitLabel: string;
  errors?: ApplicationFieldErrors;
  cancelHref?: string;
};

type FieldRowProps = {
  id: keyof ApplicationInput;
  label: string;
  type?: string;
  defaultValue?: string;
  errors?: string[];
};

function FieldRow({
  id,
  label,
  type = "text",
  defaultValue,
  errors,
}: FieldRowProps) {
  const hasError = Boolean(errors?.length);
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        type={type}
        defaultValue={defaultValue ?? ""}
        required
        aria-invalid={hasError || undefined}
        aria-describedby={hasError ? `${id}-error` : undefined}
      />
      {hasError ? (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {errors?.[0]}
        </p>
      ) : null}
    </div>
  );
}

export function ApplicationForm({
  defaultValues,
  submitLabel,
  errors,
  cancelHref = "/",
}: ApplicationFormProps) {
  const navigation = useNavigation();
  const submitting = navigation.state !== "idle";

  return (
    <Form method="post" noValidate={false}>
      <Card>
        <CardHeader>
          <CardTitle>{submitLabel === "Create" ? "New application" : "Edit application"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldRow
              id="jobName"
              label="Job name"
              defaultValue={defaultValues?.jobName}
              errors={errors?.jobName}
            />
            <FieldRow
              id="companyName"
              label="Company name"
              defaultValue={defaultValues?.companyName}
              errors={errors?.companyName}
            />
            <FieldRow
              id="companyWebpage"
              label="Company webpage"
              type="url"
              defaultValue={defaultValues?.companyWebpage}
              errors={errors?.companyWebpage}
            />
            <FieldRow
              id="applicationEmail"
              label="Application email"
              type="email"
              defaultValue={defaultValues?.applicationEmail}
              errors={errors?.applicationEmail}
            />
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
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
              {errors?.status?.[0] ? (
                <p className="text-xs text-destructive">{errors.status[0]}</p>
              ) : null}
            </div>
          </div>

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
              <FieldRow
                id="contactName"
                label="Name"
                defaultValue={defaultValues?.contactName}
                errors={errors?.contactName}
              />
              <FieldRow
                id="contactPhone"
                label="Phone"
                type="tel"
                defaultValue={defaultValues?.contactPhone}
                errors={errors?.contactPhone}
              />
              <FieldRow
                id="contactEmail"
                label="Email"
                type="email"
                defaultValue={defaultValues?.contactEmail}
                errors={errors?.contactEmail}
              />
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
