import { connectDB } from "~/lib/db.server";
import {
  ApplicationModel,
  serializeApplication,
} from "~/lib/models/application.model.server";
import type {
  ApplicationStatus,
  ListApplicationsParams,
  SerializedApplication,
} from "~/lib/models/application.types";
import type { ApplicationInput } from "~/lib/schemas/application.schema";

export async function listApplications(
  userId: string,
  params: ListApplicationsParams = {}
): Promise<SerializedApplication[]> {
  await connectDB();

  const filter: Record<string, unknown> = { userId };

  if (params.categories && params.categories.length > 0) {
    filter.categories = { $in: params.categories };
  }

  if (params.statuses && params.statuses.length > 0) {
    filter.status = { $in: params.statuses };
  }

  const sortField = params.sort ?? "updatedAt";
  const sortDir: 1 | -1 = params.direction === "asc" ? 1 : -1;

  const docs = await ApplicationModel.find(filter)
    .sort({ [sortField]: sortDir })
    .collation({ locale: "en", strength: 2 })
    .exec();

  return docs.map(serializeApplication);
}

export async function getApplicationById(
  id: string,
  userId: string
): Promise<SerializedApplication | null> {
  await connectDB();
  const doc = await ApplicationModel.findOne({ _id: id, userId }).exec();
  return doc ? serializeApplication(doc) : null;
}

export async function getApplicationBySlug(
  slug: string,
  userId: string
): Promise<SerializedApplication | null> {
  await connectDB();
  const doc = await ApplicationModel.findOne({ slug, userId }).exec();
  return doc ? serializeApplication(doc) : null;
}

export async function createApplication(
  userId: string,
  data: ApplicationInput & { slug: string }
): Promise<SerializedApplication> {
  await connectDB();
  const doc = await ApplicationModel.create({ ...data, userId });
  return serializeApplication(doc);
}

export async function updateApplication(
  id: string,
  userId: string,
  data: ApplicationInput
): Promise<SerializedApplication | null> {
  await connectDB();
  const doc = await ApplicationModel.findOneAndUpdate(
    { _id: id, userId },
    data,
    { returnDocument: "after" }
  ).exec();
  return doc ? serializeApplication(doc) : null;
}

export async function updateApplicationStatus(
  id: string,
  userId: string,
  status: ApplicationStatus
): Promise<boolean> {
  await connectDB();
  const doc = await ApplicationModel.findOneAndUpdate(
    { _id: id, userId },
    { status }
  ).exec();
  return doc !== null;
}

export async function deleteApplication(
  id: string,
  userId: string
): Promise<void> {
  await connectDB();
  await ApplicationModel.findOneAndDelete({ _id: id, userId }).exec();
}

export async function listAllCategories(userId: string): Promise<string[]> {
  await connectDB();
  const cats = await ApplicationModel.distinct("categories", { userId }).exec();
  return (cats as string[])
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}
