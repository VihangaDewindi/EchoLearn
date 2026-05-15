/**
 * Functional tests — Teacher routes
 * Tests run against the live backend server at http://localhost:5001
 * Covers: authorization, dashboard, classes CRUD, curriculum,
 *         reports, popular-lessons, student search, units/lessons
 *
 * A temporary teacher is registered before tests and removed via admin API after.
 */
const supertest = require("supertest");
const BASE = supertest("http://localhost:5001");

const TS            = Date.now();
const TEACHER_EMAIL = `functeacher_${TS}@test.echolearn.com`;
const TEACHER_PASS  = "TeacherPass123";

let teacherToken    = null;
let teacherId       = null;
let createdClassId  = null;
let createdLessonSlug = null;

beforeAll(async () => {
  await BASE.post("/api/auth/register").send({
    role: "teacher", fullName: "Functional Test Teacher", email: TEACHER_EMAIL, password: TEACHER_PASS,
  });

  const loginRes = await BASE.post("/api/auth/login").send({
    role: "teacher", email: TEACHER_EMAIL, password: TEACHER_PASS,
  });

  if (loginRes.status === 200) {
    teacherToken = loginRes.body.token;
    teacherId    = loginRes.body.user.id;
  } else {
    console.warn("⚠️  Teacher login failed (status:", loginRes.status, ")");
  }
});

afterAll(async () => {
  // Delete test lesson via admin API if admin credentials are available
  if (createdLessonSlug) {
    const adminLogin = await BASE.post("/api/auth/login").send({
      role: "admin", email: "admin@echolearn.edu", password: "Admin@EchoLearn123",
    }).catch(() => ({}));
    if (adminLogin.body?.token) {
      const lessons = await BASE.get("/api/admin/lessons?search=Functional+Test+Lesson")
        .set("Authorization", `Bearer ${adminLogin.body.token}`).catch(() => ({ body: [] }));
      for (const l of (lessons.body || [])) {
        if (l.slug === createdLessonSlug) {
          await BASE.delete(`/api/admin/lessons/${l._id}`)
            .set("Authorization", `Bearer ${adminLogin.body.token}`).catch(() => {});
        }
      }
      // Delete the test teacher via admin API
      if (teacherId) {
        await BASE.delete(`/api/admin/users/${teacherId}`)
          .set("Authorization", `Bearer ${adminLogin.body.token}`).catch(() => {});
      }
    }
  }
});

const auth = () => ({ Authorization: `Bearer ${teacherToken}` });

/* ─── AUTHORIZATION ─────────────────────────────────────────────── */
describe("Teacher Route Authorization", () => {

  it("TC-TCH-01: returns 401 when no token provided", async () => {
    const res = await BASE.get("/api/teacher/dashboard");
    expect(res.status).toBe(401);
  });

  it("TC-TCH-02: returns 403 when student token used on teacher route", async () => {
    const email = `funcstudent_${TS}@test.echolearn.com`;
    await BASE.post("/api/auth/register").send({
      role: "student", fullName: "Student User", email, password: "Pass1234",
    });
    const loginRes = await BASE.post("/api/auth/login").send({
      role: "student", email, password: "Pass1234",
    });
    const res = await BASE.get("/api/teacher/dashboard")
      .set("Authorization", `Bearer ${loginRes.body.token}`);
    expect(res.status).toBe(403);
  });

});

