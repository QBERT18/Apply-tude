import { z } from "zod";

export const applicationSchema = z.object({
  jobName: z.string().min(1, "Job name is required"),
  companyName: z.string().min(1, "Company name is required"),
  companyWebpage: z.string().url("Must be a valid URL"),
  applicationEmail: z.string().email("Must be a valid email"),
  contactName: z.string().min(1, "Contact name is required"),
  contactPhone: z.string().min(1, "Contact phone is required"),
  contactEmail: z.string().email("Must be a valid email"),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

export type ApplicationFieldErrors = Partial<
  Record<keyof ApplicationInput, string[]>
>;
