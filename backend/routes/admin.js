const router = require("express").Router();
const User = require("../models/user");
const Lesson = require("../models/Lesson");
const ActivityLog = require("../models/ActivityLog");
const { verifyToken, requireRole } = require("../middleware/auth");

const adminOnly = [verifyToken, requireRole("admin")];

// GET /api/admin/stats — headline numbers for the dashboard
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

// GET /api/admin/users — list all users with optional role filter
router.get("/users", ...adminOnly, async (req, res) => {
  try {
    const { role, search } = req.query;
    const filter = {};
    if (role && role !== "all") filter.role = role;
    if (search) filter.fullName = { $regex: search, $options: "i" };

    const users = await User.find(filter)
      .select("fullName email role xp streak badges createdAt lastActive")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// PATCH /api/admin/users/:id — update role
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

// DELETE /api/admin/users/:id — remove a user
router.delete("/users/:id", ...adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// GET /api/admin/activity — recent activity logs
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

// GET /api/admin/lessons — list all lessons
router.get("/lessons", ...adminOnly, async (req, res) => {
  try {
    const lessons = await Lesson.find()
      .select("title subject slug duration level progress")
      .sort({ subject: 1, title: 1 })
      .catch(() => []);
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch lessons" });
  }
});

// GET /api/admin/students — students with full stats
router.get("/students", ...adminOnly, async (req, res) => {
  try {
    const { search } = req.query;
    const filter = { role: "student" };
    if (search) filter.fullName = { $regex: search, $options: "i" };

    const students = await User.find(filter)
      .select("fullName email xp streak level badges progress lastActive createdAt")
      .sort({ xp: -1 })
      .limit(200);

    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// GET /api/admin/teachers — teachers with their classes
router.get("/teachers", ...adminOnly, async (req, res) => {
  try {
    const { search } = req.query;
    const Class = require("../models/Class");
    const filter = { role: "teacher" };
    if (search) filter.fullName = { $regex: search, $options: "i" };

    const teachers = await User.find(filter)
      .select("fullName email lastActive createdAt")
      .sort({ fullName: 1 })
      .limit(200);

    const teacherIds = teachers.map(t => t._id);
    const classes = await Class.find({ teacherId: { $in: teacherIds }, isArchived: false })
      .select("teacherId name subject gradeLevel students")
      .lean();

    const classMap = {};
    classes.forEach(c => {
      const tid = c.teacherId.toString();
      if (!classMap[tid]) classMap[tid] = [];
      classMap[tid].push(c);
    });

    const result = teachers.map(t => ({
      ...t.toObject(),
      classes: classMap[t._id.toString()] || [],
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch teachers" });
  }
});

// GET /api/admin/parents — parents with linked children
router.get("/parents", ...adminOnly, async (req, res) => {
  try {
    const { search } = req.query;
    const ParentStudentLink = require("../models/ParentStudentLink");
    const filter = { role: "parent" };
    if (search) filter.fullName = { $regex: search, $options: "i" };

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

    const result = parents.map(p => ({
      ...p.toObject(),
      children: linkMap[p._id.toString()] || [],
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch parents" });
  }
});

module.exports = router;
