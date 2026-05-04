require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors({
  origin: "http://localhost:3000"
}));

app.use(express.json());

/* ---------------- ENV CHECK ---------------- */
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is missing in backend/.env");
  process.exit(1);
}

console.log("Loaded URI:", process.env.MONGO_URI);

/* ---------------- ROUTES ---------------- */
const courseRoutes = require("./routes/courseRoutes");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const progressRoutes = require("./routes/progressRoutes");
const student = require("./routes/student");
const ai = require("./routes/ai");
const lessons = require("./routes/lessons");
const achievementRoutes = require("./routes/achievementRoutes");
const teacherRoutes = require("./routes/teacher");
const parentRoutes = require("./routes/parent");
const voiceRoutes = require("./routes/voice");
const adminRoutes = require("./routes/admin");

app.use("/api/courses", courseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/student", student);
app.use("/api/ai", ai);
app.use("/api/lessons", lessons);
app.use("/api/achievements", achievementRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/parent", parentRoutes);
app.use("/api/voice", voiceRoutes);
app.use("/api/admin", adminRoutes);

/* ---------------- START SERVER AFTER DB CONNECTS ---------------- */
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    }).on("error", (err) => {
      console.error("Express Error:", err.message);
    });
  })
  .catch(err => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });