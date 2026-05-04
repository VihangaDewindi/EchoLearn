const router = require("express").Router();
const User = require("../models/user");
const { verifyToken } = require("../middleware/auth");

// GET /api/achievements/leaderboard — top 10 students by XP
// NOTE: must be defined before /:userId so Express doesn't treat "leaderboard" as an id
router.get("/leaderboard", async (req, res) => {
  try {
    const topUsers = await User.find({ role: "student" })
      .sort({ xp: -1 })
      .limit(10)
      .select("fullName xp");
    res.json(topUsers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// GET /api/achievements/me — achievements for the authenticated user (JWT)
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const rank = await User.countDocuments({ role: "student", xp: { $gt: user.xp } }) + 1;
    const topUser = await User.findOne({ role: "student" }).sort({ xp: -1 }).select("xp");
    const xpToTop = topUser ? Math.max(0, topUser.xp - user.xp) : 0;

    const milestones = [
      {
        id: "m1",
        title: "Content Scholar",
        description: "Complete 5 more lessons",
        progress: 80,
        status: "In Progress",
      },
      {
        id: "m2",
        title: "Consistent Learner",
        description: `Maintain streak for ${Math.max(0, 7 - user.streak)} more days`,
        progress: Math.min(100, Math.round((user.streak / 7) * 100)),
        status: "In Progress",
        current: `${user.streak}/7 Days`,
      },
      {
        id: "m3",
        title: "Perfect Score",
        description: "Score 100% on next quiz",
        progress: 0,
        status: "Pending",
      },
    ];

    res.json({
      fullName: user.fullName,
      xp: user.xp,
      streak: user.streak,
      rank,
      xpToTop,
      badges: user.badges,
      milestones,
    });
  } catch (err) {
    console.error("Achievements /me error:", err);
    res.status(500).json({ error: "Failed to fetch achievements" });
  }
});

// GET /api/achievements/:userId — achievements for a specific user (by id)
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const rank = await User.countDocuments({ role: "student", xp: { $gt: user.xp } }) + 1;

    const milestones = [
      {
        id: "m1",
        title: "Content Scholar",
        description: "Complete 5 more lessons",
        progress: 80,
        status: "In Progress",
      },
      {
        id: "m2",
        title: "Consistent Learner",
        description: "Maintain streak for 3 more days",
        progress: Math.min(100, Math.round((user.streak / 7) * 100)),
        status: "In Progress",
        current: `${user.streak}/7 Days`,
      },
      {
        id: "m3",
        title: "Perfect Score",
        description: "Score 100% on next quiz",
        progress: 0,
        status: "Pending",
      },
    ];

    res.json({ xp: user.xp, streak: user.streak, rank, badges: user.badges, milestones });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch achievements" });
  }
});

module.exports = router;
