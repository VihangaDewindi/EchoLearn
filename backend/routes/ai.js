const router = require("express").Router();
const Groq = require("groq-sdk");
const Lesson = require("../models/Lesson");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function buildLocalQuizFromLesson(lesson) {
  const facts = [];

  lesson.blocks.forEach((block) => {
    if (block.text) facts.push(block.text);
    if (block.items) {
      block.items.forEach((item) => {
        if (item.title && item.text) facts.push(`${item.title}: ${item.text}`);
        else if (item.title) facts.push(item.title);
      });
    }
  });

  const cleanFacts = facts
    .map((f) => f.replace(/\s+/g, " ").trim())
    .filter((f) => f.length > 20);

  // Need at least 4 facts for distractors; pad if necessary
  while (cleanFacts.length < 4) {
    cleanFacts.push(`${lesson.title} is a lesson about ${lesson.subject}.`);
  }

  // Generate up to 10 questions, cycling through facts if fewer than 10
  const TARGET = 10;
  const questions = [];
  for (let idx = 0; idx < TARGET; idx++) {
    const factIdx = idx % cleanFacts.length;
    const fact = cleanFacts[factIdx];

    const wrongOptions = cleanFacts
      .filter((_, i) => i !== factIdx)
      .slice(0, 3);

    while (wrongOptions.length < 3) {
      wrongOptions.push(`This does not describe ${lesson.title}.`);
    }

    // Shuffle correct answer into a random position (A-D)
    const pos = idx % 4;
    const allOpts = [fact, wrongOptions[0], wrongOptions[1], wrongOptions[2]];
    const correct = allOpts.splice(0, 1)[0];
    allOpts.splice(pos, 0, correct);

    questions.push({
      question: `Question ${idx + 1}: Which of the following is correct about "${lesson.title}"?`,
      options: allOpts.map((o, i) => ({
        letter: ["A", "B", "C", "D"][i],
        title: o.slice(0, 130),
        description: i === pos ? "Correct answer from the lesson." : "Incorrect option",
        isCorrect: i === pos,
      })),
    });
  }

  return questions;
}

router.post("/generate-quiz", async (req, res) => {
  let lesson;

  try {
    const { lessonSlug } = req.body;
    console.log("Quiz requested for slug:", lessonSlug);

    lesson = await Lesson.findOne({ slug: lessonSlug });
    console.log("Lesson found:", lesson?.title);

    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    const lessonText = lesson.blocks
      .map((b) => {
        if (b.text) return b.text;

        if (b.items) {
          return b.items.map((i) => `${i.title}: ${i.text}`).join(" ");
        }

        return "";
      })
      .join("\n");

    const seed = Date.now();
    const prompt = `
You are a school quiz generator. Request ID: ${seed}

Generate exactly 10 UNIQUE multiple-choice quiz questions from this lesson content.
Each call must produce DIFFERENT questions — vary which facts, examples, and concepts you test.

Lesson title: ${lesson.title}
Subject: ${lesson.subject}
Grade: ${lesson.grade}

LESSON CONTENT:
${lessonText}

Strict rules:
- Every question must be based only on the lesson content above.
- Do not ask general subject questions.
- Do not use outside knowledge.
- Do not repeat the same question.
- Pick different angles, facts, and details from throughout the lesson.
- Each question must test a specific fact, concept, example, or explanation from the lesson.
- Exactly 4 options: A, B, C, D.
- Exactly one correct answer.
- Return ONLY valid JSON array.

Format:
[
  {
    "question": "Question text here",
    "options": [
      { "letter": "A", "title": "Option text", "description": "Short explanation", "isCorrect": false },
      { "letter": "B", "title": "Option text", "description": "Short explanation", "isCorrect": true },
      { "letter": "C", "title": "Option text", "description": "Short explanation", "isCorrect": false },
      { "letter": "D", "title": "Option text", "description": "Short explanation", "isCorrect": false }
    ]
  }
]
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a school quiz generator. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
    });

    const text = completion.choices[0].message.content;



    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const quiz = JSON.parse(cleaned);

    return res.json({
      quiz,
      source: "ai",
    });

  } catch (err) {
    console.error("Groq quiz error:", err.message);

    const fallbackQuiz = lesson
      ? buildLocalQuizFromLesson(lesson)
      : [];

    return res.json({
      quiz: fallbackQuiz,
      source: "local-fallback",
    });
  }
});

module.exports = router;
