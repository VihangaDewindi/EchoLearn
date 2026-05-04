const router = require("express").Router();
const { verifyToken } = require("../middleware/auth");

const NAVIGATION_INTENTS = {
  navigate_lessons: [
    "lesson", "lessons", "go to lessons", "open lessons", "my lessons",
    "start lesson", "resume lesson", "continue lesson", "continue learning"
  ],
  navigate_quiz: [
    "quiz", "quizzes", "open quiz", "take quiz", "start quiz", "test", "exam"
  ],
  navigate_achievements: [
    "achievement", "achievements", "badges", "rewards", "trophy", "trophies", "show achievements"
  ],
  navigate_dashboard: [
    "dashboard", "home", "go home", "main page", "go to dashboard"
  ],
  navigate_courses: [
    "courses", "subjects", "curriculum", "open courses", "my courses"
  ],
  navigate_profile: [
    "profile", "my profile", "account", "settings"
  ],
  where_am_i: [
    "where am i", "what page", "current page", "location"
  ],
  help: [
    "help", "what can you do", "commands", "voice commands", "what can i say"
  ],
};

function classifyLocally(command) {
  const lc = command.toLowerCase();
  for (const [intent, keywords] of Object.entries(NAVIGATION_INTENTS)) {
    if (keywords.some((kw) => lc.includes(kw))) {
      return intent;
    }
  }
  return null;
}

const INTENT_ROUTES = {
  navigate_lessons: "/Student/lessons",
  navigate_quiz: "/Student/quiz",
  navigate_achievements: "/Student/achievements",
  navigate_dashboard: "/Student/dashboard",
  navigate_courses: "/Student/courses",
  navigate_profile: "/Student/profile",
};

/* ─── POST /api/voice/process ───────────────────────────────── */
router.post("/process", verifyToken, async (req, res) => {
  const { command, context } = req.body;

  if (!command || typeof command !== "string") {
    return res.status(400).json({ error: "command is required" });
  }

  // Try Gemini first, fall back to local classification
  if (process.env.GEMINI_API_KEY) {
    try {
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
You are a voice navigation assistant for EchoLearn, an educational platform for children with disabilities.
The student said: "${command}"
Current page context: ${context || "student dashboard"}

Classify the student's voice command into exactly ONE of these intents:
- navigate_lessons: wants to go to lessons/continue learning
- navigate_quiz: wants to take a quiz or test
- navigate_achievements: wants to see badges/achievements/rewards
- navigate_dashboard: wants to go home/dashboard
- navigate_courses: wants to see subjects/courses
- navigate_profile: wants to see their profile
- where_am_i: asking where they are
- help: asking for help or available commands
- unknown: none of the above

Respond with ONLY a JSON object in this exact format (no markdown, no explanation):
{"intent":"<intent_name>","confidence":<0.0-1.0>,"message":"<friendly spoken response for child>"}
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const parsed = JSON.parse(text);

      const action = parsed.intent === "where_am_i" || parsed.intent === "help"
        ? "speak"
        : parsed.intent === "unknown"
        ? "unknown"
        : "navigate";

      return res.json({
        action,
        intent: parsed.intent,
        target: INTENT_ROUTES[parsed.intent] || null,
        message: parsed.message,
        confidence: parsed.confidence,
        source: "gemini",
      });
    } catch (err) {
      console.error("Gemini voice error, falling back to local:", err.message);
    }
  }

  // Local fallback
  const intent = classifyLocally(command);

  if (intent === "where_am_i") {
    return res.json({
      action: "speak",
      intent,
      target: null,
      message: `You are on the ${context || "student dashboard"} page. You can say: go to lessons, open quiz, show achievements, or go home.`,
      source: "local",
    });
  }

  if (intent === "help") {
    return res.json({
      action: "speak",
      intent,
      target: null,
      message: "You can say: go to lessons, open quiz, show achievements, go home, open courses, or where am I.",
      source: "local",
    });
  }

  if (intent && INTENT_ROUTES[intent]) {
    return res.json({
      action: "navigate",
      intent,
      target: INTENT_ROUTES[intent],
      message: `Taking you to ${intent.replace("navigate_", "").replace("_", " ")} now.`,
      source: "local",
    });
  }

  res.json({
    action: "unknown",
    intent: "unknown",
    target: null,
    message: "Sorry, I did not understand that. Try saying: go to lessons, open quiz, or show achievements.",
    source: "local",
  });
});

module.exports = router;
