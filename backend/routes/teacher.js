const router = require("express").Router();
const User          = require("../models/user");
const Class         = require("../models/Class");
const Unit          = require("../models/Unit");
const Lesson        = require("../models/Lesson");
const LessonProgress = require("../models/LessonProgress");
const { verifyToken, requireRole } = require("../middleware/auth");

const SUBJECT_IMAGES = {
  Mathematics: "/maths.png",
  Science:     "/lessons_livingthings.png",
  English:     "/english.png",
  Math:        "/maths.png",
};

const DEMO_CLASSES = [
  { name: "Grade 3 Mathematics", subject: "Mathematics", session: "Morning Session",   gradeLevel: "Grade 3" },
  { name: "Grade 4 Science",     subject: "Science",     session: "Afternoon Session", gradeLevel: "Grade 4" },
  { name: "Grade 5 English",     subject: "English",     session: "Full Day",          gradeLevel: "Grade 5" },
];

const DEMO_UNITS = {
  Mathematics: [
    { title: "Numbers & Counting", order: 1, lessons: [
      { name: "Introduction to Numbers", type: "Video",    duration: "10 min" },
      { name: "Counting to 100",         type: "Activity", duration: "15 min" },
      { name: "Numbers Quiz",            type: "Quiz",     duration: "10 min" },
    ]},
    { title: "Addition & Subtraction", order: 2, lessons: [
      { name: "Basic Addition",         type: "Reading",  duration: "8 min" },
      { name: "Subtraction Strategies", type: "Video",    duration: "12 min" },
      { name: "Practice Problems",      type: "Activity", duration: "20 min" },
    ]},
    { title: "Fractions & Decimals", order: 3, lessons: [
      { name: "What is a Fraction?",    type: "Video",    duration: "10 min" },
      { name: "Comparing Fractions",    type: "Activity", duration: "15 min" },
      { name: "Decimals Introduction",  type: "Reading",  duration: "8 min" },
    ]},
  ],
  Science: [
    { title: "Living Things", order: 1, lessons: [
      { name: "Characteristics of Life", type: "Reading", duration: "10 min" },
      { name: "Plants vs Animals",        type: "Video",   duration: "12 min" },
    ]},
    { title: "The Solar System", order: 2, lessons: [
      { name: "Our Solar System",  type: "Video",    duration: "15 min" },
      { name: "Planets Overview",  type: "Activity", duration: "20 min" },
      { name: "Solar System Quiz", type: "Quiz",     duration: "10 min" },
    ]},
    { title: "States of Matter", order: 3, lessons: [
      { name: "Solids, Liquids, Gases", type: "Reading",  duration: "10 min" },
      { name: "Matter Experiments",     type: "Activity", duration: "25 min" },
    ]},
  ],
  English: [
    { title: "Phonics & Reading", order: 1, lessons: [
      { name: "Letter Sounds",    type: "Video",    duration: "10 min" },
      { name: "Blending Practice", type: "Activity", duration: "15 min" },
    ]},
    { title: "Grammar Basics", order: 2, lessons: [
      { name: "Nouns and Verbs",     type: "Reading", duration: "8 min" },
      { name: "Sentence Structure",  type: "Video",   duration: "12 min" },
      { name: "Grammar Quiz",        type: "Quiz",    duration: "10 min" },
    ]},
    { title: "Creative Writing", order: 3, lessons: [
      { name: "Story Elements",   type: "Reading",  duration: "10 min" },
      { name: "Writing Workshop", type: "Activity", duration: "30 min" },
    ]},
  ],
};

