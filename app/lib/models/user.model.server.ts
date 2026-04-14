import mongoose, {
  Schema,
  type Model,
  type HydratedDocument,
} from "mongoose";

import type { SerializedUser } from "./user.types";

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IUserDocument = HydratedDocument<IUser>;

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export const UserModel: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export function serializeUser(doc: IUserDocument): SerializedUser {
  return {
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
  };
}
