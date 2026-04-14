import bcrypt from "bcryptjs";

import { connectDB } from "~/lib/db.server";
import { UserModel, serializeUser } from "~/lib/models/user.model.server";
import type { SerializedUser } from "~/lib/models/user.types";

export async function createUser(
  name: string,
  email: string,
  password: string
): Promise<SerializedUser> {
  await connectDB();
  const passwordHash = await bcrypt.hash(password, 10);
  const doc = await UserModel.create({ name, email, passwordHash });
  return serializeUser(doc);
}

export async function findUserByEmail(
  email: string
): Promise<SerializedUser | null> {
  await connectDB();
  const doc = await UserModel.findOne({ email: email.toLowerCase() }).exec();
  return doc ? serializeUser(doc) : null;
}

export async function findUserById(
  id: string
): Promise<SerializedUser | null> {
  await connectDB();
  const doc = await UserModel.findById(id).exec();
  return doc ? serializeUser(doc) : null;
}

export async function verifyLogin(
  email: string,
  password: string
): Promise<SerializedUser | null> {
  await connectDB();
  const doc = await UserModel.findOne({ email: email.toLowerCase() }).exec();
  if (!doc) return null;
  const valid = await bcrypt.compare(password, doc.passwordHash);
  return valid ? serializeUser(doc) : null;
}
