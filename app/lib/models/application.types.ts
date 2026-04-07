import type { ApplicationStatus } from "~/lib/schemas/application.schema";

export type SerializedApplication = {
  id: string;
  slug: string;
  jobName: string;
  companyName: string;
  companyWebpage: string;
  applicationEmail: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
};
