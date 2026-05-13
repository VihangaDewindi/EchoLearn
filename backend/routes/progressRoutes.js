const router = require("express").Router();

const LessonProgress = require("../models/LessonProgress");
const User        = require("../models/user");
const Lesson      = require("../models/Lesson");
const ActivityLog = require("../models/ActivityLog");

function resolveUserId(req) {
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const jwt = require("jsonwebtoken");
      const decoded = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET || "fallback_secret_key");
      return decoded.id;
    } catch {}
  }
  return req.body?.userId || null;
}

// GET /api/progress — real subject progress + XP + last lesson for authenticated user
router.get("/", async (req, res) => {
  const userId = resolveUserId(req);

  if (!userId) {
    return res.json({ math: 0, science: 0, english: 0, xp: 0, lastLesson: null });
  }

  try {
    const user = await User.findById(userId).select("progress xp").lean();

    const lastProgress = await LessonProgress.findOne({ userId }).sort({ updatedAt: -1 }).lean();
    let lastLesson = null;
    if (lastProgress) {
      const lesson = await Lesson.findOne({ slug: lastProgress.lessonSlug }).lean();
      if (lesson) {
        lastLesson = {
          slug:     lesson.slug,
          title:    lesson.title,
          subject:  lesson.subject,
          image:    lesson.image,
          progress: lastProgress.progress,
        };
      }
    }

    res.json({
      math:       user?.progress?.math    ?? 0,
      science:    user?.progress?.science ?? 0,
      english:    user?.progress?.english ?? 0,
      xp:         user?.xp ?? 0,
      lastLesson,
    });
  } catch (err) {
    console.error("Progress GET error:", err);
    res.json({ math: 0, science: 0, english: 0, xp: 0, lastLesson: null });
  }
});

// GET /api/progress/lessons — all lesson progress records
router.get("/lessons", async (req, res) => {
  try {
    const progress = await LessonProgress.find();
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch lesson progress" });
  }
});

// POST /api/progress/quiz-result — save quiz score, award XP + badge
router.post("/quiz-result", async (req, res) => {
  try {
    const { lessonSlug, score, totalQuestions } = req.body;

    let userId = resolveUserId(req);

    const lesson = await Lesson.findOne({ slug: lessonSlug }).catch(() => null);
    const lessonTitle = lesson ? lesson.title : lessonSlug.replace(/-/g, " ");

    let user = null;
    if (userId) user = await User.findById(userId).catch(() => null);
    if (!user)  user = await User.findOne({ role: "student" });

    const xpEarned = 150;
    let badgeEarned = null;

    if (user) {
      user.xp += xpEarned;

      // Update subject-specific progress (ratchet up, never down)
      if (lesson) {
        const subj     = (lesson.subject || "").toLowerCase();
        const scorePct = Math.round((score / totalQuestions) * 100);
        if (subj === "mathematics" || subj === "math") {
          user.progress.math    = Math.max(user.progress.math    || 0, scorePct);
        } else if (subj === "science") {
          user.progress.science = Math.max(user.progress.science || 0, scorePct);
        } else if (subj === "english") {
          user.progress.english = Math.max(user.progress.english || 0, scorePct);
        }
      }

      // Varied badge: subject + grade + score tier (unique per lesson + performance)
      const scoreFraction = score / totalQuestions;
      const tier = scoreFraction >= 0.9 ? "Genius"   :
                   scoreFraction >= 0.7 ? "Champion" :
                   scoreFraction >= 0.5 ? "Scholar"  : "Explorer";
      const subjectWord = lesson?.subject || "Quiz";
      const gradeTag    = lesson?.grade   ? ` G${lesson.grade}` : "";
      badgeEarned = `${subjectWord}${gradeTag} ${tier}`;

      // Only push if this exact badge name hasn't been earned before
      const hasBadge = user.badges.some(b => b.name === badgeEarned);
      if (!hasBadge) {
        user.badges.push({ name: badgeEarned, earnedDate: new Date(), icon: "ribbon" });
      }

      await user.save();

      // Activity logs (fire-and-forget)
      const pct = Math.round((score / totalQuestions) * 100);
      ActivityLog.create({
        userId: user._id,
        type: "quiz_completed",
        title: `Completed quiz: ${lessonTitle} — ${score}/${totalQuestions} (${pct}%)`,
        subject: lesson?.subject || "",
        score: pct,
      }).catch(() => {});

      if (!hasBadge && badgeEarned) {
        ActivityLog.create({
          userId: user._id,
          type: "badge_earned",
          title: `Earned badge: ${badgeEarned}`,
          subject: lesson?.subject || "",
        }).catch(() => {});
      }
    }

    // Mark lesson as completed in progress
    if (user && lessonSlug) {
      await LessonProgress.findOneAndUpdate(
        { userId: user._id, lessonSlug },
        { progress: 100, status: "Completed" },
        { upsert: true, new: true }
      );

      ActivityLog.create({
        userId: user._id,
        type: "lesson_completed",
        title: `Completed lesson: ${lessonTitle}`,
        subject: lesson?.subject || "",
      }).catch(() => {});
    }

    res.json({ xpEarned, badgeEarned, lessonTitle, score, totalQuestions });
  } catch (err) {
    console.error("Quiz Result Error:", err);
    res.status(500).json({ error: "Failed to process quiz result" });
  }
});

module.exports = router;
