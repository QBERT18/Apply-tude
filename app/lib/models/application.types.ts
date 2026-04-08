export type { ApplicationStatus } from "~/lib/constants/application.constants";

import type { ApplicationStatus } from "~/lib/constants/application.constants";

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
  categories: string[];
  createdAt: string;
  updatedAt: string;
};
