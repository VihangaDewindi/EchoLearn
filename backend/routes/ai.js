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
        facts.push(`${item.title}: ${item.text}`);
      });
    }
  });

  const cleanFacts = facts
    .map((f) => f.replace(/\s+/g, " ").trim())
    .filter((f) => f.length > 30);

  const questions = cleanFacts.slice(0, 10).map((fact, index) => {
    const wrongOptions = cleanFacts
      .filter((_, i) => i !== index)
      .slice(0, 3);

    while (wrongOptions.length < 3) {
      wrongOptions.push("This is not the correct answer for this question.");
    }

    const options = [
      {
        letter: "A",
        title: fact.slice(0, 130),
        description: "Correct answer from the selected lesson.",
        isCorrect: true,
      },
      {
        letter: "B",
        title: wrongOptions[0].slice(0, 130),
        description: "Incorrect option",
        isCorrect: false,
      },
      {
        letter: "C",
        title: wrongOptions[1].slice(0, 130),
        description: "Incorrect option",
        isCorrect: false,
      },
      {
        letter: "D",
        title: wrongOptions[2].slice(0, 130),
        description: "Incorrect option",
        isCorrect: false,
      },
    ];

    return {
      question: "Which statement from the lesson is correct?",
      options,
    };
  });

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
