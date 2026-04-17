const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  rating: Number,
  progress: {
    type: Number,
    default: 0
  },
  tag: String,
  image: String,
  accessibilityRating: Number
});

module.exports = mongoose.model("Course", courseSchema);
