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

export type ApplicationSortField =
  | "updatedAt"
  | "createdAt"
  | "jobName"
  | "companyName"
  | "contactName";

export type ApplicationSortDirection = "asc" | "desc";

export type ListApplicationsParams = {
  from?: string;
  to?: string;
  categories?: string[];
  statuses?: ApplicationStatus[];
  sort?: ApplicationSortField;
  direction?: ApplicationSortDirection;
};