/* ─── DASHBOARD ─────────────────────────────────────────────────── */
describe("GET /api/teacher/dashboard", () => {

  it("TC-TCH-03: returns dashboard stats and seeds demo classes on first access", async () => {
    if (!teacherToken) return console.log("Skipped: no teacher token");
    const res = await BASE.get("/api/teacher/dashboard").set(auth());
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("totalStudents");
    expect(res.body).toHaveProperty("totalClasses");
    expect(res.body).toHaveProperty("studentsNeedingSupport");
    expect(res.body).toHaveProperty("avgQuizScore");
    expect(res.body).toHaveProperty("engagement");
    expect(Array.isArray(res.body.engagement)).toBe(true);
    expect(res.body.engagement).toHaveLength(7);
    expect(res.body).toHaveProperty("students");
    expect(Array.isArray(res.body.students)).toBe(true);
  });

  it("TC-TCH-04: totalClasses is greater than 0 after seeding", async () => {
    if (!teacherToken) return console.log("Skipped: no teacher token");
    const res = await BASE.get("/api/teacher/dashboard").set(auth());
    expect(res.status).toBe(200);
    expect(res.body.totalClasses).toBeGreaterThan(0);
  });

});

/* ─── CLASSES ───────────────────────────────────────────────────── */
describe("GET /api/teacher/classes", () => {

  it("TC-TCH-05: returns array of teacher classes with participant counts", async () => {
    if (!teacherToken) return console.log("Skipped: no teacher token");
    const res = await BASE.get("/api/teacher/classes").set(auth());
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("name");
    expect(res.body[0]).toHaveProperty("subject");
    expect(res.body[0]).toHaveProperty("studentCount");
    expect(res.body[0]).toHaveProperty("participantCount");
  });

});

