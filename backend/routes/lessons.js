const router = require("express").Router();
const Lesson = require("../models/Lesson");

// get all lessons (with optional filtering)
router.get("/", async (req, res) => {
  try {
    const { subject, grade } = req.query;
    let query = {};
    
    // Case-insensitive subject matching
    if (subject) {
      query.subject = { $regex: new RegExp(`^${subject.trim()}$`, "i") };
    }

    // Handle "Grade 1" vs "1"
    if (grade) {
      const numericGrade = grade.replace("Grade", "").trim();
      query.grade = { $in: [grade.trim(), numericGrade] };
    }

    console.log("Lessons query normalized:", query);
    const lessons = await Lesson.find(query).sort({ createdAt: -1 });
    res.json(lessons);
  } catch (err) {
    console.error("Get lessons error:", err);
    res.status(500).json({ error: "Failed to fetch lessons" });
  }
});

// get single lesson by slug
router.get("/:slug", async (req, res) => {
  try {
    const lesson = await Lesson.findOne({ slug: req.params.slug });

    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    res.json(lesson);
  } catch (err) {
    console.error("Get single lesson error:", err);
    res.status(500).json({ error: "Failed to fetch lesson" });
  }
});

// create lesson
router.post("/", async (req, res) => {
  try {
    const lesson = await Lesson.create(req.body);
    res.status(201).json(lesson);
  } catch (err) {
    console.error("Create lesson error:", err);
    res.status(500).json({ error: "Failed to create lesson" });
  }
});

// create many lessons
router.post("/bulk", async (req, res) => {
  try {
    const lessons = await Lesson.insertMany(req.body);
    res.status(201).json({
      message: "Lessons inserted successfully",
      count: lessons.length,
      lessons
    });
  } catch (err) {
    console.error("Bulk create lessons error:", err);
    res.status(500).json({ error: "Failed to create lessons" });
  }
});

// update lesson by slug
router.put("/:slug", async (req, res) => {
  try {
    const lesson = await Lesson.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    );
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });
    res.json(lesson);
  } catch (err) {
    console.error("Update lesson error:", err);
    res.status(500).json({ error: "Failed to update lesson" });
  }
});

module.exports = router;