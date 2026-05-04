require("dotenv").config();
const mongoose = require("mongoose");
const Lesson = require("./models/Lesson");

const lessons = [
  {
    slug: "intro-to-fractions",
    title: "Introduction to Fractions",
    subject: "MATHEMATICS",
    grade: "Grade 3",
    unit: "Unit 3",
    description: "Master the basics of numerators, denominators, and equivalent fractions."
  },
  {
    slug: "algebra-basics",
    title: "Algebraic Expressions",
    subject: "MATHEMATICS",
    grade: "Grade 6",
    unit: "Unit 1",
    description: "Learn how to solve for x and understand variable relationships."
  },
  {
    slug: "geometry-vol-1",
    title: "Geometry: Volume & Surface Area",
    subject: "MATHEMATICS",
    grade: "Grade 10",
    unit: "Unit 5",
    description: "Advanced calculations for 3D shapes."
  },
  {
    slug: "photosynthesis-basics",
    title: "Photosynthesis Basics",
    subject: "SCIENCE",
    grade: "Grade 3",
    unit: "Unit 4",
    description: "How plants turn sunlight into energy."
  },
  {
    slug: "human-anatomy",
    title: "Human Anatomy: The Heart",
    subject: "SCIENCE",
    grade: "Grade 10",
    unit: "Unit 2",
    description: "Detailed study of the cardiovascular system."
  }
];

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/EchoLearn")
  .then(async () => {
    console.log("Connected for seeding...");
    await Lesson.deleteMany({});
    await Lesson.insertMany(lessons);
    console.log("Seeding complete!");
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
