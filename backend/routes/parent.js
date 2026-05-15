const router = require("express").Router();
const User = require("../models/user");
const ParentStudentLink = require("../models/ParentStudentLink");
const ActivityLog = require("../models/ActivityLog");
const { verifyToken, requireRole } = require("../middleware/auth");

async function getLinkedStudent(parentId) {
  const link = await ParentStudentLink.findOne({ parentId }).populate(
    "studentId",
    "fullName email progress xp level streak badges lastActive createdAt"
  );
  return link?.studentId || null;
}

/* ─── DASHBOARD ─────────────────────────────────────────────── */
router.get("/dashboard", verifyToken, requireRole("parent"), async (req, res) => {
  try {
    const student = await getLinkedStudent(req.user.id);
    if (!student) {
      return res.status(404).json({ error: "No linked student found" });
    }

    const activity = await ActivityLog.find({ userId: student._id })
      .sort({ createdAt: -1 })
      .limit(6);

    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const monthlyLessons = await ActivityLog.countDocuments({
      userId: student._id,
      type: { $in: ["lesson_completed", "quiz_completed"] },
      createdAt: { $gte: monthAgo },
    });

    const avgScore =
      Math.round((student.progress.math + student.progress.science + student.progress.english) / 3) || 88;

    const weeklyGoalTotal = 5;
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weeklyCompleted = await ActivityLog.countDocuments({
      userId: student._id,
      type: "lesson_completed",
      createdAt: { $gte: weekStart },
    });

    res.json({
      student: {
        _id: student._id,
        fullName: student.fullName,
        email: student.email,
        level: student.level,
        xp: student.xp,
        streak: student.streak,
        badges: student.badges,
        progress: student.progress,
      },
      stats: {
        learningTimeHrs: ((monthlyLessons * 15) / 60).toFixed(1),
        lessonsCompleted: monthlyLessons,
        avgQuizScore: avgScore,
      },
      weeklyGoal: {
        completed: Math.min(weeklyCompleted, weeklyGoalTotal),
        total: weeklyGoalTotal,
      },
      subjects: [
        { name: "Mathematics", progress: student.progress.math, color: "bg-[#33478D]" },
        { name: "Science", progress: student.progress.science, color: "bg-[#5AAF7B]" },
        { name: "English", progress: student.progress.english, color: "bg-[#E5A644]" },
      ],
      activity: activity.map((a) => ({
        type: a.type,
        title: a.title,
        subject: a.subject,
        score: a.score,
        details: a.details,
        time: a.createdAt,
      })),
    });
  } catch (err) {
    console.error("Parent dashboard error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ─── MY CHILD ───────────────────────────────────────────────── */
router.get("/my-child", verifyToken, requireRole("parent"), async (req, res) => {
  try {
    const student = await getLinkedStudent(req.user.id);
    if (!student) return res.status(404).json({ error: "No linked student found" });

    const activity = await ActivityLog.find({ userId: student._id })
      .sort({ createdAt: -1 })
      .limit(10);

    const totalLessons = await ActivityLog.countDocuments({
      userId: student._id,
      type: "lesson_completed",
    });

    const quizLogs = await ActivityLog.find({
      userId: student._id,
      type: "quiz_completed",
      score: { $ne: null },
    });

    const quizAvg =
      quizLogs.length > 0
        ? Math.round(quizLogs.reduce((a, q) => a + q.score, 0) / quizLogs.length)
        : Math.round((student.progress.math + student.progress.science + student.progress.english) / 3);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weeklyCompleted = await ActivityLog.countDocuments({
      userId: student._id,
      type: "lesson_completed",
      createdAt: { $gte: weekStart },
    });

    res.json({
      student: {
        _id: student._id,
        fullName: student.fullName,
        email: student.email,
        level: student.level,
        xp: student.xp,
        streak: student.streak,
        badges: student.badges,
      },
      stats: {
        totalPoints: student.xp,
        lessonsCompleted: totalLessons,
        avgQuizScore: quizAvg,
      },
      subjects: [
        { name: "Math", progress: student.progress.math, recent: "Fractions & Decimals", color: "bg-[#33478D]" },
        { name: "Science", progress: student.progress.science, recent: "The Solar System", color: "bg-[#5AAF7B]" },
        { name: "English", progress: student.progress.english, recent: "Grammar Basics", color: "bg-[#E5A644]" },
      ],
      weeklyGoal: {
        completed: Math.min(weeklyCompleted, 5),
        total: 5,
      },
      activity: activity.map((a) => ({
        type: a.type,
        title: a.title,
        subject: a.subject,
        score: a.score,
        details: a.details,
        time: a.createdAt,
      })),
    });
  } catch (err) {
    console.error("Parent my-child error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
