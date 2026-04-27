const mongoose = require("mongoose");

const lessonProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  lessonSlug: {
    type: String,
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    default: "Not Started"
  }
}, { timestamps: true });

// Ensure unique progress per user per lesson
lessonProgressSchema.index({ userId: 1, lessonSlug: 1 }, { unique: true });

module.exports = mongoose.models.LessonProgress || mongoose.model("LessonProgress", lessonProgressSchema);
