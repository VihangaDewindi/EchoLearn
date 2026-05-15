const mongoose = require("mongoose");

const lessonBlockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["paragraph", "highlight", "cards", "quote", "visualizer"],
      required: true,
    },
    text: String,
    items: [
      {
        title: String,
        text: String,
        icon: String,
      },
    ],
  },
  { _id: false }
);

const lessonSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subject: { type: String, required: true },
    grade: { type: String, required: true },
    unit: { type: String, required: true },
    duration: { type: String, default: "12 min read" },
    level: { type: String, default: "Beginner" },
    progress: { type: Number, default: 45 },
    description: { type: String },
    image: { type: String, default: "" },
    quizRoute: { type: String, default: "" },
    blocks: [lessonBlockSchema],
    quiz: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Lesson || mongoose.model("Lesson", lessonSchema);