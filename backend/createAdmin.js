/**
 * One-time admin seed script.
 * Run: node backend/createAdmin.js
 *
 * Creates admin@echolearn.edu / Admin@EchoLearn123 if it doesn't exist.
 * If the account exists but has a different role, upgrades it to "admin".
 */

require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const User     = require("./models/user");

const ADMIN_EMAIL    = "admin@echolearn.edu";
const ADMIN_PASSWORD = "Admin@EchoLearn123";
const ADMIN_NAME     = "EchoLearn Admin";

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.");

  const existing = await User.findOne({ email: ADMIN_EMAIL });

  if (existing) {
    if (existing.role === "admin") {
      console.log("Admin account already exists. No changes made.");
    } else {
      existing.role = "admin";
      await existing.save();
      console.log(`Role for ${ADMIN_EMAIL} updated to admin.`);
    }
  } else {
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await User.create({
      fullName: ADMIN_NAME,
      email:    ADMIN_EMAIL,
      password: hashed,
      role:     "admin",
    });
    console.log("Admin account created successfully!");
    console.log(`  Email:    ${ADMIN_EMAIL}`);
    console.log(`  Password: ${ADMIN_PASSWORD}`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
