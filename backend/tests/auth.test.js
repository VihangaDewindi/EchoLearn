/**
 * Functional tests — Authentication routes
 * Tests run against the live backend server at http://localhost:5001
 * Covers: register, login, forgot-password, reset-password
 */
const supertest = require("supertest");
const BASE = supertest("http://localhost:5001");

const TS         = Date.now();
const TEST_EMAIL = `authtest_${TS}@test.echolearn.com`;
const TEST_PASS  = "TestPass123";

/* ─── REGISTER ──────────────────────────────────────────────────── */
describe("POST /api/auth/register", () => {

  it("TC-AUTH-01: registers a new student with valid data", async () => {
    const res = await BASE.post("/api/auth/register").send({
      role: "student", fullName: "Auth Test Student", email: TEST_EMAIL, password: TEST_PASS,
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");
  });

  it("TC-AUTH-02: rejects duplicate email", async () => {
    const res = await BASE.post("/api/auth/register").send({
      role: "student", fullName: "Duplicate Student", email: TEST_EMAIL, password: TEST_PASS,
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/already exists/i);
  });

  it("TC-AUTH-03: rejects missing required fields", async () => {
    const res = await BASE.post("/api/auth/register").send({
      role: "student", fullName: "No Email",
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("TC-AUTH-04: rejects invalid email format", async () => {
    const res = await BASE.post("/api/auth/register").send({
      role: "student", fullName: "Bad Email", email: "not-an-email", password: TEST_PASS,
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/email/i);
  });

  it("TC-AUTH-05: rejects password shorter than 6 characters", async () => {
    const res = await BASE.post("/api/auth/register").send({
      role: "student", fullName: "Short Pass",
      email: `authtest_short_${TS}@test.echolearn.com`, password: "abc",
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/password/i);
  });

  it("TC-AUTH-06: registers a teacher successfully", async () => {
    const res = await BASE.post("/api/auth/register").send({
      role: "teacher", fullName: "Auth Test Teacher",
      email: `authtest_teacher_${TS}@test.echolearn.com`, password: TEST_PASS,
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");
  });

});

/* ─── LOGIN ─────────────────────────────────────────────────────── */
describe("POST /api/auth/login", () => {

  it("TC-AUTH-07: returns token and user object on valid credentials", async () => {
    const res = await BASE.post("/api/auth/login").send({
      role: "student", email: TEST_EMAIL, password: TEST_PASS,
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
    expect(res.body.user).toMatchObject({ email: TEST_EMAIL, role: "student" });
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user).toHaveProperty("fullName");
  });

  it("TC-AUTH-08: rejects wrong password", async () => {
    const res = await BASE.post("/api/auth/login").send({
      role: "student", email: TEST_EMAIL, password: "WrongPassword!",
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("TC-AUTH-09: rejects non-existent email", async () => {
    const res = await BASE.post("/api/auth/login").send({
      role: "student", email: "nobody@nowhere.echolearn.com", password: TEST_PASS,
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("TC-AUTH-10: rejects missing email field", async () => {
    const res = await BASE.post("/api/auth/login").send({
      role: "student", password: TEST_PASS,
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("TC-AUTH-11: rejects wrong role for valid credentials", async () => {
    // Registered as student — logging in as teacher should fail
    const res = await BASE.post("/api/auth/login").send({
      role: "teacher", email: TEST_EMAIL, password: TEST_PASS,
    });
    expect(res.status).toBe(400);
  });

});

/* ─── FORGOT / RESET PASSWORD ───────────────────────────────────── */
describe("POST /api/auth/forgot-password", () => {

  let resetToken;

  it("TC-AUTH-12: returns a reset token for existing email", async () => {
    const res = await BASE.post("/api/auth/forgot-password").send({ email: TEST_EMAIL });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    resetToken = res.body.token;
  });

  it("TC-AUTH-13: returns 404 for unknown email", async () => {
    const res = await BASE.post("/api/auth/forgot-password").send({
      email: "unknown_xyz@nowhere.echolearn.com",
    });
    expect(res.status).toBe(404);
  });

  it("TC-AUTH-14: resets password with valid token and allows login with new password", async () => {
    if (!resetToken) return;
    const res = await BASE.post("/api/auth/reset-password").send({
      token: resetToken, newPassword: "NewPass456",
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Password reset successfully");

    const loginRes = await BASE.post("/api/auth/login").send({
      role: "student", email: TEST_EMAIL, password: "NewPass456",
    });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty("token");
  });

  it("TC-AUTH-15: rejects invalid or expired reset token", async () => {
    const res = await BASE.post("/api/auth/reset-password").send({
      token: "invalidtoken123", newPassword: "SomePass123",
    });
    expect(res.status).toBe(400);
  });

});
