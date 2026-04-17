const express = require("express");
const router = express.Router();
const Course = require("../models/course");

const mockData = [
  {
    title: "Particles of Motion",
    description: "Explore motion, energy, and forces.",
    rating: 4.8,
    progress: 65,
    tag: "SCIENCE",
    image: "/science.jpg",
    accessibilityRating: 98
  },
  {
    title: "Hardware & Software Basics",
    description: "Understand how computers work.",
    rating: 4.9,
    progress: 20,
    tag: "IT",
    image: "/i.png",
    accessibilityRating: 95
  },
  {
    title: "The Story Tree",
    description: "Learn grammar and storytelling.",
    rating: 5.0,
    progress: 85,
    tag: "ENGLISH",
    image: "/english.jpg",
    accessibilityRating: 99
  },
  {
    title: "Basic Mathematics",
    description: "Master core math skills.",
    rating: 4.6,
    progress: 40,
    tag: "MATH",
    image: "/maths.png",
    accessibilityRating: 90
  },
  {
    title: "Creative Arts",
    description: "Explore creativity through drawing.",
    rating: 4.7,
    progress: 10,
    tag: "ART",
    image: "/art.jpg",
    accessibilityRating: 88
  },
  {
    title: "World History",
    description: "Learn about historical events.",
    rating: 4.5,
    progress: 0,
    tag: "HISTORY",
    image: "/history.jpg",
    accessibilityRating: 85
  }
];

// ✅ GET ALL / FILTER
router.get("/", async (req, res) => {
  try {
    const { tag } = req.query;

    let filter = {};

    if (tag) {
      filter.tag = tag.toUpperCase();
    }

    let courses = await Course.find(filter);

    // Auto-seed ONLY if empty
    if (courses.length === 0) {
      await Course.insertMany(mockData);
      courses = await Course.find(filter);
    }

    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET COURSES BY SUBJECT (DYNAMIC ROUTE)
router.get("/subject/:tag", async (req, res) => {
  try {
    const tag = req.params.tag.toUpperCase();

    const courses = await Course.find({ tag });

    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ GET SINGLE COURSE (OPTIONAL - DETAIL PAGE)
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

