import mongoose, { Schema, Document } from "mongoose";
import { UserAttributes } from "@/interfaces/user.types";

export interface IUserModel extends Omit<UserAttributes, "id">, Document { }

const UserSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

UserSchema.index({ email: 1 }, { unique: true });

export default mongoose.model<IUserModel>("User", UserSchema);
