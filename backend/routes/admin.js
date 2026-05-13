const router  = require("express").Router();
const User    = require("../models/user");
const Lesson  = require("../models/Lesson");
const Class   = require("../models/Class");
const ActivityLog    = require("../models/ActivityLog");
const LessonProgress = require("../models/LessonProgress");
const { verifyToken, requireRole } = require("../middleware/auth");

const adminOnly = [verifyToken, requireRole("admin")];

const SUBJECT_IMAGES = {
  Mathematics: "/maths.png",
  Science:     "/lessons_livingthings.png",
  English:     "/english.png",
};

/* ─── STATS ───────────────────────────────────────────────────── */
router.get("/stats", ...adminOnly, async (req, res) => {
  try {
    const [totalUsers, students, teachers, parents, totalLessons, recentLogs] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "teacher" }),
      User.countDocuments({ role: "parent" }),
      Lesson.countDocuments().catch(() => 0),
      ActivityLog.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }).catch(() => 0),
    ]);
    res.json({ totalUsers, students, teachers, parents, totalLessons, recentLogs });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

/* ─── USERS ───────────────────────────────────────────────────── */
router.get("/users", ...adminOnly, async (req, res) => {
  try {
    const { role, search } = req.query;
    const filter = {};
    if (role && role !== "all") filter.role = role;
    if (search) filter.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email:    { $regex: search, $options: "i" } },
    ];
    const users = await User.find(filter)
      .select("fullName email role xp streak badges createdAt lastActive")
      .sort({ createdAt: -1 })
      .limit(200);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.patch("/users/:id", ...adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    if (!["student", "teacher", "parent", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

router.delete("/users/:id", ...adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

/* ─── STUDENTS ────────────────────────────────────────────────── */
router.get("/students", ...adminOnly, async (req, res) => {
  try {
    const { search } = req.query;
    const filter = { role: "student" };
    if (search) filter.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email:    { $regex: search, $options: "i" } },
    ];
    const students = await User.find(filter)
      .select("fullName email xp streak level badges progress lastActive createdAt")
      .sort({ xp: -1 })
      .limit(200);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

/* ─── TEACHERS ────────────────────────────────────────────────── */
router.get("/teachers", ...adminOnly, async (req, res) => {
  try {
    const { search } = req.query;
    const filter = { role: "teacher" };
    if (search) filter.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email:    { $regex: search, $options: "i" } },
    ];
    const teachers = await User.find(filter)
      .select("fullName email lastActive createdAt")
      .sort({ fullName: 1 })
      .limit(200);

    const teacherIds = teachers.map(t => t._id);
    const classes = await Class.find({ teacherId: { $in: teacherIds } })
      .select("teacherId name subject gradeLevel students isArchived")
      .lean();

    const classMap = {};
    classes.forEach(c => {
      const tid = c.teacherId.toString();
      if (!classMap[tid]) classMap[tid] = [];
      classMap[tid].push(c);
    });

    res.json(teachers.map(t => ({
      ...t.toObject(),
      classes:       classMap[t._id.toString()] || [],
      totalStudents: (classMap[t._id.toString()] || []).reduce((a, c) => a + (c.students?.length || 0), 0),
    })));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch teachers" });
  }
});

/* ─── PARENTS ─────────────────────────────────────────────────── */
router.get("/parents", ...adminOnly, async (req, res) => {
  try {
    const { search } = req.query;
    const ParentStudentLink = require("../models/ParentStudentLink");
    const filter = { role: "parent" };
    if (search) filter.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email:    { $regex: search, $options: "i" } },
    ];
    const parents = await User.find(filter)
      .select("fullName email lastActive createdAt")
      .sort({ fullName: 1 })
      .limit(200);

    const parentIds = parents.map(p => p._id);
    const links = await ParentStudentLink.find({ parentId: { $in: parentIds } })
      .populate("studentId", "fullName email xp level")
      .lean();

    const linkMap = {};
    links.forEach(l => {
      const pid = l.parentId.toString();
      if (!linkMap[pid]) linkMap[pid] = [];
      if (l.studentId) linkMap[pid].push(l.studentId);
    });

    res.json(parents.map(p => ({ ...p.toObject(), children: linkMap[p._id.toString()] || [] })));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch parents" });
  }
});

/* ─── CURRICULUM (grouped lessons) ───────────────────────────── */
router.get("/curriculum", ...adminOnly, async (req, res) => {
  try {
    const lessons = await Lesson.find()
      .select("title subject grade unit slug duration level description image createdAt")
      .sort({ subject: 1, grade: 1, title: 1 });

    const grouped = {};
    for (const l of lessons) {
      const subj = l.subject || "Other";
      if (!grouped[subj]) grouped[subj] = [];
      const gradeNum   = String(l.grade).replace(/^Grade\s+/i, "").trim();
      const gradeLabel = `Grade ${gradeNum}`;
      let grp = grouped[subj].find(g => g.grade === gradeNum);
      if (!grp) {
        grp = { grade: gradeNum, label: gradeLabel, lessons: [] };
        grouped[subj].push(grp);
      }
      grp.lessons.push({ ...l.toObject(), grade: gradeNum });
    }
    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch curriculum" });
  }
});

/* ─── LESSONS (CRUD) ──────────────────────────────────────────── */
router.get("/lessons", ...adminOnly, async (req, res) => {
  try {
    const { subject, search } = req.query;
    const filter = {};
    if (subject && subject !== "all") filter.subject = subject;
    if (search) filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { slug:  { $regex: search, $options: "i" } },
    ];
    const lessons = await Lesson.find(filter)
      .select("title subject grade slug duration level description image createdAt")
      .sort({ subject: 1, grade: 1, title: 1 });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch lessons" });
  }
});

router.post("/lessons", ...adminOnly, async (req, res) => {
  try {
    const { title, subject, grade, description, duration, level } = req.body;
    if (!title || !subject || !grade) return res.status(400).json({ error: "Title, subject, grade required" });
    const gradeNum = String(grade).replace(/^Grade\s+/i, "").trim();
    const slug = `${subject.toLowerCase().replace(/\s+/g, "-")}-grade-${gradeNum}-${title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}-${Date.now()}`;
    const lesson = await Lesson.create({
      slug, title, subject,
      grade:       gradeNum,
      unit:        "Admin Created",
      description: description || "",
      duration:    duration    || "12 min read",
      level:       level       || "Beginner",
      image:       SUBJECT_IMAGES[subject] || "",
      blocks:      [],
    });
    res.status(201).json(lesson);
  } catch (err) {
    res.status(500).json({ error: "Failed to create lesson" });
  }
});

router.put("/lessons/:id", ...adminOnly, async (req, res) => {
  try {
    const { title, subject, grade, unit, duration, level, description } = req.body;
    const gradeNum = grade ? String(grade).replace(/^Grade\s+/i, "").trim() : undefined;
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      {
        title, subject,
        ...(gradeNum && { grade: gradeNum }),
        unit:        unit        || "Admin Created",
        duration:    duration    || "12 min read",
        level:       level       || "Beginner",
        description: description || "",
        image:       SUBJECT_IMAGES[subject] || "",
      },
      { new: true }
    );
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: "Failed to update lesson" });
  }
});

