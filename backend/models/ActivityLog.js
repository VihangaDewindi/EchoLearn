const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["lesson_started", "lesson_completed", "quiz_completed", "badge_earned", "login", "streak"],
    required: true,
  },
  title: { type: String, required: true },
  subject: { type: String, default: "" },
  score: { type: Number, default: null },
  details: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.models.ActivityLog || mongoose.model("ActivityLog", activityLogSchema);
