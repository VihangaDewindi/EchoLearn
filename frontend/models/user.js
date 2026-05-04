import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["student", "teacher", "parent"],
      default: "student",
    },
    fullName: {
      type: String,
    },
    name: {
      type: String,
      default: "Alex",
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
    },
    level: {
      type: Number,
      default: 9,
    },
    xp: {
      type: Number,
      default: 2450,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
