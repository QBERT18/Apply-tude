import { z } from "zod";

export const applicationGenerateSchema = z.object({
  jobName: z.string().optional().default("Software Engineer"),
  companyName: z.string().optional().default("Acme Corp"),
  companyWebpage: z.string().optional().default("https://example.com"),
  applicationEmail: z.string().optional().default("careers@example.com"),
  contactName: z.string().optional().default("Jane Doe"),
  contactPhone: z.string().optional().default("+1 555-0100"),
  contactEmail: z.string().optional().default("hr@example.com"),
  categories: z.array(z.string()).optional().default([]),
});

export type GeneratedApplication = z.infer<typeof applicationGenerateSchema>;
