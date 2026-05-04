const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({
    fullName: "Vihanga Dewindi",
    level: 9,
    xp: "2,450"
  });
});

module.exports = router;
