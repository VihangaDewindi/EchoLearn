require('dotenv').config();
const mongoose = require('mongoose');
const Lesson = require('./models/Lesson');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to DB');
    
    const blocks = [
      {
        type: 'paragraph',
        text: 'Fractions represent parts of a whole. When we divide something into equal pieces, each piece is a fraction of the original item. Imagine a fresh, circular pizza sitting on a table.'
      },
      {
        type: 'highlight',
        text: 'If you cut that pizza into four equal slices, each slice represents exactly one-fourth (1/4) of the total pizza. The way we write this is with two numbers separated by a line.'
      },
      {
        type: 'cards',
        items: [
          {
            title: 'The Numerator',
            text: 'The top number tells us how many parts we actually have. If you eat 3 slices, the numerator is 3.',
            icon: 'arrow-up'
          },
          {
            title: 'The Denominator',
            text: 'The bottom number tells us how many equal parts make up the whole. For our pizza, it is 4.',
            icon: 'arrow-down'
          }
        ]
      },
      {
        type: 'paragraph',
        text: 'Understanding denominators is crucial because it tells us the "size" of the pieces. A larger denominator means the whole is divided into more pieces, which actually makes each individual piece smaller! Think about it: would you rather have 1/2 of a pizza or 1/8 of a pizza?'
      },
      {
        type: 'quote',
        text: 'A fraction is simply a way of telling us how much of a whole thing we are dealing with.'
      },
      {
        type: 'paragraph',
        text: 'In the next section, we will explore proper and improper fractions, and how they relate to mixed numbers. But first, let\'s make sure we have the basics down.'
      }
    ];

    try {
      let lesson = await Lesson.findOne({ slug: 'intro-to-fractions' });
      if (!lesson) {
        lesson = new Lesson({
          slug: 'intro-to-fractions',
          title: 'Introduction to Fractions',
          subject: 'Mathematics',
          unit: 'Unit 3: Fractions',
          duration: '12 min read',
          level: 'Beginner',
          progress: 65,
          description: 'Master the basics of numerators, denominators, and equivalent fractions through visual puzzles.',
          quizRoute: '/quiz?lesson=intro-to-fractions',
          blocks: blocks
        });
        await lesson.save();
        console.log('Created new lesson');
      } else {
        lesson.blocks = blocks;
        await lesson.save();
        console.log('Updated existing lesson');
      }
    } catch(err) {
      console.error(err);
    }
    
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
