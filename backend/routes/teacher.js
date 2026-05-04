const router = require("express").Router();
const User = require("../models/user");
const Class = require("../models/Class");
const Unit = require("../models/Unit");
const LessonProgress = require("../models/LessonProgress");
const ActivityLog = require("../models/ActivityLog");
const { verifyToken, requireRole } = require("../middleware/auth");

const SUBJECT_IMAGES = {
  Math: "https://images.unsplash.com/photo-1509228468518-180dd4822ed5?auto=format&fit=crop&q=80&w=400",
  Science: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=400",
  English: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400",
  "Social Studies": "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&q=80&w=400",
};

const DEMO_CLASSES = [
  { name: "Grade 3 Math", subject: "Math", session: "Morning Session", gradeLevel: "Grade 3" },
  { name: "Grade 4 Science", subject: "Science", session: "Afternoon Session", gradeLevel: "Grade 4" },
  { name: "Grade 5 English", subject: "English", session: "Full Day", gradeLevel: "Grade 5" },
  { name: "Grade 2 Social Studies", subject: "Social Studies", session: "Elective", gradeLevel: "Grade 2" },
];

const DEMO_UNITS = {
  Math: [
    { title: "Numbers & Counting", order: 1, lessons: [
      { name: "Introduction to Numbers", type: "Video", duration: "10 min" },
      { name: "Counting to 100", type: "Activity", duration: "15 min" },
      { name: "Numbers Quiz", type: "Quiz", duration: "10 min" },
    ]},
    { title: "Addition & Subtraction", order: 2, lessons: [
      { name: "Basic Addition", type: "Reading", duration: "8 min" },
      { name: "Subtraction Strategies", type: "Video", duration: "12 min" },
      { name: "Practice Problems", type: "Activity", duration: "20 min" },
    ]},
    { title: "Fractions & Decimals", order: 3, lessons: [
      { name: "What is a Fraction?", type: "Video", duration: "10 min" },
      { name: "Comparing Fractions", type: "Activity", duration: "15 min" },
      { name: "Decimals Introduction", type: "Reading", duration: "8 min" },
    ]},
  ],
  Science: [
    { title: "Living Things", order: 1, lessons: [
      { name: "Characteristics of Life", type: "Reading", duration: "10 min" },
      { name: "Plants vs Animals", type: "Video", duration: "12 min" },
    ]},
    { title: "The Solar System", order: 2, lessons: [
      { name: "Our Solar System", type: "Video", duration: "15 min" },
      { name: "Planets Overview", type: "Activity", duration: "20 min" },
      { name: "Solar System Quiz", type: "Quiz", duration: "10 min" },
    ]},
    { title: "States of Matter", order: 3, lessons: [
      { name: "Solids, Liquids, Gases", type: "Reading", duration: "10 min" },
      { name: "Matter Experiments", type: "Activity", duration: "25 min" },
    ]},
  ],
  English: [
    { title: "Phonics & Reading", order: 1, lessons: [
      { name: "Letter Sounds", type: "Video", duration: "10 min" },
      { name: "Blending Practice", type: "Activity", duration: "15 min" },
    ]},
    { title: "Grammar Basics", order: 2, lessons: [
      { name: "Nouns and Verbs", type: "Reading", duration: "8 min" },
      { name: "Sentence Structure", type: "Video", duration: "12 min" },
      { name: "Grammar Quiz", type: "Quiz", duration: "10 min" },
    ]},
    { title: "Creative Writing", order: 3, lessons: [
      { name: "Story Elements", type: "Reading", duration: "10 min" },
      { name: "Writing Workshop", type: "Activity", duration: "30 min" },
    ]},
  ],
  "Social Studies": [
    { title: "My Community", order: 1, lessons: [
      { name: "Community Helpers", type: "Video", duration: "10 min" },
      { name: "Map Reading", type: "Activity", duration: "15 min" },
    ]},
    { title: "Sri Lanka History", order: 2, lessons: [
      { name: "Ancient Kingdoms", type: "Reading", duration: "12 min" },
      { name: "Cultural Traditions", type: "Video", duration: "15 min" },
    ]},
  ],
};

