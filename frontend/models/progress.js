import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema({
  userId: String,
  math: Number,
  science: Number,
  english: Number,
});

export default mongoose.models.Progress || mongoose.model("Progress", ProgressSchema);
