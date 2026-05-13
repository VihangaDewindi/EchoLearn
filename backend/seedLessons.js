/**
 * Comprehensive lesson seed script — EchoLearn
 * Run with: node backend/seedLessons.js
 * Seeds 30 lessons: 3 subjects × 10 grades (Mathematics, Science, English).
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Lesson   = require("./models/Lesson");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/echolearn";

const IMAGES = {
  Mathematics: "/maths.png",
  Science:     "/lessons_livingthings.png",
  English:     "/english.png",
};

const mk = (slug, title, subject, grade, unit, level, duration, description, blocks) => ({
  slug, title, subject, grade, unit, level, duration, description,
  image: IMAGES[subject] || "",
  progress: 0,
  blocks,
});

const p     = (text) => ({ type: "paragraph", text });
const h     = (text) => ({ type: "highlight", text });
const q     = (text) => ({ type: "quote",     text });
const cards = (...items) => ({ type: "cards", items });
const card  = (title, text) => ({ title, text });

// ─── MATHEMATICS ──────────────────────────────────────────────────────────

const mathLessons = [
  mk("mathematics-grade-1-counting-numbers","Counting Numbers 1 to 100","Mathematics","Grade 1","Unit 1 — Numbers","Beginner","15 min read",
    "Learn to count from 1 to 100, understand number order, recognise digits, and practise skip counting.",[
    p("Counting is one of the most important skills in mathematics. When we count, we say numbers in order: 1, 2, 3, 4, 5 and so on all the way to 100."),
    h("Numbers from 1 to 9 are single-digit numbers. Numbers from 10 to 99 are two-digit numbers. The number 100 is the first three-digit number."),
    p("Let us practise counting in groups. If you count 5 apples, then 5 more apples, you have 10 apples in total. This is the beginning of addition!"),
    cards(
      card("1 to 10","These are the building blocks of all numbers. Every larger number is made from the ten digits: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9."),
      card("11 to 20","These are the teens. Eleven, twelve, thirteen… each is ten plus a single digit."),
      card("Counting by 2s","2, 4, 6, 8, 10, 12… Skip counting by 2 helps you count even numbers fast."),
      card("Counting by 10s","10, 20, 30, 40, 50, 60, 70, 80, 90, 100. Counting by tens is the basis of our number system.")
    ),
    p("A number line shows numbers in order from left to right. Smaller numbers are on the left; numbers grow bigger as you move to the right."),
    h("Odd numbers cannot be shared equally in pairs: 1, 3, 5, 7, 9. Even numbers can always be shared equally: 2, 4, 6, 8, 10."),
    p("Skip counting by 5s: 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100. The answers always end in 0 or 5."),
    q("Numbers are the language of the universe. Every great discovery began with someone learning to count."),
    p("Practise counting every day. Count the steps you climb, the books on a shelf, or the coins in your pocket. Maths is everywhere around you!"),
    p("By the end of this lesson you can count forwards and backwards between 1 and 100, skip count by 2, 5, and 10, and identify odd and even numbers. Brilliant work!"),
  ]),

  mk("mathematics-grade-2-addition-subtraction","Addition and Subtraction","Mathematics","Grade 2","Unit 2 — Operations","Beginner","18 min read",
    "Master adding and subtracting two-digit numbers with and without carrying, using number lines and place value.",[
    p("Addition means putting numbers together to find a total. Subtraction means taking one number away from another to find the difference."),
    h("Key words for addition: sum, total, altogether, plus, add, more than. Key words for subtraction: difference, take away, minus, subtract, less than, fewer."),
    p("When you add 24 + 13, break it into tens and ones. Tens: 20 + 10 = 30. Ones: 4 + 3 = 7. So 24 + 13 = 37."),
    cards(
      card("Adding with carrying","When ones add up to 10 or more, carry the extra ten. Example: 18 + 7 = 25 (8 + 7 = 15, write 5, carry 1 ten to the tens column)."),
      card("Subtracting with borrowing","If the ones digit on top is smaller, borrow a ten. Example: 32 − 8: borrow a ten to make 12 − 8 = 4, then 2 − 1 = 1 in tens. Answer: 24."),
      card("Number line method","Start at the first number, then jump forwards (addition) or backwards (subtraction) the correct number of steps."),
      card("Checking answers","After subtracting, add your answer back to the number you subtracted. It should equal the original number.")
    ),
    p("Let us practise: 45 + 28. Tens: 40 + 20 = 60. Ones: 5 + 8 = 13 (1 ten and 3 ones). Total: 60 + 10 + 3 = 73. "),
    h("Remember: addition is commutative — 14 + 9 = 9 + 14 = 23. You can swap the order and the answer stays the same. Subtraction is NOT commutative."),
    p("Word problem: Sarah has 56 stickers. She gives 19 to her friend. How many does she have left? 56 − 19 = 37. Sarah has 37 stickers."),
    q("Mathematics is not about numbers alone — it is about understanding patterns and solving problems in the world around us."),
    p("Add and subtract objects around your home — books, coins, fruit. Real-life maths makes the skills stick faster and feel more meaningful."),
    p("Excellent work! You can now add and subtract two-digit numbers using place value, carrying, and borrowing. Keep practising every day!"),
  ]),

  mk("mathematics-grade-3-introduction-to-fractions","Introduction to Fractions","Mathematics","Grade 3","Unit 3 — Fractions","Beginner","20 min read",
    "Understand what fractions are, how to read and write them, and compare simple fractions using diagrams.",[
    p("A fraction represents a part of a whole. When we cut a pizza into 4 equal slices and eat 1 slice, we have eaten one-quarter of the pizza, written as 1/4."),
    h("Every fraction has two parts: the numerator (top number) tells how many parts you have, and the denominator (bottom number) tells the total equal parts the whole is divided into."),
    p("Think of a chocolate bar divided into 8 equal pieces. If you eat 3 pieces, you have eaten 3/8 of the bar. The 3 is the numerator and the 8 is the denominator."),
    cards(
      card("Half — 1/2","One part out of two equal parts. Fold paper in half and each side is exactly 1/2."),
      card("Quarter — 1/4","One part out of four equal parts. A quarter hour is 15 minutes because 60 ÷ 4 = 15."),
      card("Third — 1/3","One part out of three equal parts. Three friends share equally — each gets 1/3."),
      card("Equivalent fractions","Fractions that look different but are equal in value. 1/2 = 2/4 = 4/8. They all represent exactly half.")
    ),
    p("Comparing fractions with the same denominator: 3/8 is greater than 2/8 because 3 is greater than 2. The bigger numerator means more of the whole."),
    h("When the numerator is the same, a smaller denominator means a bigger fraction! 1/3 is bigger than 1/6 because thirds are larger than sixths."),
    p("Let us try: Is 3/4 greater or less than 1/2? Convert 1/2 to quarters: 1/2 = 2/4. Since 3/4 > 2/4, three-quarters is greater than one-half. "),
    p("Fractions appear everywhere: cooking (half a cup), time (quarter past three), money (half price), and sport (one-third of the match remaining)."),
    q("A fraction is like a story — the denominator sets the scene by telling you the total, and the numerator is the main character telling you how many."),
    p("Draw a circle, divide it into equal parts, and shade some of them. Label your fraction. Drawing fractions helps you see and understand them clearly."),
    p("Outstanding work! You now understand numerators, denominators, equivalent fractions, and how to compare simple fractions. You are ready for the quiz!"),
  ]),

  mk("mathematics-grade-4-multiplication-tables","Multiplication Tables","Mathematics","Grade 4","Unit 4 — Multiplication","Intermediate","18 min read",
    "Master multiplication tables from 1 to 12, understand the concept, and apply to word problems.",[
    p("Multiplication is repeated addition. Instead of adding 6 + 6 + 6 + 6, we write 6 × 4 = 24 — meaning six added together four times."),
    h("Multiplication is commutative: 6 × 4 = 4 × 6 = 24. This means you only need to learn half the table facts — the rest are repeats!"),
    p("The 5 times table: 5×1=5, 5×2=10, 5×3=15, 5×4=20, 5×5=25, 5×6=30, 5×7=35, 5×8=40, 5×9=45, 5×10=50, 5×11=55, 5×12=60."),
    cards(
      card("2 times table","All answers are even: 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24."),
      card("5 times table","Answers end in 0 or 5: 5, 10, 15, 20, 25, 30, 35, 40, 45, 50."),
      card("10 times table","Add a zero: 1×10=10, 7×10=70, 12×10=120."),
      card("9 times table","The digits in each answer add up to 9: 9×7=63 (6+3=9), 9×8=72 (7+2=9).")
    ),
    p("Word problem: A bookshelf has 8 shelves. Each shelf holds 12 books. Total books: 8 × 12 = 96 books."),
    h("Division is the inverse of multiplication. If 7 × 8 = 56, then 56 ÷ 8 = 7 and 56 ÷ 7 = 8. Knowing your tables makes division easy!"),
    p("Area uses multiplication. A room 9 m long and 6 m wide has area = 9 × 6 = 54 square metres."),
    p("The 12 times table: 12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144. Very useful for time, music, and dozens."),
    q("There are no shortcuts to excellence. Learn your times tables thoroughly and every area of mathematics will become easier."),
    p("Practise your times tables in the car, at breakfast, or while walking. Daily repetition builds fast and accurate recall — a skill that lasts a lifetime."),
    p("Brilliant work! You have explored multiplication tables from 2 to 12 and applied them to area and word problems. Keep practising until they become instant!"),
  ]),

  mk("mathematics-grade-5-division-remainders","Division and Remainders","Mathematics","Grade 5","Unit 5 — Division","Intermediate","20 min read",
    "Understand division with remainders, the long division method, and apply division to real-life problems.",[
    p("Division means sharing a number equally into groups. If you share 20 sweets equally between 4 friends, each gets 20 ÷ 4 = 5 sweets."),
    h("Division vocabulary: 20 ÷ 4 = 5. The 20 is the dividend, the 4 is the divisor, and the 5 is the quotient (the answer)."),
    p("Sometimes numbers do not divide exactly. If you share 23 sweets between 4 friends: 23 ÷ 4 = 5 remainder 3. Each gets 5 and 3 are left over."),
    cards(
      card("Exact division","28 ÷ 7 = 4. No remainder because 7 × 4 = 28 exactly."),
      card("With remainder","30 ÷ 7 = 4 remainder 2. Because 7 × 4 = 28, and 30 − 28 = 2 left over."),
      card("Checking","Multiply quotient × divisor + remainder = dividend. Check: (4 × 7) + 2 = 30. Correct!"),
      card("Long division","Divide, multiply, subtract, bring down — repeat. Used for larger dividends.")
    ),
    p("Long division: 156 ÷ 12. How many 12s in 15? One (12). Subtract: 15−12=3. Bring down 6 to make 36. How many 12s in 36? Three. Answer: 13."),
    h("Division and multiplication are inverses. If 8 × 9 = 72, then 72 ÷ 9 = 8 and 72 ÷ 8 = 9. Use multiplication to check your division."),
    p("Word problem: A farmer has 144 eggs to pack into boxes of 12. How many boxes? 144 ÷ 12 = 12 boxes."),
    p("Word problem: 85 students sit at tables of 8. How many tables? 85 ÷ 8 = 10 remainder 5. You need 11 tables — 10 full ones plus 1 extra for the 5 remaining students."),
    q("Every great problem can be broken into smaller, manageable parts — that is exactly what division teaches us."),
    p("Division is used every day: splitting a restaurant bill, calculating how long a journey takes at a given speed, or working out how many packets to buy."),
    p("Excellent! You have learned division with remainders, how to use long division, and how to check answers and apply division to real problems. Quiz time!"),
  ]),

  mk("mathematics-grade-6-decimals-percentages","Decimals and Percentages","Mathematics","Grade 6","Unit 6 — Decimals","Intermediate","22 min read",
    "Understand decimal numbers, place value, and the relationship between decimals and percentages.",[
    p("Decimals are numbers that include a decimal point showing values between whole numbers. The number 3.75 means three whole units and seventy-five hundredths."),
    h("Place value in decimals: In 3.75 — the 3 is ones, the 7 is tenths (7/10), and the 5 is hundredths (5/100). The decimal point separates whole units from parts."),
    p("Money is a practical example of decimals. £4.99 means 4 pounds and 99 pence. Prices, measurements, and statistics all use decimals."),
    cards(
      card("Tenths","The first digit after the decimal point. 0.3 = three-tenths. One metre divided into 10 equal pieces gives 0.1 m each."),
      card("Hundredths","The second digit after the decimal point. 0.07 = seven-hundredths."),
      card("Adding decimals","Line up the decimal points, then add as normal. 2.45 + 1.3 = 3.75 (treat 1.3 as 1.30 to align columns)."),
      card("Multiplying by 10/100","Move the decimal point right. 3.45 × 10 = 34.5. 3.45 × 100 = 345.")
    ),
    p("A percentage means 'out of 100'. 50% means 50 out of every 100, which is the same as 0.5 or 1/2."),
    h("Converting: 1/4 = 0.25 = 25%. 3/4 = 0.75 = 75%. 1/10 = 0.1 = 10%. These conversions are used constantly — in shops, in banks, and in science."),
    p("Finding a percentage: To find 20% of 80, convert 20% to a decimal (0.20) and multiply: 0.20 × 80 = 16. So 20% of 80 is 16."),
    p("Percentage discount: A shirt costs £40 and is 25% off. Discount = 25% of £40 = £10. Sale price = £40 − £10 = £30."),
    q("Understanding percentages is one of the most valuable life skills. From taxes to discounts to test scores — percentages are everywhere."),
    p("Rounding decimals: 3.674 rounded to 2 decimal places is 3.67. Look at the third decimal digit (4) — since it is less than 5, we round down."),
    p("Superb work! You now understand decimal place value and the connection between fractions, decimals, and percentages. You will use these every day of your life."),
  ]),

  mk("mathematics-grade-7-introduction-to-algebra","Introduction to Algebra","Mathematics","Grade 7","Unit 7 — Algebra","Intermediate","24 min read",
    "Discover algebra: using letters for unknowns, simplifying expressions, and solving one-step and two-step equations.",[
    p("Algebra uses letters called variables to represent unknown numbers. Instead of saying 'a number plus 5 equals 9', we write x + 5 = 9."),
    h("In the equation x + 5 = 9: x stands for the unknown. To find x, subtract 5 from both sides: x = 4. Check: 4 + 5 = 9. Correct!"),
    p("An algebraic expression is a combination of numbers, letters, and operations. Example: 3x + 2. Here x is the variable and 3 is its coefficient (the multiplying number)."),
    cards(
      card("Variables","Letters like x, y, or n that represent unknown or changing values."),
      card("Constants","Fixed numbers in an expression. In 3x + 7, the 7 is the constant — it never changes."),
      card("Expressions vs Equations","An expression (2x + 3) has no equals sign. An equation (2x + 3 = 11) has an equals sign and can be solved."),
      card("Balancing rule","Whatever you do to one side of the equals sign, do the same to the other side. Think of a balance scale.")
    ),
    p("Simplifying like terms: 3x + 5x + 2 = 8x + 2. The terms 3x and 5x are like terms (both contain x) so they can be added."),
    h("Solving 2x − 3 = 11: Add 3 to both sides → 2x = 14. Divide both sides by 2 → x = 7. Check: (2 × 7) − 3 = 11. Correct!"),
    p("Word problem: A bag of oranges costs £2 more than a bag of apples. Together they cost £10. Apples cost x, so x + (x+2) = 10 → 2x = 8 → x = 4. Apples £4, oranges £6."),
    p("Substitution: If x = 3, evaluate 4x − 2 + x. Substitute: 4(3) − 2 + 3 = 12 − 2 + 3 = 13."),
    q("Algebra is the poetry of logic — one glance at a page and you can feel the mind of a great mathematician working."),
    p("Algebra is the language of generalisation. Instead of solving one specific problem, you create a method to solve a whole family of similar problems at once."),
    p("Outstanding algebraic thinking today! You have understood variables, expressions, equations, and the balancing principle — the foundations of all higher mathematics."),
  ]),

  mk("mathematics-grade-8-geometry-shapes","Geometry and Shapes","Mathematics","Grade 8","Unit 8 — Geometry","Intermediate","22 min read",
    "Explore properties of 2D and 3D shapes, angles, area, perimeter, volume, and Pythagoras' Theorem.",[
    p("Geometry is the study of shapes, sizes, and the properties of space. The name comes from Greek meaning 'earth measurement'."),
    h("A polygon is a 2D flat shape with straight sides. Triangle: 3 sides. Quadrilateral: 4. Pentagon: 5. Hexagon: 6. Octagon: 8. Each has a unique set of properties."),
    p("Angles in a triangle always add up to 180°. If one angle is 90° and another is 45°, the third must be 180° − 90° − 45° = 45°."),
    cards(
      card("Area of a rectangle","Area = length × width. A rectangle 8 cm × 5 cm has area = 40 cm²."),
      card("Area of a triangle","Area = ½ × base × height. Base 10 cm, height 6 cm: area = ½ × 10 × 6 = 30 cm²."),
      card("Area of a circle","Area = π × r². A circle with radius 7 cm: area ≈ 3.14 × 49 ≈ 153.9 cm²."),
      card("Volume of a cuboid","Volume = length × width × height. A box 4 cm × 3 cm × 5 cm has volume = 60 cm³.")
    ),
    p("Perimeter is the total distance around the outside of a shape. Rectangle 12 m × 7 m: perimeter = 2 × (12 + 7) = 38 m."),
    h("Triangle types: Equilateral (all sides and angles equal at 60°). Isosceles (two equal sides and angles). Scalene (all different). Right-angled (one 90° angle)."),
    p("3D shapes: Cube has 6 faces, 8 vertices, 12 edges. Sphere has one curved surface. Cylinder has two circular faces and one curved surface."),
    p("Pythagoras Theorem: In a right-angled triangle, a² + b² = c². If the two shorter sides are 3 and 4, then c² = 9 + 16 = 25, so c = 5."),
    q("Geometry is the knowledge of the eternally existent. Shapes and their relationships were true long before humans discovered them."),
    p("Symmetry: A square has 4 lines of symmetry. A circle has infinitely many. Symmetry appears in nature, art, and architecture everywhere."),
    p("Wonderful geometry today! Understanding shapes, angles, area, volume, and Pythagoras gives you the tools to understand architecture, design, and the physical world."),
  ]),

  mk("mathematics-grade-9-linear-equations","Linear Equations","Mathematics","Grade 9","Unit 9 — Equations","Advanced","25 min read",
    "Solve linear equations with one variable, simultaneous equations, and apply them to real-world problems.",[
    p("A linear equation is one where the highest power of the variable is 1. On a graph, it produces a straight line — hence the name 'linear'."),
    h("Standard form: ax + b = c. To solve, isolate x: apply inverse operations to both sides (subtract, add, multiply, divide) until x is alone."),
    p("Solving 3x + 7 = 22: Subtract 7 → 3x = 15. Divide by 3 → x = 5. Verify: 3(5) + 7 = 22. Correct!"),
    cards(
      card("x on both sides","Solve 5x − 3 = 2x + 12. Subtract 2x: 3x − 3 = 12. Add 3: 3x = 15. Divide: x = 5."),
      card("With brackets","Solve 2(x + 4) = 18. Expand: 2x + 8 = 18. Subtract 8: 2x = 10. Divide: x = 5."),
      card("With fractions","Solve x/3 + 2 = 7. Subtract 2: x/3 = 5. Multiply by 3: x = 15."),
      card("Forming equations","A number n multiplied by 4 minus 3 gives 17. Equation: 4n − 3 = 17. Solve: n = 5.")
    ),
    p("Simultaneous equations: Solve 2x + y = 10 and x − y = 2. Add both: 3x = 12, so x = 4. Substitute into x − y = 2: 4 − y = 2, so y = 2."),
    h("Gradient-intercept form: y = mx + c. The gradient m tells how steeply the line rises. The y-intercept c shows where the line crosses the y-axis."),
    p("Real-world application: A taxi charges £2 plus £0.50/km. Total fare £12. Equation: 2 + 0.5d = 12 → d = 20 km."),
    p("Inequalities: Solve 3x + 2 > 14. Subtract 2 → 3x > 12. Divide by 3 → x > 4. Any value greater than 4 satisfies the inequality."),
    q("An equation is a balance — a statement of perfect mathematical harmony. Linear equations are perhaps the most elegant tools in algebra."),
    p("Gradient from y = mx + c: In y = 3x − 2, gradient = 3 (rises 3 for every 1 across) and y-intercept = −2 (line crosses y-axis at −2)."),
    p("Exceptional work! You have mastered linear equations including brackets, fractions, and simultaneous solutions — cornerstones of GCSE mathematics."),
  ]),

  mk("mathematics-grade-10-quadratic-equations","Quadratic Equations","Mathematics","Grade 10","Unit 10 — Quadratics","Advanced","28 min read",
    "Understand quadratic equations, factorisation, the quadratic formula, and their real-world applications.",[
    p("A quadratic equation contains a variable raised to the power 2 (x²). Standard form: ax² + bx + c = 0. Graphs produce a U-shaped parabola curve."),
    h("Three solving methods: (1) Factorisation (2) Completing the square (3) Quadratic formula: x = (−b ± √(b²−4ac)) / 2a."),
    p("Factorisation: Solve x² + 5x + 6 = 0. Find two numbers that multiply to 6 and add to 5: they are 2 and 3. So (x + 2)(x + 3) = 0. Solutions: x = −2 or x = −3."),
    cards(
      card("Difference of two squares","a² − b² = (a+b)(a−b). So x² − 9 = (x+3)(x−3). Solve x² = 9 → x = ±3."),
      card("The discriminant","b²−4ac. Positive → two real roots. Zero → one repeated root. Negative → no real roots."),
      card("Quadratic formula","For 2x² − 4x − 6 = 0: a=2, b=−4, c=−6. Discriminant = 16+48 = 64. x = (4 ± 8)/4. Solutions: x = 3 or x = −1."),
      card("Real-world use","Quadratics model projectile motion, satellite dish shapes, bridge arches, and profit/cost functions in economics.")
    ),
    p("Completing the square: x² + 6x − 7 = 0 → (x+3)² − 9 − 7 = 0 → (x+3)² = 16 → x+3 = ±4. So x = 1 or x = −7."),
    h("Vertex of parabola: For y = ax² + bx + c, the x-coordinate of the vertex is x = −b/2a. This gives the minimum (if a>0) or maximum (if a<0) point."),
    p("Application: A ball has height h = −5t² + 20t + 1 metres. Maximum height at t = −20/(2×−5) = 2 seconds. Max height = −5(4) + 40 + 1 = 21 m."),
    p("Graphing: y = x² − 4x + 3. Vertex at x = 4/2 = 2, y = 4−8+3 = −1. Parabola opens upward. Crosses x-axis where y = 0: x = 1 and x = 3."),
    q("Quadratics are the gateway to higher mathematics. Every arc, every trajectory, every economic model uses the language of second-degree equations."),
    p("Sum of roots = −b/a and product of roots = c/a. For x² + 5x + 6 = 0: sum = −5, product = 6. Confirmed: −2 + (−3) = −5 and (−2) × (−3) = 6."),
    p("Phenomenal work! Mastering quadratics — factorisation, the formula, completing the square, and graphing — places you firmly at A-Level standard. Outstanding!"),
  ]),
];

// ─── SCIENCE ──────────────────────────────────────────────────────────────

const scienceLessons = [
  mk("science-grade-1-living-nonliving","Living and Non-Living Things","Science","Grade 1","Unit 1 — Life Science","Beginner","14 min read",
    "Discover the difference between living and non-living things and learn the seven characteristics of life.",[
    p("Everything around us belongs to one of two groups: living things and non-living things. A cat is living. A rock is non-living."),
    h("Living things share seven key characteristics. Remember MRSGREN: Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, Nutrition."),
    p("Plants are living things too! They grow from seeds, need sunlight and water, and make new plants. A stone does none of these things."),
    cards(
      card("Animals","Animals are living things that can move around. Dogs, birds, fish, insects, and humans are all animals."),
      card("Plants","Plants are living things that make their own food using sunlight, water, and carbon dioxide."),
      card("Non-Living Natural","Rocks, rivers, clouds, and the Sun are natural but non-living — they don't grow or reproduce."),
      card("Non-Living Made","Tables, cars, and plastic bottles are made by humans and are non-living objects.")
    ),
    p("Fire seems alive because it moves and needs oxygen — but it cannot reproduce or grow as living things do. Fire is non-living."),
    h("Viruses are unusual. They can reproduce inside living cells but cannot do so on their own. Scientists debate whether viruses are truly living."),
    p("Seeds appear non-living but they contain a tiny living plant inside, waiting for the right conditions (water, warmth, light) to germinate and grow."),
    q("The diversity of life on Earth is extraordinary — from the tiniest bacteria to the largest whale. Each living thing plays a role in the web of life."),
    p("Look around your home and classify five objects as living or non-living. Can you explain WHY for each one using the seven characteristics?"),
    p("Great start to science! Understanding living and non-living things is the foundation of all biology and life sciences. Well done!"),
  ]),

  mk("science-grade-2-plants-parts","Plants and Their Parts","Science","Grade 2","Unit 2 — Botany","Beginner","16 min read",
    "Learn the parts of a plant, their functions, and how plants grow from seeds to full plants.",[
    p("Plants are living things found almost everywhere on Earth — in forests, oceans, deserts, and even the Arctic. They make their own food using sunlight."),
    h("A plant has five main parts: roots, stem, leaves, flowers, and seeds (or fruit). Each part has a special job that keeps the plant alive and thriving."),
    p("Roots grow underground. They anchor the plant in the soil and absorb water and minerals. Some roots (like carrots and turnips) store food."),
    cards(
      card("Roots","Anchor the plant and absorb water and nutrients from the soil. Tiny root hairs increase the surface area for absorption."),
      card("Stem","Carries water and nutrients up from the roots to the leaves. It supports the plant and holds leaves up to the sunlight."),
      card("Leaves","The food factory of the plant. Leaves capture sunlight and use it with water and carbon dioxide to make sugar through photosynthesis."),
      card("Flowers","The reproductive part. Flowers attract insects to help with pollination. After fertilisation, flowers produce seeds.")
    ),
    p("Plant life cycle: seed → germination → seedling → mature plant → flowering → pollination → seed production. Then the cycle begins again!"),
    h("Photosynthesis equation: Carbon dioxide + Water + Sunlight → Glucose + Oxygen. Glucose is the plant's food. Oxygen is released into the air we breathe."),
    p("Not all plants flower. Ferns reproduce using spores. Conifers use cones. But all plants need sunlight, water, and carbon dioxide to survive."),
    p("Pollination: Pollen moves from the stamen (male part) to the pistil (female part). Bees, butterflies, and wind all help pollinate flowers."),
    q("In every walk with nature, one receives far more than one seeks. Plants are the quiet architects of life on Earth."),
    p("Grow your own bean in a pot and observe roots, stem, and leaves developing. Science is best learned by doing and observing!"),
    p("Wonderful learning today! You now know the five parts of a plant, what each part does, and how the plant life cycle works. Excellent!"),
  ]),

  mk("science-grade-3-water-cycle","The Water Cycle","Science","Grade 3","Unit 3 — Earth Science","Beginner","18 min read",
    "Understand how water moves continuously through evaporation, condensation, and precipitation on Earth.",[
    p("Water is constantly on the move. The water you drink today might have once been inside a dinosaur — it has cycled around the Earth for billions of years!"),
    h("The water cycle has four main stages: Evaporation → Condensation → Precipitation → Collection. It is powered by the Sun's energy and never stops."),
    p("Evaporation: The Sun heats water in oceans, lakes, and rivers. The heat causes water to turn into invisible water vapour (a gas) and rise into the atmosphere."),
    cards(
      card("Evaporation","Liquid water absorbs heat and turns into water vapour. This is why puddles disappear on a sunny day."),
      card("Condensation","As water vapour rises higher it cools and turns back into tiny liquid droplets, forming clouds. Think of a cold glass — droplets form on the outside."),
      card("Precipitation","When clouds hold too much water, it falls back to Earth as rain, snow, sleet, or hail. The type depends on air temperature."),
      card("Collection","Water collects in oceans, rivers, lakes, and underground. It then evaporates again, continuing the cycle endlessly.")
    ),
    p("Transpiration: Plants also release water vapour through their leaves. This contributes water to the atmosphere and is part of the water cycle."),
    h("About 97% of Earth's water is salt water in the oceans. Only 3% is fresh water, and most of that is frozen in ice caps. The water cycle gives us drinkable fresh water!"),
    p("Clouds are classified by shape and height: Cumulus (fluffy), Stratus (flat layers), Cirrus (wispy, high altitude), Cumulonimbus (tall storm clouds)."),
    p("Groundwater: Some precipitation soaks into soil and rock forming underground stores called aquifers. We pump this water up for drinking, farming, and industry."),
    q("Water is the driving force of all nature. Without the water cycle, Earth would be a lifeless desert."),
    p("Climate change affects the water cycle. Warmer temperatures increase evaporation, leading to more intense rainfall and more severe droughts."),
    p("Brilliant work! The water cycle is one of Earth's most important processes. You now understand exactly how it works — excellent science!"),
  ]),

  mk("science-grade-4-animals-habitats","Animals and Their Habitats","Science","Grade 4","Unit 4 — Ecology","Beginner","18 min read",
    "Explore different animal habitats, how animals adapt to survive, and the concept of food chains.",[
    p("A habitat is the natural home of a plant or animal. It provides everything needed to survive: food, water, shelter, and the right climate."),
    h("Major habitats on Earth: Rainforests, deserts, oceans, grasslands, polar regions, and freshwater habitats. Each has unique conditions and species."),
    p("Animals are adapted to their habitats. A polar bear has thick fur and a layer of fat for Arctic cold. A camel stores fat in its hump and has wide feet for desert sand."),
    cards(
      card("Rainforest","Hot and wet year-round. Home to jaguars, toucans, and tree frogs. Contains over half of all species on Earth."),
      card("Desert","Very dry with extreme temperatures. Camels, lizards, scorpions, and cacti have evolved to conserve water and survive heat."),
      card("Ocean","Covers 71% of Earth. From coral reefs to deep-sea creatures that produce their own light — enormous diversity."),
      card("Polar Regions","Extremely cold. Polar bears (Arctic) and penguins (Antarctic) have thick insulating layers and special cold-weather adaptations.")
    ),
    p("A food chain shows what eats what. Example: Grass → Grasshopper → Frog → Snake → Eagle. Each arrow means 'is eaten by' and shows energy flow."),
    h("Food chain roles: PRODUCER (plant using sunlight). PRIMARY CONSUMER (eats plants). SECONDARY CONSUMER (eats primary consumers). APEX PREDATOR (top of chain)."),
    p("If a species is removed from a food chain, it disrupts the whole ecosystem. Remove wolves from a forest, deer multiply, and vegetation disappears."),
    p("Biodiversity means the variety of life in an area. High biodiversity makes ecosystems more resilient — if one species disappears, others fill its role."),
    q("In nature's economy, nothing is wasted. Every creature, however small, plays a vital role in the great web of life."),
    p("Endangered species are at risk of extinction due to human activities: deforestation, pollution, and climate change are the biggest threats to biodiversity today."),
    p("Great exploration today! You now understand habitats, adaptation, food chains, and biodiversity — the core concepts of ecology. Well done!"),
  ]),

  mk("science-grade-5-forces-motion","Forces and Motion","Science","Grade 5","Unit 5 — Physics","Intermediate","20 min read",
    "Understand forces, types of forces, Newton's three Laws of Motion, and how forces affect movement.",[
    p("A force is a push or pull that changes the shape, speed, or direction of an object. Forces are measured in Newtons (N), named after Sir Isaac Newton."),
    h("Forces are either contact forces (friction, tension — objects must touch) or non-contact forces (gravity, magnetism, electrostatic — act at a distance)."),
    p("Gravity pulls all objects with mass towards each other. On Earth, gravity pulls everything downward with approximately 10 N per kilogram of mass."),
    cards(
      card("Newton's First Law","An object at rest stays at rest; an object in motion stays in motion at the same speed and direction, unless acted on by an unbalanced force."),
      card("Newton's Second Law","Force = Mass × Acceleration (F = ma). Greater force → greater acceleration. Heavier object → more force needed for same acceleration."),
      card("Newton's Third Law","For every action, there is an equal and opposite reaction. Jumping pushes the Earth, and the Earth pushes you upward."),
      card("Friction","A force opposing motion between two surfaces. Friction slows objects down but also allows us to walk without sliding.")
    ),
    p("Balanced forces: Equal and opposite forces mean no acceleration. The object stays still or moves at constant speed. Unbalanced forces cause acceleration."),
    h("Weight vs Mass: Mass is the amount of matter in an object (kg) — it never changes. Weight is the gravitational force on that mass (N) — it changes with gravity."),
    p("Terminal velocity: As a skydiver falls, air resistance increases until it equals gravity. Net force = zero. The skydiver falls at constant speed."),
    p("Momentum = mass × velocity. It measures how hard it is to stop a moving object. A heavier, faster object has more momentum."),
    q("If I have seen further than others, it is by standing upon the shoulders of giants. — Sir Isaac Newton."),
    p("Simple machines (lever, pulley, inclined plane) use forces more efficiently. A lever multiplies force — a small push creates a large force at the other end."),
    p("Fantastic progress! You now understand forces, Newton's three laws, friction, weight, and momentum. Physics is truly all around us!"),
  ]),

  mk("science-grade-6-light-sound","Light and Sound","Science","Grade 6","Unit 6 — Physics: Waves","Intermediate","22 min read",
    "Explore how light travels, reflection and refraction, how sound is produced, and how both travel as waves.",[
    p("Light and sound are both forms of energy that travel as waves, but they behave very differently. Light can travel through vacuum (space). Sound cannot — it needs a medium."),
    h("Light travels at 300,000 km/s in a vacuum. Sound travels at only 343 m/s through air — nearly a million times slower. This is why you see lightning before hearing thunder."),
    p("Every three seconds between lightning and thunder represents approximately 1 km of distance. This is how you can estimate how far away a storm is."),
    cards(
      card("Reflection","Light bouncing off a smooth, shiny surface. Angle of incidence = angle of reflection. This is how mirrors work."),
      card("Refraction","Light bending as it passes between materials (air to water). This is why a spoon looks bent in a glass of water."),
      card("How sound is made","Sound is created by vibrations. A guitar string vibrates, a speaker cone vibrates, and your vocal cords vibrate when you speak."),
      card("Loudness and pitch","Loudness depends on amplitude (wave size). Pitch depends on frequency — more vibrations per second gives a higher pitch.")
    ),
    p("The electromagnetic spectrum: Visible light is a tiny part of a much broader spectrum including radio waves, microwaves, infrared, ultraviolet, X-rays, and gamma rays."),
    h("White light contains all colours. A prism separates them: Red, Orange, Yellow, Green, Blue, Indigo, Violet — ROYGBIV. This is how rainbows form."),
    p("Echoes occur when sound reflects off a hard surface (cliff, building) and returns to your ears. Bats use echolocation — they emit sound pulses and listen to echoes to navigate."),
    p("Ultrasound has frequency too high for humans to hear (above 20,000 Hz). Used in medical scanning (seeing babies before birth) and submarine SONAR."),
    q("Light gives us information about the universe; sound connects us to each other. Together, these two waves shape the entire human experience."),
    p("The speed of light is the universal speed limit. Nothing with mass can travel as fast as light — this fundamental constant shapes Einstein's relativity."),
    p("Outstanding physics today! Light and sound underpin medicine, music, telecommunications, and astronomy. Truly important concepts mastered!"),
  ]),

  mk("science-grade-7-human-body","Human Body Systems","Science","Grade 7","Unit 7 — Biology","Intermediate","24 min read",
    "Explore the major organ systems of the human body, their functions, and how they work together.",[
    p("The human body is an amazing machine made of trillions of cells organised into tissues, organs, and organ systems. Each system carries out vital functions."),
    h("There are 11 major organ systems. The key ones are: skeletal, muscular, circulatory, respiratory, digestive, nervous, endocrine, immune, and urinary."),
    p("The circulatory system: The heart pumps blood through arteries, veins, and capillaries. Blood delivers oxygen and nutrients to cells and removes carbon dioxide and waste."),
    cards(
      card("Skeletal System","206 bones support the body, protect organs, and enable movement. Bone marrow produces red blood cells, and bones store calcium."),
      card("Muscular System","Over 600 muscles enable movement. Muscles work in pairs — when one contracts, the other relaxes. The heart is a special muscle that never rests."),
      card("Respiratory System","Lungs take in oxygen and expel carbon dioxide. Oxygen enters the blood through tiny air sacs (alveoli). You breathe about 22,000 times per day."),
      card("Digestive System","Breaks food into nutrients. The journey takes 24–72 hours: mouth → oesophagus → stomach → small intestine → large intestine → exit.")
    ),
    p("The nervous system: Brain, spinal cord, and nerves form the body's control centre. Nerve signals travel at up to 120 m/s — faster than a racing car!"),
    h("Homeostasis: The body constantly regulates temperature (37°C), blood sugar, water balance, and pH. This automatic regulation keeps us alive and functioning."),
    p("The immune system: White blood cells fight bacteria, viruses, and other pathogens. Antibodies are proteins that specifically target and neutralise foreign invaders."),
    p("The endocrine system releases hormones (chemical messengers) into the bloodstream. Insulin regulates blood sugar. Adrenaline prepares the body for 'fight or flight'."),
    q("The human body is the best picture of the human soul — and perhaps the most complex and remarkable object in the known universe."),
    p("Kidneys filter about 200 litres of blood every day, producing 1–2 litres of urine. The liver performs over 500 functions including detoxification and nutrient processing."),
    p("Superb science today! Understanding how your own body works is one of the most useful and fascinating areas of biology. Well done!"),
  ]),

  mk("science-grade-8-chemical-reactions","Chemical Reactions","Science","Grade 8","Unit 8 — Chemistry","Intermediate","24 min read",
    "Understand what chemical reactions are, how to identify them, types of reactions, and conservation of mass.",[
    p("A chemical reaction transforms substances (reactants) into new substances (products) with different properties. Chemical bonds are broken and new ones are formed."),
    h("Signs a reaction has occurred: colour change, gas production (bubbles), a solid precipitate forms, temperature change, or light is produced."),
    p("Chemical equations: Reactants → Products. Example: Magnesium + Oxygen → Magnesium Oxide. The arrow shows the direction of the reaction."),
    cards(
      card("Combustion","Burning — rapid reaction with oxygen producing heat and light. Hydrocarbons + Oxygen → Carbon dioxide + Water."),
      card("Neutralisation","Acid + Base → Salt + Water. Hydrochloric acid + Sodium hydroxide → Sodium chloride (common salt) + Water."),
      card("Oxidation","Gain of oxygen or loss of electrons. Rusting: Iron + Oxygen + Water → Iron oxide (rust). A slow oxidation reaction."),
      card("Decomposition","One compound breaks into simpler substances. Heating calcium carbonate → calcium oxide + carbon dioxide.")
    ),
    p("Conservation of mass: Antoine Lavoisier discovered that mass is never created or destroyed in a reaction. Reactant mass always equals product mass."),
    h("A catalyst speeds up a reaction without being used up. Enzymes are biological catalysts — saliva contains amylase to break down starch as soon as you eat."),
    p("Rates of reaction: Raise temperature (more energy, more collisions), increase concentration (more particles), or use a catalyst to speed up a reaction."),
    p("Exothermic reactions release heat (combustion, neutralisation). Endothermic reactions absorb heat from surroundings (photosynthesis, dissolving certain salts)."),
    q("Chemistry begins in the stars. The elements making up our bodies were forged in the cores of ancient stars billions of years ago."),
    p("Balanced equations: Fe + S → FeS (Iron + Sulphur → Iron Sulphide). Both sides must have equal numbers of each type of atom — the equation is 'balanced'."),
    p("Brilliant chemistry today! Chemical reactions underpin medicine, materials science, cooking, manufacturing, and environmental science. You've covered truly important chemistry!"),
  ]),

  mk("science-grade-9-electricity-circuits","Electricity and Circuits","Science","Grade 9","Unit 9 — Physics: Electricity","Advanced","25 min read",
    "Learn about electric charge, circuits, Ohm's Law, series and parallel circuits, and electrical safety.",[
    p("Electricity is the flow of electric charge (usually electrons) through a conductor. It powers virtually every device in the modern world."),
    h("Key quantities: Voltage (V) — the push driving current. Current (I) — the rate of charge flow, in Amperes (A). Resistance (R) — opposition to current, in Ohms (Ω)."),
    p("Ohm's Law: V = I × R. A circuit with resistance 10 Ω and current 2 A has voltage V = 2 × 10 = 20 V."),
    cards(
      card("Series circuits","Components in a single loop. Same current through all. If one bulb breaks, the whole circuit stops — like old Christmas tree lights."),
      card("Parallel circuits","Components across multiple branches. Each branch has the same voltage. If one bulb breaks, others continue. Used in home wiring."),
      card("Resistance rules","Series: R_total = R1 + R2 + R3. Parallel: 1/R_total = 1/R1 + 1/R2. Adding resistors in parallel decreases total resistance."),
      card("Electrical power","P = V × I (in Watts). A 12 V bulb drawing 2 A uses 24 W. Running a 1000 W device for 1 hour uses 1 kilowatt-hour (kWh) of energy.")
    ),
    p("Electric charge: All matter contains protons (+) and electrons (−). Like charges repel; opposite charges attract. A build-up of charge creates static electricity."),
    h("Electrical safety: Never use electrical devices near water. Fuses melt when current is too high, protecting the circuit. Earth wires prevent electric shock from faulty appliances."),
    p("Generators convert kinetic energy into electrical energy. A magnet spinning inside wire coils creates alternating current (AC). All power stations use this principle."),
    p("Semiconductors (like silicon) can conduct or insulate depending on conditions. They are the basis of transistors — the building blocks of all computers and smartphones."),
    q("Mastering electricity is mastering the modern world. Every digital device, every light, every motor — electricity made them possible."),
    p("Electromagnetic induction: A changing magnetic field induces a voltage in a conductor. Discovered by Michael Faraday — used in generators, transformers, and wireless charging."),
    p("Exceptional work! Your understanding of Ohm's Law, series/parallel circuits, power, and electrical safety is now solid. This is A-Level ready physics!"),
  ]),

  mk("science-grade-10-genetics-evolution","Genetics and Evolution","Science","Grade 10","Unit 10 — Biology: Genetics","Advanced","28 min read",
    "Understand DNA, inheritance, Mendel's laws, natural selection, and the evidence for evolution.",[
    p("Genetics is the study of heredity — how characteristics pass from parents to offspring through genes. Evolution is how species change over generations."),
    h("DNA (deoxyribonucleic acid) carries genetic information. Found in the nucleus of every cell, arranged into chromosomes. Humans have 46 chromosomes in 23 pairs."),
    p("Genes are sections of DNA that code for proteins, which determine characteristics (traits). You inherit one copy of each gene from your mother and one from your father."),
    cards(
      card("Dominant and recessive","Dominant alleles (A) are expressed with just one copy. Recessive alleles (a) are only expressed when two copies are present (aa)."),
      card("Punnet squares","Predict offspring probabilities. Two Aa parents give 25% AA, 50% Aa, 25% aa offspring. 75% show the dominant trait."),
      card("Natural selection","Variations exist; better-adapted individuals survive and reproduce more; over time, the population changes. Darwin's mechanism for evolution."),
      card("Evidence for evolution","Fossil record, homologous structures (similar bone patterns), DNA similarities between species, and observed evolution in bacteria exposed to antibiotics.")
    ),
    p("Mutations are changes in the DNA sequence. Most are harmless. Some cause genetic diseases. Occasionally a mutation gives an advantage and spreads through the population."),
    h("Genetic diseases: Down's syndrome results from an extra chromosome 21. Cystic fibrosis is caused by a recessive allele — both parents must carry it for a child to be affected."),
    p("Gregor Mendel (1822–1884), an Austrian monk, discovered the laws of inheritance through pea plant experiments — a century before DNA was discovered."),
    p("CRISPR-Cas9 allows scientists to edit DNA precisely. Applications include treating genetic diseases, producing disease-resistant crops, and medical research."),
    q("Nothing in biology makes sense except in the light of evolution. — Theodosius Dobzhansky. Genetics and evolution are the keys to understanding all living things."),
    p("Speciation: When populations become isolated, they evolve separately. Over thousands of generations they become different species that can no longer interbreed."),
    p("Remarkable achievement! Genetics and evolution are among the most important concepts in all biology. You now have the foundation for medicine, ecology, and evolutionary biology."),
  ]),
];

// ─── ENGLISH ──────────────────────────────────────────────────────────────

const englishLessons = [
  mk("english-grade-1-alphabets-phonics","Alphabets and Phonics","English","Grade 1","Unit 1 — Foundations","Beginner","14 min read",
    "Learn the 26 letters of the English alphabet, their sounds, vowels and consonants, and basic phonics rules.",[
    p("The English alphabet has 26 letters: A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z. These letters are the building blocks of every English word."),
    h("There are 5 vowels: A, E, I, O, U. All other letters are consonants. Vowels make open sounds that form the heart of almost every English word."),
    p("Phonics teaches us the sounds that letters make. B makes a 'buh' sound. S makes a 'sss' sound. Knowing letter sounds lets you decode (read) new words."),
    cards(
      card("Short vowel sounds","A as in 'cat', E as in 'bed', I as in 'sit', O as in 'hot', U as in 'cup'. These are the most common vowel sounds."),
      card("Long vowel sounds","A as in 'cake', E as in 'feet', I as in 'kite', O as in 'bone', U as in 'cube'. Long vowels say their own name."),
      card("Consonant blends","Two or more consonants together: 'bl' in 'blue', 'str' in 'strong', 'cr' in 'crab'. Blend the sounds smoothly."),
      card("Digraphs","Two letters making one sound: 'ch' as in 'chip', 'sh' as in 'ship', 'th' as in 'that', 'ph' as in 'phone'.")
    ),
    p("The alphabet song helps you remember all 26 letters in order. Sing it to the tune of 'Twinkle Twinkle Little Star'!"),
    h("Capital letters (A, B, C) are used at the start of sentences and for proper nouns (names of people and places). Lowercase (a, b, c) is used for all other words."),
    p("Words are built from letters. 'Cat' has 3 letters: C-A-T. 'Elephant' has 8 letters: E-L-E-P-H-A-N-T. Counting letters builds strong spelling skills."),
    q("Once you learn to read, you will be forever free. Learning your alphabet and phonics is the key that opens every door of knowledge."),
    p("Practise writing each letter of the alphabet daily — both capital and lowercase. Trace them, say their sound, and think of a word that begins with each letter."),
    p("Excellent work! Knowing the alphabet and letter sounds is the foundation of all reading and writing. You are on your way to becoming a great reader!"),
  ]),

  mk("english-grade-2-simple-sentences","Simple Sentences","English","Grade 2","Unit 2 — Writing","Beginner","16 min read",
    "Learn to construct simple sentences with a subject and verb, use capital letters and full stops correctly.",[
    p("A sentence is a group of words that expresses a complete thought. Every sentence needs at least two things: a subject (who or what) and a verb (the action or state)."),
    h("Sentence rules: Always start with a capital letter. Always end with a full stop (.), question mark (?), or exclamation mark (!). The sentence must make complete sense."),
    p("Example: 'The dog barked.' — 'The dog' is the subject and 'barked' is the verb. 'The dog' alone is NOT a sentence — it needs a verb to be complete."),
    cards(
      card("Simple sentence","Has one subject and one verb: 'The cat sat on the mat.' Clear, direct, and complete."),
      card("Question","Asks something and ends with a question mark: 'Where is my book?' — word order is often inverted."),
      card("Exclamation","Shows strong emotion and ends with an exclamation mark: 'What a wonderful day!' or 'Stop!'"),
      card("Negative sentence","Uses 'not' or contractions: 'I do not like broccoli.' or 'She didn't come to school.'")
    ),
    p("Nouns name people, places, and things. Verbs describe actions or states. Adjectives describe nouns. Knowing these word classes helps you build better sentences."),
    h("Punctuation marks are the traffic signals of writing — they tell the reader when to pause, stop, question, or show excitement. Use them carefully."),
    p("Expanding sentences: 'The bird flew.' is fine, but 'The bright red bird flew gracefully through the clear blue sky.' is far more vivid and interesting."),
    p("Conjunctions join ideas: 'and', 'but', 'or', 'so', 'because'. 'I was tired, but I finished my homework.' This creates a compound sentence."),
    q("Writing is thinking on paper. A well-crafted sentence can change a mind, move a heart, or bring a smile — learn to build them with care."),
    p("Practise writing 5 sentences every day about something that happened to you. Use a capital letter, a full stop, and check for a subject and a verb."),
    p("Well done! You can write simple sentences correctly, use capital letters and punctuation, and expand your ideas. Writing improves with every sentence you write!"),
  ]),

  mk("english-grade-3-reading-comprehension","Reading Comprehension","English","Grade 3","Unit 3 — Reading","Beginner","18 min read",
    "Develop skills to understand, analyse, and interpret written texts through active reading strategies.",[
    p("Reading comprehension means truly understanding what you read — not just saying the words, but grasping the meaning, ideas, and purpose behind them."),
    h("Before reading: Look at the title, pictures, and headings. Predict what the text might be about. This activates your prior knowledge and improves understanding."),
    p("During reading: Read actively! Ask yourself: What is happening? Who are the main characters? Why did that happen? Look up words you don't know."),
    cards(
      card("Finding the main idea","Every paragraph has a main idea — the most important point. It is often (but not always) in the first sentence, called the topic sentence."),
      card("Inference","Sometimes the text doesn't say something directly — read between the lines. Use clues plus your own knowledge to infer the meaning."),
      card("Text types","Fiction tells stories (characters, settings, plot). Non-fiction gives information (reports, biographies, instructions, news articles)."),
      card("After reading","Summarise in your own words. What were the key points? Could you explain it to a friend? What questions do you still have?")
    ),
    p("Skimming is reading quickly to get the general idea. Scanning is looking through text to find specific information (like a date or name). Both are very useful skills."),
    h("Helpful text features: headings, subheadings, bullet points, bold text, diagrams, captions, and glossaries. These organise information and guide the reader."),
    p("Vocabulary: The more words you know, the better your comprehension. When you encounter an unfamiliar word, use context clues (surrounding words) to guess its meaning."),
    p("Fact vs Opinion: A fact can be proved ('The Eiffel Tower is in Paris'). An opinion expresses a belief ('The Eiffel Tower is the most beautiful building')."),
    q("Not all readers are leaders, but all leaders are readers. The habit of deep, active reading is one of the most powerful skills any person can develop."),
    p("Make connections: text-to-self (does this remind you of your own experience?), text-to-text (another book?), text-to-world (current events?)."),
    p("Wonderful reading skills today! Active comprehension is the engine of all learning. Everything you study at school requires understanding what you read."),
  ]),

  mk("english-grade-4-grammar-basics","Grammar Basics","English","Grade 4","Unit 4 — Grammar","Beginner","20 min read",
    "Master the eight parts of speech: noun, pronoun, verb, adjective, adverb, preposition, conjunction, and interjection.",[
    p("Grammar is the set of rules governing how words are arranged to make meaningful sentences. Learning grammar gives you power to communicate clearly and accurately."),
    h("The 8 parts of speech: Noun, Pronoun, Verb, Adjective, Adverb, Preposition, Conjunction, Interjection. Every word in English belongs to one of these categories."),
    p("Nouns name people (teacher, Amelia), places (London, park), things (book, cloud), and ideas (freedom, happiness). Proper nouns begin with a capital letter."),
    cards(
      card("Verb tenses","Past: 'She ran.' Present: 'She runs.' Future: 'She will run.' Perfect: 'She has run.' Getting tenses right is crucial for clear communication."),
      card("Adjectives","Describe nouns: big, beautiful, ancient, three. They answer Which one?, What kind?, or How many? They make writing vivid and specific."),
      card("Adverbs","Describe verbs, adjectives, or other adverbs. Often end in -ly: quickly, softly. They answer How?, When?, Where?, or How much?"),
      card("Prepositions","Show relationships: 'The book is ON the table.', 'She walked THROUGH the park.', 'He arrived BEFORE me.'")
    ),
    p("Subject-verb agreement: The verb must agree with its subject. 'The dog barks' (singular). 'The dogs bark' (plural). 'She runs.' vs 'They run.'"),
    h("Pronouns replace nouns to avoid repetition. Instead of 'Sam went to Sam's room and Sam picked up Sam's bag', we say 'Sam went to his room and picked up his bag'."),
    p("Conjunctions join ideas. Coordinating (FANBOYS — For, And, Nor, But, Or, Yet, So). Subordinating (because, although, when, unless, while)."),
    p("Active vs passive voice: Active — 'The dog ate the bone.' (Subject does the action.) Passive — 'The bone was eaten by the dog.' Active voice is usually clearer."),
    q("Grammar is the logic of speech, even as logic is the grammar of reason. Master grammar and you master the most powerful tool humans possess — language."),
    p("Apostrophes: For possession — 'Tom's book', 'the children's toys'. For contractions — 'don't' (do not), 'it's' (it is). 'Its' (no apostrophe) means belonging to it."),
    p("Magnificent grammar work today! Knowing the parts of speech gives you confident, accurate English that will serve you in all subjects and in life."),
  ]),

  mk("english-grade-5-creative-writing","Creative Writing","English","Grade 5","Unit 5 — Creative Writing","Intermediate","20 min read",
    "Learn to write engaging stories using character, setting, plot, dialogue, and descriptive language.",[
    p("Creative writing is the art of using words to create imaginary worlds, bring characters to life, and take readers on journeys. It is one of the most joyful forms of expression."),
    h("A great story needs: a compelling character, an interesting setting, a conflict (problem), rising action (complications), a climax (turning point), and a satisfying resolution."),
    p("Creating characters: The best characters feel like real people. Give them a name, age, appearance, personality, strengths, and flaws. What do they want? What are they afraid of?"),
    cards(
      card("Show, don't tell","Instead of 'She was nervous', write 'Her hands trembled and she kept glancing at the door.' Showing creates vivid, memorable writing."),
      card("Setting the scene","Engage all five senses: sight, sound, smell, taste, touch. 'The library smelled of dust and adventures. Afternoon light slanted through tall windows.'"),
      card("Dialogue","Speech reveals character and advances plot. Use speech marks correctly. 'I don't believe it,' she whispered. Each new speaker starts a new line."),
      card("Sentence variety","Mix short sentences for impact. Then add longer, flowing sentences that build atmosphere and carry the reader forward smoothly.")
    ),
    p("The plot mountain: Introduction → Rising action (tension builds) → Climax (crisis) → Falling action (aftermath) → Resolution (ending)."),
    h("Figurative language: Similes ('as cold as ice'), metaphors ('the moon was a lantern'), personification ('the wind whispered'), alliteration ('Peter Piper picked')."),
    p("Great opening lines hook the reader immediately. Challenge yourself to write a first line that makes someone NEED to know what happens next."),
    p("Editing: All great writers revise. After your first draft, check for: unclear ideas, repetitive words, incorrect punctuation, and opportunities to improve description."),
    q("You can make anything by writing. — C.S. Lewis. Stories are the most powerful technology humans have ever created for sharing understanding and imagination."),
    p("Write every day — even just a few sentences. Keep a journal. Describe a dream or invent a character. Great writers are great readers — read as widely as you can!"),
    p("Brilliant creative writing session! You now have the tools to construct rich stories with vivid characters, settings, and plot. Go and write something wonderful!"),
  ]),

  mk("english-grade-6-poetry-prose","Poetry and Prose","English","Grade 6","Unit 6 — Literature","Intermediate","22 min read",
    "Explore the features of poetry and prose, poetic devices, different forms, and how to analyse literature.",[
    p("Literature comes in two major forms: prose (ordinary sentences and paragraphs — novels, short stories, essays) and poetry (lines and stanzas with rhythm and imagery)."),
    h("Poetry features: rhythm (pattern of beats), rhyme (matching end sounds), imagery (vivid word pictures), and devices like metaphor, simile, alliteration, and onomatopoeia."),
    p("Types of poetry: Haiku (3 lines: 5-7-5 syllables), sonnet (14 lines, often about love), limerick (humorous, AABBA rhyme), free verse (no fixed rhyme or rhythm)."),
    cards(
      card("Alliteration","Repeating the same starting consonant sound: 'Peter Piper picked a peck.' Creates rhythm and makes phrases memorable."),
      card("Onomatopoeia","Words that sound like what they describe: buzz, crash, splash, sizzle, whisper. Makes writing vivid and sound-rich."),
      card("Personification","Giving human qualities to non-human things: 'The stars danced in the night sky.' or 'The wind howled in fury.'"),
      card("Metaphor vs simile","Simile uses 'like' or 'as': 'brave as a lion'. Metaphor states directly: 'He is a lion in battle.' Both create powerful imagery.")
    ),
    p("Prose analysis: Consider the author's purpose (entertain, inform, persuade?), the tone (serious, comic, melancholic?), style (formal, informal?), and themes (love, identity, justice?)."),
    h("Narrative viewpoint: First person ('I walked into the house') gives intimacy. Third person ('She walked into the house') gives distance and a wider view of events."),
    p("A stanza is a group of lines in a poem (like a paragraph in prose). A couplet is 2 lines, a quatrain is 4 lines, a sestet is 6 lines, an octet is 8 lines."),
    p("Read poetry aloud. Hear the rhythm, feel the pauses, let the imagery form pictures in your mind. Then read it again — poetry always rewards multiple readings."),
    q("Poetry is the spontaneous overflow of powerful feelings recollected in tranquillity. — William Wordsworth."),
    p("Writing poetry: Don't force every line to rhyme — forced rhymes sound unnatural. Focus on choosing precise, powerful words. Every single word in a poem counts."),
    p("Excellent literature today! Appreciating and analysing poetry and prose deepens your understanding of language, culture, and the full range of human emotion."),
  ]),

  mk("english-grade-7-essay-writing","Essay Writing","English","Grade 7","Unit 7 — Academic Writing","Intermediate","24 min read",
    "Learn to plan, structure, and write clear, well-argued essays with introduction, body paragraphs, and conclusion.",[
    p("An essay presents, develops, and supports an argument or explores a topic. Essay writing is one of the most important academic skills you will ever learn."),
    h("Essay structure — Three Parts: Introduction (state your topic and thesis), Body Paragraphs (develop and support your argument with evidence), Conclusion (summarise and reinforce)."),
    p("The introduction: Begin with a hook (interesting opening), provide context (background), and end with your thesis — the main argument your essay will prove."),
    cards(
      card("Thesis statement","A clear, specific, arguable claim your essay will prove. 'Climate change demands urgent policy action' is a thesis. 'Climate change exists' is just a fact."),
      card("Body paragraph (PEEL)","Point — state your argument. Evidence — quote or data. Explain — analyse the evidence. Link — connect back to the thesis or next point."),
      card("Types of essays","Argumentative (takes a position), analytical (breaks down a text), expository (explains a topic), comparative (examines similarities and differences)."),
      card("Transitions","Link paragraphs: 'Furthermore,', 'In contrast,', 'Building on this,', 'Consequently,'. Transitions create a coherent, flowing argument.")
    ),
    p("Using evidence: In literature essays, quote from the text and analyse the quotation. Explain what it means and WHY it supports your point. Quotations are evidence, not arguments."),
    h("Conclusion: Do NOT introduce new ideas. Restate your thesis in different words, briefly summarise key points, and end with a final broader thought or reflection."),
    p("Formal language: Avoid contractions ('don't' → 'do not'). Avoid first-person 'I' in formal academic essays unless instructed. Use precise vocabulary and an objective tone."),
    p("Planning: Spend time planning before writing. A brief essay plan listing your thesis and the main point of each paragraph makes writing much faster and the essay much clearer."),
    q("Essays are how we clarify our thinking. Writing forces precision — vague thoughts become clear ideas when you express them in words for others to examine."),
    p("Proofreading: Always read your essay back before submitting. Check spelling, grammar, punctuation, and that every paragraph connects clearly to your thesis."),
    p("Outstanding academic work today! Essay writing — clear argument, evidence, structure — is a skill at the heart of all education and professional life. These skills serve you everywhere."),
  ]),

  mk("english-grade-8-literary-devices","Literary Devices","English","Grade 8","Unit 8 — Literary Analysis","Intermediate","24 min read",
    "Identify and analyse key literary devices and their effects in fiction and poetry.",[
    p("Literary devices are the tools and techniques that writers use to convey meaning, create atmosphere, develop character, and communicate themes in powerful ways."),
    h("Understanding literary devices lets you analyse texts at a deeper level — not just WHAT happens, but HOW the writer creates effect and WHY they make specific choices."),
    p("Symbolism: Objects or events representing abstract ideas. In 'Lord of the Flies', the conch shell symbolises order and democracy. When it shatters, civilisation collapses."),
    cards(
      card("Foreshadowing","Hints early in the text at events that will happen later. Creates suspense and makes rereading rewarding as you notice the clues you missed first time."),
      card("Dramatic irony","When the audience knows something a character does not. Creates tension, humour, or tragedy. In Romeo and Juliet, we know Juliet is alive while Romeo does not."),
      card("Flashback","A scene set in the past interrupting the present narrative. Reveals backstory, motivation, or context. Also called 'analepsis' in literary criticism."),
      card("Pathetic fallacy","Using weather to reflect character's mood: 'Dark clouds gathered as she received the terrible news.' Links setting to emotional state.")
    ),
    p("Motif: A recurring element (image, symbol, idea) developing a theme. In Macbeth, blood is a motif representing guilt — it appears repeatedly as guilt grows."),
    h("Tone vs mood: The author's tone is their attitude towards the subject ('ironic', 'reverent'). The mood is the emotional atmosphere for the reader ('melancholic', 'tense', 'joyful')."),
    p("Stream of consciousness: Attempting to reproduce the natural flow of a character's thoughts. James Joyce and Virginia Woolf used this technique extensively."),
    p("Extended metaphor: A metaphor continuing across several lines or an entire poem. It creates a unified, sustained comparison that deepens with each repetition."),
    q("A writer only begins a book. A reader finishes it. The meaning of a text is co-created between the author and the reader — that is why literary analysis is such a rich endeavour."),
    p("Analysing language: Ask WHY the writer chose THAT specific word. 'She walked' vs 'she crept' vs 'she strode' — each creates a completely different impression of character."),
    p("Superb literary analysis today! Identifying literary devices and their effects is the heart of literary criticism. These skills apply to every text you will ever encounter."),
  ]),

  mk("english-grade-9-advanced-grammar","Advanced Grammar","English","Grade 9","Unit 9 — Grammar","Advanced","26 min read",
    "Master complex grammar: clauses, sentence types, grammatical voice, mood, and advanced punctuation.",[
    p("Advanced grammar gives you precise control over your writing. Understanding clause structure, sentence types, and grammatical mood lets you write with clarity and sophistication."),
    h("A clause contains a subject and a predicate (verb). A main clause can stand alone as a sentence. A subordinate clause cannot — it depends on the main clause for its meaning."),
    p("Sentence types: Simple (one main clause). Compound (two main clauses joined by a coordinating conjunction). Complex (main + subordinate clause). Compound-complex (two main + subordinate)."),
    cards(
      card("Relative clauses","Introduced by who (person), which (thing), that, whose. 'The scientist who discovered penicillin was Alexander Fleming.'"),
      card("Participial phrases","Begin with a participle (-ing or -ed): 'Running to catch the bus, she dropped her bag.' Must attach to the correct noun to avoid a dangling modifier."),
      card("Subjunctive mood","Used for hypothetical situations: 'If I were you...' (not 'was'). 'I suggest that he be present.' Formal and required in academic writing."),
      card("Passive voice","Subject receives action: 'The report was written by the committee.' Use passive when the action is more important than the actor.")
    ),
    p("Colons and semicolons: A colon introduces what follows: 'There was one problem: the deadline.' A semicolon joins two related main clauses: 'The sun rose; the birds sang.'"),
    h("Parenthetical clauses insert extra information: 'The prime minister — who had served six years — announced her resignation.' Commas, dashes, or brackets enclose them."),
    p("Appositives rename an adjacent noun: 'My neighbour, a retired teacher, grows beautiful roses.' The appositive 'a retired teacher' gives extra information about 'my neighbour'."),
    p("Dangling modifiers: Error: 'Running through the park, the flowers looked beautiful.' (Who was running?) Correct: 'Running through the park, I noticed the beautiful flowers.'"),
    q("Grammar is not a set of arbitrary rules. It is the accumulated wisdom of generations — the patterns that have proven most useful for clear, precise communication."),
    p("Ellipsis: Omitting words understood from context. 'She wanted to leave, and he did too.' Creates concision and natural-sounding prose. Widely used in skilled writing."),
    p("Excellent advanced grammar today! Commanding complex sentence structures and sophisticated punctuation marks you as a highly competent and confident writer."),
  ]),

  mk("english-grade-10-critical-analysis","Critical Analysis and Argument","English","Grade 10","Unit 10 — Critical Thinking","Advanced","28 min read",
    "Develop skills to critically evaluate texts, construct evidence-based arguments, and write at examination level.",[
    p("Critical analysis means examining a text rigorously: identifying claims made, evaluating evidence, detecting bias, and assessing the overall effectiveness of the communication."),
    h("Key critical thinking questions: What is the main argument? What evidence is given? What assumptions are made? Whose perspective is represented? Who is the intended audience?"),
    p("Evaluating evidence: Strong evidence is specific, relevant, credible, and sufficient. Weak arguments rely on anecdote, emotional appeal, irrelevant comparison, or authority without reasoning."),
    cards(
      card("Logical fallacies","Ad hominem (attacking the person). Straw man (misrepresenting to attack easily). False dilemma (only two options when more exist). Slippery slope (assuming extremes without evidence)."),
      card("Bias and perspective","All texts reflect a perspective. Consider the author's background, purpose, and context. Recognise when evidence is cherry-picked or counterarguments are ignored."),
      card("Rhetorical devices","Ethos (credibility), Pathos (emotion), Logos (logic and evidence). Skilled readers identify which tools a writer is using and to what effect."),
      card("Synthesis","Drawing together evidence from multiple sources to construct an original supported argument — the highest level of analytical writing.")
    ),
    p("Writing a critical analysis: State the text's argument clearly, evaluate the effectiveness of evidence, analyse the language and techniques used, and offer a judgement."),
    h("Hedging language in academic writing: 'This suggests that…', 'It could be argued…', 'The evidence implies…'. Hedging shows awareness that claims are debatable."),
    p("Comparative analysis: Organise by theme, not by going through texts separately. Use: 'Similarly,', 'In contrast,', 'Both texts argue…', 'Whereas Text A…, Text B…'."),
    p("Examination technique: Read the question carefully and identify the key instruction word — analyse, compare, evaluate, explain, discuss. Plan before you write. Refer to the text. Watch the time."),
    q("The most valuable result of all education is the ability to make yourself do the thing you have to do, when it ought to be done, whether you like it or not."),
    p("Academic integrity: Use your own words. When quoting, use inverted commas and cite the source. Plagiarism — copying without acknowledgement — is unacceptable in academic work."),
    p("Truly outstanding critical thinking today! The ability to analyse, evaluate, argue, and synthesise are the highest-order intellectual skills. They serve you in every field of study and work."),
  ]),
];

// ─── SINHALA ──────────────────────────────────────────────────────────────

const sinhalaTopics = [
  ["sinhala-grade-1-alphabet","Introduction to Sinhala Alphabet","Unit 1 — Alphabet","The Sinhala alphabet (akshara mala) has approximately 60 letters. Learn vowels, consonants, and how each letter sounds in the Sinhala language."],
  ["sinhala-grade-2-basic-words","Basic Sinhala Words and Greetings","Unit 2 — Vocabulary","Learn common Sinhala words for everyday objects, the greeting Ayubowan, numbers, and simple phrases used at home and at school."],
  ["sinhala-grade-3-simple-sentences","Simple Sinhala Sentences","Unit 3 — Sentences","Construct simple Sinhala sentences using subject-verb-object structure, understand basic sentence patterns, and practise spoken and written Sinhala."],
  ["sinhala-grade-4-stories","Reading Sinhala Stories","Unit 4 — Reading","Read and comprehend simple Sinhala short stories, identify characters and events, and develop reading fluency in the Sinhala language."],
  ["sinhala-grade-5-grammar","Sinhala Grammar Basics","Unit 5 — Grammar","Learn Sinhala parts of speech: naama padam (nouns), kriya pada (verbs), visheshana (adjectives), and understand basic sentence structure in Sinhala."],
  ["sinhala-grade-6-poetry","Sinhala Poetry and Verse","Unit 6 — Poetry","Explore traditional Sinhala poetry forms, understand rhythm and rhyme in Sinhala verse, and learn famous poems from Sri Lankan literary heritage."],
  ["sinhala-grade-7-essay","Sinhala Essay Writing","Unit 7 — Writing","Learn to plan and write structured Sinhala essays with introduction, body paragraphs, and conclusion on everyday topics and social issues."],
  ["sinhala-grade-8-literature","Sinhala Literature and Prose","Unit 8 — Literature","Study classical and modern Sinhala literature, analyse prose texts, and understand themes, character, and historical context in major Sri Lankan works."],
  ["sinhala-grade-9-advanced-grammar","Advanced Sinhala Grammar","Unit 9 — Advanced Grammar","Master advanced Sinhala grammar including complex sentences, formal and informal registers, and correct use of tense and aspect in Sinhala."],
  ["sinhala-grade-10-prose-poetry","Classical Sinhala Prose and Poetry","Unit 10 — Classical Literature","Analyse classical Sinhala texts, understand historical context, literary devices in Sinhala, and write critical responses to literary works."],
];

const sinhalaLessons = sinhalaTopics.map(([slug, title, unit, description], i) => {
  const grade = i + 1;
  const level = grade <= 3 ? "Beginner" : grade <= 7 ? "Intermediate" : "Advanced";
  return mk(slug, title, "Sinhala", `Grade ${grade}`, unit, level, `${14 + grade} min read`, description, [
    p(`Welcome to Grade ${grade} Sinhala — ${title}. This lesson covers important concepts in the Sinhala language for Grade ${grade} students.`),
    h("Sinhala is one of Sri Lanka's two official languages, spoken by approximately 16 million people. It belongs to the Indo-Aryan branch of the Indo-European language family."),
    p("The Sinhala script is unique and beautiful. Sinhala letters are rounded in shape, and the script is written from left to right. Each character typically represents a syllable."),
    cards(
      card("Vowels (Swaraya)","Sinhala has 12 vowels — short vowels (hraswa) and long vowels (deergha). Vowels appear as independent letters at the start of words and as diacritic marks after consonants."),
      card("Consonants (Byanjana)","Approximately 40 consonant letters represent the consonant sounds of Sinhala. Consonants form the backbone of the Sinhala writing system."),
      card("Word formation","Sinhala words are formed by combining consonant letters with vowel signs. Understanding this system is key to reading and writing Sinhala fluently."),
      card("Formal vs informal Sinhala","Sinhala has formal (written) and informal (spoken) registers that differ significantly. Formal Sinhala is used in writing, official contexts, and literature.")
    ),
    p(`In Grade ${grade}, students build ${grade <= 3 ? "foundational" : grade <= 6 ? "intermediate" : "advanced"} Sinhala language skills that will serve them throughout their education and life in Sri Lanka.`),
    h("Daily Sinhala practice is essential. Read Sinhala text every day, write sentences and paragraphs, and speak Sinhala at home and school to build fluency and confidence."),
    p("Sinhala literature has a rich heritage spanning over 2,000 years. Famous works include the Mahavamsa (a historical chronicle) and the poetry of Alagiyawanna Mukaveti."),
    q("Sinhala is not just a language — it is the vessel of a civilisation, a culture, and an identity that Sri Lankans have preserved and celebrated for millennia."),
    p("Grammar understanding allows you to construct accurate sentences, communicate clearly, and appreciate the structure of the language at a deeper level."),
    p("Excellent Sinhala study today! Regular reading, writing, and speaking practice is the path to mastery. Your language skills will improve with every lesson."),
  ]);
});

// ─── TAMIL ────────────────────────────────────────────────────────────────

const tamilTopics = [
  ["tamil-grade-1-alphabet","Introduction to Tamil Alphabet","Unit 1 — Alphabet","Learn the Tamil alphabet (azhuthagam) with 247 letters including vowels, consonants, and compound letters. Tamil is one of the world's oldest classical languages."],
  ["tamil-grade-2-basic-words","Basic Tamil Words and Greetings","Unit 2 — Vocabulary","Learn common Tamil vocabulary, the greeting Vanakkam, numbers in Tamil, colours, and simple conversational phrases for daily life and school."],
  ["tamil-grade-3-simple-sentences","Simple Tamil Sentences","Unit 3 — Sentences","Construct simple Tamil sentences following the Subject-Object-Verb (SOV) word order that characterises Tamil, and practise reading and speaking Tamil."],
  ["tamil-grade-4-stories","Reading Tamil Stories","Unit 4 — Reading","Read and comprehend simple Tamil stories and folk tales, develop reading fluency, and understand narrative elements in Tamil literature."],
  ["tamil-grade-5-grammar","Tamil Grammar Basics","Unit 5 — Grammar","Learn Tamil parts of speech: peyar (nouns), vinai (verbs), and understand the agglutinative nature of Tamil where meaning is expressed by adding suffixes."],
  ["tamil-grade-6-thirukkural","Tamil Poetry and the Thirukkural","Unit 6 — Classical Poetry","Explore the Thirukkural by Thiruvalluvar — 1,330 couplets on virtue, wealth, and love. One of the greatest works of world literature in the Tamil language."],
  ["tamil-grade-7-essay","Tamil Essay Writing","Unit 7 — Writing","Develop essay writing skills in Tamil — planning, structuring paragraphs, developing arguments, and writing with appropriate formal Tamil language."],
  ["tamil-grade-8-literature","Tamil Literature and Prose","Unit 8 — Literature","Study major works of Tamil literature from Sangam poetry to modern prose. Understand themes, style, and the historical context of Tamil writing."],
  ["tamil-grade-9-advanced-grammar","Advanced Tamil Grammar","Unit 9 — Advanced Grammar","Master advanced Tamil grammar: complex sentence construction, sandhi rules (letter combining), formal vs colloquial Tamil, and analytical writing skills."],
  ["tamil-grade-10-classical-literature","Classical Tamil Literature","Unit 10 — Classical Literature","Engage with Sangam literature (the oldest Tamil poetry), understand classical themes, metre, and the literary conventions of ancient Tamil poets."],
];

const tamilLessons = tamilTopics.map(([slug, title, unit, description], i) => {
  const grade = i + 1;
  const level = grade <= 3 ? "Beginner" : grade <= 7 ? "Intermediate" : "Advanced";
  return mk(slug, title, "Tamil", `Grade ${grade}`, unit, level, `${14 + grade} min read`, description, [
    p(`Welcome to Grade ${grade} Tamil — ${title}. This lesson introduces important Tamil language concepts for Grade ${grade} students.`),
    h("Tamil is one of the world's oldest living languages with over 2,000 years of literary history. It is an official language of Sri Lanka, India (Tamil Nadu), and Singapore."),
    p("The Tamil script consists of 247 characters: 12 vowels (uyir eluttu), 18 consonants (mey eluttu), and 216 compound letters (uyirmey eluttu). Tamil is written left to right."),
    cards(
      card("Tamil vowels (Uyir)","The 12 Tamil vowels are called 'life letters'. They can stand alone and also combine with consonants to form compound characters."),
      card("Tamil consonants (Mey)","The 18 Tamil consonants are called 'body letters'. They are grouped into vallinam (hard), mellinam (soft), and idaiyinam (medium) sounds."),
      card("Tamil word order","Tamil follows Subject-Object-Verb (SOV) order, unlike English (SVO). Tamil is highly agglutinative — meaning is added by attaching suffixes to root words."),
      card("The Thirukkural","By Thiruvalluvar — 1,330 couplets in 133 chapters on virtue, prosperity, and love. Celebrated as a universal scripture of ethics and wisdom.")
    ),
    p(`In Grade ${grade}, Tamil language study builds essential skills in reading, writing, speaking, and listening. Regular practice in all four areas develops well-rounded language proficiency.`),
    h("Vanakkam is the universal Tamil greeting, meaning 'I greet the divine in you'. Tamil culture places great value on respect, community, and the preservation of language and tradition."),
    p("Sangam literature (300 BCE – 300 CE) is the oldest Tamil poetry, collected in anthologies like the Purananuru and Akananuru. It reflects the life, love, and values of ancient Tamil society."),
    q("Tamil is not merely a language — it is a civilisation. To speak Tamil is to carry thousands of years of culture, philosophy, poetry, and wisdom in your voice."),
    p("Grammar tip: Tamil verbs change form based on tense, person, number, and gender of the subject. Learning these patterns systematically is the key to fluent Tamil."),
    p("Fantastic Tamil study today! Every lesson connects you to one of humanity's oldest and most beautiful literary traditions. Keep learning and be proud of this remarkable language."),
  ]);
});

// ─── SEED ─────────────────────────────────────────────────────────────────

const allLessons = [
  ...mathLessons, ...scienceLessons, ...englishLessons,
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB:", MONGO_URI);

    await Lesson.deleteMany({});
    console.log("Old lessons deleted");

    let created = 0;
    let updated = 0;

    for (const lessonData of allLessons) {
      const existing = await Lesson.findOne({ slug: lessonData.slug });
      if (existing) {
        await Lesson.updateOne({ slug: lessonData.slug }, { $set: lessonData });
        console.log(`  Updated : ${lessonData.title} (${lessonData.grade})`);
        updated++;
      } else {
        await Lesson.create(lessonData);
        console.log(`  Created : ${lessonData.title} (${lessonData.grade})`);
        created++;
      }
    }

    console.log(`\n✓ Seed complete — Created: ${created}  Updated: ${updated}  Total: ${allLessons.length} lessons`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seed();
