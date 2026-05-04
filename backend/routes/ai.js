const router = require("express").Router();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key",
});

// Detect subject from topic string
const detectSubject = (topic) => {
  const t = (topic || "").toLowerCase();
  if (t.includes("math") || t.includes("fraction") || t.includes("number") || t.includes("geometry") ||
      t.includes("algebra") || t.includes("equation") || t.includes("decimal") || t.includes("multipli") ||
      t.includes("division") || t.includes("addition") || t.includes("subtraction") || t.includes("quadratic") ||
      t.includes("counting") || t.includes("percentage")) return "mathematics";
  if (t.includes("science") || t.includes("photosynthesis") || t.includes("plant") || t.includes("animal") ||
      t.includes("water cycle") || t.includes("force") || t.includes("motion") || t.includes("light") ||
      t.includes("sound") || t.includes("human body") || t.includes("chemical") || t.includes("electricity") ||
      t.includes("genetic") || t.includes("evolution") || t.includes("living") || t.includes("habitat")) return "science";
  if (t.includes("english") || t.includes("grammar") || t.includes("phonics") || t.includes("alphabet") ||
      t.includes("sentence") || t.includes("writing") || t.includes("comprehension") || t.includes("poetry") ||
      t.includes("essay") || t.includes("literary") || t.includes("prose") || t.includes("reading")) return "english";
  if (t.includes("sinhala") || t.includes("sinhala")) return "sinhala";
  if (t.includes("tamil")) return "tamil";
  return "general";
};

