/**
 * Functional tests — Admin routes
 * Tests run against the live backend server at http://localhost:5001
 * Covers: authorization, stats, users, curriculum, lessons CRUD,
 *         settings, reports, ai-stats, security
 *
 * Prerequisite: run `node backend/createAdmin.js` once before these tests.
 */
const supertest = require("supertest");
const BASE = supertest("http://localhost:5001");

const ADMIN_EMAIL = "admin@echolearn.edu";
const ADMIN_PASS  = "Admin@EchoLearn123";

let adminToken      = null;
let createdLessonId = null;

beforeAll(async () => {
  const res = await BASE.post("/api/auth/login").send({
    role: "admin", email: ADMIN_EMAIL, password: ADMIN_PASS,
  });
  if (res.status === 200) {
    adminToken = res.body.token;
  } else {
    console.warn("⚠️  Admin login failed (status:", res.status, ").");
    console.warn("    Run: node backend/createAdmin.js  — then re-run tests.");
  }
});

afterAll(async () => {
  // Delete test lesson if it was created and not yet deleted
  if (createdLessonId && adminToken) {
    await BASE.delete(`/api/admin/lessons/${createdLessonId}`)
      .set("Authorization", `Bearer ${adminToken}`).catch(() => {});
  }
  // Delete temp non-admin users created during authorization tests
  const usersRes = await BASE.get("/api/admin/users?search=nonadmin_")
    .set("Authorization", `Bearer ${adminToken}`).catch(() => ({ body: [] }));
  for (const u of (usersRes.body || [])) {
    if (u.email?.includes("@test.echolearn.com")) {
      await BASE.delete(`/api/admin/users/${u._id}`)
        .set("Authorization", `Bearer ${adminToken}`).catch(() => {});
    }
  }
});

const auth = () => ({ Authorization: `Bearer ${adminToken}` });

/* ─── AUTHORIZATION ─────────────────────────────────────────────── */
describe("Admin Route Authorization", () => {

  it("TC-ADM-01: returns 401 when no token provided", async () => {
    const res = await BASE.get("/api/admin/stats");
    expect(res.status).toBe(401);
  });

  it("TC-ADM-02: returns 403 when student token is used", async () => {
    const ts = Date.now();
    const email = `nonadmin_${ts}@test.echolearn.com`;
    await BASE.post("/api/auth/register").send({
      role: "student", fullName: "Non Admin User", email, password: "Pass1234",
    });
    const loginRes = await BASE.post("/api/auth/login").send({
      role: "student", email, password: "Pass1234",
    });
    const studentToken = loginRes.body.token;

    const res = await BASE.get("/api/admin/stats")
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.status).toBe(403);
  });

});

/* ─── STATS ─────────────────────────────────────────────────────── */
describe("GET /api/admin/stats", () => {

  it("TC-ADM-03: returns platform-level statistics", async () => {
    if (!adminToken) return console.log("Skipped: no admin token");
    const res = await BASE.get("/api/admin/stats").set(auth());
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("totalUsers");
    expect(res.body).toHaveProperty("students");
    expect(res.body).toHaveProperty("teachers");
    expect(res.body).toHaveProperty("totalLessons");
    expect(res.body).toHaveProperty("recentLogs");
    expect(typeof res.body.totalUsers).toBe("number");
    expect(res.body.totalUsers).toBeGreaterThanOrEqual(0);
  });

});

/* ─── USERS ─────────────────────────────────────────────────────── */
describe("GET /api/admin/users", () => {

  it("TC-ADM-04: returns all users as an array", async () => {
    if (!adminToken) return console.log("Skipped: no admin token");
    const res = await BASE.get("/api/admin/users").set(auth());
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("fullName");
      expect(res.body[0]).toHaveProperty("email");
      expect(res.body[0]).toHaveProperty("role");
    }
  });

  it("TC-ADM-05: filters users by role=student", async () => {
    if (!adminToken) return console.log("Skipped: no admin token");
    const res = await BASE.get("/api/admin/users?role=student").set(auth());
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body.every(u => u.role === "student")).toBe(true);
    }
  });

  it("TC-ADM-06: filters users by search term", async () => {
    if (!adminToken) return console.log("Skipped: no admin token");
    const res = await BASE.get("/api/admin/users?search=admin").set(auth());
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});

