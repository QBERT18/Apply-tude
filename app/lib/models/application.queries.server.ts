import { connectDB } from "~/lib/db.server";
import {
  ApplicationModel,
  serializeApplication,
} from "~/lib/models/application.model.server";
import type { SerializedApplication } from "~/lib/models/application.types";
import type {
  ApplicationInput,
  ApplicationStatus,
} from "~/lib/schemas/application.schema";

export async function listApplications(): Promise<SerializedApplication[]> {
  await connectDB();
  const docs = await ApplicationModel.find().sort({ updatedAt: -1 }).exec();
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