// Subject-aware fallback questions
const getFallbackQuiz = (topic) => {
  const subject = detectSubject(topic);
  const t = topic || "this topic";

  const subjectQuestions = {
    mathematics: [
      {
        question: "What is a fraction?",
        options: [
          { letter: "A", title: "Part of a whole", description: "A number representing one or more parts of something divided into equal pieces.", isCorrect: true },
          { letter: "B", title: "A whole number", description: "Numbers like 1, 2, 3 with no fractional part.", isCorrect: false },
          { letter: "C", title: "A multiplication symbol", description: "The symbol × used for multiplying numbers.", isCorrect: false },
          { letter: "D", title: "A type of angle", description: "A geometric measurement in degrees.", isCorrect: false }
        ]
      },
      {
        question: "In the fraction 3/4, what does the number 4 represent?",
        options: [
          { letter: "A", title: "The numerator", description: "The top number that shows how many parts you have.", isCorrect: false },
          { letter: "B", title: "The denominator", description: "The bottom number showing total equal parts the whole is divided into.", isCorrect: true },
          { letter: "C", title: "The product", description: "The result of multiplying two numbers.", isCorrect: false },
          { letter: "D", title: "The quotient", description: "The result of dividing two numbers.", isCorrect: false }
        ]
      },
      {
        question: "Which is the largest fraction: 1/2, 1/4, 1/3, or 1/8?",
        options: [
          { letter: "A", title: "1/4", description: "One part out of four equal parts.", isCorrect: false },
          { letter: "B", title: "1/8", description: "One part out of eight equal parts.", isCorrect: false },
          { letter: "C", title: "1/2", description: "One part out of two equal parts — the largest of the group.", isCorrect: true },
          { letter: "D", title: "1/3", description: "One part out of three equal parts.", isCorrect: false }
        ]
      },
      {
        question: "What is 2 + 3 equal to?",
        options: [
          { letter: "A", title: "4", description: "One less than the correct answer.", isCorrect: false },
          { letter: "B", title: "5", description: "The sum of 2 and 3.", isCorrect: true },
          { letter: "C", title: "6", description: "One more than the correct answer.", isCorrect: false },
          { letter: "D", title: "23", description: "Placing the digits side by side instead of adding.", isCorrect: false }
        ]
      },
      {
        question: "How many sides does a triangle have?",
        options: [
          { letter: "A", title: "2 sides", description: "A shape with only 2 sides is not a closed polygon.", isCorrect: false },
          { letter: "B", title: "3 sides", description: "A triangle always has exactly 3 sides.", isCorrect: true },
          { letter: "C", title: "4 sides", description: "A shape with 4 sides is a quadrilateral.", isCorrect: false },
          { letter: "D", title: "5 sides", description: "A pentagon has 5 sides.", isCorrect: false }
        ]
      },
      {
        question: "What is 5 × 6?",
        options: [
          { letter: "A", title: "11", description: "The result of adding 5 and 6, not multiplying.", isCorrect: false },
          { letter: "B", title: "56", description: "Placing the digits side by side — not multiplication.", isCorrect: false },
          { letter: "C", title: "30", description: "5 groups of 6 equals 30.", isCorrect: true },
          { letter: "D", title: "25", description: "5 multiplied by 5, not 6.", isCorrect: false }
        ]
      },
      {
        question: "What is the value of x in: x + 7 = 15?",
        options: [
          { letter: "A", title: "x = 6", description: "7 + 6 = 13, not 15.", isCorrect: false },
          { letter: "B", title: "x = 8", description: "7 + 8 = 15, so x = 8.", isCorrect: true },
          { letter: "C", title: "x = 22", description: "Adding 7 and 15 instead of subtracting.", isCorrect: false },
          { letter: "D", title: "x = 9", description: "7 + 9 = 16, not 15.", isCorrect: false }
        ]
      },
      {
        question: "What is 50% of 200?",
        options: [
          { letter: "A", title: "50", description: "That would be 25% of 200.", isCorrect: false },
          { letter: "B", title: "100", description: "50% means half, and half of 200 is 100.", isCorrect: true },
          { letter: "C", title: "150", description: "That would be 75% of 200.", isCorrect: false },
          { letter: "D", title: "200", description: "That would be 100% of 200.", isCorrect: false }
        ]
      },
      {
        question: "What is the perimeter of a square with side length 5?",
        options: [
          { letter: "A", title: "10", description: "That would be two sides added together.", isCorrect: false },
          { letter: "B", title: "20", description: "A square has 4 equal sides: 4 × 5 = 20.", isCorrect: true },
          { letter: "C", title: "25", description: "That is the area of the square, not the perimeter.", isCorrect: false },
          { letter: "D", title: "15", description: "That would be three sides added together.", isCorrect: false }
        ]
      },
      {
        question: `What is the topic of ${t} mainly about?`,
        options: [
          { letter: "A", title: "Working with numbers and patterns", description: "Mathematics involves understanding quantities, shapes, and relationships.", isCorrect: true },
          { letter: "B", title: "Understanding living organisms", description: "This describes science and biology.", isCorrect: false },
          { letter: "C", title: "Writing and reading skills", description: "This describes English language arts.", isCorrect: false },
          { letter: "D", title: "Studying history and culture", description: "This describes social studies.", isCorrect: false }
        ]
      }
    ],

    science: [
      {
        question: "What do plants need to make their own food through photosynthesis?",
        options: [
          { letter: "A", title: "Water, sunlight, and carbon dioxide", description: "Plants use these three ingredients to produce glucose (food).", isCorrect: true },
          { letter: "B", title: "Water and soil only", description: "Soil provides minerals but is not the main ingredient for photosynthesis.", isCorrect: false },
          { letter: "C", title: "Oxygen and sunlight", description: "Plants produce oxygen — they don't use it for photosynthesis.", isCorrect: false },
          { letter: "D", title: "Rain and wind", description: "Wind and rain do not directly power photosynthesis.", isCorrect: false }
        ]
      },
      {
        question: "What gas do plants release during photosynthesis?",
        options: [
          { letter: "A", title: "Carbon dioxide", description: "Plants absorb CO₂ during photosynthesis — they don't release it.", isCorrect: false },
          { letter: "B", title: "Nitrogen", description: "Nitrogen is a component of air but not a product of photosynthesis.", isCorrect: false },
          { letter: "C", title: "Oxygen", description: "Oxygen is released as a by-product when plants split water molecules.", isCorrect: true },
          { letter: "D", title: "Hydrogen", description: "Hydrogen combines with CO₂ to form glucose — it is not released.", isCorrect: false }
        ]
      },
      {
        question: "Which part of the plant is mainly responsible for photosynthesis?",
        options: [
          { letter: "A", title: "Roots", description: "Roots absorb water and minerals from the soil.", isCorrect: false },
          { letter: "B", title: "Stem", description: "The stem transports water and nutrients but does little photosynthesis.", isCorrect: false },
          { letter: "C", title: "Leaves", description: "Leaves contain chlorophyll and are the main site of photosynthesis.", isCorrect: true },
          { letter: "D", title: "Flowers", description: "Flowers are for reproduction, not photosynthesis.", isCorrect: false }
        ]
      },
      {
        question: "What is the name of the green pigment in plants?",
        options: [
          { letter: "A", title: "Melanin", description: "Melanin is a pigment found in human skin, not plants.", isCorrect: false },
          { letter: "B", title: "Haemoglobin", description: "Haemoglobin carries oxygen in red blood cells.", isCorrect: false },
          { letter: "C", title: "Chlorophyll", description: "Chlorophyll absorbs sunlight and gives plants their green colour.", isCorrect: true },
          { letter: "D", title: "Keratin", description: "Keratin is a protein found in hair and nails.", isCorrect: false }
        ]
      },
      {
        question: "Which of the following is a living thing?",
        options: [
          { letter: "A", title: "A rock", description: "Rocks are non-living — they don't grow or reproduce.", isCorrect: false },
          { letter: "B", title: "A tree", description: "Trees are living organisms that grow, reproduce, and respond to the environment.", isCorrect: true },
          { letter: "C", title: "A cloud", description: "Clouds are made of water vapour — not living.", isCorrect: false },
          { letter: "D", title: "A river", description: "A river is water flowing — it is non-living.", isCorrect: false }
        ]
      },
      {
        question: "What is the water cycle?",
        options: [
          { letter: "A", title: "Water flowing only in rivers", description: "Water cycle includes more than just rivers.", isCorrect: false },
          { letter: "B", title: "The continuous movement of water through evaporation, condensation, and precipitation", description: "The water cycle describes how water moves through Earth's systems.", isCorrect: true },
          { letter: "C", title: "Water freezing in winter", description: "Freezing is one small part of a much larger cycle.", isCorrect: false },
          { letter: "D", title: "Ocean tides rising and falling", description: "Tides are caused by the Moon's gravity, not the water cycle.", isCorrect: false }
        ]
      },
      {
        question: "What force pulls objects towards the Earth?",
        options: [
          { letter: "A", title: "Magnetism", description: "Magnetism attracts iron objects, not all objects.", isCorrect: false },
          { letter: "B", title: "Friction", description: "Friction opposes motion between surfaces.", isCorrect: false },
          { letter: "C", title: "Gravity", description: "Gravity is the force that pulls all objects toward Earth's centre.", isCorrect: true },
          { letter: "D", title: "Tension", description: "Tension is the pulling force in ropes or strings.", isCorrect: false }
        ]
      },
      {
        question: "What is the function of the heart?",
        options: [
          { letter: "A", title: "To digest food", description: "Digestion happens in the stomach and intestines.", isCorrect: false },
          { letter: "B", title: "To filter blood", description: "The kidneys filter blood, not the heart.", isCorrect: false },
          { letter: "C", title: "To pump blood around the body", description: "The heart is a muscular pump that circulates blood.", isCorrect: true },
          { letter: "D", title: "To produce oxygen", description: "Oxygen enters the body through the lungs.", isCorrect: false }
        ]
      },
      {
        question: "Which planet is closest to the Sun?",
        options: [
          { letter: "A", title: "Earth", description: "Earth is the third planet from the Sun.", isCorrect: false },
          { letter: "B", title: "Venus", description: "Venus is the second planet from the Sun.", isCorrect: false },
          { letter: "C", title: "Mercury", description: "Mercury is the first and closest planet to the Sun.", isCorrect: true },
          { letter: "D", title: "Mars", description: "Mars is the fourth planet from the Sun.", isCorrect: false }
        ]
      },
      {
        question: `What is the main focus of the science topic: ${t}?`,
        options: [
          { letter: "A", title: "Understanding the natural world", description: "Science explores how living things, matter, and energy work.", isCorrect: true },
          { letter: "B", title: "Counting and calculating", description: "Counting and calculation are mathematics skills.", isCorrect: false },
          { letter: "C", title: "Writing stories", description: "Story writing is an English language skill.", isCorrect: false },
          { letter: "D", title: "Learning about history", description: "History is studied in social sciences, not physical science.", isCorrect: false }
        ]
      }
    ],

    english: [
      {
        question: "What is a noun?",
        options: [
          { letter: "A", title: "A word that describes an action", description: "Words describing actions are called verbs.", isCorrect: false },
          { letter: "B", title: "A person, place, thing, or idea", description: "Nouns name people, places, things, or concepts.", isCorrect: true },
          { letter: "C", title: "A word that modifies a verb", description: "Words that modify verbs are called adverbs.", isCorrect: false },
          { letter: "D", title: "A connecting word", description: "Connecting words are called conjunctions.", isCorrect: false }
        ]
      },
      {
        question: "Which of the following is a complete sentence?",
        options: [
          { letter: "A", title: "Running fast", description: "This is a phrase — it has no subject.", isCorrect: false },
          { letter: "B", title: "The dog barked loudly.", description: "This sentence has a subject (the dog), a verb (barked), and ends with a full stop.", isCorrect: true },
          { letter: "C", title: "Under the tree", description: "This is a prepositional phrase — not a complete sentence.", isCorrect: false },
          { letter: "D", title: "Blue and happy", description: "This is a phrase with no verb or subject.", isCorrect: false }
        ]
      },
      {
        question: "What does a vowel sound represent?",
        options: [
          { letter: "A", title: "A sound made with the mouth closed", description: "Vowels are made with an open mouth.", isCorrect: false },
          { letter: "B", title: "The letters A, E, I, O, U and their sounds", description: "Vowels are the five letters that form the core sounds of words.", isCorrect: true },
          { letter: "C", title: "Only the letter A", description: "There are five vowel letters: A, E, I, O, U.", isCorrect: false },
          { letter: "D", title: "Any letter at the start of a word", description: "Position in a word does not determine if a letter is a vowel.", isCorrect: false }
        ]
      },
      {
        question: "What punctuation mark ends a question?",
        options: [
          { letter: "A", title: "Full stop (.)", description: "A full stop ends a statement, not a question.", isCorrect: false },
          { letter: "B", title: "Comma (,)", description: "A comma separates clauses or items in a list.", isCorrect: false },
          { letter: "C", title: "Question mark (?)", description: "A question mark always ends a direct question.", isCorrect: true },
          { letter: "D", title: "Exclamation mark (!)", description: "An exclamation mark shows strong emotion.", isCorrect: false }
        ]
      },
      {
        question: "What is a synonym?",
        options: [
          { letter: "A", title: "A word with the opposite meaning", description: "Words with opposite meanings are antonyms.", isCorrect: false },
          { letter: "B", title: "A word with a similar meaning", description: "Synonyms are words that mean nearly the same thing.", isCorrect: true },
          { letter: "C", title: "A word that sounds the same", description: "Words that sound the same but have different meanings are homophones.", isCorrect: false },
          { letter: "D", title: "A describing word", description: "Describing words are called adjectives.", isCorrect: false }
        ]
      },
      {
        question: "Which sentence uses correct grammar?",
        options: [
          { letter: "A", title: "She don't like apples.", description: "'Don't' is incorrect with 'she' — should be 'doesn't'.", isCorrect: false },
          { letter: "B", title: "They is going to school.", description: "'Is' is incorrect with 'they' — should be 'are'.", isCorrect: false },
          { letter: "C", title: "He doesn't like cold weather.", description: "Correct subject-verb agreement: 'He doesn't'.", isCorrect: true },
          { letter: "D", title: "I goes to the park every day.", description: "'Goes' is incorrect with 'I' — should be 'go'.", isCorrect: false }
        ]
      },
      {
        question: "What is a simile?",
        options: [
          { letter: "A", title: "Giving human qualities to an object", description: "Giving objects human qualities is called personification.", isCorrect: false },
          { letter: "B", title: "An exaggerated statement", description: "Exaggerated statements are called hyperbole.", isCorrect: false },
          { letter: "C", title: "A comparison using 'like' or 'as'", description: "Similes compare two things using 'like' or 'as', e.g. 'as fast as a cheetah'.", isCorrect: true },
          { letter: "D", title: "Words that start with the same sound", description: "Starting words with the same sound is alliteration.", isCorrect: false }
        ]
      },
      {
        question: "What does the prefix 'un-' mean?",
        options: [
          { letter: "A", title: "Again", description: "The prefix 're-' means again.", isCorrect: false },
          { letter: "B", title: "Not or opposite of", description: "Un- reverses the meaning, e.g. 'unhappy' means not happy.", isCorrect: true },
          { letter: "C", title: "Before", description: "The prefix 'pre-' means before.", isCorrect: false },
          { letter: "D", title: "After", description: "The prefix 'post-' means after.", isCorrect: false }
        ]
      },
      {
        question: "How many letters are in the English alphabet?",
        options: [
          { letter: "A", title: "24 letters", description: "There are 26, not 24, letters in the English alphabet.", isCorrect: false },
          { letter: "B", title: "26 letters", description: "The English alphabet has 26 letters from A to Z.", isCorrect: true },
          { letter: "C", title: "28 letters", description: "There are 26, not 28, letters in the English alphabet.", isCorrect: false },
          { letter: "D", title: "30 letters", description: "There are 26, not 30, letters in the English alphabet.", isCorrect: false }
        ]
      },
      {
        question: `In the English topic "${t}", what skill is most important?`,
        options: [
          { letter: "A", title: "Reading and writing clearly", description: "English skills involve understanding language and expressing ideas effectively.", isCorrect: true },
          { letter: "B", title: "Solving equations", description: "Equations belong to mathematics.", isCorrect: false },
          { letter: "C", title: "Understanding chemical reactions", description: "Chemical reactions are studied in science.", isCorrect: false },
          { letter: "D", title: "Drawing geometric shapes", description: "Geometric shapes are studied in mathematics.", isCorrect: false }
        ]
      }
    ],

    sinhala: [
      {
        question: "How many letters are in the Sinhala alphabet (akshara mala)?",
        options: [
          { letter: "A", title: "26 letters", description: "26 is the number of English alphabet letters, not Sinhala.", isCorrect: false },
          { letter: "B", title: "About 60 letters", description: "The Sinhala alphabet has approximately 60 letters including vowels and consonants.", isCorrect: true },
          { letter: "C", title: "10 letters", description: "10 is far too few for the Sinhala alphabet.", isCorrect: false },
          { letter: "D", title: "100 letters", description: "100 is far too many for the Sinhala alphabet.", isCorrect: false }
        ]
      },
      {
        question: "Sinhala is the official language of which country?",
        options: [
          { letter: "A", title: "India", description: "India has many official languages but Sinhala is not one of them.", isCorrect: false },
          { letter: "B", title: "Sri Lanka", description: "Sinhala is an official language of Sri Lanka.", isCorrect: true },
          { letter: "C", title: "Bangladesh", description: "Bangladesh's official language is Bengali.", isCorrect: false },
          { letter: "D", title: "Nepal", description: "Nepal's official language is Nepali.", isCorrect: false }
        ]
      },
      {
        question: "What script is used to write Sinhala?",
        options: [
          { letter: "A", title: "Devanagari", description: "Devanagari is used for Hindi and Sanskrit.", isCorrect: false },
          { letter: "B", title: "Latin script", description: "Latin script is used for English and European languages.", isCorrect: false },
          { letter: "C", title: "Sinhala script", description: "Sinhala has its own unique alphabetic script derived from Brahmi.", isCorrect: true },
          { letter: "D", title: "Arabic script", description: "Arabic script is used for Arabic and related languages.", isCorrect: false }
        ]
      },
      {
        question: "In Sinhala, what is the term for a vowel?",
        options: [
          { letter: "A", title: "Byanjana", description: "Byanjana refers to consonants in Sinhala.", isCorrect: false },
          { letter: "B", title: "Swaraya", description: "Swaraya (or swara) refers to vowels in Sinhala.", isCorrect: true },
          { letter: "C", title: "Pathaya", description: "Pathaya refers to a lesson or chapter.", isCorrect: false },
          { letter: "D", title: "Vachanaya", description: "Vachanaya refers to a sentence or statement.", isCorrect: false }
        ]
      },
      {
        question: "Which of these is a greeting in Sinhala?",
        options: [
          { letter: "A", title: "Vanakkam", description: "Vanakkam is a Tamil greeting.", isCorrect: false },
          { letter: "B", title: "Namaste", description: "Namaste is a Hindi/Sanskrit greeting.", isCorrect: false },
          { letter: "C", title: "Ayubowan", description: "Ayubowan means 'may you live long' — a traditional Sinhala greeting.", isCorrect: true },
          { letter: "D", title: "Bonjour", description: "Bonjour is a French greeting.", isCorrect: false }
        ]
      },
      {
        question: "Sinhala literature dates back over how many years?",
        options: [
          { letter: "A", title: "100 years", description: "Sinhala literature is far older than 100 years.", isCorrect: false },
          { letter: "B", title: "500 years", description: "Sinhala literature dates back well over 500 years.", isCorrect: false },
          { letter: "C", title: "Over 2,000 years", description: "Sinhala literature has a recorded history of over 2,000 years.", isCorrect: true },
          { letter: "D", title: "50 years", description: "Sinhala literature is far older than 50 years.", isCorrect: false }
        ]
      },
      {
        question: "What are the two categories of letters in the Sinhala alphabet?",
        options: [
          { letter: "A", title: "Nouns and verbs", description: "Nouns and verbs are word classes, not letter categories.", isCorrect: false },
          { letter: "B", title: "Vowels (Swar) and consonants (Byanjana)", description: "Like most alphabets, Sinhala letters are categorised as vowels and consonants.", isCorrect: true },
          { letter: "C", title: "Short words and long words", description: "Word length is not a letter category.", isCorrect: false },
          { letter: "D", title: "Ancient and modern letters", description: "Letters are not categorised by age in this way.", isCorrect: false }
        ]
      },
      {
        question: "In Sinhala grammar, what is 'naama padam'?",
        options: [
          { letter: "A", title: "A verb", description: "Verbs are 'kriya pada' in Sinhala grammar.", isCorrect: false },
          { letter: "B", title: "A noun", description: "Naama padam refers to a noun — the name of a person, place, or thing.", isCorrect: true },
          { letter: "C", title: "An adjective", description: "Adjectives are 'visheshana' in Sinhala grammar.", isCorrect: false },
          { letter: "D", title: "A preposition", description: "Prepositions are 'kriya visheshana' in Sinhala grammar.", isCorrect: false }
        ]
      },
      {
        question: "Which poet is famous for classical Sinhala poetry?",
        options: [
          { letter: "A", title: "Thiruvalluvar", description: "Thiruvalluvar is a famous Tamil poet known for the Thirukkural.", isCorrect: false },
          { letter: "B", title: "Alagiyawanna Mukaveti", description: "Alagiyawanna was a renowned Sinhala poet from the 16th–17th century.", isCorrect: true },
          { letter: "C", title: "William Shakespeare", description: "Shakespeare was an English playwright and poet.", isCorrect: false },
          { letter: "D", title: "Rabindranath Tagore", description: "Tagore was a Bengali poet and Nobel laureate.", isCorrect: false }
        ]
      },
      {
        question: `What is the best way to improve your ${t} skills?`,
        options: [
          { letter: "A", title: "Regular reading and writing practice", description: "Consistent practice is the key to mastering Sinhala language skills.", isCorrect: true },
          { letter: "B", title: "Solving mathematics problems", description: "Maths practice improves numeracy, not language skills.", isCorrect: false },
          { letter: "C", title: "Conducting science experiments", description: "Science experiments develop inquiry skills, not Sinhala language skills.", isCorrect: false },
          { letter: "D", title: "Learning computer programming", description: "Programming uses logic, not Sinhala language literacy.", isCorrect: false }
        ]
      }
    ],

    tamil: [
      {
        question: "Tamil is one of the world's oldest languages. Approximately how old is it?",
        options: [
          { letter: "A", title: "About 500 years old", description: "Tamil is far older than 500 years.", isCorrect: false },
          { letter: "B", title: "Over 2,000 years old", description: "Tamil has a recorded literary history of over 2,000 years.", isCorrect: true },
          { letter: "C", title: "About 100 years old", description: "Tamil is far older than 100 years.", isCorrect: false },
          { letter: "D", title: "About 1,000 years old", description: "Tamil literature dates back well over 2,000 years.", isCorrect: false }
        ]
      },
      {
        question: "How many letters are in the Tamil alphabet?",
        options: [
          { letter: "A", title: "26 letters", description: "26 is the number of English alphabet letters.", isCorrect: false },
          { letter: "B", title: "247 letters", description: "The Tamil alphabet has 247 letters (vowels, consonants, and compound letters).", isCorrect: true },
          { letter: "C", title: "50 letters", description: "50 is too few for the Tamil alphabet.", isCorrect: false },
          { letter: "D", title: "100 letters", description: "100 is too few for the full Tamil alphabet.", isCorrect: false }
        ]
      },
      {
        question: "Tamil is an official language in which countries?",
        options: [
          { letter: "A", title: "India only", description: "Tamil is official in India but also in other countries.", isCorrect: false },
          { letter: "B", title: "Sri Lanka only", description: "Tamil is official in Sri Lanka but also in other countries.", isCorrect: false },
          { letter: "C", title: "India, Sri Lanka, and Singapore", description: "Tamil has official status in India (Tamil Nadu), Sri Lanka, and Singapore.", isCorrect: true },
          { letter: "D", title: "Bangladesh and Nepal", description: "These countries do not have Tamil as an official language.", isCorrect: false }
        ]
      },
      {
        question: "What is the famous Tamil classical text known as the Thirukkural about?",
        options: [
          { letter: "A", title: "War stories", description: "The Thirukkural is not primarily about war.", isCorrect: false },
          { letter: "B", title: "Ethics, political wisdom, and love", description: "The Thirukkural by Thiruvalluvar contains 1,330 couplets on virtue, wealth, and love.", isCorrect: true },
          { letter: "C", title: "Mathematical formulas", description: "The Thirukkural is a literary, not mathematical, work.", isCorrect: false },
          { letter: "D", title: "Scientific discoveries", description: "The Thirukkural is a work of ethics and philosophy.", isCorrect: false }
        ]
      },
      {
        question: "In Tamil grammar, what is 'peyar' (பெயர்)?",
        options: [
          { letter: "A", title: "A verb", description: "Verbs are called 'vinai' in Tamil.", isCorrect: false },
          { letter: "B", title: "A noun (a name/naming word)", description: "Peyar means name and refers to nouns in Tamil grammar.", isCorrect: true },
          { letter: "C", title: "An adjective", description: "Adjectives are called 'peyaradi' or modifiers in Tamil.", isCorrect: false },
          { letter: "D", title: "An adverb", description: "Adverbs are 'vinayadi' in Tamil grammar.", isCorrect: false }
        ]
      },
      {
        question: "What is the greeting 'Vanakkam' used for in Tamil?",
        options: [
          { letter: "A", title: "To say goodbye", description: "Goodbye in Tamil is 'poivittuvaren' or 'santhippom'.", isCorrect: false },
          { letter: "B", title: "To say hello or welcome someone", description: "Vanakkam is a respectful greeting meaning 'hello' or 'welcome'.", isCorrect: true },
          { letter: "C", title: "To ask for help", description: "Asking for help would use different Tamil words.", isCorrect: false },
          { letter: "D", title: "To say thank you", description: "Thank you in Tamil is 'nandri'.", isCorrect: false }
        ]
      },
      {
        question: "What are the basic vowels (uyir eluttu) in Tamil?",
        options: [
          { letter: "A", title: "Only A and E", description: "Tamil has 12 vowels, not just A and E.", isCorrect: false },
          { letter: "B", title: "12 vowels from அ to ஔ", description: "Tamil has 12 vowels (uyir eluttu) from அ (a) to ஔ (au).", isCorrect: true },
          { letter: "C", title: "5 vowels like English", description: "Tamil has 12 vowels, more than English's 5.", isCorrect: false },
          { letter: "D", title: "20 vowels", description: "Tamil has 12 vowels, not 20.", isCorrect: false }
        ]
      },
      {
        question: "Which of these is a famous Tamil poet?",
        options: [
          { letter: "A", title: "Kalidasa", description: "Kalidasa was a Sanskrit poet and playwright.", isCorrect: false },
          { letter: "B", title: "Thiruvalluvar", description: "Thiruvalluvar is the celebrated Tamil poet who wrote the Thirukkural.", isCorrect: true },
          { letter: "C", title: "Rabindranath Tagore", description: "Tagore was a Bengali poet.", isCorrect: false },
          { letter: "D", title: "William Shakespeare", description: "Shakespeare was an English playwright.", isCorrect: false }
        ]
      },
      {
        question: "Tamil script is written in which direction?",
        options: [
          { letter: "A", title: "Right to left", description: "Arabic and Hebrew are written right to left, not Tamil.", isCorrect: false },
          { letter: "B", title: "Bottom to top", description: "No major script is written bottom to top.", isCorrect: false },
          { letter: "C", title: "Left to right", description: "Tamil is written from left to right, like English.", isCorrect: true },
          { letter: "D", title: "Top to bottom only", description: "Tamil is not written top to bottom in the traditional sense.", isCorrect: false }
        ]
      },
      {
        question: `What is the best way to improve your ${t} skills?`,
        options: [
          { letter: "A", title: "Regular reading and writing practice in Tamil", description: "Consistent practice is the most effective way to master Tamil.", isCorrect: true },
          { letter: "B", title: "Solving mathematics problems", description: "Maths practice improves numeracy, not Tamil language skills.", isCorrect: false },
          { letter: "C", title: "Conducting science experiments", description: "Science experiments develop inquiry skills, not Tamil language skills.", isCorrect: false },
          { letter: "D", title: "Learning computer programming", description: "Programming uses logic, not Tamil language literacy.", isCorrect: false }
        ]
      }
    ],

    general: [
      {
        question: `What is the main focus of the topic: "${t}"?`,
        options: [
          { letter: "A", title: "Learning new knowledge and skills", description: "Education is about building knowledge, understanding, and skills.", isCorrect: true },
          { letter: "B", title: "Memorising without understanding", description: "True learning requires understanding, not just memorisation.", isCorrect: false },
          { letter: "C", title: "Avoiding difficult questions", description: "Facing challenges is an important part of learning.", isCorrect: false },
          { letter: "D", title: "Only watching videos", description: "Active engagement is more effective than passive watching alone.", isCorrect: false }
        ]
      },
      {
        question: "What is the best way to remember new information?",
        options: [
          { letter: "A", title: "Read it once and forget it", description: "A single reading is rarely enough to retain information.", isCorrect: false },
          { letter: "B", title: "Practise regularly and review", description: "Spaced repetition and regular practice strengthen memory.", isCorrect: true },
          { letter: "C", title: "Never ask questions", description: "Asking questions is a key part of learning.", isCorrect: false },
          { letter: "D", title: "Only study the night before a test", description: "Cramming is much less effective than consistent study.", isCorrect: false }
        ]
      },
      {
        question: "Which of the following helps you focus when studying?",
        options: [
          { letter: "A", title: "Noisy, distracting environment", description: "Noise and distractions reduce focus and memory retention.", isCorrect: false },
          { letter: "B", title: "A quiet, organised workspace", description: "A quiet space with minimal distractions helps you concentrate.", isCorrect: true },
          { letter: "C", title: "Watching TV while reading", description: "Multi-tasking reduces the quality of study.", isCorrect: false },
          { letter: "D", title: "Skipping difficult topics", description: "Skipping difficult topics creates gaps in understanding.", isCorrect: false }
        ]
      },
      {
        question: "What does 'comprehension' mean?",
        options: [
          { letter: "A", title: "The ability to run fast", description: "This describes physical fitness, not comprehension.", isCorrect: false },
          { letter: "B", title: "The ability to understand what you read or hear", description: "Comprehension is the ability to understand and interpret information.", isCorrect: true },
          { letter: "C", title: "The ability to draw pictures", description: "Drawing is an artistic skill, not comprehension.", isCorrect: false },
          { letter: "D", title: "The ability to solve equations", description: "Solving equations is a mathematical skill.", isCorrect: false }
        ]
      },
      {
        question: "Why is it important to ask questions when you don't understand something?",
        options: [
          { letter: "A", title: "It wastes time", description: "Asking questions actually saves time by clearing up confusion.", isCorrect: false },
          { letter: "B", title: "It helps you learn and fill gaps in your knowledge", description: "Questions lead to understanding and deeper learning.", isCorrect: true },
          { letter: "C", title: "It makes teachers angry", description: "Good teachers encourage questions as part of learning.", isCorrect: false },
          { letter: "D", title: "It shows weakness", description: "Asking questions shows curiosity and a desire to learn.", isCorrect: false }
        ]
      },
      {
        question: "What does 'feedback' help you do?",
        options: [
          { letter: "A", title: "Give up on difficult subjects", description: "Feedback should encourage you to improve, not give up.", isCorrect: false },
          { letter: "B", title: "Understand your mistakes and improve", description: "Feedback highlights what you did well and what needs improvement.", isCorrect: true },
          { letter: "C", title: "Avoid all challenges", description: "Challenges are opportunities to grow, not things to avoid.", isCorrect: false },
          { letter: "D", title: "Memorise answers without thinking", description: "Feedback encourages thinking, not just memorising.", isCorrect: false }
        ]
      },
      {
        question: "What is the purpose of a quiz?",
        options: [
          { letter: "A", title: "To trick students", description: "Quizzes are designed to assess and reinforce learning.", isCorrect: false },
          { letter: "B", title: "To test and reinforce your knowledge", description: "Quizzes help you recall information and identify what you need to study more.", isCorrect: true },
          { letter: "C", title: "To punish students who don't study", description: "Quizzes are learning tools, not punishments.", isCorrect: false },
          { letter: "D", title: "To finish lessons faster", description: "Quizzes consolidate learning, not speed it up artificially.", isCorrect: false }
        ]
      },
      {
        question: "What is 'critical thinking'?",
        options: [
          { letter: "A", title: "Being critical of everyone around you", description: "Critical thinking is not about criticising others.", isCorrect: false },
          { letter: "B", title: "Analysing information carefully before accepting it", description: "Critical thinking means evaluating evidence and reasoning before forming conclusions.", isCorrect: true },
          { letter: "C", title: "Accepting everything you read as true", description: "Critical thinkers question sources and evaluate evidence.", isCorrect: false },
          { letter: "D", title: "Only thinking about negative things", description: "Critical thinking is about careful analysis, not negativity.", isCorrect: false }
        ]
      },
      {
        question: "Why is reading regularly important for students?",
        options: [
          { letter: "A", title: "It is not important", description: "Regular reading is one of the most effective ways to learn.", isCorrect: false },
          { letter: "B", title: "It builds vocabulary, knowledge, and comprehension skills", description: "Regular reading strengthens language, thinking, and knowledge across all subjects.", isCorrect: true },
          { letter: "C", title: "It only improves one subject", description: "Reading benefits all subjects, not just English.", isCorrect: false },
          { letter: "D", title: "It replaces the need for school", description: "Reading complements formal education; it does not replace it.", isCorrect: false }
        ]
      },
      {
        question: `Which study habit will most help you master "${t}"?`,
        options: [
          { letter: "A", title: "Consistent practice and review", description: "Regular study and reviewing material leads to the strongest retention.", isCorrect: true },
          { letter: "B", title: "Studying only once a year", description: "Infrequent study sessions lead to poor retention.", isCorrect: false },
          { letter: "C", title: "Relying on luck during tests", description: "Preparation, not luck, leads to good results.", isCorrect: false },
          { letter: "D", title: "Copying answers without thinking", description: "Copying prevents real understanding and learning.", isCorrect: false }
        ]
      }
    ]
  };

  const questions = subjectQuestions[subject] || subjectQuestions.general;
  return questions.slice(0, 10);
};