async function seedTeacherData(teacherId) {
  const existingClasses = await Class.find({ teacherId });
  if (existingClasses.length === 0) {
    await Class.insertMany(
      DEMO_CLASSES.map((c) => ({
        ...c,
        teacherId,
        image: SUBJECT_IMAGES[c.subject] || "",
      }))
    );
  }
  const existingUnits = await Unit.find({ teacherId });
  if (existingUnits.length === 0) {
    const unitsToInsert = [];
    for (const [subject, units] of Object.entries(DEMO_UNITS)) {
      for (const unit of units) {
        unitsToInsert.push({ ...unit, subject, teacherId });
      }
    }
    await Unit.insertMany(unitsToInsert);
  }
}

/* ─── DASHBOARD ─────────────────────────────────────────────── */
router.get("/dashboard", verifyToken, requireRole("teacher"), async (req, res) => {
  try {
    const teacherId = req.user.id;
    await seedTeacherData(teacherId);

    const classes = await Class.find({ teacherId, isArchived: false }).populate("students", "fullName progress xp level badges lastActive");
    const allStudents = classes.flatMap((c) => c.students);
    const uniqueStudentIds = [...new Set(allStudents.map((s) => s._id.toString()))];
    const uniqueStudents = uniqueStudentIds.map((id) =>
      allStudents.find((s) => s._id.toString() === id)
    );

    const avgQuizScore = uniqueStudents.length > 0
      ? Math.round(
          uniqueStudents.reduce((acc, s) => {
            const avg = (s.progress.math + s.progress.science + s.progress.english) / 3;
            return acc + avg;
          }, 0) / uniqueStudents.length
        )
      : 84;

    const struggling = uniqueStudents.filter(
      (s) => (s.progress.math + s.progress.science + s.progress.english) / 3 < 60
    ).length;

    const recentActivity = await ActivityLog.find({
      userId: { $in: uniqueStudentIds },
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("userId", "fullName");

    res.json({
      totalStudents: uniqueStudents.length || 0,
      totalClasses: classes.length,
      avgQuizScore,
      studentsNeedingSupport: struggling,
      students: uniqueStudents.slice(0, 6).map((s) => ({
        _id: s._id,
        fullName: s.fullName,
        progress: Math.round((s.progress.math + s.progress.science + s.progress.english) / 3),
        quizAvg: Math.round((s.progress.math + s.progress.science + s.progress.english) / 3),
        xp: s.xp,
        level: s.level,
        lastActive: s.lastActive,
        badges: s.badges.length,
        status:
          (s.progress.math + s.progress.science + s.progress.english) / 3 >= 80
            ? "excelling"
            : (s.progress.math + s.progress.science + s.progress.english) / 3 >= 60
            ? "average"
            : "struggling",
      })),
      recentActivity: recentActivity.map((a) => ({
        title: a.title,
        studentName: a.userId?.fullName || "Student",
        type: a.type,
        subject: a.subject,
        time: a.createdAt,
      })),
    });
  } catch (err) {
    console.error("Teacher dashboard error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ─── CLASSES ────────────────────────────────────────────────── */
router.get("/classes", verifyToken, requireRole("teacher"), async (req, res) => {
  try {
    const teacherId = req.user.id;
    await seedTeacherData(teacherId);

    const classes = await Class.find({ teacherId }).populate("students", "fullName progress xp");
    res.json(
      classes.map((c) => ({
        _id: c._id,
        name: c.name,
        subject: c.subject,
        session: c.session,
        gradeLevel: c.gradeLevel,
        image: c.image,
        isArchived: c.isArchived,
        studentCount: c.students.length,
        progress:
          c.students.length > 0
            ? Math.round(
                c.students.reduce(
                  (acc, s) => acc + (s.progress.math + s.progress.science + s.progress.english) / 3,
                  0
                ) / c.students.length
              )
            : 0,
      }))
    );
  } catch (err) {
    console.error("Teacher classes error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/classes", verifyToken, requireRole("teacher"), async (req, res) => {
  try {
    const { name, subject, session, gradeLevel } = req.body;
    if (!name || !subject) return res.status(400).json({ error: "Name and subject required" });

    const newClass = await Class.create({
      teacherId: req.user.id,
      name,
      subject,
      session: session || "Morning Session",
      gradeLevel: gradeLevel || "Grade 1",
      image: SUBJECT_IMAGES[subject] || "",
    });
    res.status(201).json(newClass);
  } catch (err) {
    console.error("Create class error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ─── STUDENTS ───────────────────────────────────────────────── */
router.get("/students", verifyToken, requireRole("teacher"), async (req, res) => {
  try {
    const teacherId = req.user.id;
    const classes = await Class.find({ teacherId }).populate("students", "fullName email progress xp level badges lastActive streak");
    const allStudents = classes.flatMap((c) => c.students);
    const unique = Object.values(
      allStudents.reduce((acc, s) => {
        if (!acc[s._id]) acc[s._id.toString()] = s;
        return acc;
      }, {})
    );

    res.json(
      unique.map((s) => {
        const avg = Math.round((s.progress.math + s.progress.science + s.progress.english) / 3);
        return {
          _id: s._id,
          fullName: s.fullName,
          email: s.email,
          level: s.level,
          xp: s.xp,
          streak: s.streak,
          lastActive: s.lastActive,
          badges: s.badges.length,
          progress: {
            math: s.progress.math,
            science: s.progress.science,
            english: s.progress.english,
            avg,
          },
          status: avg >= 80 ? "excelling" : avg >= 60 ? "average" : "struggling",
        };
      })
    );
  } catch (err) {
    console.error("Teacher students error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ─── CURRICULUM ─────────────────────────────────────────────── */
router.get("/curriculum", verifyToken, requireRole("teacher"), async (req, res) => {
  try {
    const teacherId = req.user.id;
    await seedTeacherData(teacherId);

    const units = await Unit.find({ teacherId }).sort({ subject: 1, order: 1 });
    const grouped = units.reduce((acc, u) => {
      if (!acc[u.subject]) acc[u.subject] = [];
      acc[u.subject].push({
        _id: u._id,
        title: u.title,
        order: u.order,
        lessons: u.lessons,
        lessonCount: u.lessons.length,
      });
      return acc;
    }, {});

    res.json(grouped);
  } catch (err) {
    console.error("Teacher curriculum error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ─── REPORTS ────────────────────────────────────────────────── */
router.get("/reports", verifyToken, requireRole("teacher"), async (req, res) => {
  try {
    const teacherId = req.user.id;
    const classes = await Class.find({ teacherId }).populate(
      "students",
      "fullName email progress xp level badges lastActive streak"
    );

    const allStudents = Object.values(
      classes.flatMap((c) => c.students).reduce((acc, s) => {
        if (!acc[s._id]) acc[s._id.toString()] = s;
        return acc;
      }, {})
    );

    const studentReports = allStudents.map((s) => {
      const avg = Math.round((s.progress.math + s.progress.science + s.progress.english) / 3);
      return {
        _id: s._id,
        fullName: s.fullName,
        email: s.email,
        math: s.progress.math,
        science: s.progress.science,
        english: s.progress.english,
        quizAvg: avg,
        badges: s.badges.length,
        streak: s.streak,
        lastActive: s.lastActive,
        status: avg >= 80 ? "excelling" : avg >= 60 ? "average" : "struggling",
      };
    });

    const totalStudents = studentReports.length || 1;
    const avgQuizScore =
      studentReports.length > 0
        ? (studentReports.reduce((a, s) => a + s.quizAvg, 0) / totalStudents).toFixed(1)
        : "84.5";

    const atRisk = studentReports.filter((s) => s.quizAvg < 60).length;
    const subjectAvgs = ["math", "science", "english"].map((sub) => ({
      subject: sub.charAt(0).toUpperCase() + sub.slice(1),
      avg:
        studentReports.length > 0
          ? Math.round(studentReports.reduce((a, s) => a + s[sub], 0) / totalStudents)
          : 0,
    }));

    res.json({
      students: studentReports,
      kpis: {
        avgQuizScore,
        completionRate: 92,
        engagementRate: 78,
        atRisk,
      },
      subjectAverages: subjectAvgs,
    });
  } catch (err) {
    console.error("Teacher reports error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
