const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  subject: { type: String, required: true },
  session: { type: String, default: "Morning Session" },
  gradeLevel: { type: String, default: "Grade 1" },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  image: { type: String, default: "" },
  isArchived: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.models.Class || mongoose.model("Class", classSchema);