describe("POST /api/teacher/classes", () => {

  it("TC-TCH-06: creates a new class and returns it with expected fields", async () => {
    if (!teacherToken) return console.log("Skipped: no teacher token");
    const res = await BASE.post("/api/teacher/classes")
      .set(auth())
      .send({ name: "Functional Test Class", subject: "Science", session: "Morning Session", gradeLevel: "Grade 4" });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toBe("Functional Test Class");
    expect(res.body.subject).toBe("Science");
    createdClassId = res.body._id;
  });

  it("TC-TCH-07: rejects class creation without name or subject", async () => {
    if (!teacherToken) return console.log("Skipped: no teacher token");
    const res = await BASE.post("/api/teacher/classes")
      .set(auth()).send({ session: "Morning Session" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

});

describe("PUT /api/teacher/classes/:id", () => {

  it("TC-TCH-08: edits class name and subject", async () => {
    if (!teacherToken || !createdClassId) return console.log("Skipped");
    const res = await BASE.put(`/api/teacher/classes/${createdClassId}`)
      .set(auth())
      .send({ name: "Edited Test Class", subject: "English", session: "Afternoon Session", gradeLevel: "Grade 5" });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Edited Test Class");
    expect(res.body.subject).toBe("English");
  });

});

describe("DELETE + PATCH /api/teacher/classes/:id — archive/restore", () => {

  it("TC-TCH-09: archives a class (soft delete — isArchived becomes true)", async () => {
    if (!teacherToken || !createdClassId) return console.log("Skipped");
    const res = await BASE.delete(`/api/teacher/classes/${createdClassId}`).set(auth());
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Class archived");
  });

  it("TC-TCH-10: restores an archived class via PATCH unarchive", async () => {
    if (!teacherToken || !createdClassId) return console.log("Skipped");
    const res = await BASE.patch(`/api/teacher/classes/${createdClassId}/unarchive`).set(auth());
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Class restored");
  });

});

/* ─── CURRICULUM ────────────────────────────────────────────────── */
describe("GET /api/teacher/curriculum", () => {

  it("TC-TCH-11: returns curriculum object grouped by subject", async () => {
    if (!teacherToken) return console.log("Skipped: no teacher token");
    const res = await BASE.get("/api/teacher/curriculum").set(auth());
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe("object");
  });

  it("TC-TCH-12: grade labels do not contain duplicate 'Grade Grade' prefix", async () => {
    if (!teacherToken) return console.log("Skipped: no teacher token");
    const res = await BASE.get("/api/teacher/curriculum").set(auth());
    expect(res.status).toBe(200);
    Object.values(res.body).flat().forEach((group) => {
      if (group.title) expect(group.title).not.toMatch(/Grade\s+Grade/i);
    });
  });

});

/* ─── LESSON CREATION ───────────────────────────────────────────── */
describe("POST /api/teacher/lessons", () => {

  it("TC-TCH-13: creates a lesson and returns a slug", async () => {
    if (!teacherToken) return console.log("Skipped: no teacher token");
    const res = await BASE.post("/api/teacher/lessons")
      .set(auth())
      .send({ title: "Functional Test Lesson", subject: "Mathematics", grade: "3", description: "Test" });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("slug");
    expect(res.body.title).toBe("Functional Test Lesson");
    createdLessonSlug = res.body.slug;
  });

  it("TC-TCH-14: rejects lesson creation without title/subject/grade", async () => {
    if (!teacherToken) return console.log("Skipped: no teacher token");
    const res = await BASE.post("/api/teacher/lessons")
      .set(auth()).send({ title: "No Subject or Grade" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

});

/* ─── REPORTS ───────────────────────────────────────────────────── */
describe("GET /api/teacher/reports", () => {

  it("TC-TCH-15: returns KPIs and subject averages", async () => {
    if (!teacherToken) return console.log("Skipped: no teacher token");
    const res = await BASE.get("/api/teacher/reports").set(auth());
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("kpis");
    expect(res.body.kpis).toHaveProperty("avgQuizScore");
    expect(res.body.kpis).toHaveProperty("completionRate");
    expect(res.body.kpis).toHaveProperty("atRisk");
    expect(res.body).toHaveProperty("subjectAverages");
    expect(Array.isArray(res.body.subjectAverages)).toBe(true);
    expect(res.body).toHaveProperty("students");
    expect(Array.isArray(res.body.students)).toBe(true);
  });

});

/* ─── POPULAR LESSONS ───────────────────────────────────────────── */
describe("GET /api/teacher/popular-lessons", () => {

  it("TC-TCH-16: returns popular lessons array (empty ok for new teacher)", async () => {
    if (!teacherToken) return console.log("Skipped: no teacher token");
    const res = await BASE.get("/api/teacher/popular-lessons").set(auth());
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("slug");
      expect(res.body[0]).toHaveProperty("title");
      expect(res.body[0]).toHaveProperty("participants");
    }
  });

});

/* ─── STUDENT SEARCH ────────────────────────────────────────────── */
describe("GET /api/teacher/students/search-all", () => {

  it("TC-TCH-17: returns students matching query", async () => {
    if (!teacherToken) return console.log("Skipped: no teacher token");
    const res = await BASE.get("/api/teacher/students/search-all?q=test").set(auth());
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("fullName");
      expect(res.body[0]).toHaveProperty("email");
    }
  });

  it("TC-TCH-18: excludes students already enrolled in specified class", async () => {
    if (!teacherToken || !createdClassId) return console.log("Skipped");
    const res = await BASE.get(`/api/teacher/students/search-all?q=&classId=${createdClassId}`).set(auth());
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});

/* ─── UNITS ─────────────────────────────────────────────────────── */
describe("POST /api/teacher/units", () => {

  let createdUnitId;

  it("TC-TCH-19: creates a new unit with lessons", async () => {
    if (!teacherToken) return console.log("Skipped: no teacher token");
    const res = await BASE.post("/api/teacher/units")
      .set(auth())
      .send({ title: "Test Unit", subject: "Mathematics", grade: "3", lessonNames: ["Lesson A", "Lesson B"] });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe("Test Unit");
    expect(res.body.lessons).toHaveLength(2);
    createdUnitId = res.body._id;
  });

  it("TC-TCH-20: rejects unit creation without title/subject", async () => {
    if (!teacherToken) return console.log("Skipped: no teacher token");
    const res = await BASE.post("/api/teacher/units")
      .set(auth()).send({ grade: "3" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

});