router.post("/generate-quiz", async (req, res) => {
  try {
    const topic = req.body?.topic || "General Knowledge";
    const subject = detectSubject(topic);

    // Attempt AI generation
    try {
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "dummy-key") {
        throw new Error("No valid OpenAI key");
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are an educational quiz generator for school students aged 8–14. " +
              "Always respond with valid JSON in EXACTLY this format: " +
              '{"questions":[{"question":"...","options":[{"letter":"A","title":"short label","description":"one sentence explanation","isCorrect":false},{"letter":"B","title":"...","description":"...","isCorrect":false},{"letter":"C","title":"...","description":"...","isCorrect":false},{"letter":"D","title":"...","description":"...","isCorrect":true}]}]}. ' +
              "Rules: exactly 10 questions, exactly 4 options per question (letters A B C D), exactly one option has isCorrect:true. " +
              "ALL questions must be specifically about the given lesson topic — do not mix subjects.",
          },
          {
            role: "user",
            content:
              `Subject: ${subject}. Lesson topic: "${topic}". ` +
              `Generate exactly 10 multiple-choice quiz questions that test knowledge of this specific topic. ` +
              `Make the questions age-appropriate (8–14 years), clear, and educational. ` +
              `Return only the JSON object with the questions array.`,
          },
        ],
      });

      const raw = JSON.parse(completion.choices[0].message.content);
      const questions = raw.questions || raw.quiz || (Array.isArray(raw) ? raw : null);
      if (Array.isArray(questions) && questions.length > 0) {
        return res.json({ quiz: questions });
      }
      console.log("AI returned unexpected shape, falling back.");
    } catch (aiErr) {
      console.log("AI unavailable, using subject-aware fallback:", aiErr.message);
    }

    return res.json({ quiz: getFallbackQuiz(topic) });

  } catch (err) {
    console.error("Critical quiz error:", err.message);
    return res.status(200).json({ quiz: getFallbackQuiz("general knowledge") });
  }
});

module.exports = router;