async function seedTeacherData(teacherId) {
  // One-time migration: rename any "Social Studies" classes to "Mathematics"
  await Class.updateMany(
    { teacherId, subject: "Social Studies" },
    { subject: "Mathematics", image: SUBJECT_IMAGES["Mathematics"] }
  );

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

/* ─── DASHBOARD ───────────────────────────────────────────────── */
router.get("/dashboard", verifyToken, requireRole("teacher"), async (req, res) => {
  try {
    const teacherId = req.user.id;
    await seedTeacherData(teacherId);

    const classes = await Class.find({ teacherId, isArchived: false })
      .populate("students", "fullName progress xp level badges lastActive");

    const allStudents = classes.flatMap((c) => c.students);
    const uniqueMap = {};
    allStudents.forEach((s) => { uniqueMap[s._id.toString()] = s; });
    const uniqueStudents = Object.values(uniqueMap);

    const avgQuizScore = uniqueStudents.length > 0
      ? Math.round(
          uniqueStudents.reduce((acc, s) =>
            acc + (s.progress.math + s.progress.science + s.progress.english) / 3, 0
          ) / uniqueStudents.length
        )
      : 0;

    // Students needing support = those with avg score < 40%
    const studentsNeedingSupport = uniqueStudents.filter((s) => {
      const avg = Math.round((s.progress.math + s.progress.science + s.progress.english) / 3);
      return avg < 40;
    }).length;

    // 7-day engagement: count unique students from teacher's classes who had LessonProgress activity each day
    const studentIds = uniqueStudents.map((s) => s._id);
    const engagement = [];
    for (let i = 6; i >= 0; i--) {
      const start = new Date();
      start.setDate(start.getDate() - i);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);

      let count = 0;
      if (studentIds.length > 0) {
        const activeIds = await LessonProgress.distinct("userId", {
          userId:    { $in: studentIds },
          updatedAt: { $gte: start, $lte: end },
        }).catch(() => []);
        count = activeIds.length;
      }

      // Fall back to lastActive if no LessonProgress data yet
      if (count === 0) {
        count = uniqueStudents.filter((s) => {
          const la = s.lastActive ? new Date(s.lastActive) : null;
          return la && la >= start && la <= end;
        }).length;
      }

      engagement.push(count);
    }

    res.json({
      totalStudents:          uniqueStudents.length,
      totalClasses:           classes.length,
      avgQuizScore,
      studentsNeedingSupport,
      engagement,
      students: uniqueStudents.slice(0, 8).map((s) => {
        const avg = Math.round((s.progress.math + s.progress.science + s.progress.english) / 3);
        return {
          _id:        s._id,
          fullName:   s.fullName,
          progress:   avg,
          quizAvg:    avg,
          xp:         s.xp,
          level:      s.level,
          lastActive: s.lastActive,
          badges:     s.badges.length,
          status:     avg >= 80 ? "excelling" : avg >= 60 ? "average" : "struggling",
        };
      }),
    });
  } catch (err) {
    console.error("Teacher dashboard error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ─── CLASSES ─────────────────────────────────────────────────── */
router.get("/classes", verifyToken, requireRole("teacher"), async (req, res) => {
  try {
    const teacherId = req.user.id;
    await seedTeacherData(teacherId);

    const classes = await Class.find({ teacherId })
      .populate("students", "fullName progress xp");

    res.json(
      classes.map((c) => {
        const participantCount = c.students.filter(
          (s) => s.progress.math + s.progress.science + s.progress.english > 0
        ).length;

        return {
          _id:            c._id,
          name:           c.name,
          subject:        c.subject,
          session:        c.session,
          gradeLevel:     c.gradeLevel,
          image:          c.image,
          isArchived:     c.isArchived,
          studentCount:   c.students.length,
          participantCount,
          progress: c.students.length > 0
            ? Math.round(
                c.students.reduce(
                  (acc, s) => acc + (s.progress.math + s.progress.science + s.progress.english) / 3, 0
                ) / c.students.length
              )
            : 0,
        };
      })
    );
  } catch (err) {
    console.error("Teacher classes error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/classes/:id", verifyToken, requireRole("teacher"), async (req, res) => {
  try {
    const { name, subject, session, gradeLevel } = req.body;
    const cls = await Class.findOneAndUpdate(
      { _id: req.params.id, teacherId: req.user.id },
      { name, subject, session, gradeLevel, image: SUBJECT_IMAGES[subject] || "" },
      { new: true }
    ).populate("students", "fullName progress xp");
    if (!cls) return res.status(404).json({ error: "Class not found" });
    const avg = cls.students.length > 0
      ? Math.round(cls.students.reduce((a, s) => a + (s.progress.math + s.progress.science + s.progress.english) / 3, 0) / cls.students.length)
      : 0;
    const participantCount = cls.students.filter(
      (s) => s.progress.math + s.progress.science + s.progress.english > 0
    ).length;
    res.json({ ...cls.toObject(), studentCount: cls.students.length, participantCount, progress: avg });
  } catch (err) {
    console.error("Edit class error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/classes/:id", verifyToken, requireRole("teacher"), async (req, res) => {
  try {
    const cls = await Class.findOneAndUpdate(
      { _id: req.params.id, teacherId: req.user.id },
      { isArchived: true },
      { new: true }
    );
    if (!cls) return res.status(404).json({ error: "Class not found" });
    res.json({ message: "Class archived" });
  } catch (err) {
    console.error("Archive class error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Unarchive a class
router.patch("/classes/:id/unarchive", verifyToken, requireRole("teacher"), async (req, res) => {
  try {
    const cls = await Class.findOneAndUpdate(
      { _id: req.params.id, teacherId: req.user.id },
      { isArchived: false },
      { new: true }
    );
    if (!cls) return res.status(404).json({ error: "Class not found" });
    res.json({ message: "Class restored" });
  } catch (err) {
    console.error("Unarchive class error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/classes/:id/students", verifyToken, requireRole("teacher"), async (req, res) => {
  try {
    const { studentEmail } = req.body;
    const student = await User.findOne({ email: studentEmail.trim().toLowerCase(), role: "student" });
    if (!student) return res.status(404).json({ error: "No student found with that email" });

    const cls = await Class.findOne({ _id: req.params.id, teacherId: req.user.id });
    if (!cls) return res.status(404).json({ error: "Class not found" });

    if (cls.students.map(s => s.toString()).includes(student._id.toString())) {
      return res.status(400).json({ error: "Student already in this class" });
    }

    cls.students.push(student._id);
    await cls.save();
    res.json({ message: "Student added", student: { _id: student._id, fullName: student.fullName, email: student.email } });
  } catch (err) {
    console.error("Assign student error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/classes/:id/students/:studentId", verifyToken, requireRole("teacher"), async (req, res) => {
  try {
    const cls = await Class.findOne({ _id: req.params.id, teacherId: req.user.id });
    if (!cls) return res.status(404).json({ error: "Class not found" });
    cls.students = cls.students.filter(s => s.toString() !== req.params.studentId);
    await cls.save();
    res.json({ message: "Student removed" });
  } catch (err) {
    console.error("Remove student error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/classes", verifyToken, requireRole("teacher"), async (req, res) => {
  try {
    const { name, subject, session, gradeLevel } = req.body;
    if (!name || !subject) return res.status(400).json({ error: "Name and subject required" });

    const newClass = await Class.create({
      teacherId:  req.user.id,
      name,
      subject,
      session:    session    || "Morning Session",
      gradeLevel: gradeLevel || "Grade 1",
      image:      SUBJECT_IMAGES[subject] || "",
    });
    res.status(201).json({ ...newClass.toObject(), studentCount: 0, participantCount: 0, progress: 0 });
  } catch (err) {
    console.error("Create class error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* Class roster */
router.get("/classes/:id/students", verifyToken, requireRole("teacher"), async (req, res) => {
  try {
    const cls = await Class.findOne({ _id: req.params.id, teacherId: req.user.id })
      .populate("students", "fullName email progress xp level badges lastActive");
    if (!cls) return res.status(404).json({ error: "Class not found" });

    res.json(
      cls.students.map((s) => {
        const avg = Math.round((s.progress.math + s.progress.science + s.progress.english) / 3);
        return {
          _id:        s._id,
          fullName:   s.fullName,
          email:      s.email,
          level:      s.level,
          xp:         s.xp,
          progress:   avg,
          math:       s.progress.math,
          science:    s.progress.science,
          english:    s.progress.english,
          status:     avg >= 80 ? "excelling" : avg >= 60 ? "average" : "struggling",
          lastActive: s.lastActive,
        };
      })
    );
  } catch (err) {
    console.error("Class roster error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* Popular lessons — top 5 most-accessed lessons across teacher's students */
router.get("/popular-lessons", verifyToken, requireRole("teacher"), async (req, res) => {
  try {
    const teacherId = req.user.id;
    const classes   = await Class.find({ teacherId, isArchived: false }).lean();
    const studentIds = [...new Set(classes.flatMap((c) => c.students.map((s) => s.toString())))];

    if (studentIds.length === 0) {
      return res.json([]);
    }

    const pipeline = [
      { $match: { userId: { $in: studentIds.map(id => require("mongoose").Types.ObjectId.createFromHexString(id)) } } },
      { $group: { _id: "$lessonSlug", count: { $sum: 1 }, avgProgress: { $avg: "$progress" } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ];

    const results = await LessonProgress.aggregate(pipeline).catch(() => []);

    // Enrich with lesson titles
    const slugs   = results.map((r) => r._id);
    const lessons = await Lesson.find({ slug: { $in: slugs } }).select("title subject grade slug").lean();
    const lessonMap = {};
    lessons.forEach((l) => { lessonMap[l.slug] = l; });

    res.json(results.map((r) => ({
      slug:        r._id,
      title:       lessonMap[r._id]?.title  || r._id,
      subject:     lessonMap[r._id]?.subject || "Unknown",
      grade:       lessonMap[r._id]?.grade   || "",
      participants: r.count,
      avgProgress:  Math.round(r.avgProgress || 0),
    })));
  } catch (err) {
    console.error("Popular lessons error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ─── STUDENTS ────────────────────────────────────────────────── */
router.get("/students/search-all", verifyToken, requireRole("teacher"), async (req, res) => {
  try {
    const { q, classId } = req.query;
    const filter = { role: "student" };
    if (q && q.trim()) {
      filter.$or = [
        { fullName: { $regex: q, $options: "i" } },
        { email:    { $regex: q, $options: "i" } },
      ];
    }
    let students = await User.find(filter).select("fullName email").limit(30);

    // Exclude students already in the specified class
    if (classId) {
      const cls = await Class.findById(classId).lean();
      if (cls) {
        const existing = cls.students.map(s => s.toString());
        students = students.filter(s => !existing.includes(s._id.toString()));
      }
    }

    res.json(students);
  } catch (err) {
    console.error("Student search-all error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/students", verifyToken, requireRole("teacher"), async (req, res) => {
  try {
    const teacherId = req.user.id;
    const classes = await Class.find({ teacherId })
      .populate("students", "fullName email progress xp level badges lastActive streak");

    const studentClassMap = {};
    classes.forEach((cls) => {
      cls.students.forEach((s) => {
        const key = s._id.toString();
        if (!studentClassMap[key]) studentClassMap[key] = [];
        studentClassMap[key].push({ _id: cls._id, name: cls.name });
      });
    });

    const uniqueMap = {};
    classes.flatMap((c) => c.students).forEach((s) => { uniqueMap[s._id.toString()] = s; });
    const unique = Object.values(uniqueMap);

    res.json(
      unique.map((s) => {
        const avg = Math.round((s.progress.math + s.progress.science + s.progress.english) / 3);
        return {
          _id:        s._id,
          fullName:   s.fullName,
          email:      s.email,
          level:      s.level,
          xp:         s.xp,
          streak:     s.streak,
          lastActive: s.lastActive,
          badges:     s.badges.length,
          classes:    studentClassMap[s._id.toString()] || [],
          progress: {
            math:    s.progress.math,
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

/* ─── CURRICULUM ──────────────────────────────────────────────── */
router.get("/curriculum", verifyToken, requireRole("teacher"), async (req, res) => {
  try {
    const teacherId = req.user.id;
    await seedTeacherData(teacherId);

    const allowedSubjects = ["Mathematics", "Science", "English"];
    const lessons = await Lesson.find({ subject: { $in: allowedSubjects } })
      .sort({ grade: 1, title: 1 });

    const grouped = {};
    for (const lesson of lessons) {
      const subj = lesson.subject;
      if (!grouped[subj]) grouped[subj] = [];

      // Normalize grade to remove any leading "Grade " prefix to prevent "Grade Grade X"
      const gradeNum   = String(lesson.grade).replace(/^Grade\s+/i, "").trim();
      const gradeLabel = `Grade ${gradeNum}`;

      let gradeGroup = grouped[subj].find((g) => g.grade === gradeNum);
      if (!gradeGroup) {
        gradeGroup = {
          _id:         `${subj}-${gradeNum}`,
          title:       gradeLabel,
          grade:       gradeNum,
          lessons:     [],
          lessonCount: 0,
        };
        grouped[subj].push(gradeGroup);
      }
      gradeGroup.lessons.push({
        name:     lesson.title,
        type:     "Reading",
        duration: lesson.duration || "12 min",
        slug:     lesson.slug,
        grade:    gradeNum,
      });
      gradeGroup.lessonCount++;
    }

    // Merge teacher-created units
    const teacherUnits = await Unit.find({
      teacherId,
      subject: { $in: allowedSubjects },
    }).sort({ order: 1 });

    for (const unit of teacherUnits) {
      const subj = unit.subject;
      if (!grouped[subj]) grouped[subj] = [];
      grouped[subj].push({
        _id:         unit._id,
        title:       unit.title,
        grade:       unit.grade || "Custom",
        lessons:     unit.lessons,
        lessonCount: unit.lessons.length,
        isCustom:    true,
      });
    }

    res.json(grouped);
  } catch (err) {
    console.error("Teacher curriculum error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ─── UNITS (teacher-created) ─────────────────────────────────── */
router.post("/units", verifyToken, requireRole("teacher"), async (req, res) => {
  try {
    const { title, subject, grade, lessonNames = [] } = req.body;
    if (!title || !subject) return res.status(400).json({ error: "Title and subject required" });

    const unit = await Unit.create({
      teacherId: req.user.id,
      title,
      subject,
      grade:    grade  || "1",
      order:    Date.now(),
      lessons:  lessonNames.map((name) => ({ name, type: "Reading", duration: "10 min" })),
    });
    res.status(201).json(unit);
  } catch (err) {
    console.error("Create unit error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/units/:id", verifyToken, requireRole("teacher"), async (req, res) => {
  try {
    const unit = await Unit.findOneAndUpdate(
      { _id: req.params.id, teacherId: req.user.id },
      req.body,
      { new: true }
    );
    if (!unit) return res.status(404).json({ error: "Unit not found" });
    res.json(unit);
  } catch (err) {
    console.error("Update unit error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ─── LESSONS (teacher creates/edits) ────────────────────────── */
router.post("/lessons", verifyToken, requireRole("teacher"), async (req, res) => {
  try {
    const { title, subject, grade, description, duration } = req.body;
    if (!title || !subject || !grade) {
      return res.status(400).json({ error: "Title, subject, and grade are required" });
    }
    const gradeNum = String(grade).replace(/^Grade\s+/i, "").trim();
    const slug = `${subject.toLowerCase().replace(/\s+/g, "-")}-grade-${gradeNum}-${title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}-${Date.now()}`;
    const lesson = await Lesson.create({
      slug,
      title,
      subject,
      grade:       gradeNum,
      unit:        "Teacher Created",
      description: description || "",
      duration:    duration    || "12 min read",
      image:       SUBJECT_IMAGES[subject] || "",
      blocks:      [],
    });
    res.status(201).json(lesson);
  } catch (err) {
    console.error("Teacher create lesson error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/lessons/:slug", verifyToken, requireRole("teacher"), async (req, res) => {
  try {
    const { title, subject, grade, unit, duration, level, description, image } = req.body;
    const gradeNum = grade ? String(grade).replace(/^Grade\s+/i, "").trim() : undefined;
    const lesson = await Lesson.findOneAndUpdate(
      { slug: req.params.slug },
      {
        title, subject,
        ...(gradeNum && { grade: gradeNum }),
        unit:        unit        || "Teacher Created",
        duration:    duration    || "12 min read",
        level:       level       || "Beginner",
        description: description || "",
        image:       image       || SUBJECT_IMAGES[subject] || "",
      },
      { new: true }
    );
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });
    res.json(lesson);
  } catch (err) {
    console.error("Edit lesson error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ─── REPORTS ─────────────────────────────────────────────────── */
router.get("/reports", verifyToken, requireRole("teacher"), async (req, res) => {
  try {
    const teacherId = req.user.id;
    const classes = await Class.find({ teacherId })
      .populate("students", "fullName email progress xp level badges lastActive streak");

    const uniqueMap = {};
    classes.flatMap((c) => c.students).forEach((s) => { uniqueMap[s._id.toString()] = s; });
    const allStudents = Object.values(uniqueMap);

    const studentReports = allStudents.map((s) => {
      const avg = Math.round((s.progress.math + s.progress.science + s.progress.english) / 3);
      return {
        _id:        s._id,
        fullName:   s.fullName,
        email:      s.email,
        math:       s.progress.math,
        science:    s.progress.science,
        english:    s.progress.english,
        quizAvg:    avg,
        badges:     s.badges.length,
        streak:     s.streak,
        lastActive: s.lastActive,
        status:     avg >= 80 ? "excelling" : avg >= 60 ? "average" : "struggling",
      };
    });

    const total = studentReports.length || 1;
    const avgQuizScore = studentReports.length > 0
      ? (studentReports.reduce((a, s) => a + s.quizAvg, 0) / total).toFixed(1)
      : "0.0";

    // At-risk = students scoring below 40%
    const atRisk = studentReports.filter((s) => s.quizAvg < 40).length;

    // Completion rate = % of students who have at least one LessonProgress record
    const studentIds = allStudents.map((s) => s._id);
    let completionRate = 0;
    if (studentIds.length > 0) {
      const completedIds = await LessonProgress.distinct("userId", {
        userId: { $in: studentIds },
        progress: { $gt: 0 },
      }).catch(() => []);
      completionRate = Math.round(completedIds.length / total * 100);
    }

    const engagementRate = studentReports.length > 0
      ? Math.round(studentReports.filter(s => s.quizAvg > 0).length / total * 100)
      : 0;

    const subjectAvgs = [
      { subject: "Mathematics", key: "math" },
      { subject: "Science",     key: "science" },
      { subject: "English",     key: "english" },
    ].map(({ subject, key }) => ({
      subject,
      avg: studentReports.length > 0
        ? Math.round(studentReports.reduce((a, s) => a + s[key], 0) / total)
        : 0,
    }));

    res.json({
      students: studentReports,
      kpis: { avgQuizScore, completionRate, engagementRate, atRisk },
      subjectAverages: subjectAvgs,
    });
  } catch (err) {
    console.error("Teacher reports error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ─── SAVE QUIZ TO LESSON ─────────────────────────────────────── */
router.post("/lessons/:slug/save-quiz", verifyToken, requireRole("teacher"), async (req, res) => {
  try {
    const { quiz } = req.body;
    if (!Array.isArray(quiz) || quiz.length === 0) {
      return res.status(400).json({ error: "Quiz array is required" });
    }
    const lesson = await Lesson.findOneAndUpdate(
      { slug: req.params.slug },
      { quiz },
      { new: true }
    );
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });
    res.json({ message: "Quiz saved to lesson", lessonId: lesson._id });
  } catch (err) {
    console.error("Save quiz error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
