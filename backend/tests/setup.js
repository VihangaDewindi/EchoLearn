/**
 * Global pre-flight check — runs once before all test files.
 * Tests hit the LIVE server (http://localhost:5001), not a test-spawned instance,
 * so the server's existing MongoDB Atlas connection is reused.
 */
const supertest = require("supertest");

beforeAll(async () => {
  try {
    const res = await supertest("http://localhost:5001").get("/api/auth/login").timeout(8000);
    // 400 is fine — endpoint exists, server is up
    if (res.status >= 500) throw new Error(`Server error on health check: ${res.status}`);
  } catch (err) {
    if (err.message?.includes("ECONNREFUSED")) {
      throw new Error(
        "Backend server is not running. Start it first:\n  cd backend && node server.js"
      );
    }
    throw err;
  }
}, 15000);
