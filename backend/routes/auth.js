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
    const { email, password, role } = req.body;

    console.log("Incoming body:", req.body);
    console.log("Email:", email);
    console.log("Role:", role);

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({
      $and: [
        { role: role.trim().toLowerCase() },
        {
          $or: [
            { email: email.trim() },
            { fullName: email.trim() }
          ]
        }
      ]
    });

    console.log("User found:", user);

    if (!user) {
      return res.status(400).json({ error: "Invalid email or username" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "fallback_secret_key",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});


// FORGOT PASSWORD — generate a reset token and return it (demo: no email, token shown in UI)
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email: email.trim() });
    if (!user) return res.status(404).json({ error: "No account found with that email address" });

    // Generate a simple token: base64(userId + timestamp)
    const raw = `${user._id}:${Date.now()}`;
    const token = Buffer.from(raw).toString("base64url");

    // Store token + expiry on the user (1 hour)
    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    // In production you'd email the token. For this demo we return it directly.
    res.json({ message: "Reset token generated", token });
  } catch (err) {
    console.error("Forgot-password error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

// RESET PASSWORD — validate token, hash new password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: "Token and new password are required" });
    if (newPassword.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });
    if (!user) return res.status(400).json({ error: "Invalid or expired reset token" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset-password error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

module.exports = router;
