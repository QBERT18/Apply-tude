import { z } from "zod";

import { applicationStatusValues } from "~/lib/constants/application.constants";

export const applicationSchema = z.object({
  jobName: z.string().min(1, "Job name is required"),
  companyName: z.string().min(1, "Company name is required"),
  companyWebpage: z.url("Must be a valid URL"),
  applicationEmail: z.email("Must be a valid email"),
  contactName: z.string().min(1, "Contact name is required"),
  contactPhone: z.string().min(1, "Contact phone is required"),
  contactEmail: z.email("Must be a valid email"),
  status: z.enum(applicationStatusValues),
  categories: z
    .array(z.string())
    .default([])
    .transform((arr) =>
      Array.from(new Set(arr.map((s) => s.trim()).filter(Boolean)))
    ),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

export type ApplicationFieldErrors = Partial<
  Record<keyof ApplicationInput, string[]>
>;