router.delete("/lessons/:id", ...adminOnly, async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });
    res.json({ message: "Lesson deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete lesson" });
  }
});

/* ─── ACTIVITY ────────────────────────────────────────────────── */
router.get("/activity", ...adminOnly, async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate("userId", "fullName email role")
      .sort({ createdAt: -1 })
      .limit(50)
      .catch(() => []);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch activity" });
  }
});

/* ─── REPORTS & ANALYTICS ─────────────────────────────────────── */
router.get("/reports", ...adminOnly, async (req, res) => {
  try {
    const [totalStudents, totalTeachers, totalLessons, totalClasses] = await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "teacher" }),
      Lesson.countDocuments(),
      Class.countDocuments({ isArchived: false }),
    ]);

    // Average progress across all students
    const students = await User.find({ role: "student" })
      .select("progress xp streak lastActive")
      .limit(500);

    const total = students.length || 1;
    const avgMath    = Math.round(students.reduce((a, s) => a + s.progress.math,    0) / total);
    const avgScience = Math.round(students.reduce((a, s) => a + s.progress.science, 0) / total);
    const avgEnglish = Math.round(students.reduce((a, s) => a + s.progress.english, 0) / total);
    const avgOverall = Math.round((avgMath + avgScience + avgEnglish) / 3);
    const totalXP    = students.reduce((a, s) => a + (s.xp || 0), 0);
    const atRisk     = students.filter(s => (s.progress.math + s.progress.science + s.progress.english) / 3 < 40).length;

    // Top lessons by participation
    const topLessons = await LessonProgress.aggregate([
      { $group: { _id: "$lessonSlug", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]).catch(() => []);

    const slugs       = topLessons.map(l => l._id);
    const lessonDocs  = await Lesson.find({ slug: { $in: slugs } }).select("title subject slug").lean();
    const lessonMap   = {};
    lessonDocs.forEach(l => { lessonMap[l.slug] = l; });

    // 7-day daily active users
    const dailyActive = [];
    for (let i = 6; i >= 0; i--) {
      const start = new Date(); start.setDate(start.getDate() - i); start.setHours(0, 0, 0, 0);
      const end   = new Date(start); end.setHours(23, 59, 59, 999);
      const count = await LessonProgress.distinct("userId", { updatedAt: { $gte: start, $lte: end } })
        .then(ids => ids.length).catch(() => 0);
      dailyActive.push(count);
    }

    res.json({
      overview: { totalStudents, totalTeachers, totalLessons, totalClasses, totalXP, atRisk },
      subjectAvgs: { math: avgMath, science: avgScience, english: avgEnglish, overall: avgOverall },
      topLessons: topLessons.map(l => ({
        slug:  l._id,
        title: lessonMap[l._id]?.title   || l._id,
        subject: lessonMap[l._id]?.subject || "",
        count: l.count,
      })),
      dailyActive,
    });
  } catch (err) {
    console.error("Admin reports error:", err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

/* ─── SYSTEM SETTINGS ─────────────────────────────────────────── */
// In-memory settings store (replace with DB model in production)
let systemSettings = {
  platformName:      "EchoLearn",
  maintenanceMode:   false,
  registrationOpen:  true,
  maxStudentsPerClass: 40,
  voiceEnabled:      true,
  aiQuizEnabled:     true,
  supportEmail:      "support@echolearn.edu",
};

router.get("/settings", ...adminOnly, (req, res) => {
  res.json(systemSettings);
});

router.post("/settings", ...adminOnly, (req, res) => {
  const allowed = Object.keys(systemSettings);
  const update  = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) update[key] = req.body[key];
  }
  systemSettings = { ...systemSettings, ...update };
  res.json({ message: "Settings saved", settings: systemSettings });
});

/* ─── AI / QUIZ MONITORING ────────────────────────────────────── */
router.get("/ai-stats", ...adminOnly, async (req, res) => {
  try {
    const [totalProgress, completedCount, inProgressCount] = await Promise.all([
      LessonProgress.countDocuments().catch(() => 0),
      LessonProgress.countDocuments({ status: "Completed" }).catch(() => 0),
      LessonProgress.countDocuments({ status: "In Progress" }).catch(() => 0),
    ]);

    // Top 10 most-attempted lessons
    const topAttempted = await LessonProgress.aggregate([
      { $group: { _id: "$lessonSlug", attempts: { $sum: 1 }, avgProgress: { $avg: "$progress" } } },
      { $sort: { attempts: -1 } },
      { $limit: 10 },
    ]).catch(() => []);

    const slugs      = topAttempted.map(l => l._id);
    const lessonDocs = await Lesson.find({ slug: { $in: slugs } }).select("title subject slug grade").lean();
    const lessonMap  = {};
    lessonDocs.forEach(l => { lessonMap[l.slug] = l; });

    // Quiz completions per subject
    const allProgress = await LessonProgress.find({ status: "Completed" })
      .select("lessonSlug")
      .lean()
      .catch(() => []);

    const completedSlugs = allProgress.map(p => p.lessonSlug);
    const completedLessons = await Lesson.find({ slug: { $in: completedSlugs } })
      .select("subject")
      .lean()
      .catch(() => []);

    const subjectCounts = { Mathematics: 0, Science: 0, English: 0, Other: 0 };
    completedLessons.forEach(l => {
      const k = subjectCounts[l.subject] !== undefined ? l.subject : "Other";
      subjectCounts[k]++;
    });

    res.json({
      totalLessonAttempts:    totalProgress,
      completedLessons:       completedCount,
      inProgressLessons:      inProgressCount,
      completionRate:         totalProgress > 0 ? Math.round((completedCount / totalProgress) * 100) : 0,
      subjectCompletions:     subjectCounts,
      topAttempted: topAttempted.map(l => ({
        slug:        l._id,
        title:       lessonMap[l._id]?.title   || l._id,
        subject:     lessonMap[l._id]?.subject || "",
        grade:       lessonMap[l._id]?.grade   || "",
        attempts:    l.attempts,
        avgProgress: Math.round(l.avgProgress || 0),
      })),
    });
  } catch (err) {
    console.error("Admin AI stats error:", err);
    res.status(500).json({ error: "Failed to fetch AI stats" });
  }
});

/* ─── SECURITY & ACCESS ───────────────────────────────────────── */
router.get("/security", ...adminOnly, async (req, res) => {
  try {
    // Recent admin and teacher accounts (potential access control interest)
    const [admins, recentUsers, recentActivity] = await Promise.all([
      User.find({ role: "admin" }).select("fullName email createdAt lastActive").lean(),
      User.find()
        .select("fullName email role createdAt lastActive")
        .sort({ createdAt: -1 })
        .limit(20)
        .lean(),
      ActivityLog.find()
        .populate("userId", "fullName email role")
        .sort({ createdAt: -1 })
        .limit(30)
        .catch(() => []),
    ]);

    // User role breakdown
    const roleCounts = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]).catch(() => []);

    res.json({
      admins,
      recentSignups: recentUsers,
      recentActivity,
      roleCounts,
    });
  } catch (err) {
    console.error("Admin security error:", err);
    res.status(500).json({ error: "Failed to fetch security data" });
  }
});

module.exports = router;
