module.exports = {
  testEnvironment: "node",
  testTimeout: 60000,
  testMatch: ["**/tests/**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  forceExit: true,
  verbose: true,
};
