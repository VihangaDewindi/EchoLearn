const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors    = require("cors");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/courses",      require("./routes/courseRoutes"));
app.use("/api/auth",         require("./routes/auth"));
app.use("/api/user",         require("./routes/userRoutes"));
app.use("/api/progress",     require("./routes/progressRoutes"));
app.use("/api/student",      require("./routes/student"));
app.use("/api/ai",           require("./routes/ai"));
app.use("/api/lessons",      require("./routes/lessons"));
app.use("/api/achievements", require("./routes/achievementRoutes"));
app.use("/api/teacher",      require("./routes/teacher"));
app.use("/api/parent",       require("./routes/parent"));
app.use("/api/voice",        require("./routes/voice"));
app.use("/api/admin",        require("./routes/admin"));

module.exports = app;
