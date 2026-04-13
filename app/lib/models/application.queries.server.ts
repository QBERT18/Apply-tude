import mongoose from "mongoose";

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

// ---------------------------------------------------------------------------
// Dashboard aggregation queries
// ---------------------------------------------------------------------------

export async function getStatusDistribution(
  userId: string
): Promise<{ status: string; count: number }[]> {
  await connectDB();
  return ApplicationModel.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
    { $project: { _id: 0, status: "$_id", count: 1 } },
    { $sort: { count: -1 } },
  ]);
}

export async function getApplicationsOverTime(
  userId: string
): Promise<{ month: string; count: number }[]> {
  await connectDB();
  return ApplicationModel.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $project: { _id: 0, month: "$_id", count: 1 } },
    { $sort: { month: 1 } },
  ]);
}

export async function getSuccessFunnel(
  userId: string
): Promise<{ stage: string; count: number }[]> {
  await connectDB();
  const funnelStatuses = ["applied", "interviewing", "offer", "accepted"];
  const results = await ApplicationModel.aggregate<{
    stage: string;
    count: number;
  }>([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        status: { $in: funnelStatuses },
      },
    },
    { $group: { _id: "$status", count: { $sum: 1 } } },
    { $project: { _id: 0, stage: "$_id", count: 1 } },
  ]);

  const countMap = new Map(results.map((r) => [r.stage, r.count]));
  return funnelStatuses.map((stage) => ({
    stage,
    count: countMap.get(stage) ?? 0,
  }));
}

export async function getCategoryDistribution(
  userId: string
): Promise<{ category: string; count: number }[]> {
  await connectDB();
  return ApplicationModel.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $unwind: "$categories" },
    { $group: { _id: "$categories", count: { $sum: 1 } } },
    { $project: { _id: 0, category: "$_id", count: 1 } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);
}

export async function getActivityHeatmap(
  userId: string
): Promise<{ date: string; count: number }[]> {
  await connectDB();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  return ApplicationModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: oneYearAgo },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $project: { _id: 0, date: "$_id", count: 1 } },
    { $sort: { date: 1 } },
  ]);
}