describe("PATCH /api/admin/users/:id", () => {

  it("TC-ADM-07: rejects invalid role value", async () => {
    if (!adminToken) return console.log("Skipped: no admin token");
    const { Types } = require("mongoose");
    const fakeId = new Types.ObjectId().toString();
    const res = await BASE.patch(`/api/admin/users/${fakeId}`)
      .set(auth()).send({ role: "superuser" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("TC-ADM-08: returns 404 for non-existent user", async () => {
    if (!adminToken) return console.log("Skipped: no admin token");
    const { Types } = require("mongoose");
    const fakeId = new Types.ObjectId().toString();
    const res = await BASE.patch(`/api/admin/users/${fakeId}`)
      .set(auth()).send({ role: "student" });
    expect(res.status).toBe(404);
  });

});

/* ─── CURRICULUM & LESSONS CRUD ─────────────────────────────────── */
describe("Admin Lesson CRUD", () => {

  it("TC-ADM-09: GET /api/admin/curriculum returns grouped lessons by subject", async () => {
    if (!adminToken) return console.log("Skipped: no admin token");
    const res = await BASE.get("/api/admin/curriculum").set(auth());
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe("object");
  });

  it("TC-ADM-10: GET /api/admin/lessons returns flat lesson list", async () => {
    if (!adminToken) return console.log("Skipped: no admin token");
    const res = await BASE.get("/api/admin/lessons").set(auth());
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("TC-ADM-11: GET /api/admin/lessons filters by subject", async () => {
    if (!adminToken) return console.log("Skipped: no admin token");
    const res = await BASE.get("/api/admin/lessons?subject=Mathematics").set(auth());
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body.every(l => l.subject === "Mathematics")).toBe(true);
    }
  });

  it("TC-ADM-12: POST /api/admin/lessons creates a new lesson", async () => {
    if (!adminToken) return console.log("Skipped: no admin token");
    const res = await BASE.post("/api/admin/lessons")
      .set(auth())
      .send({ title: "Admin Test Lesson", subject: "Mathematics", grade: "4", description: "Functional test" });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("slug");
    expect(res.body.title).toBe("Admin Test Lesson");
    createdLessonId = res.body._id;
  });

  it("TC-ADM-13: PUT /api/admin/lessons/:id updates lesson title", async () => {
    if (!adminToken || !createdLessonId) return console.log("Skipped");
    const res = await BASE.put(`/api/admin/lessons/${createdLessonId}`)
      .set(auth())
      .send({ title: "Updated Admin Test Lesson", subject: "Mathematics", grade: "4" });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Admin Test Lesson");
  });

  it("TC-ADM-14: POST /api/admin/lessons rejects missing subject/grade", async () => {
    if (!adminToken) return console.log("Skipped: no admin token");
    const res = await BASE.post("/api/admin/lessons")
      .set(auth()).send({ title: "Incomplete Lesson" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("TC-ADM-15: DELETE /api/admin/lessons/:id removes the lesson", async () => {
    if (!adminToken || !createdLessonId) return console.log("Skipped");
    const res = await BASE.delete(`/api/admin/lessons/${createdLessonId}`).set(auth());
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Lesson deleted");
    createdLessonId = null;
  });

});

/* ─── SETTINGS ──────────────────────────────────────────────────── */
describe("Admin System Settings", () => {

  it("TC-ADM-16: GET /api/admin/settings returns current settings", async () => {
    if (!adminToken) return console.log("Skipped: no admin token");
    const res = await BASE.get("/api/admin/settings").set(auth());
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("platformName");
    expect(res.body).toHaveProperty("maintenanceMode");
    expect(res.body).toHaveProperty("registrationOpen");
    expect(res.body).toHaveProperty("voiceEnabled");
    expect(res.body).toHaveProperty("aiQuizEnabled");
    expect(res.body).toHaveProperty("maxStudentsPerClass");
    expect(res.body).toHaveProperty("supportEmail");
  });

  it("TC-ADM-17: POST /api/admin/settings saves and returns updated settings", async () => {
    if (!adminToken) return console.log("Skipped: no admin token");
    const res = await BASE.post("/api/admin/settings")
      .set(auth())
      .send({ platformName: "EchoLearn Test Build", maxStudentsPerClass: 35 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Settings saved");
    expect(res.body.settings.platformName).toBe("EchoLearn Test Build");
    expect(res.body.settings.maxStudentsPerClass).toBe(35);

    // Restore defaults
    await BASE.post("/api/admin/settings").set(auth())
      .send({ platformName: "EchoLearn", maxStudentsPerClass: 40 });
  });

});

/* ─── REPORTS ───────────────────────────────────────────────────── */
describe("GET /api/admin/reports", () => {

  it("TC-ADM-18: returns analytics overview with all required fields", async () => {
    if (!adminToken) return console.log("Skipped: no admin token");
    const res = await BASE.get("/api/admin/reports").set(auth());
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("overview");
    expect(res.body.overview).toHaveProperty("totalStudents");
    expect(res.body.overview).toHaveProperty("totalTeachers");
    expect(res.body.overview).toHaveProperty("totalLessons");
    expect(res.body.overview).toHaveProperty("totalXP");
    expect(res.body.overview).toHaveProperty("atRisk");
    expect(res.body).toHaveProperty("subjectAvgs");
    expect(res.body.subjectAvgs).toHaveProperty("math");
    expect(res.body.subjectAvgs).toHaveProperty("science");
    expect(res.body.subjectAvgs).toHaveProperty("english");
    expect(res.body).toHaveProperty("dailyActive");
    expect(Array.isArray(res.body.dailyActive)).toBe(true);
    expect(res.body.dailyActive).toHaveLength(7);
    expect(res.body).toHaveProperty("topLessons");
    expect(Array.isArray(res.body.topLessons)).toBe(true);
  });

});

/* ─── AI STATS ──────────────────────────────────────────────────── */
describe("GET /api/admin/ai-stats", () => {

  it("TC-ADM-19: returns lesson-progress statistics", async () => {
    if (!adminToken) return console.log("Skipped: no admin token");
    const res = await BASE.get("/api/admin/ai-stats").set(auth());
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("totalLessonAttempts");
    expect(res.body).toHaveProperty("completedLessons");
    expect(res.body).toHaveProperty("inProgressLessons");
    expect(res.body).toHaveProperty("completionRate");
    expect(res.body).toHaveProperty("subjectCompletions");
    expect(res.body).toHaveProperty("topAttempted");
    expect(Array.isArray(res.body.topAttempted)).toBe(true);
    expect(typeof res.body.completionRate).toBe("number");
  });

});

/* ─── SECURITY ──────────────────────────────────────────────────── */
describe("GET /api/admin/security", () => {

  it("TC-ADM-20: returns security dashboard with admins, role counts, recent signups", async () => {
    if (!adminToken) return console.log("Skipped: no admin token");
    const res = await BASE.get("/api/admin/security").set(auth());
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("admins");
    expect(res.body).toHaveProperty("roleCounts");
    expect(res.body).toHaveProperty("recentSignups");
    expect(Array.isArray(res.body.admins)).toBe(true);
    expect(Array.isArray(res.body.roleCounts)).toBe(true);
    expect(Array.isArray(res.body.recentSignups)).toBe(true);
    if (res.body.admins.length > 0) {
      const found = res.body.admins.some(a => a.email === ADMIN_EMAIL);
      expect(found).toBe(true);
    }
  });

});

/* ─── ROLE-SPECIFIC USER LISTS ──────────────────────────────────── */
describe("Admin role-specific user lists", () => {

  it("TC-ADM-21: GET /api/admin/students returns only students", async () => {
    if (!adminToken) return console.log("Skipped: no admin token");
    const res = await BASE.get("/api/admin/students").set(auth());
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("xp");
      expect(res.body[0]).toHaveProperty("progress");
    }
  });

  it("TC-ADM-22: GET /api/admin/teachers returns teachers with class counts", async () => {
    if (!adminToken) return console.log("Skipped: no admin token");
    const res = await BASE.get("/api/admin/teachers").set(auth());
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("classes");
      expect(res.body[0]).toHaveProperty("totalStudents");
    }
  });

});
