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

function parseDayBoundary(value: string, end: boolean): Date | null {
  // Parse YYYY-MM-DD as UTC midnight; for "end" use the last ms of that day.
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, y, m, d] = match;
  return end
    ? new Date(Date.UTC(+y, +m - 1, +d, 23, 59, 59, 999))
    : new Date(Date.UTC(+y, +m - 1, +d, 0, 0, 0, 0));
}

export async function listApplications(
  params: ListApplicationsParams = {}
): Promise<SerializedApplication[]> {
  await connectDB();

  const filter: Record<string, unknown> = {};

  if (params.from || params.to) {
    const from = params.from ? parseDayBoundary(params.from, false) : null;
    const to = params.to
      ? parseDayBoundary(params.to, true)
      : params.from
        ? parseDayBoundary(params.from, true)
        : null;
    const range: Record<string, Date> = {};
    if (from) range.$gte = from;
    if (to) range.$lte = to;
    if (Object.keys(range).length > 0) {
      filter.createdAt = range;
    }
  }

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
): Promise<SerializedApplication | null> {
  await connectDB();
  const doc = await ApplicationModel.findById(id).exec();
  return doc ? serializeApplication(doc) : null;
}

export async function getApplicationBySlug(
  slug: string,
): Promise<SerializedApplication | null> {
  await connectDB();
  const doc = await ApplicationModel.findOne({ slug }).exec();
  return doc ? serializeApplication(doc) : null;
}

export async function createApplication(
  data: ApplicationInput & { slug: string },
): Promise<SerializedApplication> {
  await connectDB();
  const doc = await ApplicationModel.create(data);
  return serializeApplication(doc);
}

export async function updateApplication(
  id: string,
  data: ApplicationInput,
): Promise<SerializedApplication | null> {
  await connectDB();
  const doc = await ApplicationModel.findByIdAndUpdate(id, data, {
    returnDocument: "after",
  }).exec();
  return doc ? serializeApplication(doc) : null;
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
): Promise<boolean> {
  await connectDB();
  const doc = await ApplicationModel.findByIdAndUpdate(id, { status }).exec();
  return doc !== null;
}

export async function deleteApplication(id: string): Promise<void> {
  await connectDB();
  await ApplicationModel.findByIdAndDelete(id).exec();
}

export async function listAllCategories(): Promise<string[]> {
  await connectDB();
  const cats = await ApplicationModel.distinct("categories").exec();
  return (cats as string[])
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}
