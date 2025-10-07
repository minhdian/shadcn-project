// Test regex patterns
const testFiles = [
  'lesson-01-greetings.mp4',
  'lesson-01-greetings.srt', 
  'lesson1.mp4',
  'lesson1.srt',
  'lesson01.mp4',
  'lesson01.srt',
  'lesson-10-verbs-actions.srt'
];

const regex = /^lesson-?0?(\d+)(?:-(.+))?\.(mp4|srt)$/i;

console.log('Testing regex pattern:');
testFiles.forEach(filename => {
  const match = filename.match(regex);
  if (match) {
    const lessonNum = match[1].padStart(2, '0');
    const titlePart = match[2];
    const extension = match[3].toLowerCase();
    console.log(`✅ ${filename} → lesson: ${lessonNum}, title: ${titlePart || 'none'}, ext: ${extension}`);
  } else {
    console.log(`❌ ${filename} → no match`);
  }
});

export {};
