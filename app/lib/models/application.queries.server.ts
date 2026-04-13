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
// Dashboard aggregation — single $facet query for all chart data
// ---------------------------------------------------------------------------

export type DashboardStatsResult = {
  statusDistribution: { status: string; count: number }[];
  applicationsOverTime: { month: string; count: number }[];
  successFunnel: { stage: string; count: number }[];
  categoryDistribution: { category: string; count: number }[];
  activityHeatmap: { date: string; count: number }[];
};

export async function getDashboardStats(
  userId: string
): Promise<DashboardStatsResult> {
  await connectDB();
  const uid = new mongoose.Types.ObjectId(userId);
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const [result] = await ApplicationModel.aggregate([
    { $match: { userId: uid } },
    {
      $facet: {
        statusDistribution: [
          { $group: { _id: "$status", count: { $sum: 1 } } },
          { $project: { _id: 0, status: "$_id", count: 1 } },
          { $sort: { count: -1 as const } },
        ],
        applicationsOverTime: [
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
              count: { $sum: 1 },
            },
          },
          { $project: { _id: 0, month: "$_id", count: 1 } },
          { $sort: { month: 1 as const } },
        ],
        successFunnel: [
          {
            $match: {
              status: { $in: ["applied", "interviewing", "offer", "accepted"] },
            },
          },
          { $group: { _id: "$status", count: { $sum: 1 } } },
          { $project: { _id: 0, stage: "$_id", count: 1 } },
        ],
        categoryDistribution: [
          { $unwind: "$categories" },
          { $group: { _id: "$categories", count: { $sum: 1 } } },
          { $project: { _id: 0, category: "$_id", count: 1 } },
          { $sort: { count: -1 as const } },
          { $limit: 10 },
        ],
        activityHeatmap: [
          { $match: { createdAt: { $gte: oneYearAgo } } },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              count: { $sum: 1 },
            },
          },
          { $project: { _id: 0, date: "$_id", count: 1 } },
          { $sort: { date: 1 as const } },
        ],
      },
    },
  ]);

  // Ensure funnel always has all 4 stages (including zeros)
  const funnelStatuses = ["applied", "interviewing", "offer", "accepted"];
  const funnelMap = new Map(
    result.successFunnel.map((r: { stage: string; count: number }) => [r.stage, r.count])
  );
  result.successFunnel = funnelStatuses.map((stage) => ({
    stage,
    count: (funnelMap.get(stage) as number) ?? 0,
  }));

  return result as DashboardStatsResult;
}
