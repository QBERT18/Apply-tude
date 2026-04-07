import mongoose, {
  Schema,
  type Model,
  type HydratedDocument,
} from "mongoose";

import type { SerializedApplication } from "./application.types";
import {
  applicationStatusValues,
  DEFAULT_APPLICATION_STATUS,
  type ApplicationStatus,
} from "~/lib/schemas/application.schema";

export interface IApplication {
  slug: string;
  jobName: string;
  companyName: string;
  companyWebpage: string;
  applicationEmail: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type IApplicationDocument = HydratedDocument<IApplication>;

const ApplicationSchema = new Schema<IApplication>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      immutable: true,
    },
    jobName: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    companyWebpage: { type: String, required: true, trim: true },
    applicationEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    contactName: { type: String, required: true, trim: true },
    contactPhone: { type: String, required: true, trim: true },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      required: true,
      enum: applicationStatusValues,
      default: DEFAULT_APPLICATION_STATUS,
    },
  },
  { timestamps: true }
);

export const ApplicationModel: Model<IApplication> =
  (mongoose.models.Application as Model<IApplication>) ||
  mongoose.model<IApplication>("Application", ApplicationSchema);

export function serializeApplication(
  doc: IApplicationDocument
): SerializedApplication {
  return {
    id: String(doc._id),
    slug: doc.slug,
    jobName: doc.jobName,
    companyName: doc.companyName,
    companyWebpage: doc.companyWebpage,
    applicationEmail: doc.applicationEmail,
    contactName: doc.contactName,
    contactPhone: doc.contactPhone,
    contactEmail: doc.contactEmail,
    status: doc.status,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}
