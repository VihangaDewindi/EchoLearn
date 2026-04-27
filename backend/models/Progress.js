import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  math: Number,
  science: Number,
  english: Number,
});

export default mongoose.models.Progress ||
  mongoose.model("Progress", progressSchema);
