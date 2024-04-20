import { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  email_verified: boolean;
  last_login: Date | null;
  status: "active" | "inactive" | "suspended";
  role: "user" | "admin" | "moderator";
  password_reset_token: string | null;
  password_reset_expires: Date | null;
  profile_picture_url: string | null;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true, minlength: 8 },
    email_verified: { type: Boolean, default: false },
    last_login: { type: Date, default: null },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    password_reset_token: { type: String, default: null },
    password_reset_expires: { type: Date, default: null },
    profile_picture_url: { type: String, default: null },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Adding a compound index on email and status for efficient querying
userSchema.index({ email: 1, status: 1 });

const UserModel = model<IUser>("User", userSchema);

export default UserModel;
