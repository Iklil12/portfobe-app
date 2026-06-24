const fs = require('fs');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('.next') && !file.includes('scratch')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src/features/gallery');
let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Fix videoUtils
  content = content.replace(/['"]@\/lib\/videoUtils['"]/g, "'@/shared/lib/videoUtils'");
  content = content.replace(/['"](?:\.\.\/)+lib\/videoUtils['"]/g, "'@/shared/lib/videoUtils'");

  // Fix useThemeEditor if needed
  content = content.replace(/['"]@\/hooks\/useThemeEditor['"]/g, "'@/features/appearance'");
  content = content.replace(/['"](?:\.\.\/)+hooks\/useThemeEditor['"]/g, "'@/features/appearance'");

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedCount++;
  }
});

console.log(`Gallery files updated: ${changedCount}`);
