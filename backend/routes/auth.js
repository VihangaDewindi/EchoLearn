const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Utility function to validate email format
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { role, fullName, email, password } = req.body;

    // 1. Basic Validation
    if (!role || !fullName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    // 2. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // 3. Hash password and save
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      role,
      fullName,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Failed to register user. Please try again." });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { role, email, password } = req.body;

    // 1. Basic Validation
    if (!role || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 2. Find user & Verify Role (Search by either email or username/fullName)
    const user = await User.findOne({
      $or: [
        { email: email },
        { fullName: email }
      ]
    });

    if (!user) {
        return res.status(400).json({ error: "Invalid email or username" });
    }

    if (user.role !== role) {
        return res.status(400).json({ error: `Account registered as a ${user.role}, please select the correct role.` });
    }

    // 3. Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: "Invalid password" });
    }

    // 4. Generate Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "fallback_secret_key",
      { expiresIn: "1d" }
    );

    res.json({ token, user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

module.exports = router;
