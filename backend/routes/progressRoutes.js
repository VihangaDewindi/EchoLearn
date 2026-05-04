const router = require("express").Router();

const LessonProgress = require("../models/LessonProgress");
const User = require("../models/user");
const Lesson = require("../models/Lesson");
const { verifyToken } = require("../middleware/auth");

// Example dashboard totals
router.get("/", (req, res) => {
  res.json({
    math: 65,
    science: 45,
    english: 90,
  });
});

// Get progress for all lessons of a user (Mocked userId for demo)
router.get("/lessons", async (req, res) => {
  try {
    const progress = await LessonProgress.find(); // In real app, filter by userId
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch lesson progress" });
  }
});

// Submit quiz result — accepts optional Bearer token to identify user
router.post("/quiz-result", async (req, res) => {
  try {
    const { lessonSlug, score, totalQuestions } = req.body;

    // Try to resolve user from Authorization header, then body, then fallback
    let userId = req.body.userId;
    const authHeader = req.headers["authorization"];
    if (!userId && authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const jwt = require("jsonwebtoken");
        const decoded = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET || "fallback_secret_key");
        userId = decoded.id;
      } catch {}
    }

    // Find lesson to get title for badge
    const lesson = await Lesson.findOne({ slug: lessonSlug }).catch(() => null);
    const lessonTitle = lesson ? lesson.title : lessonSlug.replace(/-/g, " ");

    // Fetch the target user (fallback to first student for demo if no user resolved)
    let user = null;
    if (userId) {
      user = await User.findById(userId).catch(() => null);
    }
    if (!user) {
      user = await User.findOne({ role: "student" });
    }

    let xpEarned = 150; // Standard XP for completion
    let badgeEarned = null;

    if (user) {
      user.xp += xpEarned;

      // Determine if a badge is earned (e.g., >= 80% score)
      if (score / totalQuestions >= 0.8) {
        // Extract the last word or major concept for badge name
        const titleWords = lessonTitle.split(" ");
        const subjectConcept = titleWords.length > 1 ? titleWords[titleWords.length - 1] : "Lesson";
        const badgeName = `${subjectConcept} Master`;

        // Check if badge already exists
        const hasBadge = user.badges.some(b => b.name === badgeName);
        if (!hasBadge) {
          badgeEarned = badgeName;
          user.badges.push({ name: badgeName, earnedDate: new Date(), icon: "ribbon" }); // Use a default icon
        }
      }

      await user.save();
    }

    // Update lesson progress to completed
    if (user && lessonSlug) {
      await LessonProgress.findOneAndUpdate(
        { userId: user._id, lessonSlug },
        { progress: 100, status: "Completed" },
        { upsert: true, new: true }
      );
    }

    res.json({
      xpEarned,
      badgeEarned,
      lessonTitle,
      score,
      totalQuestions
    });
  } catch (err) {
    console.error("Quiz Result Error:", err);
    res.status(500).json({ error: "Failed to process quiz result" });
  }
});

module.exports = router;
