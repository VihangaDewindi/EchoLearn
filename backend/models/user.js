const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["student", "teacher", "parent", "admin"],
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  badges: [{
    name: { type: String },
    earnedDate: { type: Date, default: Date.now },
    icon: { type: String }
  }],
  progress: {
    math: { type: Number, default: 0 },
    science: { type: Number, default: 0 },
    english: { type: Number, default: 0 }
  },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
