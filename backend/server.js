const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");
const app      = require("./app");

/* ---------------- ENV CHECK ---------------- */
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is missing in backend/.env");
  process.exit(1);
}

console.log("Loaded URI:", process.env.MONGO_URI);

/* ---------------- START SERVER AFTER DB CONNECTS ---------------- */
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    }).on("error", (err) => {
      console.error("Express Error:", err.message);
    });
  })
  .catch(err => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });