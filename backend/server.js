require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const dns = require("dns");
// Force use of Cloudflare DNS for this process to bypass ISP blocks
dns.setServers(["1.1.1.1", "1.0.0.1", "8.8.8.8"]);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
    if (err.message.includes("ENOTFOUND")) {
      console.log("\n👉 TIPS: Your internet provider is blocking MongoDB addresses.");
      console.log("   Either switch to a Mobile Hotspot or use the 'Standard Connection String' from Atlas.");
    }
  });

// Routes
const courseRoutes = require("./routes/courseRoutes");
const authRoutes = require("./routes/auth");

app.use("/api/courses", courseRoutes);
app.use("/api/auth", authRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
