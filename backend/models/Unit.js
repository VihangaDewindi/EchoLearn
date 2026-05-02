const mongoose = require("mongoose");

const lessonItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["Video", "Reading", "Activity", "Quiz"], default: "Reading" },
  duration: { type: String, default: "10 min" },
  isCompleted: { type: Boolean, default: false },
}, { _id: false });

const unitSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: String, required: true },
  title: { type: String, required: true },
  order: { type: Number, default: 0 },
  lessons: [lessonItemSchema],
}, { timestamps: true });

module.exports = mongoose.models.Unit || mongoose.model("Unit", unitSchema);
