const mongoose = require("mongoose");

const parentStudentLinkSchema = new mongoose.Schema({
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  relationship: { type: String, default: "Parent" },
}, { timestamps: true });

parentStudentLinkSchema.index({ parentId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.models.ParentStudentLink || mongoose.model("ParentStudentLink", parentStudentLinkSchema);
